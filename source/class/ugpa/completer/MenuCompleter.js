qx.Class.define("ugpa.completer.MenuCompleter", {
    extend: ugpa.completer.Completer,

    construct(source, widget) {
        // noinspection JSAnnotator
        super(source, widget);
        const menu = new qx.ui.menu.Menu();
        this.setPopup(menu);
        this.setModel(menu);
    },

    members: {
        _setupAutoFocus(){
            const popup = this.getPopup();
            const firstButton = popup.getSelectables()[0];
            if (firstButton){
                popup.setSelectedButton(firstButton);
            }
        },

        _addItemOnPopup(value){
            const button = new qx.ui.menu.Button(value);
            button.addListener("execute", this._onItemPressed, this);
            this.getModel().add(button);
        },

        _onItemPressed(e){
            const button = e.getTarget();
            this.getWidget().setValue(button.getLabel());
        },

        _clearPopup(){
            const model = this.getModel();
            model.removeAll();
        }
    }
});