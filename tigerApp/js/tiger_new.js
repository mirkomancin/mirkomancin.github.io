function initTiger(){
	          
      

      var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
          thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>',
          southWest = L.latLng(42.13, 7.64),
          northEast = L.latLng(44.82, 11.92);


      var bounds = L.latLngBounds(southWest, northEast);

         
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; ' + osmLink + ' Contributors',
          landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
          thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink;

  
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; ' + osmLink + ' Contributors',
          redUrladu = 'http://149.139.8.55/data/redlav/images/adu_raster/{z}/{x}/{y}.png',
          redUrleggs = 'http://149.139.8.55/data/redlav/images/eggs_raster/{z}/{x}/{y}.png',
           redAttrib = 'Project Redlav';

     var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
         aduMap = L.tileLayer(redUrladu, {   tms: true,
                                               opacity: 0.3, 
                                               attribution: redAttrib});

         eggsMap = L.tileLayer(redUrleggs, {   active: true,
                                               tms: true,
                                               opacity: 0.3, 
                                               attribution: redAttrib});



       
     var map = L.map('tiger', {
			     layers: [osmMap] // 
		    })
		    .setView([43.8487, 10.5747], 9);

		var baseLayers = {
			"OSM Mapnik": osmMap
			  
		};

		var overlays = {
			"Densità adulti": aduMap,
                        "Densità uova": eggsMap
 
		};

		
		
      var title = new L.Control();
		title.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
		};
		title.update = function () {
			this._div.innerHTML = '<div style="background:#fff;color:#000;"><h2>#Zanzara tigre maps</h2>Mappe Produttività Adulti e Uova</div>'
		};
		title.addTo(map);
		var osmGeocoder = new L.Control.OSMGeocoder({
                                      collapsed: false,
                                      position: 'bottomright',
                                      text: 'Cerca indirizzo!',
		});
		osmGeocoder.addTo(map);
	 
	 
	 
	 
     L.control.layers(baseLayers,overlays,{collapsed:false}).addTo(map);
     
     var aduLegend = L.control({position: 'bottomright'});
     var eggsLegend = L.control({position: 'bottomright'});

     aduLegend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'info legend');
          div.innerHTML +=
    '<img src="http://149.139.8.55/data/redlav/images/legend_adu.png" alt="legend" width="120" height="200">';
     return div;
     };

    eggsLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
    '<img src="http://149.139.8.55/data/redlav/images/legend_eggs.png" alt="legend" width="134" height="147">';
    return div;
    };

    // Add this one (only) for now, as the Population layer is on by default
    
    aduLegend.addTo(map);

    map.on('overlayadd', function (eventLayer) {
  
    // Switch to the Adult legend...
    if (eventLayer.name === 'Densità adulti') {
        this.removeControl(eggsLegend);
       aduLegend.addTo(this);
    } else { // Or switch to the Eggs legend...
        this.removeControl(aduLegend);
        eggsLegend.addTo(this);
    }
    });
    
    map.on('dblclick', function(e) {
    alert(e.latlng);
    });
     // Restrict to bounds

     map.setMaxBounds(bounds);

    // Fit bounds

    //map.fitBounds(bounds);
	
}
