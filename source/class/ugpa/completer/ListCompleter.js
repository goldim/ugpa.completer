qx.Class.define("ugpa.completer.ListCompleter", {
    extend: qx.core.Object,
    implement: [qx.ui.form.IModel],
    include: ugpa.completer.MFilterMode,

    construct(source, widget) {
        // noinspection JSAnnotator
        super();
        this.__source = source;
        widget.addListener("keydown", this._onKeyPress, this);
        const model = new qx.data.Array();
        this.__createPopup(model);
        this.setModel(model);
        this.setWidget(widget);
        this.__delayTimer = null;
    },

    destruct(){
        this.__delayTimer = null;
    },

    events: {
        "activated": "qx.event.type.Event",
        "highlighted": "qx.event.type.Event"
    },

    properties: {
        delay: {
            init: 0,
            check: "Integer"
        },

        model: {
            init: null,
            apply: "_applyModel",
            event: "changeModel"
        },

        autoFocus: {
            init: false,
            check: "Boolean"
        },

        caseSensitivity: {
            init: true,
            check: "Boolean"
        },

        minLength: {
            init: 1
        },

        maxVisibleItems: {
            init: 7,
            check: "Integer"
        },

        widget: {
            init: null,
            apply: "_applyWidget"
        },

        popup: {
            deferredInit: true,
            apply: "_applyPopup"
        }
    },

    members: {
        __createPopup(model){
            const popup = new ugpa.completer.ListPopup(model);
            const list = popup.getList();
            list.getPane().addListener("update", this._onUpdatePane, this);
            list.addListener("changeValue", this._onItemPressed, this);
            list.addListener("pointerover", this._onPointerDown, this);
            this.initPopup(popup);
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

        _applyModel(model){
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

        _applyWidget(widget){
            qx.Interface.assertObject(widget, ugpa.completer.IWidget);

            widget.addListener("input", this._onInput, this);
            widget.addListener("click", this._onFocus, this);
            widget.addListener("tap", this._onFocus, this);

            this.__updatePopupWidth();
        },

        __updatePopupWidth(){
            const popup = this.getPopup();
            if (popup){
                const widget = this.getWidget();
                if (widget){
                    popup.setWidth(widget.getWidth());
                }
            }
        },

        _applyPopup(popup){
            qx.Interface.assertObject(popup, ugpa.completer.IPopup);
            this.__updatePopupWidth();
        },

        _onFocus(){
            const value = this.getWidget().getValue();
            if (!value && this.getMinLength() > 0){
                return;
            }
            this.__showPopup();
            this.__applyInput(value === null ? "" : value);
        },

        _onInput(e){
            const input = e.getData();
            if (input.length < this.getMinLength()) {
                if (this.getPopup().isVisible()){
                    this.getPopup().hide();
                }
                return;
            }
            this.__searchWithTimer(input);
        },

        __searchWithTimer(input){
            this.__stopDelayTimer();

            this.__delayTimer = qx.event.Timer.once(function(){
                this.__showPopup();
                this.__applyInput(input);
            }, this, this.getDelay());
        },

        __stopDelayTimer(){
            if (this.__delayTimer){
                this.__delayTimer.stop();
                this.__delayTimer = null;
            }
        },

        __showPopup(){
            const popup = this.getPopup();
            popup.show();
            popup.placeToWidget(this.getWidget());
        },

        __applyAutofocus(){
            if (this.getAutoFocus()){
                const popup = this.getPopup();
                popup.getList().setSelection([this.getModel().getItem(0)]);
            }
        },

        search(value){
            this.__searchWithTimer(value);
        },

        __applyInput(input){
            this.__clearPopup();
            const values = this.filterByInput(input, this.__source);
            if (values.length){
                values.slice(0, this.getMaxVisibleItems()).forEach(this.__addItemOnPopup, this);
                this.__applyAutofocus();
            } else {
                this.getPopup().hide();
            }
        },

        __addItemOnPopup(value){
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
        },

        __clearPopup(){
            const model = this.getModel();
            model.removeAll();
        }
    }
});