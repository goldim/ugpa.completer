/* ************************************************************************

   Copyright: 2022

   License: MIT license

   Authors: Dmitrii Zolotov (goldim) zolotovdy@yandex.ru

************************************************************************ */

qx.Interface.define("ugpa.completer.IWidget", {
    members: {
        getWidth(){},
        getValue(){},
        setValue(value){
            qx.core.Assert.assertString(value);
        }
    }
});