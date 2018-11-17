define([
    "app",

    "text!templates/TicketQuery.html",
    "collections/TicketCollection"
], function (app, StashedTicketsTpl, TicketCollection) {

    var StashedTicketsView = Backbone.View.extend({

        initialize: function (options) {
            this.TicketCollection = new TicketCollection({ query: options.urlQuery });
            var self = this;
            this.TicketCollection.fetch({
                success: function () {
                    self.render();
                }
            });
        },

        events: {

        },

        render: function () {
            this.template = _.template(StashedTicketsTpl);
            if (this.TicketCollection.length != 0) {
                this.$el.html(this.template({ user: app.session.user.toJSON() }));
            }
            else {
                this.$el.html("<h3 class=\"text-muted\">Nothing here...</h3>");
            }
            return this;
        },

    });

    return StashedTicketsView;
});