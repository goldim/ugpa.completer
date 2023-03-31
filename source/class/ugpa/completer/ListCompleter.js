qx.Class.define("ugpa.completer.ListCompleter", {
    extend: ugpa.completer.Completer,

    construct(source, widget) {
        // noinspection JSAnnotator
        super(source, widget);
        widget.addListener("keyup", this._onKeyPress, this);
        this.__list = this.__createList();
        this.setPopup(this.__createPopup(this.__list));
    },

    destruct() {
        this.__list.dispose();
        this.__list = null;
    },

    members: {
        __getListModel() {
            return this.__list.getModel();
        },

        _applyPopup(popup) {
            super._applyPopup(popup);
            popup.add(this.__list);
        },

        __createList() {
            const model = new qx.data.Array();
            const list = new qx.ui.list.List(model);
            list.getPane().addListener("update", this._onUpdatePane, this);
            list.addListener("changeValue", this._onItemPressed, this);
            list.addListener("pointerover", this._onPointerDown, this);
            return list;
        },

        __createPopup(list) {
            const popup = new ugpa.completer.ListPopup();
            popup.add(list);
            return popup;
        },

        _onUpdatePane() {
            const height = this.__list.getPane().getRowConfig().getTotalSize() + 6;
            this.__list.setHeight(height);
        },

        _onPointerDown(e) {
            const target = e.getTarget();
            if (target instanceof qx.ui.form.ListItem) {
                if (this.__oldItem) {
                    this.__oldItem.removeState("selected");
                }
                target.addState("selected");
                this.__oldItem = target;
            }
        },

        setDelegate(delegate) {
            this.__list.setDelegate(delegate);
        },

        _onKeyPress(e) {
            if (!this.getEnabled()) {
                return;
            }
            const model = this.__getListModel();
            if (model.getLength() === 0) {
                return;
            }
            const key = e.getKeyIdentifier();
            if (key === "Backspace") {
                return;
            }
            if (key === "Down" || key === "Up") {
                e.preventDefault();
            }
            let index;
            const list = this.__list;
            const selection = list.getSelection();
            if (!this.getPopup().isVisible()) {
                this.getPopup().show();
            }

            if (selection.getLength()) {
                const selected = selection.getItem(0);
                if (key === "Enter") {
                    this.__applyValue(selected);
                    this.getPopup().hide();
                }

                index = model.indexOf(selected);

                if (key === "Down") {
                    if (index === model.getLength() - 1) {
                        index = 0;
                    } else {
                        index++;
                    }
                }

                if (key === "Up") {
                    if (index === 0) {
                        index = model.getLength() - 1;
                    } else {
                        index--;
                    }
                }
            } else {
                if (key === "Down") {
                    index = 0;
                }

                if (key === "Up") {
                    index = model.getLength() - 1;
                }
            }
            if (qx.lang.Type.isNumber(index)) {
                const value = model.getItem(index);
                list.setSelection([value]);
                this.__applyValue(value);
            }
        },

        _setupAutoFocus() {
            const firstItem = this.__getListModel().getItem(0);
            if (firstItem) {
                this.__list.setSelection([firstItem]);
            }
        },

        _addItemOnPopup(value) {
            this.__getListModel().push(value);
        },

        __applyValue(value) {
            if (this.getCompletionColumn()) {
                value = value.get(this.getCompletionColumn());
            }
            this.getWidget().setValue(value);
        },

        _onItemPressed(e) {
            const index = e.getData()[0];
            const value = this.__getListModel().getItem(index);
            this.__applyValue(value);
            qx.event.Timer.once(function() {
 this.getPopup().hide(); 
}, this, 100);
        },

        _clearPopup() {
            const model = this.__getListModel();
            model.removeAll();
        }
    }
});
