qx.Class.define("ugpa.completer.ListPopup", {
    extend: qx.ui.popup.Popup,
    implement: ugpa.completer.IPopup,

    construct(model){
        // noinspection JSAnnotator
        super();
        this.setLayout(new qx.ui.layout.Grow());
        this.add(new qx.ui.list.List(model));
    }
});