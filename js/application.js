var Application = (function() {
  var initHandleBars = function() {
    Handlebars.registerHelper('getVarNameWithSpaces', function(variable) {
      return this[variable.replace(/([_])/g, ' ')];
    });
  };

  var createMap = function() {
    // Create the map view
    var map = L.map('map').setView([55.940104, -3.208988], 11);

    // Connect some OpenStreet map tiles
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);

    return map;
  };

  var getGitHubDocument = function(user, repo, file, handleData) {
    return $.ajax({
       url: "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + file,
       dataType: 'json',
    }).done(function (response) {
      handleData(window.atob(response.content));
    });
  };

  var getEdinCouncilDocument = function(file, handleData) {
    return getGitHubDocument('edinburghcouncil', 'datasets', file, handleData);
  };

  var addBogs = function(map) {
    var bogPopupTemplate = Handlebars.compile($('#bog-popup-template').html());

    getEdinCouncilDocument('Public conveniences.csv', function (data) {
      var geoJson = CsvToGeoJson.fromString(data, "Location");

      L.geoJson(geoJson, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(bogPopupTemplate(feature.properties));
        },
        coordsToLatLng: function(coords) {
          /*
           * Leaflet assumes GeoJson coords are [long,lat] and by default flips
           * them to [lat,long]. Our data is already in the correct order so no
           * need to flip.
           */
          return coords;
        }
      }).addTo(map);
    });
  };

  return {
    run: function() {
      initHandleBars();

      var map = createMap();
      addBogs(map);
    }
  };
})();