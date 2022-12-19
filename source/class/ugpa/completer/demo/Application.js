/* ************************************************************************

   Copyright: 2022 

   License: MIT license

   Authors: Dmitrii Zolotov (goldim) zolotovdy@yandex.ru

************************************************************************ */

/**
 * This is the main application class of "ugpa.completer"
 */
qx.Class.define("ugpa.completer.demo.Application",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      // qx.theme.iconfont.LoadMaterialIcons;
      const field = new qx.ui.form.TextField();
      const source = new qx.data.Array(["a", "ab", "abc", "abcd", "abcde", "abcdef", "abcdefg", "abcdefgh"]);
      const completer = new ugpa.completer.Completer(source, field);
      completer.setCaseSensitivity(false);
      this.getRoot().add(field);
    }
  }
});