define([
    "app",
    "models/TicketModel"
], function (app, TicketModel) {
    var TicketCollection = Backbone.Collection.extend({

        initialize: function () {
            _.bindAll(this);
        },
        model: TicketModel,
        "url": function () {
            return app.API + '/tickets';
        }
    });

    return TicketCollection;

});