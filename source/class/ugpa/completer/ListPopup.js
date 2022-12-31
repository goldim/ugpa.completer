qx.Class.define("ugpa.completer.ListPopup", {
    extend: qx.ui.popup.Popup,
    implement: ugpa.completer.IPopup,

    construct(model){
        // noinspection JSAnnotator
        super();
        this.setLayout(new qx.ui.layout.Grow());
        const list = this.__list = new qx.ui.list.List(model);
        this.add(list);
    },

    destruct(){
        this.__list.dispose();
    },

    members: {
        getList(){
            return this.__list;
        }
    }
});