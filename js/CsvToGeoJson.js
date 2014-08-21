var CsvToGeoJson = (function() {
  'use strict';

  var self = {
    parseCoords: function(coordsString) {
      return coordsString.split(',').map(parseFloat);
    },

    parseProperties: function(row, geoDataFieldName) {
      return Object.getOwnPropertyNames(row)
        .filter(function(fieldName) {
          return fieldName != geoDataFieldName;
        })
        .reduce(function(newObj, fieldName) {
          newObj[fieldName] = row[fieldName];
          return newObj;
        }, {});
    },

    parseFeature: function(csvRow, geoDataFieldName) {
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": self.parseCoords(csvRow[geoDataFieldName])
        },
        "properties": self.parseProperties(csvRow, geoDataFieldName)
      };
    },

    parseFeatures: function(csvRows, geoDataFieldName) {
      return csvRows.map(function(csvRow) {
        return self.parseFeature(csvRow, geoDataFieldName);
      });
    },

    convertRows: function(csvRows, geoDataFieldName) {
      return {
        "type": "FeatureCollection",
        "features": self.parseFeatures(csvRows, geoDataFieldName)
      };
    },

    convert: function(csvStr, geoDataFieldName) {
      var csvRows = csv2json.csv.parse(csvStr);
      return self.convertRows(csvRows, geoDataFieldName);
    }
  };

  return self;
})();