/* ************************************************************************

   Copyright: 2022

   License: MIT license

   Authors: Dmitrii Zolotov (goldim) zolotovdy@yandex.ru

************************************************************************ */

qx.Interface.define("ugpa.completer.IPopup", {
    members: {
        show() {},
        hide() {},
        isVisible() {},
        setWidth(width) {
            qx.core.Assert.assertNumber(width);
        },
        placeToWidget() {}
    }
});
