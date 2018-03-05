define([
    "app",

    "text!templates/main-page.html",
    "collections/TicketCollection",

    "parsley"
], function (app, MainPageTpl, TicketCollection) {

    var MainPageView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.TicketCollection = new TicketCollection({});
            this.TicketCollection.fetch();
            this.listenTo(this.TicketCollection, 'change add remove update', this.render);
        },

        events: {
            
        },

        render: function () {
            this.template = _.template(MainPageTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        },

    });

    return MainPageView;
});