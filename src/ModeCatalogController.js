import $ from "jquery";
import { App } from "./App";

import { Database } from "./Database"
import { Render } from "./Render"

export class ModeCatalogController {

    static sCatalogGroupID = ""
    static sCatalogCategoryID = ""
    static sArticleID = ""
    static sTagID = ""

    // ===============================================================
    static get $oModeCatalog() { return $("#mode-catalog") }

    static get $oModeCatalogGroupItems() { return ModeCatalogController.$oModeCatalog.find(".groups-panel .item-title") }
    static get $oModeCatalogCategoryItems() { return ModeCatalogController.$oModeCatalog.find(".categories-panel .item-title") }
    static get $oModeCatalogArticleItems() { return ModeCatalogController.$oModeCatalog.find(".articles-panel .item-title") }

    static get $oCatalogGroupsList() { return $(".groups-panel .list") }
    static get $oCatalogCategoriesList() { return $(".categories-panel .list") }
    static get $oCatalogArticlesList() { return $(".articles-panel .list") }
    static get $oCatalogGroupsPanel() { return $(".groups-panel") }
    static get $oCatalogCategoriesPanel() { return $(".categories-panel") }
    static get $oCatalogArticlesPanel() { return $(".articles-panel") }

    static get $oCatalogGroupsReload() { return $("#catalog-groups-reload") }
    static get $oCatalogGroupsCreate() { return $("#catalog-groups-create") }
    static get $oCatalogGroupsEdit() { return $("#catalog-groups-edit") }
    static get $oCatalogGroupsRemove() { return $("#catalog-groups-remove") }

    static get $oCatalogCategoryReload() { return $("#catalog-category-reload") }
    static get $oCatalogCategoryCreate() { return $("#catalog-category-create") }
    static get $oCatalogCategoryEdit() { return $("#catalog-category-edit") }
    static get $oCatalogCategoryRemove() { return $("#catalog-category-remove") }

    static get $oCatalogArticleReload() { return $("#catalog-article-reload") }
    static get $oCatalogArticleCreate() { return $("#catalog-article-create") }
    static get $oCatalogArticleEdit() { return $("#catalog-article-edit") }
    static get $oCatalogArticleRemove() { return $("#catalog-article-remove") }

    // ===============================================================

    static fnBind() 
    {
        $(document).click((oEvent) => {
            // App.$oCatalogArticlesPanel
            if ($(oEvent.target).parents(".articles-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sArticleID", sID)
                    ModeCatalogController.fnChangeArticle(sID)
                }
            }
            // App.$oCatalogCategoriesPanel
            if ($(oEvent.target).parents(".categories-panel").length) {
                if ($(oEvent.target).parents(".item-flag-group").length) {
                    var oDiv = $($(oEvent.target).parents(".input-group")[0])
                    var sOpened = oDiv.data("opened")*1
                    var sID = oDiv.data("id")
                    console.log('sOpened', sOpened)
                    if (sID) { 
                        Database.fnUpdateRecord("categories", sID, { is_opened: !sOpened })
                        console.log(Database.oDatabase)
                        ModeCatalogController.fnUpdateCatalogCategories()
                    }
                } else {
                    var oDiv = $($(oEvent.target).parents(".input-group")[0])
                    var sID = oDiv.data("id")
                    if (sID) {
                        console.log("sCategoryID", sID)
                        ModeCatalogController.fnChangeCatalogCategory(sID)
                    }
                }
            }
            // App.$oCatalogGroupsPanel
            if ($(oEvent.target).parents(".groups-panel").length) {
                var oDiv = $($(oEvent.target).parents(".input-group")[0])
                var sID = oDiv.data("id")
                if (sID) {
                    console.log("sGroupID", sID)
                    ModeCatalogController.fnChangeCatalogGroup(sID)
                }
            }
        })

        ModeCatalogController.$oModeCatalogGroupItems.click(() => {
            var sID = $(this).data("id")
            ModeCatalogController.fnChangeCatalogGroup(sID)
        })
        ModeCatalogController.$oModeCatalogCategoryItems.click(() => {
            var sID = $(this).data("id")
            ModeCatalogController.fnChangeCatalogCategory(sID)
        })
        ModeCatalogController.$oModeCatalogArticleItems.click(() => {
            var sID = $(this).data("id")
            ModeCatalogController.fnChangeArticle(sID)
        })

        ModeCatalogController.$oCatalogGroupsRemove.click(() => {
            ModeCatalogController.fnRemoveCatalogGroup(ModeCatalogController.sCatalogGroupID)
        })
        ModeCatalogController.$oCatalogCategoryRemove.click(() => {
            ModeCatalogController.fnRemoveCatalogCategory(ModeCatalogController.sCatalogCategoryID)
        })
        ModeCatalogController.$oCatalogArticleRemove.click(() => {
            ModeCatalogController.fnRemoveCatalogArticle(ModeCatalogController.sArticleID)
        })

        ModeCatalogController.$oCatalogGroupsReload.click(() => {
            ModeCatalogController.fnUpdateCatalogGroups()
        })
        ModeCatalogController.$oCatalogCategoryReload.click(() => {
            ModeCatalogController.fnUpdateCatalogCategories()
        })
        ModeCatalogController.$oCatalogArticleReload.click(() => {
            ModeCatalogController.fnUpdateCatalogArticles()
        })

