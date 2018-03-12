if (typeof DEBUG === 'undefined') DEBUG = true;

requirejs.config({
    "paths": {
      "jquery"                : "https://code.jquery.com/jquery-2.2.4",
      "popper"                : "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper",
      "underscore"            : "assets/lib/underscore",         // load lodash instead of underscore (faster + bugfixes)
      "backbone"              : "assets/lib/backbone",
      "bootstrap"             : "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap",
      "text"                  : "assets/lib/text",
      "parsley"               : "assets/lib/parsley",
      "fontawesome"           : "https://use.fontawesome.com/releases/v5.0.8/js/all"
    },
    "shim" : {
        "underscore" : { exports  : "_" },
        'backbone'   : { deps : ['underscore', 'jquery'], exports : 'Backbone' },
        "bootstrap"  : ["jquery","popper"],
        "parsley"    : { deps: ["jquery"] }
    }
  });
   
  require(["popper"],function(p){
    window.Popper = p;
    require(["main"],function(app){
      window.mainApp = app;
    });
  });