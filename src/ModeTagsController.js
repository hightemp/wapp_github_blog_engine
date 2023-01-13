
export class ModeTagsController {
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
                    App.fnChangeTag(sID)
                }
            }
            if ($(oEvent.target).parents(".tags-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sArticleID", sID)
                    App.fnChangeArticle(sID)
                }
            }
        })
    }

    // ===============================================================

    static fnChangeTag(sTagID)
    {
        App.sTagID = sTagID
        App.fnUpdateTags()
        App.fnUpdateTagsArticles()
    }

    // ===============================================================

    static fnUpdateTags()
    {
        var aR = (Database.oDatabase.tags || [])
        var sHTML = App.fnRenderList(aR, App.sTagID)
        App.$oTagsList.html(sHTML)
    }

    static fnUpdateTagsArticles()
    {
        var aR = (Database.oDatabase.tags_relations || [])
        aR = aR.filter((oI) => oI.tag_id == App.sTagID )
        aR = aR.map((oFI) => Database.oDatabase.articles.filter((oAI) => oAI.id == oFI.article_id)[0])
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oTagsArticlesList.html(sHTML)
    }

    static fnUpdateArticlesTagsList(bEmptyForm)
    {
        var sHTML = ``
        sHTML = App.fnRenderOptionsList(Database.oDatabase.tags)
        App.$oArticleTagsBox1Select.html(sHTML)
        var aTags = Database.oDatabase.tags_relations.filter((oI) => oI.article_id == App.sArticleID)
        aTags = aTags.map((oI) => Database.oDatabase.tags.filter((oTI) => oTI.id == oI.tag_id)[0])
        if (bEmptyForm) {
            sHTML = ''
        } else {
            sHTML = App.fnRenderOptionsList(aTags)
        }
        App.$oArticleTagsBox2Select.html(sHTML)

    }
}