import $ from "jquery";
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { Database } from "./Database";

import { ModeCatalogController } from "./ModeCatalogController"

export class Editor {

    static oEditor = null

    // ===============================================================

    static get $oPageEditWrapper() { return $(".page-edit") }
    static get $oPagePanel() { return $(".page-panel") }
    static get $oPageEdit() { return $("#page-edit") }

    static get $oPageSaveBtn() { return $("#page-save-btn") }
    static get $oPageLinkBtn() { return $("#page-link-btn") }

    // ===============================================================

    static fnBind()
    {
        Editor.$oPageSaveBtn.click(() => {
            Editor.fnSaveEditorContents()
        })
        Editor.$oPageLinkBtn.click(() => {
            var sPath = Database.fnGetArticlePathURL(Database.sArticleID)
            window.open(`https://github.com/${Database.sLogin}/${Database.sRepo}/${sPath}`)
        })

    }

    // ===============================================================

    static fnRender()
    {
        Editor.fnRenderHTMLEditor()
    }

    // ===============================================================

    static fnRenderHTMLEditor()
    {
        Editor.oEditor = new Quill('#page-edit', {
            modules: {toolbar: true},
            theme: 'snow',
        });
    }

    // ===============================================================

    static fnPrepareEditorContents()
    {
        var sHTML = Editor.fnGetEditorContent()
        Database.fnUpdateRecord("articles", ModeCatalogController.sArticleID, { html: sHTML })
    }

    static fnSaveEditorContents()
    {
        Editor.fnPrepareEditorContents()
        Database.fnWriteNotesDatabase()
    }

    static fnGetEditorContent()
    {
        var editor = document.getElementsByClassName('ql-editor')
        return editor[0].innerHTML
    }

    static fnSetEditorContent(sHTML)
    {
        var editor = document.getElementsByClassName('ql-editor')
        console.log(sHTML)
        editor[0].innerHTML = sHTML
        Database.bDirty = true;
    }

    // ===============================================================

    static fnUpdateEditor()
    {
        if (!ModeCatalogController.sArticleID) {
            Editor.$oPagePanel.addClass('hidden')
            Editor.fnSetEditorContent('')
        } else {
            Editor.$oPagePanel.removeClass('hidden')
            var aR = Database.fnFilterArticlesByID(ModeCatalogController.sArticleID);
            if (aR.length) {
                Editor.fnSetEditorContent(aR[0].html)
            } else {
                Editor.$oPagePanel.addClass('hidden')
                Editor.fnSetEditorContent('')
            }
        }
    }
}