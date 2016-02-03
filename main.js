var argv = require("minimist")(process.argv.slice(2));
var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
var aMapStyles = require("./public/stylesheets/styledMap.json");
var aMapStylesLocal = require("./public/stylesheets/styledMapLocal.json");

// Must have a configuration specified on the command line.
if (!argv.config) {
  console.log("");
  console.log("Usage error");
  console.log("specify a configuration file using --config myconfig.json");
  console.log("");
  process.exit(-1);
}

var baseYear = "2015";
var homeYear = "2017";

var config = require(argv.config);
var oGeoLSOA = require(config.geoData);
var oPopData = require(config.popData);
var oConsultationData = require(config.consultationData);
var oPOIData = require(config.poiData);
var oPressureData = calculatePressure(oPopData, oConsultationData);

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
});

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
                          config: config
                        , year: homeYear
                        , mapStyle: aMapStyles
                        , mapStyleLocal: aMapStylesLocal
                        , geoData: oGeoLSOA
                        , pressureData: oPressureData[homeYear]
                        , consultationData: oConsultationData
                        , poiData: oPOIData
                        }
    );
});

app.listen(config.port);
console.log("listening on %d", config.port);