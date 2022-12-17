qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,

    construct(source, widget) {
        // noinspection JSAnnotator
        super();
        this.__sourceModel = source;
        this.initPopup(new qx.ui.menu.Menu());
        this.initWidget(widget);
        this.__filterFunc = this.__getFilterModeFunc();
    },

    events: {
        "activated": "qx.event.type.Event",
        "highlighted": "qx.event.type.Event"
    },

    properties: {
        caseSensitivity: {
            init: false,
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
        _applyWidget(widget, oldWidget){
            if (oldWidget){
            }
            widget.addListener("input", this._onInput, this);
            widget.addListener("focus", this._onFocus, this);
            widget.addListener("focusout", this._onFocusOut, this);
        },

        _applyFilterMode(){
            this.__filterFunc = this.__getFilterModeFunc();
        },

        _onFocus(){
            const value = this.getWidget().getValue();
            this.__openPopup(value === null ? "" : value);
        },

        _onFocusOut(){
            console.log("FOCUS OUT");
        },

        _onInput(e){
            const input = e.getData();
            this.__openPopup(input);
        },

        __openPopup(input){
            const popup = this.getPopup();
            popup.removeAll();

            const values = this.__sourceModel.filter(this.__filterFunc(input));

            values.slice(0, this.getMaxVisibleItems()).forEach(value => {
                const button = new qx.ui.menu.Button(value);
                button.addListener("execute", function(){ this.getWidget().setValue(value); }, this);
                popup.add(button);
            });
            popup.placeToWidget(this.getWidget());
            popup.setVisibility("visible");
        },

        __getFilterModeFunc(){
            let filterModeFunc;
            switch (this.getFilterMode()){
                case "startsWith":
                    filterModeFunc = input => value => value.startsWith(input);
                    break;
                case "contains":
                    filterModeFunc = input => value => value.includes(input);
                    break;
                case "endsWith":
                    filterModeFunc = input => value => value.endsWith(input)
                    break;
            }
            return filterModeFunc;
        }
    }
});