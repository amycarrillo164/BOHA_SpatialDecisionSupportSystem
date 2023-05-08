
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


//Function for polygons

function onEachFeaturePoly(feature, layer) {
  var popupContent =
  "<p> Focal Resource </p>"
    // "<p> Island: " +
    // feature.properties.Island;
    //  +
    // "</br> Category: " +
    // feature.properties.Category;
    // "</br> Name: " +
    // feature.properties.Descriptio +
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
        opacity: 0.9, 
        weight: 3,
      });
      e.target.openPopup();
      info.update(layer.feature.properties);I
    },
    mouseout: (e) => {
      nat_polygons.resetStyle(e.target);
      infra_polygons.resetStyle(e.target);
      cultural_polygons.resetStyle(e.target);
      e.target.closePopup();
      info.update();
    },
  });
}

// style function for focal resources polys
function style_feature_frpolys(feature) {
  return {
      fillColor: false,
      weight: 0.7,
      opacity: 1,
      color: 'black',
      fillOpacity: 0,

  };
}



// script for circle markers
var geojsonMarkerOptions = {
  radius: 3,
  // fillColor: "#blue",
  // color: "#blue",
  weight: 1,
  opacity: .7,
  fillOpacity: 0.4,
};

// Set up initial map
var map = L.map('map', {
    //fullscreenControl: true,
    center: [42.3131628, -70.9297749], 
    zoom: 13,
    // maxZoom: 20,
    // zoomDelta: 1,
    // zoomControl: true,
    //fullscreenControlOptions: {
      //position: 'bottomright'
    //},
});


// display Carto basemap tiles with light features and labels
var light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}) // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
.addTo(map);

/* Stamen colored terrain basemap tiles with labels */
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
}); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3'],
});
//.addTo(map); 

//Layer group
var baseMaps = {
    "Google Earth Satellite": googleSat,
    "Carto Light": light,
    "Stamen Terrain": terrain, 

};

// //Points (CVS)
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
//       fillColor: '#0d6efd',
//       color: '#0d6efd',
//       weight: 0.1,
//       opacity: 1,
//       fillOpacity: 0.5,
//       pane: 'markerPane',
//       // }).bindTooltip(feature.properties.NAME)
  
//     //customize your icon
//     // icon: L.icon({
//     //   iconUrl: "https://img.icons8.com/plasticine/100/null/map-pin.png",
//     //   iconSize: [12, 10]
//     // })
//     }).bindPopup(row.Category);    
//     marker.addTo(map);
//     }
//   });

// control that shows state info on hover
const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  //const contents = props ? `<b>${props.Island}</b><br />${props.Descriptio}` : 'Hover over a Focal Resource';
  const contents = props ? `<b>${props.Descriptio}</b>` : 'Hover over a Focal Resource';
  this._div.innerHTML = `<h4>Focal Resource Info</h4>${contents}`;
};

info.addTo(map);


//category points
var fr_points = L.geoJson(fr_points, {
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
  }
}).addTo(map);


//category polygons
var nat_polygons = L.geoJson(nat_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
.addTo(map);


var infra_polygons = L.geoJson(infra_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
.addTo(map);

var cultural_polygons = L.geoJson(cultural_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
.addTo(map);

// Polygons (Geojson)
// Creating variable & style for Coastal Exposure 2030
var CE_2030 = L.geoJSON(null, {
  style: (feature) => {
    return {
      //filter: (f) => f.properties.gridcode > 0,
    };
  },
  //onEachFeature: onEachFeatureFn,
  } 
)
.addTo(map);


// Creating variable & style for Coastal Exposure 2050
var CE_2050 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      //filter: (f) => f.properties.gridcode > 0,
    };
  },
  //onEachFeature: onEachFeatureFn,
})
//.addTo(map);


// Creating variable & style for Coastal Exposure 2070
var CE_2070 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      //filter: (f) => f.properties.gridcode > 0,
    };
  },
  //onEachFeature: onEachFeatureFn,
})
//.addTo(map);


// Creating variable & style for boundary
var Boundary = L.geoJSON(null, {
  style: (feature) => {
    return { 
      color: "#fff",
      weight: 1,
    };
  },
  onEachFeature: onEachFeatureFn,
}).addTo(map);



// Layers
var Boundary_9Islands = L.layerGroup([Boundary]);
var centroid_points = L.layerGroup([fr_points]);
var cultural_polygons_layer = L.layerGroup([cultural_polygons]);
var nat_polygons_layer = L.layerGroup([nat_polygons]);
var infra_polygons_layer = L.layerGroup({infra_polygons});
var CE_2030_layer = L.layerGroup([CE_2030]);
var CE_2050_layer = L.layerGroup([CE_2050]);
var CE_2070_layer = L.layerGroup([CE_2070]);


