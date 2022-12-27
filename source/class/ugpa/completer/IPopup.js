qx.Interface.define("ugpa.completer.IPopup", {
    members: {
        show(){},
        hide(){},
        isVisible(){},
        setWidth(width){
            qx.core.Assert.assertNumber(width);
        },
        placeToWidget(){}
    }
});