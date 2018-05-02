define([
    "app",
    "models/TicketModel"
], function (app, TicketModel) {
    var TicketCollection = Backbone.Collection.extend({

        initialize: function (options) {
            this.options=options;
        },
        model: TicketModel,
        "url": function () {
            if (this.options.query) return app.API + '/tickets?' + this.options.query;
            else return app.API + '/tickets';
        }
    });

    return TicketCollection;

});