var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
var aMapStyles = require("./public/stylesheets/styledMap.json");
var aMapStylesLocal = require("./public/stylesheets/styledMapLocal.json");

var oGeoLSOA = require("./data/geoLSOA.json");
var oPopData = require("./data/popData.json");


var oMaps = [


    {
        id: "gpdemand",
        header: "Hampshire GP Demand Map",
        demandUnit: "consultations",
        rateFile: "gp_rates.json",
        rateData: {},
        demandData: {},
        unitCostPounds: 45,
        supplyPointQuery: "http://q.nqminds.com/v1/datasets/EkgAN_mfLx/data",
        supplyPointSchema: {
            name: ["name"],
            facts: [
                ["registered_patients"],
                ["nhs_choices_user_rating"]
            ],
            address: [
                ["address"],
                ["post_code"]
            ],
            lat: ["geoCode", "lat"],
            lng: ["geoCode", "lng"],
            geoStatus: ["geoStatus"]
        }
    },


    {
        id: "primarydemand",
        header: "Hampshire Primary School Demand Map",
        demandUnit: "primary school places",
        rateFile: "primary_rates.json",
        rateData: {},
        demandData: {},
        unitCostPounds: 16768,
        supplyPointQuery: "http://q.nqminds.com/v1/datasets/EyZDbG2Lqg/data?filter={%22$or%22:[{%22properties.PhaseOfEducation%20(name)%22:%22Primary%22},{%22properties.PhaseOfEducation%20(name)%22:%22All%20Through%22}]}&proj={%22geometry%22:1,%22properties.geoStatus%22:1,%22properties.NumberOfPupils%22:1,%22properties.SchoolCapacity%22:1,%22properties.EstablishmentName%22:1,%22properties.OfstedSpecialMeasures%20(name)%22:1,%22properties.Postcode%22:1,%22properties.Town%22:1,%22properties.Street%22:1}",
        supplyPointSchema: {
            name: ["properties", "EstablishmentName"],
            facts: [
                ["properties", "NumberOfPupils"],
                ["properties", "SchoolCapacity"],
                ["properties", "OfstedSpecialMeasures (name)"]
            ],
            address: [
                ["properties", "Street"],
                ["properties", "Town"],
                ["properties", "Postcode"]
            ],
            lat: ["geometry", "coordinates", 1],
            lng: ["geometry", "coordinates", 0],
            geoStatus: ["properties", "geoStatus"]
        }
    },

    {
        id: "secondarydemand",
        header: "Hampshire Secondary School Demand Map",
        demandUnit: "secondary school places",
        rateFile: "secondary_rates.json",
        rateData: {},
        demandData: {},
        unitCostPounds: 19084,
        supplyPointQuery: "http://q.nqminds.com/v1/datasets/EyZDbG2Lqg/data?filter={%22$or%22:[{%22properties.PhaseOfEducation%20(name)%22:%22Secondary%22},{%22properties.PhaseOfEducation%20(name)%22:%22All%20Through%22},{%22properties.PhaseOfEducation%20(name)%22:%2216%20Plus%22}]}&proj={%22geometry%22:1,%22properties.geoStatus%22:1,%22properties.NumberOfPupils%22:1,%22properties.SchoolCapacity%22:1,%22properties.EstablishmentName%22:1,%22properties.OfstedSpecialMeasures%20(name)%22:1,%22properties.Postcode%22:1,%22properties.Town%22:1,%22properties.Street%22:1}",
        supplyPointSchema: {
            name: ["properties", "EstablishmentName"],
            facts: [
                ["properties", "NumberOfPupils"],
                ["properties", "SchoolCapacity"],
                ["properties", "OfstedSpecialMeasures (name)"]
            ],
            address: [
                ["properties", "Street"],
                ["properties", "Town"],
                ["properties", "Postcode"]
            ],
            lat: ["geometry", "coordinates", 1],
            lng: ["geometry", "coordinates", 0],
            geoStatus: ["properties", "geoStatus"]
        }
    },

    {
        id: "collegedemand",
        header: "Hampshire College Demand Map",
        demandUnit: "college places",
        rateFile: "college_rates.json",
        rateData: {},
        demandData: {},
        unitCostPounds: 19084,
        supplyPointQuery: "http://q.nqminds.com/v1/datasets/EyZDbG2Lqg/data?filter={%22$or%22:[{%22properties.PhaseOfEducation%20(name)%22:%22Secondary%22,%20%22properties.StatutoryLowAge%22:16},{%22properties.PhaseOfEducation%20(name)%22:%22All%20Through%22,%20%22properties.StatutoryLowAge%22:16},{%22properties.PhaseOfEducation%20(name)%22:%2216%20Plus%22}]}&proj={%22geometry%22:1,%22properties.geoStatus%22:1,%22properties.NumberOfPupils%22:1,%22properties.SchoolCapacity%22:1,%22properties.EstablishmentName%22:1,%22properties.OfstedSpecialMeasures%20(name)%22:1,%22properties.Postcode%22:1,%22properties.Town%22:1,%22properties.Street%22:1}",
        supplyPointSchema: {
            name: ["properties", "EstablishmentName"],
            facts: [
                ["properties", "NumberOfPupils"],
                ["properties", "SchoolCapacity"],
                ["properties", "OfstedSpecialMeasures (name)"]
            ],
            address: [
                ["properties", "Street"],
                ["properties", "Town"],
                ["properties", "Postcode"]
            ],
            lat: ["geometry", "coordinates", 1],
            lng: ["geometry", "coordinates", 0],
            geoStatus: ["properties", "geoStatus"]
        }
    },


    {
        id: "caredemand",
        header: "Hampshire Elderly Residential Care Demand Map",
        demandUnit: "residents in care",
        rateFile: "care_rates.json",
        rateData: {},
        demandData: {},
        unitCostPounds: 20000,
        supplyPointQuery: "http://q.nqminds.com/v1/datasets/EyW56eH2Ke/data",
        supplyPointSchema: {
            name: ["properties","Name"],
            facts:[
                ["properties","Provider name"],
                ["properties","Service types"]
            ],
            address: [
                ["properties","Address"],
                ["properties","Postcode"]
            ],
            lat: ["geometry","coordinates",1],
            lng: ["geometry","coordinates",0],
            geoStatus: ["properties", "geoStatus"]

        }
    }

];


