define([
    "app",
    "models/RoomModel"
], function (app, RoomModel) {
    var RoomCollection = Backbone.Collection.extend({

        initialize: function () {
            
        },
        model: RoomModel,
        "url": function () {
            return app.API + '/rooms';
        }
    });

    return RoomCollection;

});