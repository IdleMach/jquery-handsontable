 Handsontable.LookupRenderer = function (instance, td, row, col, prop, value, cellProperties) {
      var obj = arrayHelper.getById(cellProperties.objectSource, value, cellProperties.idField);
      if (obj) {
          value = obj[cellProperties.nameField];
      }
      return Handsontable.AutocompleteRenderer(instance, td, row, col, prop, value, cellProperties);
  };
