
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
      fillColor: '#003E78', //'#5fbaff' 
      weight: 2,
      opacity: 1,
      //color: 'white',
      dashArray: '3',
      fillOpacity: 1,
      //color: "#000", fill: "#ccc", fillOpacity: 0.2 
    };
  },
  //onEachFeature: onEachFeatureFn,
}).addTo(map);

// Style for SLR 2030 10% AEP
var SLR2030_10 = L.geoJSON(null, {
  style: (feature) => {
    return { 
      fillColor: "#005EB8",
      weight: 2,
      opacity: 0.9,
      //color: 'white',
      //dashArray: '3',
      fillOpacity: 1,
    };
  },
  //onEachFeature: onEachFeatureFn,
}).addTo(map);

// Style for boundary
var Boundary = L.geoJSON(null, {
  style: (feature) => {
    return { 
      color: "#fff",
      weight: 1,
    };
  },
  onEachFeature: onEachFeatureFn,
}).addTo(map);

//Layers
var SLR2030_10_CFEP = L.layerGroup([SLR2030_10]);
var SLR2030_1_CFEP = L.layerGroup([SLR2030_1]);
var Boundary_9Islands = L.layerGroup([Boundary]);
//var marker_points = L.layerGroup([marker])


//Layer groups
var overlayMaps = {
   //"cultural points" : data,
    "SLR 2030 + 10% AEP" : SLR2030_10_CFEP,
    "SLR 2030 + 1% AEP" : SLR2030_1_CFEP,
    "9 Islands Boundary" : Boundary_9Islands,
    //"Cultural & Infrastructure/Facilities" : marker_points,
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
  position: 'topright',
  marker: false,
  moveToLocation: function (latlng, map) {
      map.fitBounds( latlng.layer.getBounds() );
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

map.addControl(new L.Control.Search({
  url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}&countrycodes=us',
  position: 'topleft',
  jsonpParam: 'json_callback',
  propertyName: 'display_name',
  propertyLoc: ['lat', 'lon'],
  marker: L.circleMarker([0, 0], { radius: 30 }),
  autoCollapse: true,
  autoType: false,
  minLength: 2,
  container: '',
  moveToLocation: function (latlng, title, map) {
      //map.fitBounds( latlng.layer.getBounds() );
      let zoom = 12; //map.getBoundsZoom(latlng.layer.getBounds());
      map.setView(latlng, zoom); // access the zoom
  }
}));

const geosearchCtrl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider({
      params: {
          'accept-language': 'en', // render results in Dutch
          countrycodes: 'us', // limit search results to the Netherlands
          addressdetails: 0, // include additional address detail parts
      },
  }),
  position: "topright",
  style: 'bar',
  marker: {
      // optional: L.Marker    - default L.Icon.Default
      icon: new L.Icon.Default(),
      draggable: false,
  },
});

map.addControl(geosearchCtrl);

map.on('geosearch/showlocation', (rslt) => {
  let latlng = [rslt.location.y, rslt.location.x];
  Boundary.eachLayer((l) => {
      let pt = turf.point([rslt.location.x, rslt.location.y]);

      if (turf.booleanPointInPolygon(pt, l.feature)) {
          map.fitBounds(l.getBounds());
          l.setStyle({ color: '#F00' })
      }
  });
});

// // Fetch BOHA Boundary
// fetch("./geojson_files/BOHA_Boundary.geojson")
// .then((response) => {
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   Boundary.addData(data);
//   });