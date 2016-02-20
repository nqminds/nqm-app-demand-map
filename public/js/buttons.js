function findYearIndex(){
    var i = 0;
    while($$("yearList").getValue() != aYears[i].value){
        i++;
    }
    return i
}

function addPolygonColors(oPressureDataYear){

    $$('map').map.data.setStyle(function(feature) {
        var fid = feature.getProperty('LSOA01CD');

        if(typeof fid != "string"){
            var fid = feature.getProperty('LSOA11CD');
        }
        if (!oPressureDataYear.hasOwnProperty(fid)) {
            return {
                fillColor: selectKeyColor("NA"),
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }else if(fid ==id){
            var n = oPressureDataYear[fid];
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 3,
                strokeOpacity: 1,
                strokeColor: "blue"
            }

        } else {
            var n = oPressureDataYear[fid];
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }
    })

}




function polygonColors(year){
    if(oDemandData.hasOwnProperty(year)) {
        addPolygonColors((oDemandData[year]))
    } else {

        webix.ajax("/" + mapId + "/pressure_data/" + year, function(text,data){
            //text = '{ some :"abc"}'
            oDemandData[year] = (data.json()); //abc
            addPolygonColors((oDemandData[year]))
        });
    }
}



var playYears = function(){


}


var backYear = function(){

    var year;

    var i = findYearIndex();
    if( i == 0) {
        year = aYears[0].value
    }else {
        year = aYears[i - 1].value;
        $$("yearList").setValue(year);
    }

    updateYear(year);

};

var forwardYear = function(){

    var year;

    var i = findYearIndex();
    if( i == aYears.length - 1) {
        year = aYears[i].value
    }else {
        year = aYears[i + 1].value;
        $$("yearList").setValue(year);
    }

    updateYear(year);


};

var selectYear = function(){
    year = getYear();
    updateYear();

};

var updateYear = function(){

    polygonColors(year);

    //col  1
    updateCost();
    //updateyear
    $$("areaYear").setHTML("<div style='font-size: 70px; padding: 14px; color: lightgrey; font-weight: bold; text-align: center; vertical-align: middle;'>" + year + "</div>")


    //col 2
    updateDemandGraph();
    updatePopPyramidGraph();

    //col 3
    updateLineGraph();


};

var getYear = function(){
    return $$("yearList").getValue();
};

var updateFeature = function(name){
    $$("areaName").setHTML("<div>Local Area: " + name + "</div>");
};


var updateCost = function(){
    webix.ajax("/" + mapId + "/cost_data/" + id + "/"  + year , function(text,data){

        color = "red";
        if(Number(data.json().baseCost) >  Number(data.json().cost)){ color = "black"}

        $$("areaCost").setHTML(
            "<br><div style='font-size: 35px; padding: 14px; line-height: 20%; text-align: center; color: " + color + "'>" + ( data.json().cost - data.json().baseCost).toMoney(0) + "</div>" +
            "<p style='font-size: 14px; text-align: center; '>Annual cost increase from 2015 for local area</p>"
        )
    });
};

var updateLineGraph = function(){
    webix.ajax("/total_pop/" + id, function(text,data){
        //console.log(data.json())

        $$("popChart").data.clearAll();

        for(i in data.json()){
            $$("popChart").data.add(data.json()[i])
        }

        $$("popChart").attachEvent("onItemClick", function(id){
            year = this.getItem(id).year;
            $$("yearList").setValue(year);
            updateYear();
        })
    });
};


var updateDemandGraph = function(){
    webix.ajax("/" + mapId + "/demand_data/" + id + "/"  + year , function(text,data){
        //console.log(data.json())

        $$("demandChart").data.clearAll();

        for(i in data.json()){
            $$("demandChart").data.add(data.json()[i])
        }
    });
};

var updatePopPyramidGraph = function(){
    webix.ajax("/pop_data/" + id + "/"  + year , function(text,data){
        //console.log(data.json())

        $$("popPyramidChart").data.clearAll();

        for(i in data.json()){
            $$("popPyramidChart").data.add(data.json()[i])
        }
    });
};



function featureClick(event){

    $$("graphView").expand();



    id = event.feature.getProperty('LSOA01CD');
    var name = event.feature.getProperty('LSOA01NM');
    year = getYear();

    //col 1
    updateCost();
    updateYear();
    updateFeature(name);

    //col 2
    updateDemandGraph();
    updatePopPyramidGraph();

    //col 3
    updateLineGraph();

}




Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep){
    var n = this,
        c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
        d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

    /*
     according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
     the fastest way to check for not defined parameter is to use typeof value === 'undefined'
     rather than doing value === undefined.
     */
        t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

        sign = (n < 0) ? '-' : '',

    //extracting the absolute value of the integer part of the number and converting to string
        i = parseInt(n = Math.abs(n).toFixed(c)) + '',

        j = ((j = i.length) > 3) ? j % 3 : 0;
    return sign + " &pound " + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};
