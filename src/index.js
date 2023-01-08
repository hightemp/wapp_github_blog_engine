
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Octokit } from "@octokit/rest";
import $ from "jquery";
import { encode, decode } from 'js-base64';

// import Quill from 'quill';

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
        "articles_last_id": "4",
        "articles": [
            {"id":1, "name": "Test 1", "category_id": "1", "html": "<b>Banken, die die auf internationaler Ebene hat</b> der Ausschuss eine Reihe einheitlicher Kennzahlen entwickelt, dies als das Minimum hinaus betreffen. Dies würde zu einem Abzug beim harten Kernkapital abzuziehen ist, ergibt sich als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Das erste Ziel besteht in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Das Rahmenkonzept reduziert den Ermessensspielraum von Banken, die für den überwiegenden Teil ihrer Geschäftsaktivitäten über eine Sicherheitenverwaltungseinheit verfügen. Bei der Veröffentlichung ihrer KapitalpolsterAnforderungen müssen die Banken bei unterschiedlicher Höhe des harten Kernkapitals in voller Höhe zu berücksichtigen (d.h. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem prozentualen Anteil der Positionen des harten Kernkapitals in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Bewertung von wesentlichen Beteiligungen am Kapital von Bank-, Finanz- und Versicherungsinstituten, die ausserhalb des aufsichtsrechtlichen Konsolidierungskreises liegen, einbezogen wurde. Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Kapitalklasse vorgenommen werden, der das Kapital bei Emission durch die Bank selbst zugeordnet würde. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank erhalten würden."},
            {"id":2, "name": "Test 2", "category_id": "1", "html": "dfasdf"},
            {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
            {"id":4, "name": "Test 4", "category_id": "1", "html": "sadf asfdasf asdf"},
        ]
    }
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

    static oEditor = null
    // NOTE: Переменные - Данные
    static sLogin = ''
    static sRepo = ''
    static sAPIKey = ''

    // NOTE: Стейты
    static aModes = ["catalog", "list", "favorites", "tags"]
    static sMode = "catalog"

    static sCatalogGroupID = ""
    static sCatalogCategoryID = ""
    static sArticleID = ""

    // NOTE: методоты для работы dom

    static get $oAllArticlesList() { return $(".all-articles-panel .list") }
    static get $oCatalogGroupsList() { return $(".groups-panel .list") }
    static get $oCatalogCategoriesList() { return $(".categories-panel .list") }
    static get $oCatalogArticlesList() { return $(".articles-panel .list") }
    static get $oCatalogGroupsPanel() { return $(".groups-panel") }
    static get $oCatalogCategoriesPanel() { return $(".categories-panel") }
    static get $oCatalogArticlesPanel() { return $(".articles-panel") }

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

    static get $oModeCatalogGroupItems() { return App.$oModeCatalog.find(".groups-panel .item-title") }
    static get $oModeCatalogCategoryItems() { return App.$oModeCatalog.find(".categories-panel .item-title") }
    static get $oModeCatalogArticleItems() { return App.$oModeCatalog.find(".articles-panel .item-title") }

    static get $oPageEditWrapper() { return $(".page-edit") }
    static get $oPagePanel() { return $(".page-panel") }
    static get $oPageEdit() { return $("#page-edit") }

    // NOTE: 

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
        var sLastID = App.oDatabase[sTable+"_last_id"] + 1
        App.oDatabase[sTable].push({
            "id": sLastID,
            ...oData
        })
        App.oDatabase[sTable+"_last_id"] = sLastID
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
    }

    static fnChangeCatalogCategory(sCategoryID)
    {
        App.sCatalogCategoryID = sCategoryID
        App.sArticleID = ""
        App.fnUpdateCatalogGroups()
        App.fnUpdateCatalogCategories()
        App.fnUpdateCatalogArticles()
    }

    static fnChangeArticle(sArticleID)
    {
        App.sArticleID = sArticleID
        App.fnUpdateCatalogArticles()
        App.fnUpdateEditor()
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
    }

    static fnBindCatelogGroupList()
    {
        $(document).click((oEvent) => {
            // App.$oCatalogGroupsPanel
            if ($(oEvent.target).parents(".groups-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sGroupID", sID)
                App.fnChangeCatalogGroup(sID)
            }
        })
    }

    static fnBindCatelogCategoryList()
    {
        $(document).click((oEvent) => {
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
        })
    }

    static fnBindCatelogArticlesList()
    {
        $(document).click((oEvent) => {
            // App.$oCatalogArticlesPanel
            if ($(oEvent.target).parents(".articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                console.log("sArticleID", sID)
                App.fnChangeArticle(sID)
            }
        })
    }

    static fnUpdateView()
    {
        
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
            console.log('fnGetNotesDatabase', App.oDatabase)
        })
    }

    static fnWriteNotesDatabase()
    {
        App.fnUpdate()
        console.log('fnWriteNotesDatabase', App.oDatabase);
        return App.octokit.rest.repos.createOrUpdateFileContents({
            owner: App.sLogin,
            repo: App.sRepo,
            path: App.DATABASE_PATH,
            message: fnGetUpdateMessage(),
            content: encode(JSON.stringify(App.oDatabase))
        })
    }

    /**
     * Автоматическое сохранение
     */
    static fnUpdateNoteDatabase()
    {
        if (App.bDirty) {
            App.fnWriteNotesDatabase();
        }
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

    static fnRenderList(aR, sSelID="")
    {
        var sHTML = ``
        console.log("fnRenderList", sSelID)

        for (var oI of aR) {
            var sSelClass = sSelID == oI.id ? "active" : ""
            sHTML += `
            <div class="input-group item-row ${sSelClass}" data-id="${oI.id}">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 cb-groups" type="checkbox" value="${oI.id}" id="group-${oI.id}" />
                </div>
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

    static fnRenderTree(aR, sSelID="", iParentID=null)
    {
        var sHTML = ``

        for (var oI of aR) {
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
                    <div>${oI.name}</div>
                </a>
            </div>
            `

            if (oI.is_opened) {
                sHTML += App.fnRenderTree(aR, sSelID, oI.id)
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

    static fnUpdateEditor()
    {
        if (!App.sArticleID) {
            App.$oPagePanel.addClass('hidden')
            App.oEditor.setContents('')
        } else {
            App.$oPagePanel.removeClass('hidden')
            var aR = App.fnFilterArticlesByID(App.sArticleID);
            if (aR.length) {
                var editor = document.getElementsByClassName('ql-editor')
                editor[0].innerHTML = aR[0].html
            } else {
                App.$oPagePanel.addClass('hidden')
                App.oEditor.setContents('')
            }
        }
    }

    static fnUpdate()
    {
        App.fnUpdateCatalogGroups()
        App.fnUpdateCatalogCategories()
        App.fnUpdateCatalogArticles()
        App.fnUpdateEditor()
    }

    static fnBindCatalog()
    {
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
    }

    static fnBind()
    {
        console.log('fnBind')
        App.fnBindMode()
        App.fnBindApp()
        App.fnBindCatelogGroupList()
        App.fnBindCatelogCategoryList()
        App.fnBindCatelogArticlesList()
    }

    static fnBindApp()
    {
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
                    if (confirm('База не найдена. Создать базу в репозиториии?')) {
                        App.bDirty = true;
                        App.fnUpdateNoteDatabase();
                    }
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
    // Extend jQuery.fn with our new method
    var jQuery = $
    jQuery.extend( jQuery.fn, {
        // Name of our method & one argument (the parent selector)
        within: function( pSelector ) {
            // Returns a subset of items using jQuery.filter
            return this.filter(function(){
                // Return truthy/falsey based on presence in parent
                return $(this).closest( pSelector ).length;
            });
        }
    });
    App.fnStart()
});



