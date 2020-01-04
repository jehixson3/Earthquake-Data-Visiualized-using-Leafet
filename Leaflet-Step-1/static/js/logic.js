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
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

// Create map object
var myMap = L.map("map", {
  center: [
    37.09, -94.7
  ],
  zoom: 5,
  layers: [satellitemap, lightmap, outdoormap]
});

// Add satellite layer
satellitemap.addTo(myMap);

// Create layers for both earthquake and tectonicplates
var tectonicplates = new L.layergroup();
var earthquakes = new L.layergroup();

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Satellite": satellitemap,
  "Grayscale": lightmap,
  "Outdoors": outdoormap
 };

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

 // Add the layer control to the map
 L.control
  .layers(baseMaps, overlayMaps,)
  .addTo(myMap);

// Store Endpoint for URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  function styleInform(feature) {
    return {
      opacity: 0.8,
      fillopacity: 0.8,
      fillcolor: chooseColor(feature.properties.mag),
      color: "",
      radius: calculateRadius(magnitude),
      stroke: true,
      weight: 0.4
    };
  }

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
            return "";
    }
  } 

  function calculateRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
  }

  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInform,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag.toFixed(2));
    }

  }).addTo(earthquakes);

  earthquakes.addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "green",
      "lightgreen",
      "yellow",
      "orange",
      "redorange",
      "red"
    ];
    // loop through data
    for (var i = 0; i , grades.length; i++) {
      div.innerhtml += ",i style='background: " + color[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div
  };

  legend.addTo(myMap);

  d3.json("https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json",
    function(platedata){
      L.geoJSON(platedate, {
        color: "purple",
        weight: 3
      })
      .addTo(tectonicplates);

      tectonicplates.addTo(myMap);
    }};
});