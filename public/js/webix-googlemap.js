


function getInfoBoxString(supplyPoint){

    string = "<div>"
        +"<h3>" + getProperty(supplyPoint, oMap.supplyPointSchema.name, 0) + "</h1>"
        + "<br/>"

    //facts
    for(var i in oMap.supplyPointSchema.facts){
        string += "<p>" + oMap.supplyPointSchema.facts[i][oMap.supplyPointSchema.facts[i].length - 1] + ": " //fact name last in fact property array
        string += getProperty(supplyPoint, oMap.supplyPointSchema.facts[i], 0) + "</p>"
    }

    string += "<br/>"

    //address
    for(var i in oMap.supplyPointSchema.address){
        string += "<p>" + getProperty(supplyPoint, oMap.supplyPointSchema.address[i], 0) + "</p>"
    }

    string += "<br/>"

    return string;
}



function showMarkers(){

    if(supplyPoints == undefined){ //if not there get the points from toolbox

            console.log(oMap.supplyPointQuery)
        webix.ajax(oMap.supplyPointQuery , function(text,data){
            supplyPoints = data.json().data;
            addMarkers();
            for (var i in markers) {
                markers[i].setMap($$("map").map);
            }
        });
    } else {
        for (var i in markers) {
            markers[i].setMap($$("map").map);
        }
    }



}




var markers = [];

function addMarkers(){
    for (var i in supplyPoints){
        if (getProperty(supplyPoints[i], oMap.supplyPointSchema.geoStatus, 0) == "OK"){
            markers.push(createMarker(supplyPoints[i]));
        }
    }
}



function getProperty(obj, array, i){ //recursive loop through array of properties
    if(i == array.length - 1){
        return obj[array[i]]
    }
    return getProperty(obj[array[i]], array, i + 1)
}


var infowindow = new google.maps.InfoWindow({maxWidth: 400}); //global info window so only one open at a time

function createMarker(supplyPoint){ // create a marker with a info window


    var title = getProperty(supplyPoint, oMap.supplyPointSchema.name, 0);

    var marker = new google.maps.Marker({
        position: {lat: getProperty(supplyPoint, oMap.supplyPointSchema.lat, 0), lng: getProperty(supplyPoint, oMap.supplyPointSchema.lng, 0) },
        title: title,
        icon: "http://maps.google.com/mapfiles/kml/pal4/icon57.png"
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close();
        infowindow.setOptions({maxWidth: 400});
        infowindow.setContent(getInfoBoxString(supplyPoint));
        infowindow.open($$("map").map, marker);

    });

    return marker;
}


function hideMarkers(){
    for (var i in markers){ //remove old markers
        markers[i].setMap(null);
        //markers[i] = null;
    }
}


function supplyPointToggle(){

    if(this.data.label == this.data.onLabel){
        showMarkers();
    } else {
        hideMarkers();
    }
}

