
export class ModeListController {
    static get $oAllArticlesList() { return $(".all-articles-panel .list") }

    static get $oAllArticlesReload() { return $("#all-articles-reload") }
    static get $oAllArticlesCreate() { return $("#all-articles-create") }
    static get $oAllArticlesEdit() { return $("#all-articles-edit") }
    static get $oAllArticlesRemove() { return $("#all-articles-remove") }

    // ===============================================================

    static fnBind() 
    {
        $(document).click((oEvent) => {
            if ($(oEvent.target).parents(".all-articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sArticleID", sID)
                    App.fnChangeArticle(sID)
                }
            }
        })

        App.$oAllArticlesReload.click(() => {
            App.fnUpdateAllArticles()
        })
        App.$oAllArticlesReload.click(() => {
            App.fnUpdateAllArticles()
        })

        App.$oArticleEditSave.click(() => {
            App.fnSaveArticle()
            App.oModelEditArticle.hide()
        })

        App.$oAllArticlesReload.click(() => {
            App.fnUpdateAllArticles()
        })
        App.$oAllArticlesCreate.click(() => {
            App.fnShowArticleEditModal(true)
        })
        App.$oAllArticlesEdit.click(() => {
            var oArticle = Database.fnGetByID("articles", App.sArticleID)
            if (oArticle) {
                App.fnShowArticleEditModal(false)
            }
        })
        App.$oAllArticlesRemove.click(() => {
            App.fnRemoveCatalogArticle(App.sArticleID)
        })

    }

    // ===============================================================

    static fnUpdateAllArticles()
    {
        console.log('fnUpdateAllArticles')
        var aR = Database.oDatabase.articles
        var sHTML = App.fnRenderList(aR, App.sArticleID)
        App.$oAllArticlesList.html(sHTML)
    }

    // ===============================================================

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
}