//var oConsultationData = require("./data/consultationRates.json");
var oGPsData = require("./data/gpSurgeries.json");


var baseYear = "2015";
var homeYear = "2020";

app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));

function calculatePressure(oPopData, oRateData){

    var oDemandData = {};
    var id;
    for(id in oPopData){
        var year;
        for(year in oPopData[id]){
            var sumVisits = 0;
            if(!(oDemandData.hasOwnProperty(year))){oDemandData[year] = {}}
            if(!(oDemandData[year].hasOwnProperty(id))){oDemandData[year][id] = {}}
            var sex;
            for (sex in oPopData[id][year]){
                var age;
                for (age in oPopData[id][year][sex]){
                    sumVisits += oPopData[id][year][sex][age] * oRateData["rates"][sex][age];
                }
            }
            oDemandData[year][id] = sumVisits
        }
        var baseValue = oDemandData[baseYear][id]
        for(year in oDemandData){
            oDemandData[year][id] = oDemandData[year][id] / baseValue;
        }
    }
    return oDemandData
}


function nqm_tbx_query(options, callback){
    //requests data from tbx and returns body string

    var http = require("http");
    var req = http.get(options, function(res) {

        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            callback(i, body)
        })
    });
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
};


app.get('/references', function(req, res){
    res.render('references');
});


app.get("/:mapId/pressure_data/:year/", function(req, res){


    var mapId = req.params["mapId"];
    var obj = oMaps.filter(function(el){return el.id == mapId})[0];

    var year = req.params["year"];

    //console.log(mapId + " " + year)
    //console.log(obj.demandData[year])
    res.json(obj.demandData[year]);
});

