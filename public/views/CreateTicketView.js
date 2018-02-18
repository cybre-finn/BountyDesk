define([
    "app",

    "text!templates/CreateTicket.html",

    "parsley"
], function(app, CreateTicketViewTpl){

    var CreateTicketView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
        },

        events: {
        },

        render:function () {
            this.template = _.template(CreateTicketViewTpl);

            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        }

    });

    return CreateTicketView;
});