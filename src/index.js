
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

var jdb = require("db-json");

var Helper = jdb.DatabaseHelper.extend({
    // _saveDb: function(data, cb)
    // {
    //     console.log('>>1',data);
    //     oNoteDatabase = data
    //     cb()
    // }
});

var oDatabase = {
    "name": "obsdb",
    "version": "1.0.0",
    "created": (new Date()).getTime(),
    "updated": (new Date()).getTime(),
    "tables": [
        {
            "name": "groups",
            "created": (new Date()).getTime(),
            "updated": (new Date()).getTime(),
            "fields": [
                {
                    "name": "id",
                    "type": "id",
                    "unique": true,
                    "generated": true,
                    "nullable": false,
                    "default": null
                },
                {
                    "name": "name",
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255,
                    "nullable": false,
                    "generated": false,
                    "default": null
                },
            ],
            "entries": [
                {
                    "id": "19lty0qnion4dydc",
                    "name": "Разное"
                },
                {
                    "id": "29lty0qnion4dydc",
                    "name": "Химия"
                },
                {
                    "id": "39lty0qnion4dydc",
                    "name": "Computer-Science"
                },
                {
                    "id": "49lty0qnion4dydc",
                    "name": "Физика"
                },
            ]
        },
        {
            "name": "categories",
            "created": (new Date()).getTime(),
            "updated": (new Date()).getTime(),
            "fields": [
                {
                    "name": "id",
                    "type": "id",
                    "unique": true,
                    "generated": true,
                    "nullable": false,
                    "default": null
                },
                {
                    "name": "name",
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255,
                    "nullable": false,
                    "generated": false,
                    "default": null
                },
                {
                    "name": "is_opened",
                    "type": "boolean",
                    "default": false
                },
                {
                    "name": "parent_id",
                    "type": "string",
                    "default": ""
                },
            ],
            "entries": [
                {
                    "id": "19lty0qnion4dydc",
                    "name": "Категория 1.1"
                },
                {
                    "id": "29lty0qnion4dydc",
                    "name": "Категория 2.1",
                    "parent_id": "19lty0qnion4dydc",
                },
                {
                    "id": "39lty0qnion4dydc",
                    "name": "Категория 3.1",
                    "parent_id": "29lty0qnion4dydc",
                },
                {
                    "id": "49lty0qnion4dydc",
                    "name": "Категория 1.1"
                },
            ]
        },
        {
            "name": "articles",
            "created": (new Date()).getTime(),
            "updated": (new Date()).getTime(),
            "fields": [
                {
                    "name": "id",
                    "type": "id",
                    "unique": true,
                    "generated": true,
                    "nullable": false,
                    "default": null
                },
                {
                    "name": "name",
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255,
                    "nullable": false,
                    "generated": false,
                    "default": null
                },
                {
                    "name": "html",
                    "type": "string",
                    "nullable": false,
                    "generated": false,
                    "default": null
                },
            ],
            "entries": [
                {
                    "id": "19lty0qnion4dydc",
                    "name": "Lorem ipsum dolor sit amet 1",
                    "html": "<b>Für international tätige Banken</b> ist das Polster der gewichtete Durchschnitt der geltenden antizyklischen Kapitalpolster sollen die Kapitalanforderungen für den Bankensektor das globale Finanzumfeld berücksichtigen, in dem die Banken häufig Bewertungen der vertraglichen Laufzeiteninkongruenz durchführen. Ebenso ergibt sich der Betrag, der vom harten Kernkapital ausgeklammert. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem prozentualen Anteil der Positionen des harten Kernkapitals am gesamten Eigenkapital. Die Geschäftsleitung muss eine ausreichende personelle Ausstattung dieser Einheit sicherstellen, damit Nachschussforderungen und damit zusammenhängende Streitigkeiten auch in schweren Marktkrisen rechtzeitig bearbeit werden und welche Rechte die Bank beispielsweise einen Credit-Default-Swap (CDS) auf einen Emittenten im Bestand, der zufällig auch Kontrahent eines ausserbörslichen Geschäfts ist, wobei der CDS jedoch nicht als CVA-Absicherung behandelt wird, so darf dieser CDS nicht im Rahmen der eigenständigen VaR-Berechnung für die CVARisikokapitalanforderung gegen die CVA aufgerechnet werden. Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Berechnung des harten Kernkapitals der Bank erhalten würden. Die strukturelle Liquiditätsquote (Net Stable Funding Ratio, NSFR) hat einen einjährigen Zeithorizont; sie soll zu einer höheren Widerstandsfähigkeit des Sektors in wirtschaftlichen Abschwungphasen bei und schafft einen Mechanismus, die Kapitalbasis in der Bankenaufsicht weltweit über 25 verschiedene Messgrössen und Konzepte verwendet werden.",
                },
                {
                    "id": "29lty0qnion4dydc",
                    "name": "Lorem ipsum dolor sit amet 2",
                    "html": "",
                },
                {
                    "id": "39lty0qnion4dydc",
                    "name": "Lorem ipsum dolor sit amet 3",
                    "html": "",
                },
                {
                    "id": "49lty0qnion4dydc",
                    "name": "Lorem ipsum dolor sit amet 4",
                    "html": "",
                },
            ]
        },
    ],
}
// var oHelper = new Helper("1.0.0", JSON.stringify(oDatabase));

