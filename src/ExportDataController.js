export class ExportDataController {
    static get $oExportBtn() { return $("#app-export-btn") }

    static fnBind()
    {
        ExportDataController.$oExportBtn.click(() => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Database.oDatabase));
            var dlAnchorElem = document.createElement("A");
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `database_${(new Date).getTime()}.json`);
            dlAnchorElem.click();
            // document.body.appendChild(dlAnchorElem)
            // console.log(dlAnchorElem)
            dlAnchorElem.remove()
        })
        // App.$oImportBtn.click(() => {
            
        // })
    }
}