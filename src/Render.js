
import $ from "jquery";
import { App } from "./App";

export class Render {
    static fnRenderTree(aR, sSelID="", iParentID=null, iLevel=0)
    {
        var sHTML = ``

        for (var oI of aR) {
            if (!oI) continue;
            if (!iParentID) iParentID = null
            _l("fnRenderTree", oI.parent_id,iParentID)
            if (oI.parent_id!=iParentID) {
                continue;
            }
            var sItemStatus = ``
            if (oI.is_opened) {
                sItemStatus = `<i class="bi bi-dash-square"></i>`
            } else {
                sItemStatus = `<i class="bi bi-plus-square"></i>`
            }

            var sSelClass = sSelID == oI.id ? "active" : ""
            var sSpacer = `<div class="tree-spacer"></div>`.repeat(iLevel)

            sHTML += `
            <div class="input-group item-tree-row ${sSelClass}" data-id="${oI.id}" data-opened="${1*oI.is_opened}">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 cb-groups" type="checkbox" value="${oI.id}" id="group-${oI.id}" />
                </div>
                <div class="input-group-text item-flag-group">
                    <a class="item-flag">${sItemStatus}</a>
                </div>
                <a 
                    class="list-group-item list-group-item-action item-title ${oI.id == sSelID ? 'active' : ''}"
                    data-id="${oI.id}"
                >
                    ${sSpacer}<div>${oI.name}</div>
                </a>
            </div>
            `

            if (oI.is_opened) {
                sHTML += Render.fnRenderTree(aR, sSelID, oI.id, iLevel+1)
            }
        }

        return sHTML;
    }

    static fnRenderOptionsList(aList, sSelID)
    {
        var sHTML = ``
        for (var oItem of aList) {
            var sSelected = sSelID == oItem.id ? 'selected' : ''
            sHTML += `<option value="${oItem.id}" ${sSelected}>${oItem.name}</option>`
        }
        return sHTML
    }

    static fnRenderList(aR, sSelID="", fnHook=()=>{})
    {
        var sHTML = ``
        _l("fnRenderList", sSelID)

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
                    class="list-group-item list-group-item-action item-title ${oI.id == sSelID ? 'active' : ''}" 
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