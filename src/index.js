
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Octokit } from "@octokit/rest";
import $ from "jquery";
import { encode, decode } from 'js-base64';

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// NOTE: Хелперы

var fnGetUpdateMessage = (() => "update: "+(new Date()))
var _$ = (s, b=document.body) => document.body.querySelector.apply(b, [s])
var _$$ = (s, b=document.body) => document.body.querySelectorAll.apply(b, [s])

class App {
    static oDatabase = {
        "groups_last_id": "3",
        "groups": [
            {"id":1, "name": "Test 1"},
            {"id":2, "name": "Test 2"},
            {"id":3, "name": "Test 3"},
        ],
        "categories_last_id": "4",
        "categories": [
            {"id":1, "name": "Test 1", "is_opened": false, "parent_id": null, "group_id": "1"},
            {"id":2, "name": "Test 2", "is_opened": false, "parent_id": "1", "group_id": "1"},
            {"id":3, "name": "Test 3", "is_opened": false, "parent_id": "2", "group_id": "1"},
            {"id":4, "name": "Test 4", "is_opened": false, "parent_id": null, "group_id": "1"},
        ],
        "articles_last_id": "6",
        "articles": [
            {"id":1, "name": "Test 1", "category_id": "1", "html": "<b>Banken, die die auf internationaler Ebene hat</b> der Ausschuss eine Reihe einheitlicher Kennzahlen entwickelt, dies als das Minimum hinaus betreffen. Dies würde zu einem Abzug beim harten Kernkapital abzuziehen ist, ergibt sich als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Das erste Ziel besteht in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Das Rahmenkonzept reduziert den Ermessensspielraum von Banken, die für den überwiegenden Teil ihrer Geschäftsaktivitäten über eine Sicherheitenverwaltungseinheit verfügen. Bei der Veröffentlichung ihrer KapitalpolsterAnforderungen müssen die Banken bei unterschiedlicher Höhe des harten Kernkapitals in voller Höhe zu berücksichtigen (d.h. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem prozentualen Anteil der Positionen des harten Kernkapitals in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Bewertung von wesentlichen Beteiligungen am Kapital von Bank-, Finanz- und Versicherungsinstituten, die ausserhalb des aufsichtsrechtlichen Konsolidierungskreises liegen, einbezogen wurde. Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Kapitalklasse vorgenommen werden, der das Kapital bei Emission durch die Bank selbst zugeordnet würde. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank erhalten würden."},
            {"id":2, "name": "Test 2", "category_id": "1", "html": "dfasdf"},
            {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
            {"id":4, "name": "Test 4", "category_id": "1", "html": "sadf asfdasf asdf"},
            {"id":5, "name": "Derartige zum Ausgleich", "category_id": "2", "html": "sadf asfdasf asdf"},
            {"id":6, "name": "der bei der Kapitalklasse vorgenommen werden", "category_id": "3", "html": "sadf asfdasf asdf"},
        ],
        "favorites_last_id": "1",
        "favorites": [
            {"id":1, "article_id":"1"},
        ],
        "tags_last_id": "4",
        "tags": [
            {"id":1, "name":"computer"},
            {"id":2, "name":"testing"},
            {"id":3, "name":"development"},
            {"id":4, "name":"lorem"},
        ],
        "tags_relataions_last_id": "1",
        "tags_relations": [
            {"id":1, "tag_id":"1", "article_id":"1"},
        ]
    }

    static SHA = ""

    // NOTE: Константы
    static DATABASE_PATH = "notes-database.json"
    static DATABASE_UPDATE_TIMEOUT = 30000
    
    // NOTE: Базовые объекты
    /** @var Octokit octokit */
    static octokit = null

    // NOTE: Переменные
    static oNoteDatabase = {}
    static bDirty = false
    static sSelGroup = ''
    static sSelCategory = ''

    static oArticlesTagsList = null

    static oEditor = null
    // NOTE: Переменные - Данные
    static sLogin = ''
    static sRepo = ''
    static sAPIKey = ''

    static sFilePath = ''

    // NOTE: Стейты
    static aModes = ["catalog", "list", "favorites", "tags", "links"]
    static sMode = "catalog"

    static sCatalogGroupID = ""
    static sCatalogCategoryID = ""
    static sArticleID = ""
    static sTagID = ""

    static oDocuments = {}

    // NOTE: методоты для работы dom

    static get $oAllArticlesList() { return $(".all-articles-panel .list") }
    static get $oCatalogGroupsList() { return $(".groups-panel .list") }
    static get $oCatalogCategoriesList() { return $(".categories-panel .list") }
    static get $oCatalogArticlesList() { return $(".articles-panel .list") }
    static get $oCatalogGroupsPanel() { return $(".groups-panel") }
    static get $oCatalogCategoriesPanel() { return $(".categories-panel") }
    static get $oCatalogArticlesPanel() { return $(".articles-panel") }
    static get $oTagsList() { return $(".tags-panel .list") }
    static get $oTagsArticlesList() { return $(".tags-articles-panel .list") }
    static get $oFavoritesList() { return $(".favorites-panel .list") }

    static get $oFormValidatorIsEmpty() { return $(".is-empty") }

    // NOTE: Окно сохранения API данных
    static get $oBlockOverlay() { return $("#block-overlay") }
    static get $oModalAskApiKey() { return $("#modal-ask-api-key") }
    static get $oInfoSaveBtn() { return $("#info-save") }
    static get $oInfoLoginInput() { return $("#info-login") }
    static get $oInfoRepoInput() { return $("#info-repo") }
    static get $oInfoApiKeyInput() { return $("#info-api-key") }

    static get $oAppModes() { return $(".app-modes") }
    static get $oModes() { return $(".mode") }
    static get $oModesBtns() { return $(".app-modes>a") }
    static get $oModeListBtn() { return $("#app-mode-list") }
    static get $oModeList() { return $("#mode-list") }
    static get $oModeCatalogBtn() { return $("#app-mode-catalog") }
    static get $oModeCatalog() { return $("#mode-catalog") }
    static get $oModeFavoritesBtn() { return $("#app-mode-favorites") }
    static get $oModeFavorites() { return $("#mode-favorites") }
    static get $oModeTagsBtn() { return $("#app-mode-tags") }
    static get $oModeTags() { return $("#mode-tags") }
    static get $oModeLinksBtn() { return $("#app-mode-links") }
    static get $oModeLinks() { return $("#mode-links") }

    static get $oModeCatalogGroupItems() { return App.$oModeCatalog.find(".groups-panel .item-title") }
    static get $oModeCatalogCategoryItems() { return App.$oModeCatalog.find(".categories-panel .item-title") }
    static get $oModeCatalogArticleItems() { return App.$oModeCatalog.find(".articles-panel .item-title") }

    static get $oPageEditWrapper() { return $(".page-edit") }
    static get $oPagePanel() { return $(".page-panel") }
    static get $oPageEdit() { return $("#page-edit") }

    static get $oPageSaveBtn() { return $("#page-save-btn") }
    static get $oPageLinkBtn() { return $("#page-link-btn") }

    static get $oPublishBtn() { return $("#app-publish-btn") }

    static get $oExportBtn() { return $("#app-export-btn") }
    static get $oImportBtn() { return $("#app-import-btn") }

    static get $oCatalogGroupsReload() { return $("#catalog-groups-reload") }
    static get $oCatalogGroupsCreate() { return $("#catalog-groups-create") }
    static get $oCatalogGroupsEdit() { return $("#catalog-groups-edit") }
    static get $oCatalogGroupsRemove() { return $("#catalog-groups-remove") }

    static get $oCatalogCategoryReload() { return $("#catalog-category-reload") }
    static get $oCatalogCategoryCreate() { return $("#catalog-category-create") }
    static get $oCatalogCategoryEdit() { return $("#catalog-category-edit") }
    static get $oCatalogCategoryRemove() { return $("#catalog-category-remove") }

    static get $oCatalogArticleReload() { return $("#catalog-article-reload") }
    static get $oCatalogArticleCreate() { return $("#catalog-article-create") }
    static get $oCatalogArticleEdit() { return $("#catalog-article-edit") }
    static get $oCatalogArticleRemove() { return $("#catalog-article-remove") }

    static get $oAllArticlesReload() { return $("#all-articles-reload") }

    static oModelEditArticle = null
    static get $oModelEditArticle() { return $("#modal-edit-article") }
    static get $oArticleEditSave() { return $("#article-edit-save") }
    static get $oArticleTagsBox1Select() { return $("#article-tags .box1") }
    static get $oArticleTagsBox2Select() { return $("#article-tags .box2") }
    static get $oArticleModelEditName() { return $("#article-name") }
    static get $oArticleModelEditGroup() { return $("#article-group") }
    static get $oArticleModelEditCategory() { return $("#article-category") }

    static get $oArticleMoveAllTags2to1Btn() { return $("#article-tags .tags-list-all-2-1") }
    static get $oArticleMoveTags2to1Btn() { return $("#article-tags .tags-list-one-2-1") }
    static get $oArticleMoveAllTags1to2Btn() { return $("#article-tags .tags-list-all-1-2") }
    static get $oArticleMoveTags1to2Btn() { return $("#article-tags .tags-list-one-1-2") }


    // NOTE: 

    static fnGetByID(sTable, sRecordID)
    {
        var aR = App.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            return aR[0]
        }
        return null
    }

