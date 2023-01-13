
class ArticlesController {
    // NOTE: Окно сохранения
    static oModelEditArticle = null

    // ===============================================================

    static get $oModelEditArticle() { return $("#modal-edit-article") }
    static get $oArticleEditSave() { return $("#article-edit-save") }
    static get $oArticleTagsBox1Select() { return $("#article-tags .box1") }
    static get $oArticleTagsBox2Select() { return $("#article-tags .box2") }
    static get $oArticleModelEditName() { return $("#article-name") }
    static get $oArticleModelEditGroup() { return $("#article-group") }
    static get $oArticleModelEditCategory() { return $("#article-category") }

    static get $oArticleMoveAllTags2to1Btn() { return $("#article-tags .tags-list-all-2-1") }
    static get $oArticleMoveTags2to1Btn() { return $("#article-tags .tags-list-one-2-1") }
    static get $oArticleMoveAllTags1to2Btn() { return $("#article-tags .tags-list-all-1-2") }
    static get $oArticleMoveTags1to2Btn() { return $("#article-tags .tags-list-one-1-2") }

    // ===============================================================

    static fnBind()
    {
        App.$oArticleMoveAllTags2to1Btn.click(() => {
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = []
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveTags2to1Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList()
            var aAllBox2Tags = App.fnGetArticleBox2TagsList()
            var aBox2Tags = App.fnGetArticleBox2TagsList(true)
            aBox2Tags = aAllBox2Tags.filter((oI, iN, aA) => !~aBox2Tags.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveAllTags1to2Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList()
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })
        App.$oArticleMoveTags1to2Btn.click(() => {
            var aBox1Tags = App.fnGetArticleBox1TagsList(true)
            var aBox2Tags = App.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            App.fnRenderBox2List(aBox2Tags)
        })        
    }

    // ===============================================================

    static fnUpdateArticlesName(bEmptyForm)
    {
        if (bEmptyForm) {
            App.$oArticleModelEditName.val('')
        } else {
            var oArticle = App.fnGetCurrentArticle()
            App.$oArticleModelEditName.val(oArticle.name)
        }
    }

    static fnUpdateArticlesCategoryList()
    {
        var sHTML = ``
        var aR = []
        for (var oC of Database.oDatabase.categories) {
            var aGr = Database.oDatabase.groups.filter((oG) => oG.id == oC.group_id )
            var oCF = Object.assign({}, oC)
            oCF.name = `${aGr[0].name} - ${oCF.name}`
            aR = aR.concat(oCF)
        }
        sHTML = App.fnRenderOptionsList(aR, App.sCatalogCategoryID)
        App.$oArticleModelEditCategory.html(sHTML)
    }

    static fnUpdateArticlesModel(bEmptyForm=false)
    {
        App.fnUpdateArticlesName(bEmptyForm)
        App.fnUpdateArticlesTagsList(bEmptyForm)
        App.fnUpdateArticlesCategoryList()
    }

    // ===============================================================

    static fnShowArticleEditModal(bEmptyForm=false)
    {
        App.fnUpdateArticlesModel(bEmptyForm)
        if (!App.oModelEditArticle) {
            App.oModelEditArticle = new bootstrap.Modal(App.$oModelEditArticle, {})
        }
        App.oModelEditArticle.show()
    }

    static fnHideArticleEditModal()
    {
        App.oModelEditArticle.hide()
    }

    // ===============================================================

    static fnGetArticleBox1TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(App.$oArticleTagsBox1Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(App.$oArticleTagsBox1Select.find("option"))
        }
        aOpts = aOpts.map((oE) => Database.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    static fnGetArticleBox2TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(App.$oArticleTagsBox2Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(App.$oArticleTagsBox2Select.find("option"))
        }
        aOpts = aOpts.map((oE) => Database.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    // ===============================================================

    static fnRenderBox1List(aList)
    {
        var sHTML = ''
        sHTML = App.fnRenderOptionsList(aList)
        App.$oArticleTagsBox1Select.html(sHTML)
    }

    static fnRenderBox2List(aList)
    {
        var sHTML = ''
        sHTML = App.fnRenderOptionsList(aList)
        App.$oArticleTagsBox2Select.html(sHTML)
    }

    // ===============================================================

    static fnSaveCurrentArticleTags()
    {
        var aTagsRel = Database.oDatabase.tags_relations
        // Удаляем старые связи
        Database.oDatabase.tags_relations = aTagsRel.filter((oI) => oI.article_id != App.sArticleID)
        var aTags = App.fnGetArticleBox2TagsList()
        for (var oTag of aTags) {
            Database.fnAddRecord("tags_relations", { "tag_id": oTag.id, "article_id": App.sArticleID })
        }
    }
}