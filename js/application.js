$(function() {
  // Create the map view
  var map = L.map('map').setView([55.940104, -3.208988], 12);

  // Connect some OpenStreet map tiles
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  }).addTo(map);

  var hotelsPromise = $.ajax({
    url: "https://api.github.com/repos/edinburghcouncil/datasets/contents/Hotels.geojson",
    dataType: 'json',
  });

  hotelsPromise.done(function (data) {
    var geoJson = jQuery.parseJSON(window.atob(data.content));
    // console.log(geoJson);

    L.geoJson(geoJson, {
      style: function(feature) {
        return { color: feature.properties.color };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.description);
      }
    }).addTo(map);
  });
});