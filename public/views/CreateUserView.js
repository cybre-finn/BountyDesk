define([
    "app",

    "text!templates/CreateUser.html",

    "collections/UserCollection",

    "parsley"
], function (app, CreateUserViewTpl, UserCollection) {

    var CreateUserView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.UserCollection = new UserCollection({});
            this.render();
        },

        events: {
            "click #CreateUser-btn": "onCreateUser"
        },

        render: function () {
            this.template = _.template(CreateUserViewTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            console.log("yeah");
            return this;
            
        },

        onCreateUser: function (e) {
            e.preventDefault();
            this.UserCollection.create({
                name: this.$("#CreateUser-name").val(),
                email: this.$("#CreateUser-email").val(),
                real_name: this.$("#CreateUser-real_name").val(),
                password: this.$("#CreateUser-password").val()
            });
            Backbone.history.navigate('#', true);
        }

    });

    return CreateUserView;
});