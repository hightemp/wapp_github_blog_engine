
export class ModeFavoritesController {
    static get $oFavoritesList() { return $(".favorites-panel .list") }

    static get $oFavoritesReload() { return $("#favorites-reload") }
    static get $oFavoritesCreate() { return $("#favorites-groups-create") }
    static get $oFavoritesEdit() { return $("#favorites-groups-edit") }
    static get $oFavoritesRemove() { return $("#favorites-groups-remove") }

    // ===============================================================

    static fnBind() 
    {
        $(document).click((oEvent) => {
            if ($(oEvent.target).parents(".favorites-panel").length) {
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

    static fnUpdateFavorites()
    {
        var aR = (Database.oDatabase.favorites || [])
        aR = aR.map((oFI) => Database.oDatabase.articles.filter((oAI) => oAI.id == oFI.article_id)[0])
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oFavoritesList.html(sHTML)
    }
}
