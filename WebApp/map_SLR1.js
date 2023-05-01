
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


//POINTS (CVS)

// Read markers data from data.csv
$.get('geojson_files/cultural_points.csv', function(csvString) {
// Use PapaParse to convert string to array of objects
var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
// For each row in data, create a marker and add it to the map
// For each row, columns `Latitude`, `Longitude`, and `Title` are required
for (var i in data) {
  var row = data[i];
  var marker = L.circleMarker([row.Latitude, row.Longitude], {
    radius: 3,
    fillColor: 'purple',
    color: 'purple',
    weight: 0.1,
    opacity: 1,
    fillOpacity: 0.5,
    pane: 'markerPane',
    // }).bindTooltip(feature.properties.NAME)

  //customize your icon
  // icon: L.icon({
  //   iconUrl: "https://img.icons8.com/plasticine/100/null/map-pin.png",
  //   iconSize: [12, 10]
  // })
  }).bindPopup(row.Island);    
  marker.addTo(map);
  }
});


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
  //onEachFeature: onEachFeatureFn,
}).addTo(map);

// Style for SLR 2030 10% AEP
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

// Style for boundary
var Boundary = L.geoJSON(null, {
  style: (feature) => {
    return { 
      color: "#ffffff",
      weight: 1,
    };
  },
}).addTo(map);

//Layers
var SLR2030_10_CFEP = L.layerGroup([SLR2030_10]);
var SLR2030_1_CFEP = L.layerGroup([SLR2030_1]);
var Boundary_9Islands = L.layerGroup([Boundary])
//var Culture_points = L.layerGroup([])

//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "SLR 9in + 10% AEP" : SLR2030_10_CFEP,
    "SLR 9in + 1% AEP" : SLR2030_1_CFEP,
    "9 Islands Boundary" : Boundary_9Islands,
};

//Layer box for all layer groups
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


// FETCHING DATA
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

// Fetch BOHA Boundary
fetch("./geojson_files/BOHA_Boundary.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  Boundary.addData(data);
  });


// NEED TO WORK ON
    // Search bar
var searchControl = new L.Control.Search({
  layer: Boundary,
  propertyName: 'Island',
  //position: 'topright',
  marker: false,
  moveToLocation: function (latlng, title, map) {
      //map.fitBounds( latlng.layer.getBounds() );
      let zoom = map.getBoundsZoom(latlng.layer.getBounds());
      map.setView(latlng, zoom); // access the zoom
  }
});

searchControl.on('search:locationfound', function (e) {

  //console.log('search:locationfound', );

  //map.removeLayer(this._markerSearch)
  e.layer.setStyle({ fillColor: '#3f0', color: '#0f0' });
  if (e.layer._popup)
      e.layer.openPopup();

}).on('search:collapsed', function (e) {

  featuresLayer.eachLayer(function (layer) {	//restore feature color
      featuresLayer.resetStyle(layer);
  });
});

map.addControl(searchControl);  //inizialize search control

// map.addControl(new L.Control.Search({
//   url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}&countrycodes=us',
//   position: 'topleft',
//   jsonpParam: 'json_callback',
//   propertyName: 'display_name',
//   propertyLoc: ['lat', 'lon'],
//   marker: L.circleMarker([0, 0], { radius: 30 }),
//   autoCollapse: true,
//   autoType: false,
//   minLength: 2,
//   container: '',
//   moveToLocation: function (latlng, title, map) {
//       //map.fitBounds( latlng.layer.getBounds() );
//       let zoom = 12; //map.getBoundsZoom(latlng.layer.getBounds());
//       map.setView(latlng, zoom); // access the zoom
//   }
// }));

// //search again...
// var searchLayer = L.layerGroup(Boundary).addTo(map);
// //... adding data in searchLayer ...
// map.addControl( new L.Control.Search({layer: Boundary}) );
// //searchLayer is a L.LayerGroup contains searched markers

// var searchControl = new L.Control.Search({
//   layer: featuresLayer,
//   propertyName: 'name',
//   marker: false,
//   moveToLocation: function(latlng, title, map) {
//     //map.fitBounds( latlng.layer.getBounds() );
//     var zoom = map.getBoundsZoom(latlng.layer.getBounds());
//       map.setView(latlng, zoom); // access the zoom
//   }
// });