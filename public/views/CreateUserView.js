define([
    "app",

    "text!templates/CreateUser.html",

    "collections/UserCollection"
], function (app, CreateUserViewTpl, UserCollection) {

    var CreateUserView = Backbone.View.extend({

        initialize: function () {
            this.UserCollection = new UserCollection({});
            var self = this;
            this.UserCollection.fetch({
                success: function () {
                    self.render();
                }
            });
        },

        events: {
            "submit #CreateUser-form": "onCreateUser"
        },

        render: function () {
            this.template = _.template(CreateUserViewTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;

        },

        onCreateUser: function (e) {
            e.preventDefault();
            self=this;
            if (e.target.checkValidity() === true) {
                this.UserCollection.create({
                    name: this.$("#CreateUser-name").val(),
                    email: this.$("#CreateUser-email").val(),
                    real_name: this.$("#CreateUser-real_name").val(),
                    password: this.$("#CreateUser-password").val(),
                    rep: this.$("#CreateUser-rep").val()
                }, {
                        success: function (model, response) {
                            app.showAlert("User created", "alert-success");
                            self.render();
                        },
                        error: function (model, response) {
                            app.showAlert(response.status, "alert-danger");
                        }
                    });
            } else {
                e.target.classList.add('was-validated');
            }
        }

    });

    return CreateUserView;
});