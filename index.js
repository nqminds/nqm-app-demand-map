(function() {
  "use strict";

  var input = require("nqm-databot-utils").input;

  function databot(input, output, context) {
    const demandApp = require("./main.js"); 
    demandApp(context.instancePort, context.instanceAuthKey);
  }

  input.pipe(databot);
}());
