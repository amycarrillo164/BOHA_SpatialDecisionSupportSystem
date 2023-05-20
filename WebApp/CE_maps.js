
// Function for Island Boundary popup
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


//Function for polygons popup
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

  layer.on({
    mouseover: function (e) {
      e.target.setStyle({ 
        Color: "#fff",
        opacity: 0.9, 
        weight: 3,
      });
      e.target.openPopup();
      info.update(layer.feature.properties);
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

// Find and fit map to feature


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

// function to update the data table with the location annd text of each marker
function updateDataTable (map) {
	let dataTableBody = $('#data-table tbody')
  dataTableBody.html('<tr></tr>')
  map.eachLayer(layer => {
    let popup = layer.getPopup()
    if (popup) {
      let text = $(popup.getContent()).find('.popup-span').text()
      let latLng = layer.getLatLng()
      dataTableBody.append(
        $('<tr></tr>').append(
          $('<td></td>').text(latLng.lat),
          $('<td></td>').text(latLng.lng),
          $('<td></td>').text(text),
         )
      )
    }
  })
}


// script for styling circle markers
var geojsonMarkerOptions = {
  radius: 3,
  fillColor: "#6693f5",
  color: "#fff",
  weight: 1,
  opacity: .7,
  fillOpacity: 0.8,
};

// Set up initial map
var map = L.map('map', {
    //fullscreenControl: true,
    center: [42.3131628, -70.9297749], 
    zoom: 13,
});
map.createPane('fr_pane')
map.getPane('fr_pane').style.zIndex = 650;
map.getPane('fr_pane').style.pointerEvents = 'none';


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

//Layer group
var baseMaps = {
    "Google Earth Satellite": googleSat,
    "Carto Light": light,
    "Stamen Terrain": terrain, 
};


// Hover Info Box
const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  //const contents = props ? `<b>${props.Island}</b><br />${props.Descriptio}` : 'Hover over a Focal Resource';
  const contents = props ? `<b>${props.Descriptio}</b>` : '1. Turn on Polygon Layers <br> 2. Hover Over a Focal Resource';
  this._div.innerHTML = `<h4>Focal Resource Info</h4>${contents}`;
};
info.addTo(map);


//Creating variables for data
var nat_polygons = L.geoJson(nat_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
//.addTo(map);

var infra_polygons = L.geoJson(infra_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
//.addTo(map);

var cultural_polygons = L.geoJson(cultural_polys, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})
//.addTo(map);
//var tabledata = L.geoJson(tableDat, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})


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

//Creating variable & style for centroid merge points
// var Centroid_FR_Merge = L.geoJson(null, {
//   pane: 'fr_pane',
//   pointToLayer: function (feature, latlng) {
//     return L.circleMarker(latlng, geojsonMarkerOptions);
//   },
// })
// // .addTo(map)
// ;

// Centroid_FR_Merge.bringToFront();

// Layers
var cultural_polygons_layer = L.layerGroup([cultural_polygons]);
var nat_polygons_layer = L.layerGroup([nat_polygons]);
var infra_polygons_layer = L.layerGroup([infra_polygons]);
var CE_2030_layer = L.layerGroup([CE_2030]);
var CE_2050_layer = L.layerGroup([CE_2050]);
var CE_2070_layer = L.layerGroup([CE_2070]);
//var centroid_points = L.layerGroup([fr_points]);
var Boundary_9Islands = L.layerGroup([Boundary]);
//var tableDat = L.layerGroup([tableDat]);


//Layer groups
var overlayMaps = {
   //"cultural points" : data,

    "Coastal Exposure 2030" : CE_2030_layer,
    "Coastal Exposure 2050" : CE_2050_layer,
    "Coastal Exposure 2070" : CE_2070_layer,
    "Cultural Resources Polygons" : cultural_polygons_layer,
    "Natural Resources Polygons" : nat_polygons_layer,
    "Infrastructure/Facilties Polygons" : infra_polygons_layer,
    //"Centroid Focal Resource Points" : centroid_points,
    "9 Islands Boundary" : Boundary_9Islands,
    //"All Resources": tabledata,
    
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


// Function for CE slider
changeCEMap = function({label, map}){
  if(label == "2030"){ 
    CE_2030_layer.addTo(map);
    map.removeLayer(CE_2050_layer);
    map.removeLayer(CE_2070_layer);
  }
  else if(label == "2050") {
    CE_2050_layer.addTo(map);
    map.removeLayer(CE_2030_layer);
    map.removeLayer(CE_2070_layer);
  }

  else if(label == "2070"){
    CE_2070_layer.addTo(map);
    map.removeLayer(CE_2030_layer);
    map.removeLayer(CE_2050_layer);
  }
}; 


///////////////////////////////////////////////////////////////////////////////////////
//table data

/////////////////////////////////////////////////////////////////////////


// var jsonMapLayers = L.geoJson(tableDat, {style: style_feature_frpolys, onEachFeature: onEachFeaturePoly,})

// let geoJSON2DataArray = (d) => {
//   let datArray = Array(d.getLayers().length).fill(null), i = 0;

//   d.eachLayer(l => {
//     datArray[i++] = l.feature.properties;
//   })

//   return datArray;
// }

// let tabledata2 = geoJSON2DataArray(jsonMapLayers[tableDat])

//////////////////////////////////////////////

//data table

var table = new Tabulator("#example-table", {
  data: tabledata,
  //autoColumns:true,
  movableColumns:true,
  resizableRows:true,
  //index: 'id',
  layout:"fitColumns",
  height:"311px",
  columns: [
    {title: "ID", field: "ORIG_FID", visible:false},
    {title: "ID", field: "ï»¿OID", visible:false},
    {title: "Category", field: "Category", visible:true},
    {title: "Description", field: "Descriptio", visible:true},
    {title: "Island", field: "Island", visible:true},
    {title: "FID", field: "ORIG_FID", visible:false},
    {title: "Latitude", field: "Latitude", visible:false},
    {title: "Longitude", field: "Longitude", visible:false},
    {title: "Risk 2030", field: "gridcode_2030", visible:true},
    //{title:"Risk 2030", field:"gridcode_2030", sorter:"number", hozAlign:"left", formatter:"progress", width:100,  editable:true},
    {title: "Risk 2050", field: "gridcode2050", visible:true},
    {title: "Risk 2070", field: "gridcode_2030", visible:true},
    

  ],
  index: 'ORIG_FID',
      selectable: 1, //make rows selectable
      initialSort: [{column:"ORIG_FID", dir:"asc"}],
     }
    );
    
    table.on("rowSelectionChanged", function (data, rows) {
      if (data.length == 1 && rowSelectSource == 'table') {
        // layer is targetLayer and id is data.id
        fitLayerFeature(map, jsonMapLayers, targetLayer, data[0].id);
      }
      rowSelectSource = 'table';
    });

  table.on("rowSelectionChanged", function (data, rows) {
    if (data.length == 1 && rowSelectSource == 'table') {
      // layer is targetLayer and id is data.id
      fitLayerFeature(map, jsonMapLayers, targetLayer, data[0].id);
    }
    rowSelectSource = 'table';
  });


// // //// From map layer to table row
  // l.on({
  //   mouseover: (e) => {
  //     e.target.setStyle({
  //       fillColor: "#000",
  //       fillOpacity: l.options.fillOpacity + 0.2,
  //       weight: 2,
  //     });

  //     if(tableObj) {
  //       //e.stopPropagation();
  //       rowSelectSource = 'map';
  //       tableObj.selectRow(l.feature.properties.id);
  //       tableObj.scrollToRow(l.feature.properties.id, "top", false);
  //     }
  //   },
  //   mouseout: (e) => {
  //     jsonMapLayers[dataNames[i]].resetStyle(e.target);
  //     if(tableObj) tableObj.deselectRow(l.feature.properties.id);
  //   },
  // });




//////////////////////////////////////////////////////////////////////////////////////// 
//FETCHING DATA

// Fetch table data
fetch("geojson_files/FR_Merge_Polys_MCE2.geojson")
.then((response) => {
  return response.json();
})
.then((data) => {
  console.log(data);
  tableDat.addData(data);
  });

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


// Fetch centroid points
// fetch("geojson_files/centroid_focalresources.geojson")
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   // Centroid_FR_Merge.addData(data);
//   });


//STOP

// Tabulator data table
// var table = new Tabulator("#example-table", {
//   data: tabledat,
//   autoColumns:true,
//   movableColumns:true,
//   resizableRows:true,
//   layout:"fitColumns",
//   height:"311px",
// });
