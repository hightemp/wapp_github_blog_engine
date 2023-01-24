import $ from "jquery";

import { ArticlesController } from "./ArticlesController"
import { Database } from "./Database";
import { ModeCatalogController } from "./ModeCatalogController"
import { Render } from "./Render"

export class ModeListController {
    static get $oAllArticlesList() { return $(".all-articles-panel .list") }

    static get $oAllArticlesReload() { return $("#all-articles-reload") }
    static get $oAllArticlesCreate() { return $("#all-articles-create") }
    static get $oAllArticlesEdit() { return $("#all-articles-edit") }
    static get $oAllArticlesRemove() { return $("#all-articles-remove") }

    // ===============================================================

    static fnBind() 
    {
        $(document).on('click', (oEvent) => {
            if ($(oEvent.target).parents(".all-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sArticleID", sID)
                    ModeCatalogController.fnChangeArticle(sID)
                }
            }
        })

        ModeListController.$oAllArticlesReload.on('click', () => {
            ModeListController.fnUpdateAllArticles()
        })
        ModeListController.$oAllArticlesReload.on('click', () => {
            ModeListController.fnUpdateAllArticles()
        })


        ModeListController.$oAllArticlesReload.on('click', () => {
            ModeListController.fnUpdateAllArticles()
        })
        ModeListController.$oAllArticlesCreate.on('click', () => {
            ArticlesController.fnShowArticleEditModal(true)
        })
        ModeListController.$oAllArticlesEdit.on('click', () => {
            var oArticle = Database.fnGetByID("articles", ModeCatalogController.sArticleID)
            if (oArticle) {
                ArticlesController.fnShowArticleEditModal(false)
            }
        })
        ModeListController.$oAllArticlesRemove.on('click', () => {
            ModeCatalogController.fnRemoveCatalogArticle(ModeCatalogController.sArticleID)
        })

    }

    // ===============================================================

    static fnUpdateAllArticles()
    {
        console.log('fnUpdateAllArticles')
        var aR = Database.oDatabase.articles
        var sHTML = Render.fnRenderList(aR, ModeCatalogController.sArticleID)
        ModeListController.$oAllArticlesList.html(sHTML)
    }
}
