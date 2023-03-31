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
    main()
    {
      // Call super class
      super();

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
      main.add(this.__createSourceBlock());
      this.getRoot().add(main, {top: 100, left: 100});
    },

    __createCompleterBlock(){
      const field = new qx.ui.form.TextField();
      field.setPlaceholder("Start type some text...");
      field.setWidth(500);
      const source = this.__source = new qx.data.Array(["a", "ab", "abc", "abcd", "abcde", "abcdef", "abcdefg", "abcdefgh"]);
      this.__completer = new ugpa.completer.ListCompleter(source, field);

      const block = new qx.ui.groupbox.GroupBox("Autocomplete");
      block.setLayout(new qx.ui.layout.Basic());
      block.add(field);
      return block;
    },

    __createSettingsBlock(){
      const settingsBlock = new qx.ui.groupbox.GroupBox("Settings");
      settingsBlock.setLayout(new qx.ui.layout.VBox());
      settingsBlock.add(this.__createCaseSensitivityBlock());
      settingsBlock.add(this.__createFilterModeBlock());
      settingsBlock.add(this.__createSimpleSettingsBlock());
      settingsBlock.add(new qx.ui.form.Button("Reset"));
      return settingsBlock;
    },

    __createRadioGroup(legend, choices, handler){
      const radioGrp = new qx.ui.form.RadioGroup();
      const box = new qx.ui.groupbox.GroupBox(legend);
      box.setLayout(new qx.ui.layout.VBox());
      choices.forEach(choice => {
        const button = new qx.ui.form.RadioButton(choice);
        box.add(button);
        radioGrp.add(button);
      });
      radioGrp.addListener("changeValue", function(e){
        const label = e.getData().getLabel();
        handler(label);
      }, this);
      return box;
    },

    __createSimpleSettingsBlock(){
      const form = new qx.ui.form.Form();
      this.__createNumberField("Max visible items", form, this.__completer.getMaxVisibleItems(), (value) => this.__completer.setMaxVisibleItems(value));
      this.__createNumberField("Min length", form, this.__completer.getMinLength(), (value) => this.__completer.setMinLength(value));
      this.__createNumberField("Delay (ms)", form, this.__completer.getDelay(), (value) => this.__completer.setDelay(value));
      this.__createCheckboxField("Autofocus", form, this.__completer.getAutoFocus(), (value) => this.__completer.setAutoFocus(value));
      this.__createCheckboxField("Enabled", form, this.__completer.getEnabled(), (value) => this.__completer.setEnabled(value));
      return new qx.ui.form.renderer.Single(form);
    },

    __createCheckboxField(legend, form, defaultValue, handler){
      const checkbox = new qx.ui.form.CheckBox();
      checkbox.setValue(defaultValue);
      checkbox.addListener("changeValue", function(e){
        let value = e.getData();
        handler(value);
      }, this);
      form.add(checkbox, legend);
    },

    __createNumberField(legend, form, defaultValue, handler){
      const field = new qx.ui.form.TextField(String(defaultValue));
      field.addListener("changeValue", function(e){
        let value = e.getData();
        value = parseInt(value);
        handler(value);
      }, this);
      form.add(field, legend);
    },

    __createFilterModeBlock(){
      const choices = ["startsWith", "contains", "endsWith"];
      return this.__createRadioGroup("Filter Mode", choices, (value) => this.__completer.setFilterMode(value))
    },

    __createCaseSensitivityBlock(){
      const choices = ["insensitive", "sensitive"];
      return this.__createRadioGroup("Case Sensitivity", choices, (value) => this.__completer.setCaseSensitivity(value))
    },

    __createSourceBlock(){
      const block = new qx.ui.groupbox.GroupBox("Source List");
      block.setLayout(new qx.ui.layout.Basic());
      const list = new qx.ui.list.List();
      list.setModel(this.__source);
      block.add(list);
      return block;
    }
  }
});