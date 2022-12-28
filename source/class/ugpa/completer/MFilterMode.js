qx.Mixin.define("ugpa.completer.MFilterMode", {
    construct(){
        this.__filterFunc = this.__getFilterModeFunc();
    },

    destruct(){
        this.__filterFunc = null;
    },

    properties: {
        filterMode: {
            init: "startsWith",
            check: ["startsWith", "contains", "endsWith"],
            apply: "_applyFilterMode"
        }
    },

    members: {
        _applyFilterMode(){
            this.__filterFunc = this.__getFilterModeFunc();
        },

        filterByInput(input, source){
            let values;
            if (!this.getCaseSensitivity()){
                values = this.__filterCaseInsensitiveValues(input, source);
            } else {
                values = this.__filterCaseSensitiveValues(input, source);
            }
            return values;
        },

        __filterCaseInsensitiveValues(input, source){
            input = input.toLowerCase();
            return source.filter(value =>{
                value = value.toLowerCase();
                return this.__filterFunc(input)(value);
            });
        },

        __filterCaseSensitiveValues(input, source){
            return source.filter(this.__filterFunc(input));
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