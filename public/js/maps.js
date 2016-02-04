var geocoder;
var map;
var markers = [];
var markerCluster;
var gpFlag = false;
var polygons = {};
var aYears = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"]
var maxVisits = 1.5;
var minVisits = 0.5;





//var aKeyValues = ["           NA", "    < 100%", "100-105%", "105-110%", "110-120%", "120-130%", "130-150%", "    > 150%"]

function setYearOptions(){
    $.each(aYears, function (i) {
        $('#yearList').append(new Option(aYears[i]))
    });
    $("#yearList").val(year)
}

function loadGeoData(){
    map.data.addGeoJson(oGeoData)
}

function zoomChanged(){
    var zoomLevel = map.getZoom();
    var sMapType;
    if(zoomLevel > 9) {
        map.setMapTypeId('local');
    } else {
        map.setMapTypeId('county');
    }
}

function initialize() {

    var latlng = new google.maps.LatLng(50.9, -1.3);
    cacheCenter = latlng;
    var mapOptions = {
        zoom: 11,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT

        }
    };

    //map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
    map = new google.maps.Map($(".mapCanvas")[0], mapOptions);

    var styledMapOptions = {map: map, name: 'county'};
    var styledMapOptionsLocal = {map: map, name: 'local'};

    var sMapType = new google.maps.StyledMapType(mapStyles,styledMapOptions);
    map.mapTypes.set('county', sMapType);
    map.setMapTypeId('county');

    var sMapTypeLocal = new google.maps.StyledMapType(mapStylesLocal,styledMapOptionsLocal);
    map.mapTypes.set('local', sMapTypeLocal);

    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChanged()
    });

    if (config.showPOI) {
        map.data.addListener('click', function(event) {
            featureClick(event)
        });
    }

    loadGeoData()
    setYearOptions()
    polygonColors(year)
    addKeyD3()
}

var oKeyColors = setKeyColors()
google.maps.event.addDomListener(window, 'load', initialize);