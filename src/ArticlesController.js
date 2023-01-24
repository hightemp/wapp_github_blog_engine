import $ from "jquery";
import { App } from "./App";
import { Database } from "./Database";

import { ModeCatalogController } from "./ModeCatalogController"
import { Render } from "./Render"
import * as bootstrap from 'bootstrap'

export class ArticlesController {
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
        ArticlesController.$oArticleEditSave.on('click', () => {
            ArticlesController.fnSaveArticle()
            ArticlesController.oModelEditArticle.hide()
        })

        ArticlesController.$oArticleMoveAllTags2to1Btn.on('click', () => {
            var aBox2Tags = ArticlesController.fnGetArticleBox2TagsList()
            aBox2Tags = []
            ArticlesController.fnRenderBox2List(aBox2Tags)
        })
        ArticlesController.$oArticleMoveTags2to1Btn.on('click', () => {
            var aBox1Tags = ArticlesController.fnGetArticleBox1TagsList()
            var aAllBox2Tags = ArticlesController.fnGetArticleBox2TagsList()
            var aBox2Tags = ArticlesController.fnGetArticleBox2TagsList(true)
            aBox2Tags = aAllBox2Tags.filter((oI, iN, aA) => !~aBox2Tags.findIndex((oAI) => oAI.id == oI.id))
            ArticlesController.fnRenderBox2List(aBox2Tags)
        })
        ArticlesController.$oArticleMoveAllTags1to2Btn.on('click', () => {
            var aBox1Tags = ArticlesController.fnGetArticleBox1TagsList()
            var aBox2Tags = ArticlesController.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            ArticlesController.fnRenderBox2List(aBox2Tags)
        })
        ArticlesController.$oArticleMoveTags1to2Btn.on('click', () => {
            var aBox1Tags = ArticlesController.fnGetArticleBox1TagsList(true)
            var aBox2Tags = ArticlesController.fnGetArticleBox2TagsList()
            aBox2Tags = aBox2Tags.concat(aBox1Tags)
            aBox2Tags = aBox2Tags.filter((oI, iN, aA) => iN==aA.findIndex((oAI) => oAI.id == oI.id))
            ArticlesController.fnRenderBox2List(aBox2Tags)
        })        
    }

    // ===============================================================

    static fnUpdateArticlesName(bEmptyForm)
    {
        if (bEmptyForm) {
            ArticlesController.$oArticleModelEditName.val('')
        } else {
            var oArticle = Database.fnGetCurrentArticle()
            ArticlesController.$oArticleModelEditName.val(oArticle.name)
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
        sHTML = Render.fnRenderOptionsList(aR, ModeCatalogController.sCatalogCategoryID)
        ArticlesController.$oArticleModelEditCategory.html(sHTML)
    }

    static fnUpdateArticlesModel(bEmptyForm=false)
    {
        ArticlesController.fnUpdateArticlesName(bEmptyForm)
        ArticlesController.fnUpdateArticlesTagsList(bEmptyForm)
        ArticlesController.fnUpdateArticlesCategoryList()
    }

    // ===============================================================

    static fnShowArticleEditModal(bEmptyForm=false)
    {
        ArticlesController.fnUpdateArticlesModel(bEmptyForm)
        if (!ArticlesController.oModelEditArticle) {
            ArticlesController.oModelEditArticle = new bootstrap.Modal(ArticlesController.$oModelEditArticle, {})
        }
        ArticlesController.oModelEditArticle.show()
    }

    static fnHideArticleEditModal()
    {
        ArticlesController.oModelEditArticle.hide()
    }

    // ===============================================================

    static fnGetArticleBox1TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(ArticlesController.$oArticleTagsBox1Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(ArticlesController.$oArticleTagsBox1Select.find("option"))
        }
        aOpts = aOpts.map((oE) => Database.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    static fnGetArticleBox2TagsList(bSelected=false)
    {
        var aOpts = []
        if (bSelected) {
            aOpts = $.makeArray(ArticlesController.$oArticleTagsBox2Select.find("option:selected"))
        } else {
            aOpts = $.makeArray(ArticlesController.$oArticleTagsBox2Select.find("option"))
        }
        aOpts = aOpts.map((oE) => Database.oDatabase.tags.filter((oT) => oT.id == $(oE).attr("value"))[0])
        return JSON.parse(JSON.stringify(aOpts))
    }

    // ===============================================================

    static fnRenderBox1List(aList)
    {
        var sHTML = ''
        sHTML = ArticlesController.fnRenderOptionsList(aList)
        ArticlesController.$oArticleTagsBox1Select.html(sHTML)
    }

    static fnRenderBox2List(aList)
    {
        var sHTML = ''
        sHTML = ArticlesController.fnRenderOptionsList(aList)
        ArticlesController.$oArticleTagsBox2Select.html(sHTML)
    }

    // ===============================================================

    static fnSaveCurrentArticleTags()
    {
        var aTagsRel = Database.oDatabase.tags_relations
        // Удаляем старые связи
        Database.oDatabase.tags_relations = aTagsRel.filter((oI) => oI.article_id != ModeCatalogController.sArticleID)
        var aTags = ArticlesController.fnGetArticleBox2TagsList()
        for (var oTag of aTags) {
            Database.fnAddRecord("tags_relations", { "tag_id": oTag.id, "article_id": ModeCatalogController.sArticleID })
        }
    }

    // ===============================================================

    static fnSaveArticle()
    {
        if (ModeCatalogController.sArticleID == "") {
            // Если статьи нет, то создаем ее
            // App.sArticleID = Database.fnAddRecord("articles", {category_id:"",name:"",html:""})
        }
        var oObj = {
            name: ArticlesController.$oArticleModelEditName.val(),
            category_id: ArticlesController.$oArticleModelEditCategory.val()
        }
        console.log("!!!1", oObj, ModeCatalogController.sArticleID)
        Database.fnUpdateRecord("articles", ModeCatalogController.sArticleID, oObj)
        ArticlesController.fnSaveCurrentArticleTags()
        console.log("!!!2", Database.oDatabase)
        Database.fnWriteNotesDatabase()
        App.fnUpdate()
    }
}