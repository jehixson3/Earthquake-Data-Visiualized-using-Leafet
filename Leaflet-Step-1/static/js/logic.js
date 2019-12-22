// Create map object
var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
});

 // Define streetmap and darkmap layers
 L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// Perform a GET request to the query URL
d3.json(queryUrl, function(response) {

      var features = response.features;
});
    console.log(features)

  // loop through data to pull data we need
      for (var i = 0; i < features.length; i++) {
      var geometry = features[i].geometry;

          var color = "#d7191c";
          var mag = features[i].properties.mag;

          if (properties.mag < 1) {
          color = "#00ccbc";
          }
          else if (properties.mag < 2) {
          color = "#90eb9d";
          }
          else if (properties.mag < 3) {
          color = "#f9d057";
          }
          else if (properties.mag < 4) {
          color = "#f29e2e";
          }
          else if (properties.mag < 5) {
          color = "#e76818";
          }

    // Add circles to map
          L.circle([geometry.coordinates[1], ggeometry.coordinates[0]], {
              fillOpacity: .75,
              color: color,
              fillColor: color,
              radius: (properties.mag * 15000)
              }).bindPopup("<h2>" + features[i].properties.place + "</h2> <hr> <h3>Magnitude: " + properties.mag.toFixed(2) + "</h3>").add(myMap);
      }

      // Create legend
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', "info legend");
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];

  	            for (var i = 0; i < grades.length; i++) {
                        div.innerHTML +=  '<i style="background:' + 
                        color[i] + 
                        '"></i>' +
                        grades[i] +(grades[i + 1]? + '&ndash;' + grades[i + 1] + '<br> : "+");
                }   

  	            return div;
                };

          //Add the legend by default
          legend.addTo(myMap)

});