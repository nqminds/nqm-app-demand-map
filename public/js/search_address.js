function findAddress(address) {
    var geocoder = new google.maps.Geocoder();
    console.log(address)
    geocoder.geocode( {'address': address  + " England"}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            var loc_Center = results[0].geometry.location;

            var map = $$("map")._map;

            map.setCenter(loc_Center);
            map.setZoom(14);

            //if(marker != "no marker"){
            //    marker.setMap(null);
            //    marker = "no marker";
            //}
            //
            //marker = new google.maps.Marker({
            //    position: loc_Center,
            //    map: map
            //})
            //console.log(typeof(marker))

        } else {
            webix.message('We could not find your address for the following reason: ' + status);
        }
        // Clear focus from search input.
        document.activeElement.value = "";
        document.activeElement.blur();
    });
}