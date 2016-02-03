var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
var aMapStyles = require("./public/stylesheets/styledMap.json");
var aMapStylesLocal = require("./public/stylesheets/styledMapLocal.json");

var oGeoLSOA = require("./data/geoLSOA.json");
var oPopData = require("./data/popData.json");
var oConsultationData = require("./data/consultationRates.json");
var oGPsData = require("./data/gpSurgeries.json");
var baseYear = "2015";
var homeYear = "2017";

app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));

function calculatePressure(oPopData, oConsultationData){

    var oPressureData = {};
    var id;
    for(id in oPopData){
        var year;
        for(year in oPopData[id]){
            var sumVisits = 0;
            if(!(oPressureData.hasOwnProperty(year))){oPressureData[year] = {}}
            if(!(oPressureData[year].hasOwnProperty(id))){oPressureData[year][id] = {}}
            var sex;
            for (sex in oPopData[id][year]){
                var age;
                for (age in oPopData[id][year][sex]){
                    sumVisits += oPopData[id][year][sex][age] * oConsultationData["consultationRates"][sex][age];
                }
            }
            oPressureData[year][id] = sumVisits
        }
        var baseValue = oPressureData[baseYear][id]
        for(year in oPressureData){
            oPressureData[year][id] = oPressureData[year][id] / baseValue;
        }
    }
    return oPressureData
}


app.get('/references', function(req, res){
    res.render('references');
})


app.get("/pressure_data/:year/", function(req, res){
    var year = req.params["year"];
    res.json(oPressureData[year]);
});

app.get("/pop_data/:id/", function(req, res){
    var id = req.params["id"];
    res.json(oPopData[id]);
});


app.get('/', function(req, res){
    res.render('index', {
                        title: "GP_Map"
                        , year: homeYear
                        , mapStyle: aMapStyles
                        , mapStyleLocal: aMapStylesLocal
                        , geoData: oGeoLSOA
                        , pressureData: oPressureData[homeYear]
                        , consultationData: oConsultationData
                        , gpSurgeryData: oGPsData
                        }
    );
});




var oPressureData = calculatePressure(oPopData, oConsultationData);
app.listen(3020);