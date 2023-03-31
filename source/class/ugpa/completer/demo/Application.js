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
      this.__initialData = ["a", "ab", "abc", "abcd", "abcde", "abcdef", "abcdefg", "abcdefgh"];
      const source = this.__source = new qx.data.Array(this.__initialData);
      this.__controller = new qx.data.controller.List(this.__source);
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
      const resetButton = new qx.ui.form.Button("Reset");
      resetButton.addListener("execute", function(){
        this.resetSettings();
      }, this);
      settingsBlock.add(resetButton);
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
      return [radioGrp, box];
    },

    __createSimpleSettingsBlock(){
      const form = new qx.ui.form.Form();

      const options = { 
        converter: (value) => {
          return String(value);
        }
      }

      this.__maxVisibleItemsField = this.__createNumberField("Max visible items", form, (value) => this.__completer.setMaxVisibleItems(value));
      this.__completer.bind("maxVisibleItems", this.__maxVisibleItemsField, "value", options);

      this.__minLengthField = this.__createNumberField("Min length", form, (value) => this.__completer.setMinLength(value));
      this.__completer.bind("minLength", this.__minLengthField, "value", options);

      this.__delayField = this.__createNumberField("Delay (ms)", form, (value) => this.__completer.setDelay(value));
      this.__completer.bind("delay", this.__delayField, "value", options);

      
      this.__autoFocusCheckBox = this.__createCheckboxField("Autofocus", form, (value) => this.__completer.setAutoFocus(value));
      this.__completer.bind("autoFocus", this.__autoFocusCheckBox, "value");


      this.__enabledCheckBox = this.__createCheckboxField("Enabled", form, (value) => this.__completer.setEnabled(value));
      this.__completer.bind("enabled", this.__enabledCheckBox, "value");


      return new qx.ui.form.renderer.Single(form);
    },

    resetSettings(){
      this.__filterRadioGroup.resetValue();
      this.__caseSensitivityRadioGroup.resetValue();
      this.__completer.resetFilterMode();
      this.__completer.resetCaseSensitivity();
      this.__completer.resetMaxVisibleItems();
      this.__completer.resetMinLength();
      this.__completer.resetDelay();
      this.__completer.resetAutoFocus();
      this.__completer.resetEnabled();
    },

    __createCheckboxField(legend, form, handler){
      const checkbox = new qx.ui.form.CheckBox();
      checkbox.addListener("changeValue", function(e){
        let value = e.getData();
        handler(value);
      }, this);
      form.add(checkbox, legend);
      return checkbox;
    },

    __createNumberField(legend, form, handler){
      const field = new qx.ui.form.TextField();
      field.addListener("changeValue", function(e){
        let value = e.getData();
        value = parseInt(value);
        handler(value);
      }, this);
      form.add(field, legend);
      return field;
    },

    __createFilterModeBlock(){
      const choices = ["startsWith", "contains", "endsWith"];
      const [group, box] = this.__createRadioGroup("Filter Mode", choices, (value) => this.__completer.setFilterMode(value))
      this.__filterRadioGroup = group;
      return box;
    },

    __createCaseSensitivityBlock(){
      const choices = ["insensitive", "sensitive"];
      const [group, box] = this.__createRadioGroup("Case Sensitivity", choices, (value) => this.__completer.setCaseSensitivity(value))
      this.__caseSensitivityRadioGroup = group;
      return box;
    },

    __createSourceBlock(){
      const box = new qx.ui.groupbox.GroupBox("Source List");
      box.setLayout(new qx.ui.layout.VBox());
      const block = new qx.ui.container.Composite(new qx.ui.layout.HBox());
      const list = new qx.ui.form.List();
      this.__controller.setTarget(list);
      block.add(list);

      const controlBlock = new qx.ui.groupbox.GroupBox("Control Panel");
      controlBlock.setLayout(new qx.ui.layout.VBox());

      const itemControlBlock = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      const field = new qx.ui.form.TextField();
      itemControlBlock.add(field);
      const buttonBlock = new qx.ui.container.Composite(new qx.ui.layout.HBox());
      const addButton = new qx.ui.form.Button("Add");
      buttonBlock.add(addButton);
      addButton.addListener("execute", function(e){
        const word = field.getValue();
        field.resetValue();
        this.__source.append(word);
        this.__source.sort();
      }, this);

      const removeButton = new qx.ui.form.Button("Remove");
      removeButton.addListener("execute", function(e){
        const index = this.__source.indexOf(field.getValue());
        if (index !== -1){
          this.__source.removeAt(index);
        }
      }, this);
      buttonBlock.add(removeButton);
      itemControlBlock.add(buttonBlock);

      controlBlock.add(itemControlBlock);
      const clearButton = new qx.ui.form.Button("Clear");
      clearButton.addListener("execute", function(){
        this.__source.removeAll();
      }, this);
      controlBlock.add(clearButton);

      block.add(controlBlock);
      box.add(block);
      const resetButton = new qx.ui.form.Button("Reset")
      resetButton.addListener("execute", function(){
        this.__source.removeAll();
        this.__source.append(this.__initialData);
      }, this);
      box.add(resetButton);
      return box;
    }
  }
});