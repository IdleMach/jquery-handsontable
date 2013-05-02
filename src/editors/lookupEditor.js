var arrayHelper = {
  select: function (objArray, field) {
      var result = [];
      for (var i = 0; i < objArray.length; i++) {
          result[i] = objArray[i][field];
      }
      return result;
  },
  getIdByName: function (objArray, name, nameField, idField) {
      nameField = nameField || "name";
      for (var i = 0; i < objArray.length; i++) {
          if (objArray[i][nameField] === name) {
              return objArray[i][idField];
          }
      }
      return null;
  },
  getById: function (objArray, id, idField) {
      idField = idField || "id";
      for (var i = 0; i < objArray.length; i++) {
          if (objArray[i][idField] === id) {
              return objArray[i];
          }
      }
      return null;
  }
};

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

      if (!isCancelled) {
        var name = this.instance.getDataAtCell(this.row, this.col);
        if (name) {
            var id = arrayHelper.getIdByName(this.cellProperties.objectSource, name, this.cellProperties.nameField, this.cellProperties.idField);
            if (id) {
                this.instance.setDataAtCell(this.row, this.col, id, this);
                return;
            }
        }
        // if obj found, name is actually an id
        var obj = arrayHelper.getById(this.cellProperties.objectSource, name, this.cellProperties.idField) || null;
        if (obj === null && this.originalValue !== name) {
          var revertId = arrayHelper.getIdByName(this.cellProperties.objectSource, this.originalValue, this.cellProperties.nameField, this.cellProperties.idField);
          this.instance.setDataAtCell(this.row, this.col, revertId, this);
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
