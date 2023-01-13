import { Database } from 'Database'
import { APIDataWindow } from './APIDataWindow'
import { ExportDataController } from './ExportDataController'
import { MarkdownPublisher } from './MarkdownPublisher'
import { ModeCatalogController } from './ModeCatalogController'
import { ModeFavoritesController } from './ModeFavoritesController'
import { ModeListController } from './ModeListController'
import { ModeTagsController } from './ModeTagsController'

export class App {
    // NOTE: Переменные
    static oArticlesTagsList = null

    static sFilePath = ''

    static get $oModeCatalogGroupItems() { return App.$oModeCatalog.find(".groups-panel .item-title") }
    static get $oModeCatalogCategoryItems() { return App.$oModeCatalog.find(".categories-panel .item-title") }
    static get $oModeCatalogArticleItems() { return App.$oModeCatalog.find(".articles-panel .item-title") }

    static fnShowSavingToast()
    {
        const toastLiveExample = document.getElementById('liveToast')
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()        
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

    static fnBind()
    {
        console.log('fnBind')
        APIDataWindow.fnBind()
        ModeListController.fnBind()
        ModeCatalogController.fnBind()
        ModeFavoritesController.fnBind()
        ModeTagsController.fnBind()
        MarkdownPublisher.fnBind()
        ExportDataController.fnBind()
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

        if (!Database.sLogin || !Database.sRepo || !Database.sAPIKey) {
            return App.$oModalAskApiKey.show()
        }
        App.octokit = new Octokit({
            auth: Database.sAPIKey,
        });

        App.$oBlockOverlay.hide()
        // NOTE: Загрузка из БД из репо
        Database.fnFirstLoadDatabase()
    }

    static fnStart()
    {
        console.log('fnStart')
        App.fnBind()
        App.fnStartApp()
    }
}