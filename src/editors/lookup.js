
function HandsontableLookupEditorClass(instance) {
      this.isCellEdited = false;
      this.instance = instance;
      this.createElements();
      this.bindEvents();
      this.emptyStringLabel = '\u00A0\u00A0\u00A0'; //3 non-breaking spaces
  }

  Handsontable.helper.inherit(HandsontableLookupEditorClass, HandsontableAutocompleteEditorClass);

  HandsontableLookupEditorClass.prototype.createElements = function () {
      HandsontableAutocompleteEditorClass.prototype.createElements.call(this);
  };

  HandsontableLookupEditorClass.prototype.bindEvents = function () {
      HandsontableAutocompleteEditorClass.prototype.bindEvents.call(this);
  };

  HandsontableLookupEditorClass.prototype.bindTemporaryEvents = function (td, row, col, prop, value, cellProperties) {
      if (!cellProperties.source) {  // TODO: move to one of the initialization funcitons
          cellProperties.source = arrayHelper.select(cellProperties.objectSource, cellProperties.nameField);
      }
      var obj = arrayHelper.getById(cellProperties.objectSource, value, cellProperties.idField);
      if (obj) {
          value = obj[cellProperties.nameField];
      }
      HandsontableAutocompleteEditorClass.prototype.bindTemporaryEvents.call(this, td, row, col, prop, value, cellProperties);
  };

  HandsontableLookupEditorClass.prototype.finishEditing = function (isCancelled, ctrlDown) {
      HandsontableAutocompleteEditorClass.prototype.finishEditing.call(this, isCancelled, ctrlDown);

      var name = this.instance.getDataAtCell(this.row, this.col);
      if (name) {
          var id = arrayHelper.getIdByName(this.cellProperties.objectSource, name, this.cellProperties.nameField, this.cellProperties.idField);
          if (id) {
              this.instance.setDataAtCell(this.row, this.col, id, this);
          }
      }
  };

  Handsontable.LookupEditor = function (instance, td, row, col, prop, value, cellProperties) {
    if (!instance.lookupEditor) {
      instance.lookupEditor = new HandsontableLookupEditorClass(instance);
    }
    instance.lookupEditor.bindTemporaryEvents(td, row, col, prop, value, cellProperties);
    return function (isCancelled) {
      instance.lookupEditor.finishEditing(isCancelled);
    };
};
