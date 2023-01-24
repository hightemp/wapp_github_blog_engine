import $ from "jquery";

import { Database } from "./Database"
import { Render } from "./Render"
import { encode, decode } from 'js-base64';

export class MarkdownPublisher {
    static oDocuments = {}

    static get $oPublishBtn() { return $("#app-publish-btn") }

    static fnBind() 
    {
        // NOTE: Опубликовать в виде страниц
        MarkdownPublisher.$oPublishBtn.on('click', () => {
            ModeController.fnGeneratePages()
        })
    }

    static fnRenderArticles(iCategoryID, iLevel=1)
    {
        var aR = Database.fnFilterArticlesByCategory(iCategoryID)
        var aMarkdown = []

        for (var oArticle of aR) {
            aMarkdown.push(` `.repeat(iLevel*2) + `* - [${oArticle.name}](${Database.fnGetArticlePathURL(oArticle.id)})`)
        }

        return aMarkdown
    }

    static fnRenderCategoriesList(aR, iParentID=null, iLevel=1)
    {
        var aMarkdown = []

        for (var oCategory of aR) {
            if (!oCategory.parent_id) oCategory.parent_id = null
            if (!iParentID) iParentID = null
            if (oCategory.parent_id!=iParentID) continue
            aMarkdown.push(` `.repeat(iLevel*2) + `- ${oCategory.name}`)
            aMarkdown = aMarkdown.concat(MarkdownPublisher.fnRenderCategoriesList(aR, oCategory.id, iLevel+1))
            aMarkdown = aMarkdown.concat(MarkdownPublisher.fnRenderArticles(oCategory.id, iLevel+1))
        }

        return aMarkdown
    }

    static fnRenderCategories(iGroupID)
    {
        var aMarkdown = []

        var aR = Database.fnFilterCategoriesByGroup(iGroupID)
        aMarkdown = Database.fnRenderCategoriesList(aR, null, 1)

        return aMarkdown
    }

    static fnRenderGroups()
    {
        var aMarkdown = []

        for (var oGroup of Database.oDatabase.groups) {
            aMarkdown.push(`- ${oGroup.name}`)
            aMarkdown = aMarkdown.concat(MarkdownPublisher.fnRenderCategories(oGroup.id))
        }

        return aMarkdown
    }

    static async fnGenerateIndexPage()
    {
        var aMarkdown = [`# Оглавление\n`]

        aMarkdown = aMarkdown.concat(MarkdownPublisher.fnRenderGroups())
        var sMarkdown = aMarkdown.join(`\n`)

        await MarkdownPublisher.fnPublishDocument(`index.md`, sMarkdown)
        // console.log()
    }

    static async fnGenerateMarkdownPages()
    {
        var aR = Database.oDatabase.articles
        for (var oI of aR) {
            var sP = Database.fnGetArticlePath(oI.id)
            await MarkdownPublisher.fnPublishDocument(sP, oI.html)
        }
    }

    static async fnGeneratePages()
    {
        await MarkdownPublisher.fnGenerateIndexPage()
        await MarkdownPublisher.fnGenerateMarkdownPages()
    }

    static async fnPublishDocument(sPath, sContent)
    {
        if (!MarkdownPublisher.oDocuments[sPath] || !MarkdownPublisher.oDocuments[sPath].sha) {
            await Database.octokit.rest.repos.getContent({
                owner: Database.sLogin,
                repo: Database.sRepo,
                path: sPath,
            }).then(({ data }) => {
                MarkdownPublisher.oDocuments[sPath] = data
            }).catch((_) => { })
        }
        return Database.octokit.rest.repos.createOrUpdateFileContents({
            owner: Database.sLogin,
            repo: Database.sRepo,
            path: sPath,
            sha: MarkdownPublisher.oDocuments[sPath] ? MarkdownPublisher.oDocuments[sPath].sha : null,
            message: Database.fnGetUpdateMessage(),
            content: encode(sContent)
        })
    }
}