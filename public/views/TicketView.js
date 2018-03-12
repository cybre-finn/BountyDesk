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
            "click #classify-btn": "onClassifyTicket"
        },

        render: function () {
            this.template = _.template(TicketViewTpl);
            console.log(this.TicketModel.toJSON());
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        },

        onClassifyTicket: function (e) {
            e.preventDefault();
            if (this.$('input[name=classify-options]:checked', '#classify-form').val() == 5) {
                this.TicketModel.set({
                    status: 5,
                });
            }
            else {
                this.TicketModel.set({
                    status: 1,
                    bounty: $('input[name=classify-options]:checked', '#classify-form').val()
                });
            }
            this.TicketModel.save(null, {
                success: function (model, response) {
                    Backbone.history.navigate('#', true);
                },
                error: function (model, response) {
                    console.log("error");
                }
            });
        }

    });

    return TicketView;
});