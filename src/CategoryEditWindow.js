import $ from "jquery";
import { App } from "./App";
import { Database } from "./Database";

import { ModeCatalogController } from "./ModeCatalogController"
import { Render } from "./Render"
import * as bootstrap from 'bootstrap'

export class CategoryEditWindow {
    // NOTE: Окно сохранения
    static oModel = null
    static bEmptyForm = false

    // ===============================================================

    static get $oModel() { return $("#modal-edit-category") }
    static get $oCategoryEditSaveBtn() { return $("#category-edit-save") }

    static get $oEditName() { return $("#edit-category-name") }
    static get $oEditParent() { return $("#edit-category-parent") }
    static get $oEditGroup() { return $("#edit-category-group") }

    // ===============================================================

    static fnBind()
    {
        CategoryEditWindow.$oCategoryEditSaveBtn.on('click', () => {
            CategoryEditWindow.fnSaveCategory()
            CategoryEditWindow.fnHideModal()
        })
    }

    // ===============================================================

    static fnUpdateName(bEmptyForm)
    {
        if (bEmptyForm) {
            CategoryEditWindow.$oEditName.val('')
        } else {
            var oCategory = Database.fnGetCurrentCategory()
            CategoryEditWindow.$oEditName.val(oCategory.name)
        }
    }

    static fnUpdateCategoriesList(bEmptyForm)
    {
        var sHTML = ``
        var aList = []
        aList.push({id:'',name:'[НЕТ]'})
        aList = aList.concat(JSON.parse(JSON.stringify(Database.oDatabase.categories)))
        if (bEmptyForm) {
            sHTML = Render.fnRenderOptionsList(aList, ModeCatalogController.sCatalogCategoryID)
        } else {
            var oCategory = Database.fnGetCurrentCategory()
            sHTML = Render.fnRenderOptionsList(aList, oCategory.parent_id)
        }
        CategoryEditWindow.$oEditParent.html(sHTML)
    }

    static fnUpdateGroupList(bEmptyForm)
    {
        var sHTML = ``
        var aList = []
        aList.push({id:'',name:'[НЕТ]'})
        aList = aList.concat(JSON.parse(JSON.stringify(Database.oDatabase.groups)))
        sHTML = Render.fnRenderOptionsList(aList, ModeCatalogController.sCatalogGroupID)
        CategoryEditWindow.$oEditGroup.html(sHTML)
    }

    static fnUpdateModel(bEmptyForm=false)
    {
        CategoryEditWindow.bEmptyForm = bEmptyForm
        CategoryEditWindow.fnUpdateName(bEmptyForm)
        CategoryEditWindow.fnUpdateGroupList(bEmptyForm)
        CategoryEditWindow.fnUpdateCategoriesList(bEmptyForm)
    }

    // ===============================================================

    static fnShowModal(bEmptyForm=false)
    {
        CategoryEditWindow.fnUpdateModel(bEmptyForm)
        if (!CategoryEditWindow.oModel) {
            CategoryEditWindow.oModel = new bootstrap.Modal(CategoryEditWindow.$oModel, {})
        }
        CategoryEditWindow.oModel.show()
    }

    static fnHideModal()
    {
        CategoryEditWindow.oModel.hide()
    }

    // ===============================================================

    static fnSaveCategory()
    {
        _s('CategoryEditWindow.fnSaveCategory')
        // {"id":1, "name": "Test 1", "is_opened": false, "parent_id": null, "group_id": "1"},
        var oObj = {
            name: CategoryEditWindow.$oEditName.val(),
            parent_id: CategoryEditWindow.$oEditParent.val(),
            group_id: CategoryEditWindow.$oEditGroup.val()
        }
        _l("!!!1", oObj)
        if (CategoryEditWindow.bEmptyForm) {
            // Если статьи нет, то создаем ее
            ModeCatalogController.sCatalogCategoryID = Database.fnAddRecord("categories", oObj)
        } else {
            Database.fnUpdateRecord("categories", ModeCatalogController.sCatalogCategoryID, oObj)
        }
        _l("!!!2", Database.oDatabase)
        Database.fnWriteNotesDatabase()
        App.fnUpdate()
    }
}