qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,
    implement: [qx.ui.form.IModel],
    include: ugpa.completer.MFilterMode,

    construct(source, widget) {
        // noinspection JSAnnotator
        super();
        this.__source = source;
        const menu = new qx.ui.menu.Menu();
        this.initPopup(menu);
        this.setModel(menu);
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
        _applyModel(model){
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
                const firstButton = popup.getSelectables()[0];
                if (firstButton){
                    popup.setSelectedButton(firstButton);
                }
            }
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
            const button = new qx.ui.menu.Button(value);
            button.addListener("execute", this._onItemPressed, this);
            this.getModel().add(button);
        },

        _onItemPressed(e){
            const button = e.getTarget();
            this.getWidget().setValue(button.getLabel());
        },

        __clearPopup(){
            const model = this.getModel();
            model.removeAll();
        }
    }
});