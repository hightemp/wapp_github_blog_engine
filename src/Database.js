import { Octokit } from "@octokit/rest";

import { MODE_CATALOG, ModeController } from 'ModeController'

export class Database {
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

    static bDirty = false

    // NOTE: Константы
    static DATABASE_PATH = "notes-database.json"
    static DATABASE_UPDATE_TIMEOUT = 30000

    static SHA = ""
    
    // NOTE: Базовые объекты
    /** @var Octokit octokit */
    static octokit = null

    // NOTE: Переменные - Данные
    static sLogin = ''
    static sRepo = ''
    static sAPIKey = ''

    // NOTE: Database методы
    static fnGetByID(sTable, sRecordID)
    {
        var aR = Database.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            return aR[0]
        }
        return null
    }

    static fnUpdateRecord(sTable, sRecordID, oData)
    {
        var aR = Database.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            $.extend(aR[0], oData)
            console.log(aR[0], Database.oDatabase[sTable]);
        }
    }

    static fnAddRecord(sTable, oData)
    {
        var sLastID = Database.oDatabase[sTable+"_last_id"]*1 + 1
        Database.oDatabase[sTable].push({
            "id": sLastID,
            ...oData
        })
        Database.oDatabase[sTable+"_last_id"] = sLastID
        return sLastID
    }

    // ===============================================================

    static fnFirstLoadDatabase()
    {
        return Database
            .fnGetSHADatabase()
            .then(() => {
                ModeController.fnChangeMode(MODE_CATALOG)
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

    // ===============================================================

    static fnGetSHADatabase()
    {
        if (!Database.SHA) {
            Database.octokit.rest.repos.getContent({
                owner: Database.sLogin,
                repo: Database.sRepo,
                path: Database.DATABASE_PATH,
            }).then(({ data }) => {
                Database.SHA = data.sha
            })
        }
    }

    static fnGetNotesDatabase()
    {
        console.log([Database.sLogin, Database.sRepo, Database.DATABASE_PATH])
        return Database.octokit.rest.repos.getContent({
            owner: Database.sLogin,
            repo: Database.sRepo,
            path: Database.DATABASE_PATH,
        }).then(({ data }) => {
            console.log('fnGetNotesDatabase', data)
            Database.oDatabase = JSON.parse(decode(data.content))
            Database.SHA = data.sha
            console.log('fnGetNotesDatabase', Database.oDatabase)
        })
    }

    static fnWriteNotesDatabase()
    {
        App.fnUpdate()
        console.log('fnWriteNotesDatabase', Database.oDatabase);
        Database.bDirty = false
        var sData = JSON.stringify(Database.oDatabase)
        return Database.octokit.rest.repos.createOrUpdateFileContents({
            owner: Database.sLogin,
            repo: Database.sRepo,
            path: Database.DATABASE_PATH,
            sha: Database.SHA,
            message: fnGetUpdateMessage(),
            content: encode(sData)
        }).then(() => {
            App.fnShowSavingToast()
        })
    }

    /**
     * Автоматическое сохранение
     */
    static fnUpdateNoteDatabase()
    {
        if (Database.bDirty) {
            App.fnPrepareEditorContents()
            Database.fnWriteNotesDatabase()
        }
        Database.fnGetSHADatabase()
        setTimeout(Database.fnUpdateNoteDatabase, Database.DATABASE_UPDATE_TIMEOUT);
    }

    // ===============================================================

    static fnGetArticlePath(iID)
    {
        return `articles/${iID}.md`
    }

    static fnGetArticlePathURL(iID)
    {
        return `blob/main/articles/${iID}.md`
    }

    // ===============================================================

    static fnGetCurrentArticle()
    {
        return Database.oDatabase.articles.find((oI) => oI.id==App.sArticleID)
    }

    static fnFilterCategoriesByGroup(iGroupID)
    {
        return Database.oDatabase.categories.filter((oI) => oI.group_id == iGroupID)
    }

    static fnFilterArticlesByCategory(iCategoryID)
    {
        return Database.oDatabase.articles.filter((oI) => oI.category_id == iCategoryID)
    }

    static fnFilterArticlesByID(iID)
    {
        return Database.oDatabase.articles.filter((oI) => oI.id == iID)
    }
}