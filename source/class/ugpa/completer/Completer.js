qx.Class.define("ugpa.completer.Completer", {
    extend: ugpa.completer.CompleterBase,

    construct(source, widget) {
        // noinspection JSAnnotator
        super(source, widget);
        const menu = new qx.ui.menu.Menu();
        this.setPopup(menu);
        this.setModel(menu);
    },

    members: {
        _setupAutoFocus(popup){
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
        }
    }
});