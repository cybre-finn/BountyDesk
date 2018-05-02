define([
    "app",

    "text!templates/login-page.html"
], function (app, LoginPageTpl) {

    var LoginView = Backbone.View.extend({

        initialize: function () {
            

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.render);
        },

        events: {
            'submit #login-form': 'onLoginAttempt'
        },

        onLoginAttempt: function (e) {
            e.preventDefault();
            if (e.target.checkValidity() === true) {
                app.session.login({
                    username: this.$("#login-username-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                        success: function (mod, res) {
                            if (DEBUG) console.log("SUCCESS", mod, res);

                        },
                        error: function (err) {
                            if (DEBUG) console.log("ERROR", err);
                            app.showAlert(err, 'alert-danger');
                        }
                    });
            } else {
                e.target.classList.add('was-validated');
            }
        },

        render: function () {
            if (app.session.get('logged_in')) Backbone.history.navigate("/", { trigger: true, replace: true });
            else Backbone.history.navigate("/authentification", true);
            this.template = _.template(LoginPageTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
        }

    });

    return LoginView;
});

