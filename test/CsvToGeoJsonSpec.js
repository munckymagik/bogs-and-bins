describe('CsvToGeoJson', function() {
  'use strict';

  describe('#convert', function() {
    it('converts csv records with geo data to geoJSON', function () {
      var csvdata = "PropertyA,PropertyB,GeoLocation\n"
                  + "Hello,World,\"1.234,-1.234\"";
      var expected = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                1.234,
                -1.234
              ]
            },
            "properties": {
              "PropertyA": "Hello",
              "PropertyB": "World"
            }
          }
        ]
      };

      expect(CsvToGeoJson.convert(csvdata, "GeoLocation")).to.deep.equal(expected);
    });
  });

  describe('#parseCoords', function() {
    it("parses a coordinates string into an array of 2 numbers", function() {
      var input = "2.345,-5.4321";
      var expected = [2.345,-5.4321];

      expect(CsvToGeoJson.parseCoords(input)).to.deep.equal(expected);
    });
  });

  describe('#parseProperties', function() {
    it("parses all the non-geo data CSV fields into an object", function() {
      var csvRow = {
        'id': 1,
        'name': 'Dave',
        'geoDataField': "123,123"
      };
      var expected = {
        'id': 1,
        'name': 'Dave'
      };

      expect(CsvToGeoJson.parseProperties(csvRow, 'geoDataField')).to.deep.equal(expected);
    })
  });

  describe('#parseFeature', function() {
    it("converts one CSV row into a geoJSON feature record", function() {
      var csvRow = {
        'id': 1,
        'name': 'Dave',
        'geoDataField': "123,123"
      };
      var expected = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [123.0,123.0]
        },
        "properties": {
          'id': 1,
          'name': 'Dave'
        }
      };

      expect(CsvToGeoJson.parseFeature(csvRow, 'geoDataField')).to.deep.equal(expected);
    });
  });

  describe('#parseFeatures', function() {
    it("converts one CSV row into a geoJSON feature record", function() {
      var csvRows = [{
        'id': 1,
        'name': 'Dave',
        'geoDataField': "123,123"
      }];
      var expected = [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [123.0,123.0]
        },
        "properties": {
          'id': 1,
          'name': 'Dave'
        }
      }];

      expect(CsvToGeoJson.parseFeatures(csvRows, 'geoDataField')).to.deep.equal(expected);
    });
  });
});