app.get("/:mapId/cost_data/:id/:year", function(req, res){


    var mapId = req.params["mapId"];
    var obj = oMaps.filter(function(el){return el.id == mapId})[0];

    var id = req.params["id"];
    var year = req.params["year"];

    //console.log(obj.rateData.rates);


    var sex;
    var age;
    var baseCost = 0;
    var cost = 0;

    //get base cost
    for (sex in oPopData[id][baseYear]){
        for (age in oPopData[id][baseYear][sex]){
            baseCost += oPopData[id][baseYear][sex][age] * obj.rateData.rates[sex][age] * obj.unitCostPounds;
        }
    }


    //get year cost
    for (sex in oPopData[id][year]){
        for (age in oPopData[id][year][sex]){
            cost += oPopData[id][year][sex][age] * obj.rateData.rates[sex][age] * obj.unitCostPounds;
        }
    }

    res.json({"baseCost": baseCost, "cost": cost})


    //console.log(oPopData[id])
    //
    //res.json(oPopData[id]);
});


app.get("/:mapId/demand_data/:id/:year", function(req, res){

    var mapId = req.params["mapId"];
    var obj = oMaps.filter(function(el){return el.id == mapId})[0];

    var id = req.params["id"];
    var year = req.params["year"];

    var data = [];
    var sex;
    var age;


    var data_obj = {};

    pop = 0;


    for (sex in oPopData[id][year]){
        for (age in oPopData[id][year][sex]) {
            if(!data_obj.hasOwnProperty(age)){
                data_obj[age] = {};
                data_obj[age].age = age

            }
            data_obj[age][sex] = oPopData[id][year][sex][age] * obj.rateData.rates[sex][age]
        }
    }

    for(age in data_obj){
        data_obj[age].age = data_obj[age].age.replace("-to", ""); //change text for plot labels
        data_obj[age].age = data_obj[age].age.replace("-and-over", "+"); //change text for plot labels
        data.push(data_obj[age])
    }

    data.reverse();

    res.json(data);


});


app.get("/pop_data/:id/:year", function(req, res){


    var id = req.params["id"];
    var year = req.params["year"];

    var data = [];
    var sex;
    var age;


    var data_obj = {};

    pop = 0;


    for (sex in oPopData[id][year]){
        for (age in oPopData[id][year][sex]) {
            if(!data_obj.hasOwnProperty(age)){
                data_obj[age] = {};
                data_obj[age].age = age

            }
            data_obj[age][sex] = oPopData[id][year][sex][age]
        }
    }

    for(age in data_obj){
        data_obj[age].age = data_obj[age].age.replace("-to", ""); //change text for plot labels
        data_obj[age].age = data_obj[age].age.replace("-and-over", "+"); //change text for plot labels
        data.push(data_obj[age])
    }

    data.reverse();

    res.json(data);


});


app.get("/total_pop/:id/", function(req, res){

    var id = req.params["id"];

    var data = [];
    var year;
    var sex;
    var age;
    var pop;
    var i = 0;
    for(year in oPopData[id]) {
        pop = 0;
        for (sex in oPopData[id][year]){
            for (age in oPopData[id][year][sex]) {
                pop += Number(oPopData[id][year][sex][age])
            }
        }
        data.push({id: i, year: year, total_pop: pop});
        i++
    }



    res.json(data);
});




app.get('/:mapId', function(req, res){

    var mapId = req.params["mapId"];

    var obj = oMaps.filter(function(el){return el.id == mapId})[0];


    res.render('webix', {
                        title: mapId
                        , header: obj.header
                        , mapId: mapId
                        , oMap: obj
                        , year: homeYear
                        , demandUnit: obj.demandUnit
                        , mapStyle: aMapStyles
                        , mapStyleLocal: aMapStylesLocal
                        , geoData: oGeoLSOA
                        , demandDataYear: obj.demandData[homeYear]
                        , rateData: obj.rateData
                        }
    );
});




for(var i in oMaps){

    var obj = oMaps[i];
    obj.rateData = require("./data/" + obj.rateFile);
    obj.demandData = calculatePressure(oPopData, obj.rateData);




}

//var odemandData = calculatePressure(oPopData, oConsultationData);


app.listen(3021);