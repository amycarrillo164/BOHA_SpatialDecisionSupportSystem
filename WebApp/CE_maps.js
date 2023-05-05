// Functions
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



// Adding Data...

//Points (CVS)
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


// Polygons (Geojson)
// Creating variable & style for Coastal Exposure 2030
var CE_2030 = L.geoJSON(null, {
  style: (feature) => {
    return {
      filter: (f) => f.properties.gridcode > 0,
    };
  },
  //onEachFeature: onEachFeatureFn,
})
.addTo(map);


// Creating variable & style for Coastal Exposure 2050
var CE_2050 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      filter: (f) => f.properties.gridcode > 0,
    };
  },
  //onEachFeature: onEachFeatureFn,
})
//.addTo(map);


// Creating variable & style for Coastal Exposure 2070
var CE_2070 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      filter: (f) => f.properties.gridcode > 0,
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
var CE_2030_layer = L.layerGroup([CE_2030]);
var CE_2050_layer = L.layerGroup([CE_2050]);
var CE_2070_layer = L.layerGroup([CE_2070]);
var Boundary_9Islands = L.layerGroup([Boundary]);
//var marker_points = L.layerGroup([marker])


//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "Coastal Exposure 2030" : CE_2030_layer,
    "Coastal Exposure 2050" : CE_2050_layer,
    "Coastal Exposure 2070" : CE_2070_layer,
    "9 Islands Boundary" : Boundary_9Islands,
    //"Cultural & Infrastructure/Facilities" : marker_points,
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
  div.innerHTML += '<i style="background: #ef6548"></i><span>Intermediate Risk</span><br>';
  div.innerHTML += '<i style="background: #fdbb84"></i><span>Low Risk</span><br>';
  div.innerHTML += '<i style="background: #fee8c8"></i><span>Very Low Risk</span><br>';
  
  return div;
};

legend.addTo(map);

// FETCHING DATA

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
          //color: "#fff",
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

  data.features.forEach((f, i) => {
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
    //color: "#fff",
    //weight: 0,
    fillOpacity: 0.8,
  };
};
CE_2070.addData(data);
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



// STOP


// NEED TO WORK ON
    // Search bar
// var searchControl = new L.Control.Search({
//   layer: Boundary,
//   propertyName: 'Island',
//   position: 'topright',
//   marker: false,
//   moveToLocation: function (latlng, map) {
//       map.fitBounds( latlng.layer.getBounds() );
//       let zoom = map.getBoundsZoom(latlng.layer.getBounds());
//       map.setView(latlng, zoom); // access the zoom
//   }
// });

// searchControl.on('search:locationfound', function (e) {

//   //console.log('search:locationfound', );

//   //map.removeLayer(this._markerSearch)
//   e.layer.setStyle({ fillColor: '#3f0', color: '#0f0' });
//   if (e.layer._popup)
//       e.layer.openPopup();

// }).on('search:collapsed', function (e) {

//   featuresLayer.eachLayer(function (layer) {	//restore feature color
//       featuresLayer.resetStyle(layer);
//   });
// });

// map.addControl(searchControl);  //inizialize search control

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

// const geosearchCtrl = new GeoSearch.GeoSearchControl({
//   provider: new GeoSearch.OpenStreetMapProvider({
//       params: {
//           'accept-language': 'en', // render results in Dutch
//           countrycodes: 'us', // limit search results to the Netherlands
//           addressdetails: 0, // include additional address detail parts
//       },
//   }),
//   position: "topright",
//   style: 'bar',
//   marker: {
//       // optional: L.Marker    - default L.Icon.Default
//       icon: new L.Icon.Default(),
//       draggable: false,
//   },
// });

// map.addControl(geosearchCtrl);

// map.on('geosearch/showlocation', (rslt) => {
//   let latlng = [rslt.location.y, rslt.location.x];
//   Boundary.eachLayer((l) => {
//       let pt = turf.point([rslt.location.x, rslt.location.y]);

//       if (turf.booleanPointInPolygon(pt, l.feature)) {
//           map.fitBounds(l.getBounds());
//           l.setStyle({ color: '#F00' })
//       }
//   });
// });

// // Fetch BOHA Boundary
// fetch("./geojson_files/BOHA_Boundary.geojson")
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   Boundary.addData(data);
//   });