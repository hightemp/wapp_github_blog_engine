
class Editor {

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

    static fnRenderHTMLEditor()
    {
        App.oEditor = new Quill('#page-edit', {
            modules: {toolbar: true},
            theme: 'snow',
        });
    }

    // ===============================================================

    static fnPrepareEditorContents()
    {
        var sHTML = App.fnGetEditorContent()
        Database.fnUpdateRecord("articles", App.sArticleID, { html: sHTML })
    }

    static fnSaveEditorContents()
    {
        App.fnPrepareEditorContents()
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
        App.bDirty = true;
    }

    // ===============================================================

    static fnUpdateEditor()
    {
        if (!App.sArticleID) {
            App.$oPagePanel.addClass('hidden')
            App.fnSetEditorContent('')
        } else {
            App.$oPagePanel.removeClass('hidden')
            var aR = App.fnFilterArticlesByID(App.sArticleID);
            if (aR.length) {
                App.fnSetEditorContent(aR[0].html)
            } else {
                App.$oPagePanel.addClass('hidden')
                App.fnSetEditorContent('')
            }
        }
    }
}