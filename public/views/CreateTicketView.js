define([
    "app",

    "text!templates/CreateTicket.html",

    "collections/TicketCollection",
    "collections/RoomCollection"
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
            "submit #CreateTicket-form": "onCreateTicket"
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
            console.log(e);
            e.preventDefault();
            if (e.target.checkValidity() === true) {
                if (app.session.get("logged_in")) {
                    this.TicketCollection.create({
                        issuer: this.$("#CreateTicket-issuer").val(),
                        headline: this.$("#CreateTicket-headline").val(),
                        room: this.$("#CreateTicket-room").val(),
                        content: this.$("#CreateTicket-content").val()
                    }, {
                            success: function (model, response) {
                                if (!app.session.get("logged_in")) {
                                    app.showAlert("Ticket created. Keep track of your mailbox for updates from us.", "alert-success");
                                } else Backbone.history.navigate('/', true);
                            },
                            error: function (model, response) {
                                app.showAlert("HTTP error: " + response.status, "alert-danger");
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
            else {
                e.target.classList.add('was-validated');
            }
        }

    });

    return CreateTicketView;
});