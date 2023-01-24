import $ from "jquery";

import { Database } from "./Database"
import * as bootstrap from 'bootstrap'

export class APIDataWindow {
    // NOTE: методоты для работы dom

    static oAPIDataWindow = null

    static get $oFormValidatorIsEmpty() { return $(".is-empty") }

    // NOTE: Окно сохранения API данных
    static get $oModalAskApiKey() { return $("#modal-ask-api-key") }

    static get $oBlockOverlay() { return $("#block-overlay") }
    static get $oInfoSaveBtn() { return $("#info-save") }
    static get $oInfoLoginInput() { return $("#info-login") }
    static get $oInfoRepoInput() { return $("#info-repo") }
    static get $oInfoApiKeyInput() { return $("#info-api-key") }

    // ===============================================================

    static fnBind(fnCB=()=>{})
    {
        APIDataWindow.$oInfoSaveBtn.on('click', () => {
            var bEmpty = false;
            APIDataWindow.$oFormValidatorIsEmpty.each((iI, oE) => bEmpty |= oE.value.trim() == "")
            if (bEmpty) {
                alert('Поле пустое');
                return;
            }

            Database.sLogin = APIDataWindow.$oInfoLoginInput.val();
            Database.sRepo = APIDataWindow.$oInfoRepoInput.val();
            Database.sAPIKey = APIDataWindow.$oInfoApiKeyInput.val();

            APIDataWindow.$oModalAskApiKey.hide();
            window.location.hash = `#${Database.sLogin}:${Database.sRepo}:${Database.sAPIKey}`
            fnCB()
            // App.fnStartApp();
        })
    }

    // ===============================================================

    static fnShow()
    {
        if (!APIDataWindow.oAPIDataWindow) {
            APIDataWindow.oAPIDataWindow = new bootstrap.Modal(APIDataWindow.$oModalAskApiKey, {})
        }
        APIDataWindow.oAPIDataWindow.show()
    }

    static fnHide()
    {
        APIDataWindow.oAPIDataWindow.hide()
    }

    static fnShowOverlay()
    {
        APIDataWindow.$oBlockOverlay.show()        
    }

    static fnHideOverlay()
    {
        APIDataWindow.$oBlockOverlay.hide()        
    }
}