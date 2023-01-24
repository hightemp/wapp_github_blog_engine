import $ from "jquery";
import { Database } from "./Database";

export class ExportDataController {
    static get $oExportBtn() { return $("#app-export-btn") }

    static fnBind()
    {
        ExportDataController.$oExportBtn.on('click', () => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Database.oDatabase));
            var dlAnchorElem = document.createElement("A");
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `database_${(new Date).getTime()}.json`);
            dlAnchorElem.on('click', );
            // document.body.appendChild(dlAnchorElem)
            // _l(dlAnchorElem)
            dlAnchorElem.remove()
        })
        // App.$oImportBtn.on('click', () => {
            
        // })
    }
}