import { Database } from "./Database"

export class APIDataWindow {
    // NOTE: методоты для работы dom

    static get $oFormValidatorIsEmpty() { return $(".is-empty") }

    // NOTE: Окно сохранения API данных
    static get $oBlockOverlay() { return $("#block-overlay") }
    static get $oModalAskApiKey() { return $("#modal-ask-api-key") }
    static get $oInfoSaveBtn() { return $("#info-save") }
    static get $oInfoLoginInput() { return $("#info-login") }
    static get $oInfoRepoInput() { return $("#info-repo") }
    static get $oInfoApiKeyInput() { return $("#info-api-key") }

    static fnBind(fnCB=()=>{})
    {
        APIDataWindow.$oInfoSaveBtn.click(() => {
            var bEmpty = false;
            APIDataWindow.$oFormValidatorIsEmpty.each((iI, oE) => bEmpty |= oE.value.trim() == "")
            if (bEmpty) {
                alert('Поле пустое');
                return;
            }

            Database.sLogin = App.$oInfoLoginInput.val();
            Database.sRepo = App.$oInfoRepoInput.val();
            Database.sAPIKey = App.$oInfoApiKeyInput.val();

            APIDataWindow.$oModalAskApiKey.hide();
            window.location.hash = `#${Database.sLogin}:${Database.sRepo}:${Database.sAPIKey}`
            fnCB()
            // App.fnStartApp();
        })
    }
}