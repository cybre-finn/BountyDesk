define([
    "app",

    "text!templates/CreateTicket.html",

    "collections/TicketCollection",
    "collections/RoomCollection"
], function (app, CreateTicketViewTpl, TicketCollection, RoomCollection) {

    var CreateTicketView = Backbone.View.extend({

        initialize: function () {
            
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
            }
            else {
                e.target.classList.add('was-validated');
            }
        }

    });

    return CreateTicketView;
});