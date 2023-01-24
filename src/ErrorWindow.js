import $ from "jquery";

import { Database } from "./Database"
import * as bootstrap from 'bootstrap'

export class ErrorWindow {
    // NOTE: методоты для работы dom

    static oErrorWindow = null

    static get $oFormValidatorIsEmpty() { return $(".is-empty") }

    // NOTE: Окно сохранения API данных
    static get $oModal() { return $("#modal-error") }
    static get $oModalBody() { return ErrorWindow.$oModal.find(".modal-body") }
    static get $oModalTitle() { return ErrorWindow.$oModal.find(".modal-title") }

    // ===============================================================

    static fnBind(fnCB=()=>{})
    {

    }

    // ===============================================================

    static fnShow(sTitle, sMessage)
    {
        if (!ErrorWindow.oErrorWindow) {
            ErrorWindow.oErrorWindow = new bootstrap.Modal(ErrorWindow.$oModal, {})
        }
        ErrorWindow.$oModalTitle.html(sTitle)
        ErrorWindow.$oModalBody.html(sMessage)
        ErrorWindow.oErrorWindow.show()
    }

    static fnHide()
    {
        ErrorWindow.oErrorWindow.hide()
    }
}