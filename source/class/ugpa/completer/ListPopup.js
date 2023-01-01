qx.Class.define("ugpa.completer.ListPopup", {
    extend: qx.ui.popup.Popup,
    implement: ugpa.completer.IPopup,

    construct(){
        // noinspection JSAnnotator
        super();
        this.setLayout(new qx.ui.layout.Grow());
    }
});