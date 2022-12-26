qx.Interface.define("ugpa.completer.IWidget", {
    members: {
        getWidth(){},
        getValue(){},
        setValue(value){
            qx.core.Assert.assertString(value);
        }
    }
});