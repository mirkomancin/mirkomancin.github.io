var map;

function initialize() {
	var myOptions = {
		zoom : 1,
		center : new google.maps.LatLng(44.86463, 10.06209),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=all_locations_devices', function(data) {
		
		for(index in data)
		 createM2MLocationMarker(data);	
	});
}

function createM2MLocationMarker(data)
{
	var m2mLocation = data[index]['location'];	
	var latLng = new google.maps.LatLng(m2mLocation['lat'],m2mLocation['lng']);
	var image = 'img/minihotspot.png';
	
	var marker = new google.maps.Marker({
        position: latLng, 
        map: map,
        icon:image,
        title:m2mLocation['name']
    });   
    
    var infoBubble2 = new InfoBubble({
          map: map,
          content: '<div class="phoneytext" onClick="openDetailPage('+m2mLocation['idLocation']+')">'+m2mLocation['name']+'</div>',
          position: new google.maps.LatLng(-35, 151),
          shadowStyle: 1,
          padding: 0,
          backgroundColor: 'rgb(57,57,57)',
          borderRadius: 4,
          arrowSize: 10,
          borderWidth: 1,
          borderColor: '#2c2c2c',
          disableAutoPan: true,
          hideCloseButton: false,
          arrowPosition: 30,
          backgroundClassName: 'phoney',
          arrowStyle: 2
        });
    
    google.maps.event.addListener(marker, 'click', function() {
      infoBubble2.open(map,marker);
    });
    
    return marker;
}

function openDetailPage(locationId)
{
	q=(document.location.href);
	void(open('m2mLoc.php?locId='+locationId,'_self','resizable,location,menubar,toolbar,scrollbars,status'));
}
