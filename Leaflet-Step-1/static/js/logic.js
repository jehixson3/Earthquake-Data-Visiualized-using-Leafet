// Define streetmap and satellite layer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// Create map object
var myMap = L.map("map", {
  center: [
    39.09, -94.7
  ],
  zoom: 5,
  layers: [lightmap, satellitemap, outdoormap]
});

// Add light layer
lightmap.addTo(myMap);

// Create layers for both earthquake and tectonicplates
var tectonicplates = new L.layerGroup();
var earthquakes = new L.layerGroup();

// Define a baseMaps object to hold our base layers
var baseMaps = {
  Satellite: satellitemap,
  Grayscale: lightmap,
  Outdoors: outdoormap
 };

// Create overlay object to hold our overlay layer
var overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

 // Add the layer control to the map
L.control
  .layers(baseMaps, overlays)
  .addTo(myMap);

// Store Endpoint for URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  function styleInform(feature) {
    return {
      opacity: 0.8,
      fillopacity: 0.8,
      fillcolor: chooseColor(feature.properties.mag),
      color: "000000",
      radius: calculateRadius(feature.properties.mag),
      stroke: true,
      weight: 0.4
    };
  }

  function chooseColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return "red"; 
        case magnitude > 4: 
            return "redorange";
        case magnitude > 3:
            return "orange";
        case magnitude > 2:
            return "yelow";
        case magnitude > 1:
            return "green";
        case magnitude > 0:
              return "lightgreen";
        default:
            return "#000000";
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
      div.innerHTML += ",i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);

  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      L.geoJSON(platedata, {
        color: "purple",
        weight: 3
      })
      .addTo(tectonicplates);

      tectonicplates.addTo(myMap);
    });
});