define([
    "app",

    "text!templates/CreateTicket.html",

    "collections/TicketCollection",
    "collections/RoomCollection",

    "parsley"
], function (app, CreateTicketViewTpl, TicketCollection, RoomCollection) {

    var CreateTicketView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.TicketCollection = new TicketCollection({});
            this.RoomCollection = new RoomCollection({});
            var self = this;
            this.RoomCollection.fetch({
                success: function () {
                    self.render();
                }
            });
        },

        events: {
            "click #CreateTicket-btn": "onCreateTicket"
        },

        render: function () {
            this.template = _.template(CreateTicketViewTpl);
            this.$el.html(this.template({
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON()
            }));
            return this;
        },

        onCreateTicket: function (e) {

            e.preventDefault();
            if (app.session.get("logged_in")) {
                this.TicketCollection.create({
                    issuer: this.$("#CreateTicket-issuer").val(),
                    headline: this.$("#CreateTicket-headline").val(),
                    room: this.$("#CreateTicket-room").val(),
                    content: this.$("#CreateTicket-content").val()
                }, {
                        success: function (model, response) {
                            Backbone.history.navigate('#', true);
                        },
                        error: function (model, response) {
                            console.log("error");
                        }
                    });
            }
            else {
                this.TicketCollection.create({
                    issuer: this.$("#CreateTicket-issuer").val(),
                    headline: this.$("#CreateTicket-headline").val(),
                    room: this.$("#CreateTicket-room").val(),
                    content: this.$("#CreateTicket-content").val(),
                    contact_email: this.$("#CreateTicket-email").val()
                });
            }
        }

    });

    return CreateTicketView;
});