/**
 * Created by leovalberg on 05/02/2016.
 */


if (typeof window.demandMap === "undefined") {
    demandMap = {};
}







webix.ready(function() {

    setYearOptions();



    function loadMap() {
        if (!demandMap.mapInitialised) {



            // Add listeners for click, hover and idle events.
            //var gmap = $$("homelessnessMap").map;
            //gmap.data.addListener('mouseover', onMouseOverMap);
            //gmap.data.addListener('mouseout', onMouseOffMap);
            //gmap.data.addListener('click', onFeatureClick);
            //gmap.addListener('idle', clearMapBusy);

            // Initialise the map data.
            initialiseMap(gmap);
            demandMap.mapInitialised = true;
            //demandMap.accordionViewChanged();
            //resetMap()

        }
    }




});





function featureClick(event){



    //var id = event.feature.getProperty('LSOA01CD');
    //var name = event.feature.getProperty('LSOA01NM');
    //var year = $("#yearList").val();
    //
    //$("#featureTitle").html(" Demand breakdown " + year)
    //$(".modal-header").attr("id", id)
    //$("#featureIdTitle").html("Local Area: " + name);
    //
    //if (oPopData.hasOwnProperty(id)){
    //    loadFeatureInfoBox(oPopData[id]);
    //} else {
    //    $.ajax("/pop_data/" + id ).done(function (oPopDataId) {
    //        oPopData[id] = oPopDataId;
    //        loadFeatureInfoBox(oPopDataId);
    //    });
    //};


}