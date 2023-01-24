import $ from "jquery";

export const MODE_CATALOG = "catalog"
export const MODE_LIST = "list"
export const MODE_FAVORITES = "favorites"
export const MODE_TAGS = "tags"
export const MODE_LINKS = "links"

export class ModeController {
    // NOTE: Стейты
    static aModes = [MODE_CATALOG, MODE_LIST, MODE_FAVORITES, MODE_TAGS, MODE_LINKS]
    
    static sMode = MODE_CATALOG

    // ===============================================================

    // Кнопки режимы
    static get $oAppModes() { return $(".app-modes") }
    static get $oModes() { return $(".mode") }
    static get $oModesBtns() { return $(".app-modes>a") }
    static get $oModeListBtn() { return $("#app-mode-list") }
    static get $oModeList() { return $("#mode-list") }
    static get $oModeCatalogBtn() { return $("#app-mode-catalog") }
    static get $oModeCatalog() { return $("#mode-catalog") }
    static get $oModeFavoritesBtn() { return $("#app-mode-favorites") }
    static get $oModeFavorites() { return $("#mode-favorites") }
    static get $oModeTagsBtn() { return $("#app-mode-tags") }
    static get $oModeTags() { return $("#mode-tags") }
    static get $oModeLinksBtn() { return $("#app-mode-links") }
    static get $oModeLinks() { return $("#mode-links") }

    // ===============================================================

    static fnBind()
    {
        console.trace("fnBind")
        ModeController.$oModeListBtn.click(() => {
            ModeController.fnChangeMode(MODE_LIST)
        })
        ModeController.$oModeCatalogBtn.click(() => {
            ModeController.fnChangeMode(MODE_CATALOG)
        })
        ModeController.$oModeFavoritesBtn.click(() => {
            ModeController.fnChangeMode(MODE_FAVORITES)
        })
        ModeController.$oModeTagsBtn.click(() => {
            ModeController.fnChangeMode(MODE_TAGS)
        })
        ModeController.$oModeLinksBtn.click(() => {
            ModeController.fnChangeMode(MODE_LINKS)
        })
    }

    static fnChangeMode(sNewMode)
    {
        ModeController.$oModes.addClass("hidden")
        ModeController.$oModesBtns.removeClass("btn-primary")
        if (sNewMode==MODE_LIST) {
            ModeController.$oModeListBtn.addClass("btn-primary")
            ModeController.$oModeList.removeClass("hidden")
        }
        if (sNewMode==MODE_CATALOG) {
            ModeController.$oModeCatalogBtn.addClass("btn-primary")
            ModeController.$oModeCatalog.removeClass("hidden")
        }
        if (sNewMode==MODE_FAVORITES) {
            ModeController.$oModeFavoritesBtn.addClass("btn-primary")
            ModeController.$oModeFavorites.removeClass("hidden")
        }
        if (sNewMode==MODE_TAGS) {
            ModeController.$oModeTagsBtn.addClass("btn-primary")
            ModeController.$oModeTags.removeClass("hidden")
        }
        if (sNewMode==MODE_LINKS) {
            ModeController.$oModeLinksBtn.addClass("btn-primary")
            ModeController.$oModeLinks.removeClass("hidden")
        }
        ModeController.sMode = sNewMode
    }

    // ===============================================================
}