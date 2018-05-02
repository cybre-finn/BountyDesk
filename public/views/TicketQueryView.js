define([
    "app",

    "text!templates/TicketQuery.html",
    "collections/TicketCollection"
], function (app, BlockedTicketsTpl, TicketCollection) {

    var BlockedTicketsView = Backbone.View.extend({

        initialize: function (options) {
            this.TicketCollection = new TicketCollection({query: options.urlQuery});
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
            this.template = _.template(BlockedTicketsTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        },

    });

    return BlockedTicketsView;
});