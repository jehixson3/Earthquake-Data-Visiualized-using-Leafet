// Store Endpoint for URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
// Define a function to run once for each feature in features array
// Give each pop up to describe place ands magnitude
   function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + 
      "</h3> <hr> <h3>Magnitude: " + feature.properties.mag.toFixed(2) + "</h3>");
    }
// Create Geojson layer containing features array on the earthquaker object
// Run the onEachFeature funcetion once for each peice of information in the array
var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature
});
// loop through data to pull data we need
      for (var i = 0; i < feature.length; i++) {
      var geometry = features[i].geometry;
          L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
        fillOpacity: .75,
        color: color,
        fillColor: color,
        radius: (features[i].properties.mag * 1500)
        }).bindPopup("<h3>" + features[i].properties.place + "</h3> <hr> <h3>Magnitude: " + features[i].properties.mag.toFixed(2) + "</h3>").addTo(myMap);
},

          var color = "#d7191c";
          if (features[i].properties.mag < 1) {
          color = "#00ccbc";
          }
          else if (features[i].properties.mag < 2) {
          color = "#90eb9d";
          }
          else if (features[i].properties.mag < 3) {
          color = "#f9d057";
          }
          else if (features[i].properties.mag < 4) {
          color = "#f29e2e";
          }
          else if (features[i].properties.mag < 5) {
          color = "#e76818";
          }
          // Define streetmap and darkmap layers
      var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: API_KEY
        });
       var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
              attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
              maxZoom: 18,
              id: "mapbox.streets",
              accessToken: API_KEY
      }).addTo(myMap);
      


// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Add circles to map
    L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
          fillOpacity: .75,
          color: color,
          fillColor: color,
          radius: (features[i].properties.mag * 1500)
          }).bindPopup("<h3>" + features[i].properties.place + "</h3> <hr> <h3>Magnitude: " + features[i].properties.mag.toFixed(2) + "</h3>").addTo(myMap);
      },

      // Create legend
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function () {
        var div = L.DomUtil.create('div', "info legend");
        var grades = ["0", "1", "2", "3", "4", "5"];
        var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];

  	            for (var i = 0; i < grades.length; i++) {
                  div.innerHTML +=  '<i style="background:' + color[i] + "'></i>  " +
                    grades[i] + (grades[i + 1]? + '&ndash;' + grades[i + 1] + '<br>' : '+');
                }   

  	        return div;
            };

          //Add the legend by default
          legend.addTo(myMap);
});