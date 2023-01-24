import $ from "jquery";

import { ArticlesController } from "./ArticlesController"
import { Database } from "./Database"
import { ModeCatalogController } from "./ModeCatalogController"
import { Render } from "./Render";

export class ModeTagsController {
    static oArticlesTagsList = null

    static get $oTagsList() { return $(".tags-panel .list") }
    static get $oTagsArticlesList() { return $(".tags-articles-panel .list") }

    // ===============================================================

    static fnBind() 
    {
        $(document).click((oEvent) => {
            if ($(oEvent.target).parents(".tags-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sTagID", sID)
                    ModeTagsController.fnChangeTag(sID)
                }
            }
            if ($(oEvent.target).parents(".tags-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sArticleID", sID)
                    ModeTagsController.fnChangeArticle(sID)
                }
            }
        })
    }

    // ===============================================================

    static fnChangeTag(sTagID)
    {
        ModeCatalogController.sTagID = sTagID
        ModeTagsController.fnUpdateTags()
        ModeTagsController.fnUpdateTagsArticles()
    }

    // ===============================================================

    static fnUpdateTags()
    {
        var aR = (Database.oDatabase.tags || [])
        var sHTML = Render.fnRenderList(aR, ModeCatalogController.sTagID)
        ModeTagsController.$oTagsList.html(sHTML)
    }

    static fnUpdateTagsArticles()
    {
        var aR = (Database.oDatabase.tags_relations || [])
        aR = aR.filter((oI) => oI.tag_id == ModeCatalogController.sTagID )
        aR = aR.map((oFI) => Database.oDatabase.articles.filter((oAI) => oAI.id == oFI.article_id)[0])
        var sHTML = Render.fnRenderList(aR, ModeCatalogController.sArticleID)
        ModeTagsController.$oTagsArticlesList.html(sHTML)
    }

    static fnUpdateArticlesTagsList(bEmptyForm)
    {
        var sHTML = ``
        sHTML = Render.fnRenderOptionsList(Database.oDatabase.tags)
        ArticlesController.$oArticleTagsBox1Select.html(sHTML)
        var aTags = Database.oDatabase.tags_relations.filter((oI) => oI.article_id == ModeCatalogController.sArticleID)
        aTags = aTags.map((oI) => Database.oDatabase.tags.filter((oTI) => oTI.id == oI.tag_id)[0])
        if (bEmptyForm) {
            sHTML = ''
        } else {
            sHTML = Render.fnRenderOptionsList(aTags)
        }
        ArticlesController.$oArticleTagsBox2Select.html(sHTML)
    }
}