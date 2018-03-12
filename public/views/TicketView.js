define([
    "app",

    "text!templates/Ticket.html",
    "models/TicketModel",

    "parsley"
], function (app, TicketViewTpl, TicketModel) {

    var TicketView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.TicketModel = new TicketModel({ id: this.options.ticket_id });
            var self = this;
            this.TicketModel.fetch({
                success: function () {
                    self.render();
                }
            });


        },

        events: {

        },

        render: function () {
            this.template = _.template(TicketViewTpl);
            console.log(this.TicketModel.toJSON());
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        },

    });

    return TicketView;
});