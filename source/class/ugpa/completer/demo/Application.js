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
      const main = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      main.add(this.__createCompleterBlock());
      main.add(this.__createSettingsBlock());
      this.getRoot().add(main, {top: 100, left: 100});
      
    },

    __createCompleterBlock(){
      const field = new qx.ui.form.TextField();
      field.setWidth(500);
      const source = new qx.data.Array(["a", "ab", "abc", "abcd", "abcde", "abcdef", "abcdefg", "abcdefgh"]);
      this.__completer = new ugpa.completer.ListCompleter(source, field);

      const block = new qx.ui.container.Composite(new qx.ui.layout.Basic());
      block.add(field);
      return block;
    },

    __createSettingsBlock(){
      const radioGrp = new qx.ui.form.RadioGroup();
      const box = new qx.ui.groupbox.GroupBox("Case Sensitivity");
      box.setLayout(new qx.ui.layout.VBox());
      const choices = ["Insensitive", "Sensitive"];
      choices.forEach(choice => {
        const button = new qx.ui.form.RadioButton(choice);
        box.add(button);
        radioGrp.add(button);
      });
      radioGrp.addListener("changeValue", function(e){
        const label = e.getData().getLabel();
        this.__completer.setCaseSensitivity(qx.lang.String.firstLow(label));
      }, this);
      const block = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      block.add(box);
      return block;
    }
  }
});