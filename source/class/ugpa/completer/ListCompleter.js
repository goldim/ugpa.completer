qx.Class.define("ugpa.completer.ListCompleter", {
    extend: ugpa.completer.CompleterBase,

    construct(source, widget) {
        // noinspection JSAnnotator
        super(source, widget);
        widget.addListener("keydown", this._onKeyPress, this);
        const model = new qx.data.Array();
        this.__createPopup(model);
        this.setModel(model);
        this.setPopup(this.__createPopup(model));
    },

    members: {
        __createPopup(model){
            const popup = new ugpa.completer.ListPopup(model);
            const list = popup.getList();
            list.getPane().addListener("update", this._onUpdatePane, this);
            list.addListener("changeValue", this._onItemPressed, this);
            list.addListener("pointerover", this._onPointerDown, this);
            return popup;
        },

        _onUpdatePane(){
            this.getPopup().getList().setHeight(this.getPopup().getList().getPane().getRowConfig().getTotalSize() + 6);
        },

        _onPointerDown(e){
            const target = e.getTarget();
            if (target instanceof qx.ui.form.ListItem){
                if (this.__lastHoverItem){
                    this.__lastHoverItem.removeState("selected");
                }
                target.addState("selected");
                this.__lastHoverItem = target;
            }
        },

        setDelegate(delegate){
            this.getPopup().getList().setDelegate(delegate);
        },

        _onKeyPress(e){
            if (this.getModel().getLength() === 0){
                return;
            }
            const key = e.getKeyIdentifier();
            if (key === "Down" || key === "Up"){
                e.preventDefault();
            }
            let index;
            const list = this.getPopup().getList();
            const selection = list.getSelection();
            if (!this.getPopup().isVisible()){
                this.getPopup().show();
            }

            if (selection.getLength()){
                const selected = selection.getItem(0);
                if (key === "Enter"){
                    this.__applyValue(selected);
                    this.getPopup().hide();
                }

                index = this.getModel().indexOf(selected);

                if (key === "Down"){
                    if (index === this.getModel().getLength() - 1){
                        index = 0;
                    } else {
                        index++;
                    }
                }

                if (key === "Up"){
                    if (index === 0){
                        index = this.getModel().getLength() - 1;
                    } else {
                        index--;
                    }
                }
            } else {
                if (key === "Down"){
                    index = 0;
                }

                if (key === "Up"){
                    index = this.getModel().getLength() - 1;
                }
            }
            if (qx.lang.Type.isNumber(index)){
                const value = this.getModel().getItem(index);
                list.setSelection([value]);
                this.__applyValue(value);
            }
        },

        _setupAutoFocus(popup){
            popup.getList().setSelection([this.getModel().getItem(0)]);
        },

        _addItemOnPopup(value){
            this.getModel().push(value);
        },

        __applyValue(value){
            if (this.getCompletionColumn()){
                value = value.get(this.getCompletionColumn());
            }
            this.getWidget().setValue(value);
        },

        _onItemPressed(e){
            const index = e.getData()[0];
            const value = this.getModel().getItem(index);
            this.__applyValue(value);
            qx.event.Timer.once(function(){this.getPopup().hide();}, this, 100);
        }
    }
});