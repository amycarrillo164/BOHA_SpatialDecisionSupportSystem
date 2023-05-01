
// // Layers
// var SLR1_10pct = L.geoJSON(SLR1_10, {style: style_feature_SLR10,});
// var SLR1_1pct = L.geoJSON(SLR1_1, {style: style_feature_SLR1,});



// Set up initial map
var map = L.map('map', {
    center: [42.3131628, -70.9297749], 
    zoom: 13,
    // maxZoom: 20,
    // zoomDelta: 1,
    // zoomControl: true,
    // fullscreenControl: true,
    // fullscreenControlOptions: {
    // position: "topleft",
    // },
});


/* Control panel to display map layers */
// var controlLayers = L.control.layers( null, null, {
//    position: "topright",
//    collapsed: false
// }).addTo(map);

// display Carto basemap tiles with light features and labels
var light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default


/* Stamen colored terrain basemap tiles with labels */
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
}); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3'],
}).addTo(map); 

//Layer group
var baseMaps = {
    "Google Earth Satellite": googleSat,
    "Carto Light": light,
    "Stamen Terrain": terrain, 

};


//var layerControl = L.control.layers(baseMaps).addTo(map);



// var lC = L.control
//   .layers(baseMaps, overlayMaps, {
//     collapsed: false,
//     hideSingleBase: true,
//   })
//   .addTo(map)
//   .expand();

//POINTS (CVS)

// Read markers data from data.csv
$.get('geojson_files/cultural_points.csv', function(csvString) {

// Use PapaParse to convert string to array of objects
var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

// For each row in data, create a marker and add it to the map
// For each row, columns `Latitude`, `Longitude`, and `Title` are required
for (var i in data) {
  var row = data[i];

  var marker = L.marker([row.Latitude, row.Longitude], {
    opacity: 1,
  
  //customize your icon
  icon: L.icon({
    iconUrl: "https://img.icons8.com/plasticine/100/null/map-pin.png",
    iconSize: [12, 10]
  })
  }).bindPopup(row.Island);
     
  marker.addTo(map);
  }
});


function onEachFeatureFn(feature, layer) {
  var popupContent =
    "<p>Feature Type: " +
    feature.geometry.type;
    //  +
    // "</br> ID: " +
    // feature.properties.GEO_ID +
    // "</br> Name: " +
    // feature.properties.NAME +
    // "</p>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);

  layer.on({
    mouseover: function (e) {
      e.target.setStyle({ 
        fillColor: "#295982",
        opacity: .8, });
      e.target.openPopup();
    },
    mouseout: (e) => {
      SLR2030_1.resetStyle(e.target);
      e.target.closePopup();
    },
  });
}

// Style for SLR 2030 1% AEP
var SLR2030_1 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      fillColor: '#6fabd0', //'#5fbaff' 
      weight: 2,
      opacity: 0.5,
      //color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
      //color: "#000", fill: "#ccc", fillOpacity: 0.2 
    };
  },
  onEachFeature: onEachFeatureFn,
}).addTo(map);

// Style for SLR 2030 1% AEP
var SLR2030_10 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      fillColor: "#295982",
      weight: 2,
      opacity: 0.8,
      //color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  },
  onEachFeature: onEachFeatureFn,
}).addTo(map);

//Layers
var SLR2030_10_CFEP = L.layerGroup([SLR2030_10]);
var SLR2030_1_CFEP = L.layerGroup([SLR2030_1]);

//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "SLR 9in + 10% AEP" : SLR2030_10_CFEP,
    "SLR 9in + 1% AEP" : SLR2030_1_CFEP,
};

//Layer box for all layer groups
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


// Fetch geojson file for SLR 2030 1% AEP
fetch("./geojson_files/c2030_1CFEPpoly.json")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  SLR2030_1.addData(data);
  });

// Fetch geojson file for SLR 2030 10% AEP
  fetch("./geojson_files/c2030_10CFEPpoly.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    SLR2030_10.addData(data);
    });