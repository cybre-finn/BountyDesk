define([
    "app",

    "text!templates/MyTickets.html",
    "collections/TicketCollection"
], function (app, MyTicketsTpl, TicketCollection) {

    var MyTicketsView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.TicketCollection = new TicketCollection({});
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
            this.template = _.template(MyTicketsTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        },

    });

    return MyTicketsView;
});