    static fnUpdateRecord(sTable, sRecordID, oData)
    {
        var aR = App.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            $.extend(aR[0], oData)
            console.log(aR[0], App.oDatabase[sTable]);
        }
    }

    static fnAddRecord(sTable, oData)
    {
        var sLastID = App.oDatabase[sTable+"_last_id"]*1 + 1
        App.oDatabase[sTable].push({
            "id": sLastID,
            ...oData
        })
        App.oDatabase[sTable+"_last_id"] = sLastID
        return sLastID
    }

    static fnChangeMode(sNewMode)
    {
        App.$oModes.addClass("hidden")
        App.$oModesBtns.removeClass("btn-primary")
        if (sNewMode=="list") {
            App.$oModeListBtn.addClass("btn-primary")
            App.$oModeList.removeClass("hidden")
        }
        if (sNewMode=="catalog") {
            App.$oModeCatalogBtn.addClass("btn-primary")
            App.$oModeCatalog.removeClass("hidden")
        }
        if (sNewMode=="favorites") {
            App.$oModeFavoritesBtn.addClass("btn-primary")
            App.$oModeFavorites.removeClass("hidden")
        }
        if (sNewMode=="tags") {
            App.$oModeTagsBtn.addClass("btn-primary")
            App.$oModeTags.removeClass("hidden")
        }
        if (sNewMode=="links") {
            App.$oModeLinksBtn.addClass("btn-primary")
            App.$oModeLinks.removeClass("hidden")
        }
        App.sMode = sNewMode
    }

    static fnChangeCatalogGroup(sGroupID)
    {
        App.sCatalogGroupID = sGroupID
        App.sCatalogCategoryID = ""
        App.sArticleID = ""
        App.fnUpdateCatalogGroups()
        App.fnUpdateCatalogCategories()
        App.fnUpdateCatalogArticles()
        App.fnUpdateAllArticles()
    }

    static fnChangeCatalogCategory(sCategoryID)
    {
        App.sCatalogCategoryID = sCategoryID
        App.sArticleID = ""
        App.fnUpdateCatalogGroups()
        App.fnUpdateCatalogCategories()
        App.fnUpdateCatalogArticles()
        App.fnUpdateAllArticles()
    }

    static fnChangeArticle(sArticleID)
    {
        App.sArticleID = sArticleID
        var aArticles = App.fnFilterArticlesByID(sArticleID)
        if (aArticles.length) {
            var sID = aArticles[0].id
            App.sFilePath = App.fnGetArticlePath(sID)
        }
        App.fnUpdateCatalogArticles()
        App.fnUpdateAllArticles()
        App.fnUpdateEditor()
        App.fnUpdateFavorites()
        App.fnUpdateTagsArticles()
    }

    static fnChangeTag(sTagID)
    {
        App.sTagID = sTagID
        App.fnUpdateTags()
        App.fnUpdateTagsArticles()
    }

    static fnBindMode()
    {
        console.log("fnBindMode")
        App.$oModeListBtn.click(() => {
            App.fnChangeMode("list")
        })
        App.$oModeCatalogBtn.click(() => {
            App.fnChangeMode("catalog")
        })
        App.$oModeFavoritesBtn.click(() => {
            App.fnChangeMode("favorites")
        })
        App.$oModeTagsBtn.click(() => {
            App.fnChangeMode("tags")
        })
        App.$oModeLinksBtn.click(() => {
            App.fnChangeMode("links")
        })
        // NOTE: Опубликовать в виде страниц
        App.$oPublishBtn.click(() => {
            App.fnGeneratePages()
        })
        App.$oExportBtn.click(() => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(App.oDatabase));
            var dlAnchorElem = document.createElement("A");
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `database_${(new Date).getTime()}.json`);
            dlAnchorElem.click();
            // document.body.appendChild(dlAnchorElem)
            // console.log(dlAnchorElem)
            dlAnchorElem.remove()
        })
        App.$oImportBtn.click(() => {
            
        })
    }

    static fnGetArticlePath(iID)
    {
        return `articles/${iID}.md`
    }

    static fnGetArticlePathURL(iID)
    {
        return `blob/main/articles/${iID}.md`
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

        for (var oGroup of App.oDatabase.groups) {
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
        var aR = App.oDatabase.articles
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

    static fnUpdateView()
    {
        
    }

    static fnRemoveCatalogGroup(sGroupID)
    {
        var iIndex = App.oDatabase.groups.findIndex((oI) => oI.id==sGroupID)
        delete App.oDatabase.groups[iIndex]
        App.oDatabase.groups.splice(iIndex, 1)
        App.fnWriteNotesDatabase()
        App.sCatalogGroupID = ""
        App.sCatalogCategoryID = ""
        App.sArticleID = ""
    }

    static fnRemoveCatalogCategory(sCategoryID)
    {
        var iIndex = App.oDatabase.categories.findIndex((oI) => oI.id==sCategoryID)
        delete App.oDatabase.categories[iIndex]
        App.oDatabase.categories.splice(iIndex, 1)
        App.fnWriteNotesDatabase()
        App.sCatalogCategoryID = ""
        App.sArticleID = ""
    }

    static fnGetCurrentArticle()
    {
        return App.oDatabase.articles.find((oI) => oI.id==App.sArticleID)
    }

    static fnRemoveCatalogArticle(sArticleID)
    {
        var iIndex = App.oDatabase.articles.findIndex((oI) => oI.id==sArticleID)
        delete App.oDatabase.articles[iIndex]
        App.oDatabase.articles.splice(iIndex, 1)
        App.fnWriteNotesDatabase()
        App.sArticleID = ""
    }

    static fnGetSHADatabase()
    {
        if (!App.SHA) {
            App.octokit.rest.repos.getContent({
                owner: App.sLogin,
                repo: App.sRepo,
                path: App.DATABASE_PATH,
            }).then(({ data }) => {
                App.SHA = data.sha
            })
        }
    }

    static fnGetNotesDatabase()
    {
        console.log([App.sLogin, App.sRepo, App.DATABASE_PATH])
        return App.octokit.rest.repos.getContent({
            owner: App.sLogin,
            repo: App.sRepo,
            path: App.DATABASE_PATH,
        }).then(({ data }) => {
            console.log('fnGetNotesDatabase', data)
            App.oDatabase = JSON.parse(decode(data.content))
            App.SHA = data.sha
            console.log('fnGetNotesDatabase', App.oDatabase)
        })
    }

    static fnWriteNotesDatabase()
    {
        App.fnUpdate()
        console.log('fnWriteNotesDatabase', App.oDatabase);
        App.bDirty = false
        var sData = JSON.stringify(App.oDatabase)
        return App.octokit.rest.repos.createOrUpdateFileContents({
            owner: App.sLogin,
            repo: App.sRepo,
            path: App.DATABASE_PATH,
            sha: App.SHA,
            message: fnGetUpdateMessage(),
            content: encode(sData)
        }).then(() => {
            const toastLiveExample = document.getElementById('liveToast')
            const toast = new bootstrap.Toast(toastLiveExample)
            toast.show()
        })
    }

    /**
     * Автоматическое сохранение
     */
    static fnUpdateNoteDatabase()
    {
        if (App.bDirty) {
            App.fnPrepareEditorContents()
            App.fnWriteNotesDatabase()
        }
        App.fnGetSHADatabase()
        setTimeout(App.fnUpdateNoteDatabase, App.DATABASE_UPDATE_TIMEOUT);
    }

    static fnUpdateCatalogArticles()
    {
        if (App.sCatalogCategoryID) {
            App.$oCatalogArticlesPanel.removeClass("hidden")
            var aR = App.fnFilterArticlesByCategory(App.sCatalogCategoryID)
            var sHTML = App.fnRenderList(aR, App.sArticleID)
            App.$oCatalogArticlesList.html(sHTML)
        } else {
            App.$oCatalogArticlesPanel.addClass("hidden")
        }
    }

    static fnUpdateAllArticles()
    {
        console.log('fnUpdateAllArticles')
        var aR = App.oDatabase.articles
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oAllArticlesList.html(sHTML)
    }

    static fnRenderList(aR, sSelID="", fnHook=()=>{})
    {
        var sHTML = ``
        console.log("fnRenderList", sSelID)

        for (var oI of aR) {
            if (!oI) continue;
            var sSelClass = sSelID == oI.id ? "active" : ""
            var sHTMLHook = (fnHook(oI) || "")
            sHTML += `
            <div class="input-group item-row ${sSelClass}" data-id="${oI.id}">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 cb-groups" type="checkbox" value="${oI.id}" id="group-${oI.id}" />
                </div>
                ${sHTMLHook}
                <a 
                    class="list-group-item list-group-item-action item-title ${oI.id == App.sSelGroup ? 'active' : ''}" 
                    data-id="${oI.id}"
                >
                    <div class="item-inner-title">${oI.name}</div>
                </a>
            </div>
            `
        }

        return sHTML
    }

    static fnUpdateCatalogGroups()
    {
        var aR = App.oDatabase.groups
        var sHTML = App.fnRenderList(aR, App.sCatalogGroupID)
        App.$oCatalogGroupsList.html(sHTML)
    }

    static fnRenderTree(aR, sSelID="", iParentID=null, iLevel=0)
    {
        var sHTML = ``

        for (var oI of aR) {
            if (!oI) continue;
            if (!iParentID) iParentID = null
            console.log("fnRenderTree", oI.parent_id,iParentID)
            if (oI.parent_id!=iParentID) {
                continue;
            }
            var sItemStatus = ``
            if (oI.is_opened) {
                sItemStatus = `<i class="bi bi-dash-square"></i>`
            } else {
                sItemStatus = `<i class="bi bi-plus-square"></i>`
            }

            var sSelClass = sSelID == oI.id ? "active" : ""
            var sSpacer = `<div class="tree-spacer"></div>`.repeat(iLevel)

            sHTML += `
            <div class="input-group item-tree-row ${sSelClass}" data-id="${oI.id}" data-opened="${1*oI.is_opened}">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 cb-groups" type="checkbox" value="${oI.id}" id="group-${oI.id}" />
                </div>
                <div class="input-group-text item-flag-group">
                    <a class="item-flag">${sItemStatus}</a>
                </div>
                <a 
                    class="list-group-item list-group-item-action item-title ${oI.id == App.sSelCategory ? 'active' : ''}"
                    data-id="${oI.id}"
                >
                    ${sSpacer}<div>${oI.name}</div>
                </a>
            </div>
            `

            if (oI.is_opened) {
                sHTML += App.fnRenderTree(aR, sSelID, oI.id, iLevel+1)
            }
        }

        return sHTML;
    }

    static fnFilterCategoriesByGroup(iGroupID)
    {
        return App.oDatabase.categories.filter((oI) => oI.group_id == iGroupID)
    }

    static fnUpdateCatalogCategories()
    {
        var aR = []
        if (App.sCatalogGroupID) {
            App.$oCatalogCategoriesPanel.removeClass("hidden")
            var sHTML = ""
            aR = App.fnFilterCategoriesByGroup(App.sCatalogGroupID);
            console.log("fnUpdateCatalogCategories", App.sCatalogGroupID, aR)
            sHTML = App.fnRenderTree(aR, App.sCatalogCategoryID)
            App.$oCatalogCategoriesList.html(sHTML)
        } else {
            App.$oCatalogCategoriesPanel.addClass("hidden")
        }
        
    }

    static fnRenderHTMLEditor()
    {
        App.oEditor = new Quill('#page-edit', {
            modules: {toolbar: true},
            theme: 'snow',
        });
    }

    static fnFilterArticlesByCategory(iCategoryID)
    {
        return App.oDatabase.articles.filter((oI) => oI.category_id == iCategoryID)
    }

    static fnFilterArticlesByID(iID)
    {
        return App.oDatabase.articles.filter((oI) => oI.id == iID)
    }

    static fnGetEditorContent()
    {
        var editor = document.getElementsByClassName('ql-editor')
        return editor[0].innerHTML
    }

    static fnSetEditorContent(sHTML)
    {
        var editor = document.getElementsByClassName('ql-editor')
        console.log(sHTML)
        editor[0].innerHTML = sHTML
        App.bDirty = true;
    }

    static fnUpdateEditor()
    {
        if (!App.sArticleID) {
            App.$oPagePanel.addClass('hidden')
            App.fnSetEditorContent('')
        } else {
            App.$oPagePanel.removeClass('hidden')
            var aR = App.fnFilterArticlesByID(App.sArticleID);
            if (aR.length) {
                App.fnSetEditorContent(aR[0].html)
            } else {
                App.$oPagePanel.addClass('hidden')
                App.fnSetEditorContent('')
            }
        }
    }

    static fnUpdateFavorites()
    {
        var aR = (App.oDatabase.favorites || [])
        aR = aR.map((oFI) => App.oDatabase.articles.filter((oAI) => oAI.id == oFI.article_id)[0])
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oFavoritesList.html(sHTML)
    }

    static fnUpdateTags()
    {
        var aR = (App.oDatabase.tags || [])
        var sHTML = App.fnRenderList(aR, App.sTagID)
        App.$oTagsList.html(sHTML)
    }

    static fnUpdateTagsArticles()
    {
        var aR = (App.oDatabase.tags_relations || [])
        aR = aR.filter((oI) => oI.tag_id == App.sTagID )
        aR = aR.map((oFI) => App.oDatabase.articles.filter((oAI) => oAI.id == oFI.article_id)[0])
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oTagsArticlesList.html(sHTML)
    }

    static fnUpdate()
    {
        App.fnUpdateCatalogGroups()
        App.fnUpdateCatalogCategories()
        App.fnUpdateCatalogArticles()
        App.fnUpdateEditor()
        App.fnUpdateAllArticles()
        App.fnUpdateFavorites()
        App.fnUpdateTags()
    }

    static fnPrepareEditorContents()
    {
        var sHTML = App.fnGetEditorContent()
        App.fnUpdateRecord("articles", App.sArticleID, { html: sHTML })
    }

    static fnSaveEditorContents()
    {
        App.fnPrepareEditorContents()
        App.fnWriteNotesDatabase()
    }

    static fnBind()
    {
        console.log('fnBind')
        App.fnBindMode()
        App.fnBindApp()
    }

    static fnRenderOptionsList(aList, sSelID)
    {
        var sHTML = ``
        for (var oItem of aList) {
            var sSelected = sSelID == oItem.id ? 'selected' : ''
            sHTML += `<option value="${oItem.id}" ${sSelected}>${oItem.name}</option>`
        }
        return sHTML
    }

    static fnUpdateArticlesTagsList(bEmptyForm)
    {
        var sHTML = ``
        sHTML = App.fnRenderOptionsList(App.oDatabase.tags)
        App.$oArticleTagsBox1Select.html(sHTML)
        var aTags = App.oDatabase.tags_relations.filter((oI) => oI.article_id == App.sArticleID)
        aTags = aTags.map((oI) => App.oDatabase.tags.filter((oTI) => oTI.id == oI.tag_id)[0])
        if (bEmptyForm) {
            sHTML = ''
        } else {
            sHTML = App.fnRenderOptionsList(aTags)
        }
        App.$oArticleTagsBox2Select.html(sHTML)

    }

    static fnUpdateArticlesName(bEmptyForm)
    {
        if (bEmptyForm) {
            App.$oArticleModelEditName.val('')
        } else {
            var oArticle = App.fnGetCurrentArticle()
            App.$oArticleModelEditName.val(oArticle.name)
        }
    }

    static fnUpdateArticlesCategoryList()
    {
        var sHTML = ``
        var aR = []
        for (var oC of App.oDatabase.categories) {
            var aGr = App.oDatabase.groups.filter((oG) => oG.id == oC.group_id )
            var oCF = Object.assign({}, oC)
            oCF.name = `${aGr[0].name} - ${oCF.name}`
            aR = aR.concat(oCF)
        }
        sHTML = App.fnRenderOptionsList(aR, App.sCatalogCategoryID)
        App.$oArticleModelEditCategory.html(sHTML)
    }

    static fnUpdateArticlesModel(bEmptyForm=false)
    {
        App.fnUpdateArticlesName(bEmptyForm)
        App.fnUpdateArticlesTagsList(bEmptyForm)
        App.fnUpdateArticlesCategoryList()
    }

    static fnShowArticleEditModal(bEmptyForm=false)
    {
        App.fnUpdateArticlesModel(bEmptyForm)
        if (!App.oModelEditArticle) {
            App.oModelEditArticle = new bootstrap.Modal(App.$oModelEditArticle, {})
        }
        App.oModelEditArticle.show()
    }

    static fnHideArticleEditModal()
    {
        App.oModelEditArticle.hide()
    }

    static fnGetArticleBox1TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(App.$oArticleTagsBox1Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(App.$oArticleTagsBox1Select.find("option"))
        }
        aOpts = aOpts.map((oE) => App.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    static fnGetArticleBox2TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(App.$oArticleTagsBox2Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(App.$oArticleTagsBox2Select.find("option"))
        }
        aOpts = aOpts.map((oE) => App.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    static fnRenderBox1List(aList)
    {
        var sHTML = ''
        sHTML = App.fnRenderOptionsList(aList)
        App.$oArticleTagsBox1Select.html(sHTML)
    }

    static fnRenderBox2List(aList)
    {
        var sHTML = ''
        sHTML = App.fnRenderOptionsList(aList)
        App.$oArticleTagsBox2Select.html(sHTML)
    }

    static fnSaveCurrentArticleTags()
    {
        var aTagsRel = App.oDatabase.tags_relations
        // Удаляем старые связи
        aTagsRel = aTagsRel.filter((oI) => oI.article_id != App.sArticleID)
        var aTags = App.fnGetArticleBox2TagsList()
        for (var oTag of aTags) {
            App.fnAddRecord("tags_relations", { "tag_id": oTag.id, "article_id": App.sArticleID })
        }
    }

    static fnSaveArticle()
    {
        if (App.sArticleID == "") {
            // Если статьи нет, то создаем ее
            App.sArticleID = App.fnAddRecord("articles", {category_id:"",name:"",html:""})
        }
        var oObj = {
            name: App.$oArticleModelEditName.val(),
            category_id: App.$oArticleModelEditCategory.val()
        }
        console.log("!!!1", oObj, App.sArticleID)
        App.fnUpdateRecord("articles", App.sArticleID, oObj)
        App.fnSaveCurrentArticleTags()
        App.fnWriteNotesDatabase()
        App.fnUpdate()
    }

    static fnBindApp()
    {
        App.$oPageSaveBtn.click(() => {
            App.fnSaveEditorContents()
        })
        App.$oPageLinkBtn.click(() => {
            var sPath = App.fnGetArticlePathURL(App.sArticleID)
            window.open(`https://github.com/${App.sLogin}/${App.sRepo}/${sPath}`)
        })

        App.$oArticleMoveAllTags2to1Btn.click(() => {
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = []
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveTags2to1Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList()
            var aAllBox2Tags = App.fnGetArticleBox2TagsList()
            var aBox2Tags = App.fnGetArticleBox2TagsList(true)
            aBox2Tags = aAllBox2Tags.filter((oI, iN, aA) => !~aBox2Tags.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveAllTags1to2Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList()
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveTags1to2Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList(true)
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })

        $(document).click((oEvent) => {
            if ($(oEvent.target).parents(".favorites-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sArticleID", sID)
                App.fnChangeArticle(sID)
            }
            if ($(oEvent.target).parents(".tags-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sTagID", sID)
                App.fnChangeTag(sID)
            }
            if ($(oEvent.target).parents(".tags-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sArticleID", sID)
                App.fnChangeArticle(sID)
            }
            if ($(oEvent.target).parents(".all-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sArticleID", sID)
                App.fnChangeArticle(sID)
            }
            // App.$oCatalogArticlesPanel
            if ($(oEvent.target).parents(".articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sArticleID", sID)
                App.fnChangeArticle(sID)
            }
            // App.$oCatalogCategoriesPanel
            if ($(oEvent.target).parents(".categories-panel").length) {
                if ($(oEvent.target).parents(".item-flag-group").length) {
                    var oDiv = $($(oEvent.target).parents(".input-group")[0])
                    var sOpened = oDiv.data("opened")*1
                    var sID = oDiv.data("id")
                    console.log('sOpened', sOpened)
                    App.fnUpdateRecord("categories", sID, { is_opened: !sOpened })
                    console.log(App.oDatabase)
                    App.fnUpdateCatalogCategories()
                } else {
                    var oDiv = $($(oEvent.target).parents(".input-group")[0])
                    var sID = oDiv.data("id")
                    console.log("sCategoryID", sID)
                    App.fnChangeCatalogCategory(sID)
                }
            }
            // App.$oCatalogGroupsPanel
            if ($(oEvent.target).parents(".groups-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sGroupID", sID)
                App.fnChangeCatalogGroup(sID)
            }
        })

        // $(".btn-close").click(() => {
        //     $(oEvent.target).parents(".modal")[0].modal("hide")
        // })

        App.$oModeCatalogGroupItems.click(() => {
            var sID = $(this).data("id")
            App.fnChangeCatalogGroup(sID)
        })
        App.$oModeCatalogCategoryItems.click(() => {
            var sID = $(this).data("id")
            App.fnChangeCatalogCategory(sID)
        })
        App.$oModeCatalogArticleItems.click(() => {
            var sID = $(this).data("id")
            App.fnChangeArticle(sID)
        })

        App.$oCatalogGroupsRemove.click(() => {
            App.fnRemoveCatalogGroup(App.sCatalogGroupID)
        })
        App.$oCatalogCategoryRemove.click(() => {
            App.fnRemoveCatalogCategory(App.sCatalogCategoryID)
        })
        App.$oCatalogArticleRemove.click(() => {
            App.fnRemoveCatalogArticle(App.sArticleID)
        })

        App.$oAllArticlesReload.click(() => {
            App.fnUpdateAllArticles()
        })
        App.$oAllArticlesReload.click(() => {
            App.fnUpdateAllArticles()
        })
        App.$oCatalogGroupsReload.click(() => {
            App.fnUpdateCatalogGroups()
        })
        App.$oCatalogCategoryReload.click(() => {
            App.fnUpdateCatalogCategories()
        })
        App.$oCatalogArticleReload.click(() => {
            App.fnUpdateCatalogArticles()
        })

        App.$oCatalogGroupsCreate.click(() => {
            var sName = prompt("Группа")
            if (sName) {
                App.fnAddRecord("groups", {
                    "name": sName,
                    "html": ""
                })
                App.fnUpdate()
                App.fnWriteNotesDatabase()
            }
        })
        App.$oCatalogCategoryCreate.click(() => {
            var sName = prompt("Категория")
            if (sName) {
                App.fnAddRecord("categories", {
                    "group_id": App.sCatalogGroupID,
                    "name": sName,
                    "html": ""
                })
                App.fnUpdate()
                App.fnWriteNotesDatabase()
            }
        })
        App.$oCatalogArticleCreate.click(() => {
            App.fnShowArticleEditModal(true)
        })
        App.$oCatalogGroupsEdit.click(() => {
            var oGroup = App.fnGetByID("groups", App.sCatalogGroupID)
            if (oGroup) {
                var sName = prompt("Группа", oGroup.name)
                if (sName) {
                    App.fnUpdateRecord("groups", oGroup.id, {"name": sName})
                    App.fnUpdate()
                    App.fnWriteNotesDatabase()
                }
            }
        })
        App.$oCatalogCategoryEdit.click(() => {
            var oCategory = App.fnGetByID("categories", App.sCatalogCategoryID)
            if (oCategory) {
                var sName = prompt("Категория", oCategory.name)
                if (sName) {
                    App.fnUpdateRecord("categories", oCategory.id, {"name": sName})
                    App.fnUpdate()
                    App.fnWriteNotesDatabase()
                }
            }
        })
        App.$oCatalogArticleEdit.click(() => {
            console.log('$oCatalogArticleEdit')
            var oArticle = App.fnGetByID("articles", App.sArticleID)
            if (oArticle) {
                App.fnShowArticleEditModal(false)
            }
        })

        App.$oArticleEditSave.click(() => {
            App.fnSaveArticle()
            App.oModelEditArticle.hide()
        })

        // App.$oCatalogArticleRemove.click(() => {
            
        // })
        App.$oInfoSaveBtn.click(() => {
            var bEmpty = false;
            App.$oFormValidatorIsEmpty.each((iI, oE) => bEmpty |= oE.value.trim() == "")
            if (bEmpty) {
                alert('Поле пустое');
                return;
            }

            App.sLogin = App.$oInfoLoginInput.val();
            App.sRepo = App.$oInfoRepoInput.val();
            App.sAPIKey = App.$oInfoApiKeyInput.val();

            App.$oModalAskApiKey.hide();
            window.location.hash = `#${App.sLogin}:${App.sRepo}:${App.sAPIKey}`
            App.fnStartApp();
        })
    }

    static fnParseAPIInfo()
    {
        // bootstrap его использует
        var aHash, sHash;

        try {
            sHash = location.hash.split('#')[1]
            aHash = sHash.split(':')
        } catch (_) {
            aHash = ['', '', '']
        }

        App.sLogin = aHash[0]
        App.sRepo = aHash[1]
        App.sAPIKey = aHash[2]
    }

    static fnStartApp()
    {
        App.fnRenderHTMLEditor()
        App.fnParseAPIInfo()

        if (!App.sLogin || !App.sRepo || !App.sAPIKey) {
            return App.$oModalAskApiKey.show()
        }
        App.octokit = new Octokit({
            auth: App.sAPIKey,
        });

        App.$oBlockOverlay.hide()
        // NOTE: Загрузка из БД из репо
        App.fnGetNotesDatabase()
            .then(() => {
                App.fnChangeMode("catalog")
                App.fnUpdate();
                App.fnUpdateNoteDatabase();
            })
            .catch((sAnsw) => {
                if (/Not Found/.test(sAnsw)) {
                    // if (confirm('База не найдена. Создать базу в репозиториии?')) {
                    App.bDirty = true;
                    App.fnUpdateNoteDatabase();
                    // }
                } else {
                    alert(sAnsw);
                }
            })
    }

    static fnStart()
    {
        console.log('fnStart')
        App.fnBind()
        App.fnStartApp()
    }
}

$(document).ready(() => {
    App.fnStart()
});



