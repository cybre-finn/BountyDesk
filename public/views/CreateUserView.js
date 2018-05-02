define([
    "app",

    "text!templates/CreateUser.html",

    "collections/UserCollection"
], function (app, CreateUserViewTpl, UserCollection) {

    var CreateUserView = Backbone.View.extend({

        initialize: function () {
            
            this.UserCollection = new UserCollection({});
            this.render();
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
            if (e.target.checkValidity() === true) {
                this.UserCollection.create({
                    name: this.$("#CreateUser-name").val(),
                    email: this.$("#CreateUser-email").val(),
                    real_name: this.$("#CreateUser-real_name").val(),
                    password: this.$("#CreateUser-password").val()
                }, {
                        success: function (model, response) {
                            app.showAlert("User created", "alert-success");
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