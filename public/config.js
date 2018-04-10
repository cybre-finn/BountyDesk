if (typeof DEBUG === 'undefined') DEBUG = true;

requirejs.config({
  "paths": {
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery",
    "underscore": "assets/lib/underscore",         // load lodash instead of underscore (faster + bugfixes)
    "backbone": "assets/lib/backbone",
    "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.bundle",
    "text": "assets/lib/text",
    "parsley": "assets/lib/parsley",
    "fontawesome": "https://use.fontawesome.com/releases/v5.0.8/js/all",
    "bootstrap_select": "assets/lib/bootstrap-select",
    "showdown": "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min"
  },
  "shim": {
    "underscore": { exports: "_" },
    'backbone': { deps: ['underscore', 'jquery'], exports: 'Backbone' },
    'bootstrap_select': { deps: ["jquery", "bootstrap"]},
    "bootstrap": ["jquery"],
    "parsley": { deps: ["jquery"] }
  }
});


require(["main"], function (app) {
  window.mainApp = app;
});