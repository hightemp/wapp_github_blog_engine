
export class MarkdownPublisher {
    static oDocuments = {}

    static get $oPublishBtn() { return $("#app-publish-btn") }

    static fnBind() 
    {
        
    }

    static fnRenderArticles(iCategoryID, iLevel=1)
    {
        var aR = App.fnFilterArticlesByCategory(iCategoryID)
        var aMarkdown = []

        for (var oArticle of aR) {
            aMarkdown.push(` `.repeat(iLevel*2) + `* - [${oArticle.name}](${App.fnGetArticlePathURL(oArticle.id)})`)
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
            aMarkdown = aMarkdown.concat(App.fnRenderCategoriesList(aR, oCategory.id, iLevel+1))
            aMarkdown = aMarkdown.concat(App.fnRenderArticles(oCategory.id, iLevel+1))
        }

        return aMarkdown
    }

    static fnRenderCategories(iGroupID)
    {
        var aMarkdown = []

        var aR = App.fnFilterCategoriesByGroup(iGroupID)
        aMarkdown = App.fnRenderCategoriesList(aR, null, 1)

        return aMarkdown
    }

    static fnRenderGroups()
    {
        var aMarkdown = []

        for (var oGroup of Database.oDatabase.groups) {
            aMarkdown.push(`- ${oGroup.name}`)
            aMarkdown = aMarkdown.concat(App.fnRenderCategories(oGroup.id))
        }

        return aMarkdown
    }

    static async fnGenerateIndexPage()
    {
        var aMarkdown = [`# Оглавление\n`]

        aMarkdown = aMarkdown.concat(App.fnRenderGroups())
        var sMarkdown = aMarkdown.join(`\n`)

        await App.fnPublishDocument(`index.md`, sMarkdown)
        // console.log()
    }

    static async fnGenerateMarkdownPages()
    {
        var aR = Database.oDatabase.articles
        for (var oI of aR) {
            var sP = App.fnGetArticlePath(oI.id)
            await App.fnPublishDocument(sP, oI.html)
        }
    }

    static async fnGeneratePages()
    {
        await App.fnGenerateIndexPage()
        await App.fnGenerateMarkdownPages()
    }

    static async fnPublishDocument(sPath, sContent)
    {
        if (!App.oDocuments[sPath] || !App.oDocuments[sPath].sha) {
            await App.octokit.rest.repos.getContent({
                owner: App.sLogin,
                repo: App.sRepo,
                path: sPath,
            }).then(({ data }) => {
                App.oDocuments[sPath] = data
            }).catch((_) => { })
        }
        return App.octokit.rest.repos.createOrUpdateFileContents({
            owner: App.sLogin,
            repo: App.sRepo,
            path: sPath,
            sha: App.oDocuments[sPath] ? App.oDocuments[sPath].sha : null,
            message: fnGetUpdateMessage(),
            content: encode(sContent)
        })
    }
}