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
            if (app.session.get('logged_in') == true) {
                var self = this;
                this.TicketCollection.fetch({
                    success: function () {
                        self.render();
                    }
                });
            }
        },

        events: {

        },

        render: function () {
            this.template = _.template(MainPageTpl);
            this.$el.html(this.template({
                user: app.session.user.toJSON(),
                timeago: app.timeAgo.bind(app)
            }));
            return this;
        },

    });

    return MainPageView;
});