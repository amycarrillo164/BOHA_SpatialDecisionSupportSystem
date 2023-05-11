// Function for Island Boundary
function onEachFeatureFn(feature, layer) {
  var popupContent =
    //"<p> Island: " +
    feature.properties.Island;
    //feature.geometry.type;
    //  +
    // "</br> Island: " +
    // feature.properties.Island;
    // "</br> Name: " +
    // feature.properties.NAME +
    // "</p>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);

  //layer.on()

  layer.on({
    mouseover: function (e) {
      e.target.setStyle({ 
        Color: "#fff",
        fillColor: false,
        fillOpacity: 0,
        opacity: 0.9, 
        weight: 3,
      });
      e.target.openPopup();
    },
    mouseout: (e) => {
      Boundary.resetStyle(e.target);
      e.target.closePopup();
    },
  });
}

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

function style_feature_SLR1(feature) {
  return {
    fillColor: '#003E78', //'#5fbaff' 
    weight: 2,
    opacity: 1,
    //color: 'white',
    dashArray: '3',
    fillOpacity: 1,
    //color: "#000", fill: "#ccc", fillOpacity: 0.2 
  };
}


function style_feature_SLR10(feature) {
  return {
    fillColor: "#005EB8",
    weight: 2,
    opacity: 0.9,
    //color: 'white',
    //dashArray: '3',
    fillOpacity: 1,
  };
}

function onEachFeatureFn(feature, layer) {
  var popupContent =
    //"<p> Island: " +
    feature.properties.Island;
    //feature.geometry.type;
    //  +
    // "</br> Island: " +
    // feature.properties.Island;
    // "</br> Name: " +
    // feature.properties.NAME +
    // "</p>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);

  //layer.on()

  layer.on({
    mouseover: function (e) {
      e.target.setStyle({ 
        Color: "#ffffff",
        opacity: 0.9, 
        weight: 3,
      });
      e.target.openPopup();
    },
    mouseout: (e) => {
      //SLR2030_1.resetStyle(e.target);
      //SLR2030_10.resetStyle(e.target);
      Boundary.resetStyle(e.target);
      e.target.closePopup();
    },
  });
}

// //POINTS (CVS)
// // Read markers data from data.csv
// $.get('geojson_files/cultural_points.csv', function(csvString) {
//   // Use PapaParse to convert string to array of objects
//   var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
//   // For each row in data, create a marker and add it to the map
//   // For each row, columns `Latitude`, `Longitude`, and `Title` are required
//   for (var i in data) {
//     var row = data[i];
//     var marker = L.circleMarker([row.Latitude, row.Longitude], {
//       radius: 3,
//       fillColor: '#fff',
//       color: '#fff',
//       weight: 0.1,
//       opacity: 1,
//       fillOpacity: 0.6,
//       pane: 'markerPane',
//       // }).bindTooltip(feature.properties.NAME)
  
//     //customize your icon
//     // icon: L.icon({
//     //   iconUrl: "https://img.icons8.com/plasticine/100/null/map-pin.png",
//     //   iconSize: [12, 10]
//     // })
//     }).bindPopup(row.Island);    
//     marker.addTo(map);
//     }
//   });

// Style for boundary
var Boundary = L.geoJSON(null, {
  style: (feature) => {
    return { 
      color: "#fff",
      fillColor: false,
      fillOpacity: 0,
      weight: 1,
    };
  },
  onEachFeature: onEachFeatureFn,
}).addTo(map);

var marker = L.geoJSON(null, {}); 
var SLR2030_1 = L.geoJSON(SLR2030_1CFEP, {style: style_feature_SLR1,}) .addTo(map);
var SLR2030_10 = L.geoJSON(SLR2030_10CFEP, {style: style_feature_SLR10,}) .addTo(map);
var c2050_1CFEP = L.geoJSON(null, {style: style_feature_SLR1,});
var c2050_10CFEP = L.geoJSON(null, {style: style_feature_SLR10,}); 
var c2070_1CFEP = L.geoJSON(null, {style: style_feature_SLR1,}); 
var c2070_10CFEP = L.geoJSON(null, {style: style_feature_SLR10,}); 


//Layers
var Boundary_9Islands = L.layerGroup([Boundary]);
var SLR2030_10_CFEP = L.layerGroup([SLR2030_10]);
var SLR2030_1_CFEP = L.layerGroup([SLR2030_1]);
var SLR2050_10_CFEP = L.layerGroup([c2050_10CFEP]);
var SLR2050_1_CFEP = L.layerGroup([c2050_1CFEP]);
var SLR2070_10_CFEP = L.layerGroup([c2070_10CFEP]);
var SLR2070_1_CFEP = L.layerGroup([c2070_1CFEP]);
var marker_points = L.layerGroup([marker]);


//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "SLR 2030 + 10% AEP" : SLR2030_10_CFEP,
    "SLR 2030 + 1% AEP" : SLR2030_1_CFEP,
    "SLR 2050 + 10% AEP" : SLR2050_10_CFEP,
    "SLR 2050 + 1% AEP" : SLR2050_1_CFEP,
    "SLR 2070 + 10% AEP" : SLR2070_10_CFEP,
    "SLR 2070 + 1% AEP" : SLR2070_1_CFEP,
    "9 Islands Boundary" : Boundary_9Islands,
    "Cultural & Infrastructure/Facilities" : marker_points,
};

//Layer box for all layer groups
var layerControl = L.control
  .layers(baseMaps, overlayMaps, {
    collapsed: false,
    hideSingleBase: true,
  })
  .addTo(map)
  .expand();

 // Adjusts layer visuals 
var lcDIVElem = layerControl.getContainer();
      document.addEventListener("keydown", (e) => {
        if ((e.key === "l") | (e.key === "L")) {
          if (lcDIVElem.style.display == "") {
            lcDIVElem.style.display = "none";
          } else {
            lcDIVElem.style.display = "";
          }
        }
      });

// // FETCHING DATA

// // Fetch geojson file for SLR 2030 1% AEP
// fetch("./geojson_files/c2030_1CFEPpoly.json")
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   SLR2030_1.addData(data);
//   });

// // Fetch geojson file for SLR 2030 10% AEP
//   fetch("./geojson_files/c2030_10CFEPpoly.geojson")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//     SLR2030_10.addData(data);
//     });

// Legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Annual Exceedence <br>Probabilties</h4>";
  div.innerHTML += '<i style="background: #005EB8"></i><span>10% AEP</span><br>';
  div.innerHTML += '<i style="background: #003E78"></i><span>1% AEP</span><br>';
  return div;
};

legend.addTo(map);


// Fetch markers
// fetch("./geojson_files/centroid_focalresources.geojson")
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   markers.addData(data);
//   });

// Fetch boundary
fetch("./geojson_files/BOHA_Boundary.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  Boundary.addData(data);
  });


// Fetch 2050
fetch("./geojson_files/c2050_1CFEPpoly.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  c2050_1CFEP.addData(data);
  });

fetch("./geojson_files/c2050_10CFEPpoly.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  c2050_10CFEP.addData(data);
  });


// Fetch 2070
fetch("./geojson_files/c2070_1CFEPpoly.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  c2070_1CFEP.addData(data);
  });

fetch("./geojson_files/c2070_10CFEPpoly.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  c2070_10CFEP.addData(data);
  });


