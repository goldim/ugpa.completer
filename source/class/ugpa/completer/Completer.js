qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,

    construct(source, widget) {
        // noinspection JSAnnotator
        super();
        this.__sourceModel = source;
        this.initPopup(new qx.ui.menu.Menu());
        this.initWidget(widget);
        this.__filterFunc = this.__getFilterModeFunc();
        this.__oneAgainAfterFirstInput = false;
    },

    events: {
        "activated": "qx.event.type.Event",
        "highlighted": "qx.event.type.Event"
    },

    properties: {
        caseSensitivity: {
            init: true,
            check: "Boolean"
        },

        maxVisibleItems: {
            init: 7,
            check: "Integer"
        },

        widget: {
            deferredInit: true,
            apply: "_applyWidget"
        },

        popup: {
            deferredInit: true
        },

        filterMode: {
            init: "startsWith",
            check: ["startsWith", "contains", "endsWith"],
            apply: "_applyFilterMode"
        }
    },

    members: {
        _applyWidget(widget){
            widget.addListener("input", this._onInput, this);
            widget.addListener("focus", this._onFocus, this);
            widget.addListener("focusout", this._onFocusOut, this);
        },

        _applyFilterMode(){
            this.__filterFunc = this.__getFilterModeFunc();
        },

        _onFocus(){
            const popup = this.getPopup();
            popup.setVisibility("visible");
            popup.placeToWidget(this.getWidget());

            const value = this.getWidget().getValue();
            this.__applyInput(value === null ? "" : value);
        },

        _onFocusOut(){
            console.log("FOCUS OUT");
        },

        _onInput(e){
            const input = e.getData();
            if (this.__oneAgainAfterFirstInput){
                this.getPopup().setVisibility("visible");
            }
            this.__applyInput(input);
        },

        __applyInput(input){
            const popup = this.getPopup();
            popup.removeAll();

            let values;
            if (!this.getCaseSensitivity()){
                values = this.__filterCaseInsensitiveValues(input);
            } else {
                values = this.__filterCaseSensitiveValues(input);
            }

            values.slice(0, this.getMaxVisibleItems()).forEach(value => {
                const button = new qx.ui.menu.Button(value);
                button.addListener("execute", function(){
                    this.getWidget().setValue(value);
                    this.__oneAgainAfterFirstInput = true;
                }, this);
                popup.add(button);
            });
        },

        __filterCaseInsensitiveValues(input){
            input = input.toLowerCase();
            return this.__sourceModel.filter(value =>{
                value = value.toLowerCase();
                return this.__filterFunc(input)(value);
            });
        },

        __filterCaseSensitiveValues(input){
            return this.__sourceModel.filter(this.__filterFunc(input));
        },

        __getFilterModeFunc(){
            const table = {
                startsWith: input => value => value.startsWith(input),
                contains: input => value => value.includes(input),
                endsWith: input => value => value.endsWith(input)
            };
            return table[this.getFilterMode()];
        }
    }
});