qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,

    construct(source, widget) {
        super();
        this.__sourceModel = source;
        this.initPopup(new qx.ui.menu.Menu());
        this.initWidget(widget);
    },

    destruct() {
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
        },

        _applyFilterMode(filterMode, oldFilterMode){

        },

        _onInput(e){
            const popup = this.getPopup();
            popup.removeAll();

            const input = e.getData();
            const filterFunc = this.__getFilterModeFunc(input);
            const values = this.__sourceModel.filter(filterFunc);

            values.forEach(value => {
                const button = new qx.ui.menu.Button(value);
                button.addListener("execute", function(){ this.getWidget().setValue(value); }, this);
                popup.add(button);
            });
            popup.setVisibility("visible");
            popup.placeToWidget(this.getWidget());
        },

        __getFilterModeFunc(input){
            let filterModeFunc;
            switch (this.getFilterMode()){
                case "startsWith":
                    filterModeFunc = value => value.startsWith(input);
                    break;
                case "contains":
                    filterModeFunc = value => value.includes(input);
                    break;
                case "endsWidth":
                    filterModeFunc = value => value.endsWith(input)
                    break;
            }
            return filterModeFunc;
        }
    }
});