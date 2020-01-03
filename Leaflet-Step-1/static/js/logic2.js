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
  // Create Geojson layer containing features array on the earthquaker object
  // Run the onEachFeature funcetion once for each peice of information in the array
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3> <hr> <h3>Magnitude: " + feature.properties.mag.toFixed(2) + "</h3>");
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng, {
                radius: markerSize(features.properties.mag),
                fillcolor: chooseColor(feature.properties.mag),
                opacity: .8
            });
        },
        onEachFeature: onEachFeature
    });
  // Sending Earthquake layer to CreatreMap function
  createMap(earthquakes);
};
function chooseColor(magnitude) {
    switch (true) {
        case magnitude < 1:
            return "green"; 
        case magnitude < 2: 
            return "lightgreen";
        case magnitude < 3:
            return "yellow";
        case magnitude < 4:
            return "orange";
        case magnitude < 5:
            return "redorange";
        case magnitude > 5:
            return "red";
        default:
            return ""
    };
};
function markerSize(magnitude){
    return magnitude * 1000;
}
function createMap(earthquakes) {
  // Define streetmap and satellite layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  id: "mapbox.satellite",
  accessToken: API_KEY
});
// Define a baseMaps object to hold our base layers
  var baseMaps = {
   "Satellite": satellitemap,
   "Grayscale": lightmap,
   "Outdoors": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  // Create our map, giving it the base maps and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

 