//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "Coastal Exposure 2030" : CE_2030_layer,
    "Coastal Exposure 2050" : CE_2050_layer,
    "Coastal Exposure 2070" : CE_2070_layer,
    "9 Islands Boundary" : Boundary_9Islands,
    "Centroid Focal Resource Points" : centroid_points,
    "Cultural Resources Polygons" : cultural_polygons_layer,
    "Natural Resources Polygons" : nat_polygons_layer,
    "Infrastructure/Facilties Polygons" : infra_polygons_layer,
};


//Layer box for all layer groups
var layerControl = L.control
  .layers(baseMaps, overlayMaps, {
    collapsed: true,
    hideSingleBase: true,
  })
  .addTo(map)
  .expand();


 // Adjusts layer visuals 
// var lcDIVElem = layerControl.getContainer();
//       document.addEventListener("keydown", (e) => {
//         if ((e.key === "l") | (e.key === "L")) {
//           if (lcDIVElem.style.display == "") {
//             lcDIVElem.style.display = "none";
//           } else {
//             lcDIVElem.style.display = "";
//           }
//         }
//       });


// Legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Risk Levels</h4>";
  div.innerHTML += '<i style="background: #990000"></i><span>Very High Risk</span><br>';
  div.innerHTML += '<i style="background: #d7301f"></i><span>High Risk</span><br>';
  div.innerHTML += '<i style="background: #fdbb84"></i><span>Low Risk</span><br>';
  div.innerHTML += '<i style="background: #fee8c8"></i><span>Very Low Risk</span><br>';
  
  return div;
};

legend.addTo(map);

// FETCHING DATA
// Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
//file:///C:/Users/amyca/OneDrive/Documents/GTECH732_AdvGIS/Final_Project/BOHA_SpatialDecisionSupportSystem/WebApp/geojson_files/BOHA_Boundary.geojson. 
//(Reason: CORS request not http).

// Fetch BOHA Boundary
fetch("geojson_files/BOHA_Boundary.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  Boundary.addData(data);
  });

// Fetch geojson file for CE 2030
fetch("./geojson_files/SLR1_MCE_RiskOutputs_poly.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    //CE_2030.addData(data);

    //styling...
    var maxVal = -Infinity,
        minVal = Infinity;

    data.features.forEach((f, i) => {
      if (
          f.properties.gridcode != "0"
      ) {
          maxVal = Math.max(maxVal, f.properties.gridcode);
          minVal = Math.min(minVal, f.properties.gridcode);
      }
    });

    var valRange = maxVal - minVal;  
    
    CE_2030.options.style = (f) => {
      return {
          fillColor: d3.interpolateOrRd(
              (f.properties.gridcode - minVal) / valRange
          ),
          //color: "#fff",
          //weight: 0,
          fillOpacity: 0.8,
          color: false,
      };
  };
  CE_2030.addData(data);
});

//


// Fetch geojson file for CE 2050
fetch("./geojson_files/SLR2_MCE_RiskOutputs_poly.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    //CE_2050.addData(data);
    

    //styling...
    var maxVal = -Infinity,
        minVal = Infinity;

    data.features.forEach((f, i) => {
      if (
          f.properties.gridcode != "0"
      ) {
          maxVal = Math.max(maxVal, f.properties.gridcode);
          minVal = Math.min(minVal, f.properties.gridcode);
      }
    });

    var valRange = maxVal - minVal;  
    
    CE_2050.options.style = (f) => {
      return {
          fillColor: d3.interpolateOrRd(
              (f.properties.gridcode - minVal) / valRange
          ),
          color: false,
          //weight: 0,
          fillOpacity: 0.8,
      };
  };
  CE_2050.addData(data);
});
//

// Fetch geojson file for CE 2070
fetch("./geojson_files/SLR3_MCE_RiskOutputs_poly.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  //  CE_2070.addData(data);
    

    //styling...
    var maxVal = -Infinity,
    minVal = Infinity;

    data.features.forEach((f) => {
    if (
      f.properties.gridcode != "0"
    ) {
      maxVal = Math.max(maxVal, f.properties.gridcode);
      minVal = Math.min(minVal, f.properties.gridcode);
    }
    });

    var valRange = maxVal - minVal;  

    CE_2070.options.style = (f) => {
    return {
      fillColor: d3.interpolateOrRd(
          (f.properties.gridcode - minVal) / valRange
      ),
      color: false,
      //weight: 0,
      fillOpacity: 0.8,
    };
  };
  CE_2070.addData(data);
});





//STOP