        ModeCatalogController.$oCatalogGroupsCreate.click(() => {
            var sName = prompt("Группа")
            if (sName) {
                Database.fnAddRecord("groups", {
                    "name": sName,
                    "html": ""
                })
                App.fnUpdate()
                Database.fnWriteNotesDatabase()
            }
        })
        ModeCatalogController.$oCatalogCategoryCreate.click(() => {
            var sName = prompt("Категория")
            if (sName) {
                Database.fnAddRecord("categories", {
                    "group_id": ModeCatalogController.sCatalogGroupID,
                    "name": sName,
                    "html": ""
                })
                App.fnUpdate()
                Database.fnWriteNotesDatabase()
            }
        })
        ModeCatalogController.$oCatalogArticleCreate.click(() => {
            ArticlesController.fnShowArticleEditModal(true)
        })
        ModeCatalogController.$oCatalogGroupsEdit.click(() => {
            var oGroup = Database.fnGetByID("groups", ModeCatalogController.sCatalogGroupID)
            if (oGroup) {
                var sName = prompt("Группа", oGroup.name)
                if (sName) {
                    Database.fnUpdateRecord("groups", oGroup.id, {"name": sName})
                    App.fnUpdate()
                    Database.fnWriteNotesDatabase()
                }
            }
        })
        ModeCatalogController.$oCatalogCategoryEdit.click(() => {
            var oCategory = Database.fnGetByID("categories", ModeCatalogController.sCatalogCategoryID)
            if (oCategory) {
                var sName = prompt("Категория", oCategory.name)
                if (sName) {
                    Database.fnUpdateRecord("categories", oCategory.id, {"name": sName})
                    App.fnUpdate()
                    Database.fnWriteNotesDatabase()
                }
            }
        })
        ModeCatalogController.$oCatalogArticleEdit.click(() => {
            console.log('$oCatalogArticleEdit')
            var oArticle = Database.fnGetByID("articles", ModeCatalogController.sArticleID)
            if (oArticle) {
                ArticlesController.fnShowArticleEditModal(false)
            }
        })
    }

    // ===============================================================

    static fnRemoveCatalogGroup(sGroupID)
    {
        var iIndex = Database.oDatabase.groups.findIndex((oI) => oI.id==sGroupID)
        delete Database.oDatabase.groups[iIndex]
        Database.oDatabase.groups.splice(iIndex, 1)
        Database.fnWriteNotesDatabase()
        ModeCatalogController.sCatalogGroupID = ""
        ModeCatalogController.sCatalogCategoryID = ""
        ModeCatalogController.sArticleID = ""
    }

    static fnRemoveCatalogCategory(sCategoryID)
    {
        var iIndex = Database.oDatabase.categories.findIndex((oI) => oI.id==sCategoryID)
        delete Database.oDatabase.categories[iIndex]
        Database.oDatabase.categories.splice(iIndex, 1)
        Database.fnWriteNotesDatabase()
        ModeCatalogController.sCatalogCategoryID = ""
        ModeCatalogController.sArticleID = ""
    }

    static fnRemoveCatalogArticle(sArticleID)
    {
        var iIndex = Database.oDatabase.articles.findIndex((oI) => oI.id==sArticleID)
        delete Database.oDatabase.articles[iIndex]
        Database.oDatabase.articles.splice(iIndex, 1)
        Database.fnWriteNotesDatabase()
        ModeCatalogController.sArticleID = ""
    }

    // ===============================================================

    static fnUpdateCatalogGroups()
    {
        var aR = Database.oDatabase.groups
        var sHTML = Render.fnRenderList(aR, ModeCatalogController.sCatalogGroupID)
        ModeCatalogController.$oCatalogGroupsList.html(sHTML)
    }

    static fnUpdateCatalogCategories()
    {
        var aR = []
        if (ModeCatalogController.sCatalogGroupID) {
            ModeCatalogController.$oCatalogCategoriesPanel.removeClass("hidden")
            var sHTML = ""
            aR = Database.fnFilterCategoriesByGroup(ModeCatalogController.sCatalogGroupID);
            console.log("fnUpdateCatalogCategories", ModeCatalogController.sCatalogGroupID, aR)
            sHTML = Render.fnRenderTree(aR, ModeCatalogController.sCatalogCategoryID)
            ModeCatalogController.$oCatalogCategoriesList.html(sHTML)
        } else {
            ModeCatalogController.$oCatalogCategoriesPanel.addClass("hidden")
        }
        
    }

    static fnUpdateCatalogArticles()
    {
        if (ModeCatalogController.sCatalogCategoryID) {
            ModeCatalogController.$oCatalogArticlesPanel.removeClass("hidden")
            var aR = Database.fnFilterArticlesByCategory(ModeCatalogController.sCatalogCategoryID)
            var sHTML = Render.fnRenderList(aR, ModeCatalogController.sArticleID)
            ModeCatalogController.$oCatalogArticlesList.html(sHTML)
        } else {
            ModeCatalogController.$oCatalogArticlesPanel.addClass("hidden")
        }
    }

    // ===============================================================

    static fnChangeCatalogGroup(sGroupID)
    {
        ModeCatalogController.sCatalogGroupID = sGroupID
        ModeCatalogController.sCatalogCategoryID = ""
        ModeCatalogController.sArticleID = ""
        App.fnUpdate()
    }

    static fnChangeCatalogCategory(sCategoryID)
    {
        ModeCatalogController.sCatalogCategoryID = sCategoryID
        ModeCatalogController.sArticleID = ""
        App.fnUpdate()
    }

    static fnChangeArticle(sArticleID)
    {
        console.error(['fnChangeArticle', arguments])
        ModeCatalogController.sArticleID = sArticleID
        Database.fnUpdateFilename(sArticleID)
        App.fnUpdate()
    }
}