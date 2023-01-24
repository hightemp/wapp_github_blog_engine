import { Database } from './Database'
import { APIDataWindow } from './APIDataWindow'
import { Editor } from './Editor'
import { ExportDataController } from './ExportDataController'
import { MarkdownPublisher } from './MarkdownPublisher'
import { ModeCatalogController } from './ModeCatalogController'
import { ModeFavoritesController } from './ModeFavoritesController'
import { ModeListController } from './ModeListController'
import { ModeTagsController } from './ModeTagsController'

import { Octokit } from "@octokit/rest";
import { ModeController } from './ModeController'
import { ArticlesController } from './ArticlesController'
import * as bootstrap from 'bootstrap'
import { CategoryEditWindow } from './CategoryEditWindow'

export class App {
    static fnShowSavingToast()
    {
        const toastLiveExample = document.getElementById('liveToast')
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()        
    }

    static fnUpdate()
    {
        ModeCatalogController.fnUpdateCatalogGroups()
        ModeCatalogController.fnUpdateCatalogCategories()
        ModeCatalogController.fnUpdateCatalogArticles()
        Editor.fnUpdateEditor()
        ModeListController.fnUpdateAllArticles()
        ModeFavoritesController.fnUpdateFavorites()
        ModeTagsController.fnUpdateTags()
    }

    static fnBind()
    {
        _l('fnBind')
        APIDataWindow.fnBind()
        ModeListController.fnBind()
        ModeCatalogController.fnBind()
        ModeFavoritesController.fnBind()
        ModeTagsController.fnBind()
        MarkdownPublisher.fnBind()
        ExportDataController.fnBind()
        ArticlesController.fnBind()
        ModeController.fnBind()
        Editor.fnBind()
        CategoryEditWindow.fnBind()
    }

    static fnStartApp()
    {
        _l('App.fnStartApp')
        Editor.fnRender()
        Database.fnParseAPIInfo()

        if (!Database.sLogin || !Database.sRepo || !Database.sAPIKey) {
            return APIDataWindow.fnShow()
        }
        Database.fnInitGit()
        APIDataWindow.fnHideOverlay()
        
        // NOTE: Загрузка из БД из репо
        Database.fnFirstLoadDatabase()
    }

    static fnStart()
    {
        _l('fnStart')
        App.fnBind()
        App.fnStartApp()
    }
}