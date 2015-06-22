function initTiger(){
	
	var redlavplaces = new L.LayerGroup();

     L.marker([43.8487, 10.5747])
            .bindPopup('Dipartimento Prevenzione IDstaz 1').addTo(redlavplaces),
     L.marker([43.725,10.414])
            .bindPopup('IZS IDstaz 2').addTo(redlavplaces),
     L.marker([43.678,10.346])
            .bindPopup('S.Piero IDstaz 3').addTo(redlavplaces),
     L.marker([43.957,10.18])
            .bindPopup('Versilia IDstaz 4').addTo(redlavplaces)
     L.marker([44.088,10.013])
            .bindPopup('Farmacia IDstaz 5').addTo(redlavplaces),
     L.marker([43.538,10.3])
            .bindPopup('Livorno IDstaz 6').addTo(redlavplaces),
     L.marker([42.769,11.074])
            .bindPopup('Zoologia ambientale IDstaz 6').addTo(redlavplaces);
            
     var imageUrl_uova = 'http://149.139.8.55/data/redlav/images/eggs_last.png',
        imageBounds = L.latLngBounds([[38.73847, 7.419861],[44.58014, 12.31153]]);
     
     var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
         thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';
        
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; ' + osmLink + ' Contributors',
          landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
          thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink;

   // var southWest = new L.LatLng(38.73847, 7.419861),northEast = new L.LatLng(44.58014, 12.31153), bounds = new L.LatLngBounds(southWest, northEast);

     var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; ' + osmLink + ' Contributors',
         landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
         thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink,
         redUrleggs = 'http://149.139.8.55/data/redlav/images/eggs_raster/{z}/{x}/{y}.png',
         redAttrib = 'Project Redlav';

     var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
         landMap = L.tileLayer(landUrl, {attribution: thunAttrib}),
         eggsMap = L.tileLayer(redUrleggs, {   tms: true,
                                               opacity: 0.3, 
                                               attribution: redAttrib});



    //  https://github.com/buche/leaflet-openweathermap

     
     var map = L.map('tiger', {
			    layers: [osmMap] // only add one!
		    })
		    .setView([43.8487, 10.5747], 9);

		var baseLayers = {
			"OSM Mapnik": osmMap
			  
		};

		var overlays = {
			"Layer di Interesse ": redlavplaces,
                        "Aedes Albopictus Eggs  Actual": eggsMap
 
		};

     
     L.control.layers(baseLayers,overlays).addTo(map);

     // Restrict to bounds

     // map.setMaxBounds(bounds);

    // Fit bounds

    //map.fitBounds(bounds);
	
}