class App {
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

    static sCatalogGroup = ""
    static sCatalogCategory = ""
    static sArticle = ""

    static oDbHelper = new Helper("1.0.0", JSON.stringify(oDatabase));

    // NOTE: методоты для работы dom

    static get $oAllArticlesList() { return $(".all-articles-panel .list") }
    static get $oGroupsList() { return $(".groups-panel .list") }
    static get $oCategoriesList() { return $(".categories-panel .list") }

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

    static get $oPageEdit() { return $("#page-edit") }

    // NOTE: 

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
            App.oNoteDatabase = JSON.parse(decode(data.content))
            console.log('fnGetNotesDatabase', App.oNoteDatabase)
        })
    }

    static fnWriteNotesDatabase()
    {
        App.oNoteDatabase = App.oDbHelper.db.toJSON()
        App.fnUpdate()
        console.log('fnWriteNotesDatabase', App.oNoteDatabase);
        return App.octokit.rest.repos.createOrUpdateFileContents({
            owner: App.sLogin,
            repo: App.sRepo,
            path: App.DATABASE_PATH,
            message: fnGetUpdateMessage(),
            content: encode(JSON.stringify(App.oNoteDatabase))
        })
    }

    /**
     * Автоматическое сохранение
     */
    static fnUpdateNoteDatabase()
    {
        if (App.bDirty) {
            fnWriteNotesDatabase();
        }
        setTimeout(App.fnUpdateNoteDatabase, App.DATABASE_UPDATE_TIMEOUT);
    }

    static fnUpdateArticlesLists()
    {
        var aR = App.oDbHelper.query(["tget", "articles", "*"]);
        var sHTML = ``

        for (var oI of aR) {
            sHTML += `
            <div class="input-group item-row" data-id="${oI.id}">
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

        App.$oAllArticlesList.html(sHTML)
    }

    static fnRenderList(aR)
    {
        var sHTML = ``

        for (var oI of aR) {
            sHTML += `
            <div class="input-group item-row" data-id="${oI.id}">
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

    static fnUpdateGroups()
    {
        var aR = App.oDbHelper.query(["tget", "groups", "*"]);
        var sHTML = App.fnRenderList(aR)

        App.$oGroupsList.html(sHTML)
    }

    static fnRenderTree(aR, iParentID="")
    {
        var sHTML = ``

        for (var oI of aR) {
            console.log(oI.parent_id)
            if (oI.parent_id!=iParentID) {
                continue;
            }
            var sItemStatus = ``
            if (oI.is_opened) {
                sItemStatus = `<i class="bi bi-plus-minus"></i>`
            } else {
                sItemStatus = `<i class="bi bi-plus-square"></i>`
            }

            sHTML += `
            <div class="input-group item-tree-row" data-id="${oI.id}">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 cb-groups" type="checkbox" value="${oI.id}" id="group-${oI.id}" />
                </div>
                <div class="input-group-text">
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
                sHTML += fnRenderTree(aR, oI.id)
            }
        }

        return sHTML;
    }

    static fnUpdateCategories()
    {
        var aR = App.oDbHelper.query(["tget", "categories", "*"]);
        var sHTML = App.fnRenderTree(aR)
        App.$oCategoriesList.html(sHTML)
    }

    static fnRenderHTMLEditor()
    {
        App.oEditor = new Quill('#page-edit', {
            modules: {toolbar: true},
            theme: 'snow',
        });
    }

    static fnUpdate()
    {
        App.fnUpdateArticlesLists()
        App.fnUpdateGroups()
        App.fnUpdateCategories()
    }

    static fnBindCatalog()
    {
        App.$oModeCatalogGroupItems.click(() => {

        })
        App.$oModeCatalogCategoryItems.click(() => {

        })
        App.$oModeCatalogGroupItems.click(() => {

        })
    }

    static fnBind()
    {
        console.log('fnBind')
        App.fnBindMode()
        App.fnBindApp()
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
    App.fnStart()
});



