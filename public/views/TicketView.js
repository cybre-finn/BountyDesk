define([
    "app",

    "text!templates/Ticket.html",
    "models/TicketModel",
    "collections/CommentCollection",
    "collections/UserCollection",

    "bootstrap_select",
    "showdown"
], function (app, TicketViewTpl, TicketModel, CommentCollection, UserCollection, bootstrap_select, showdown) {

    var TicketView = Backbone.View.extend({

        initialize: function (options) {
            this.options=options;
            this.UserCollection = new UserCollection({});
            this.TicketModel = new TicketModel({ id: this.options.ticket_id });
            this.CommentCollection = new CommentCollection();
            var self = this;
            this.TicketModel.fetch({
                success: function () { successUserCollection(); }
            });
            function successTicketModel() {
                if (app.session.get("logged_in")) {
                    self.UserCollection.fetch({
                        success: function () {
                            self.render();
                        }
                    });
                }
                else {
                    self.render();
                }
            }
            function successUserCollection() {
                self.CommentCollection.fetch({
                    data: $.param({ ticket_id: self.options.ticket_id}),
                    success: function () {
                        successTicketModel();
                    }
                });
            }
        },

        events: {
            "submit #status-form": "onChStatus",
            "submit #bounty-form": "onChBounty",
            "submit #assign-form": "onAssign",
            "submit #comment-form": "onCrComment"
        },

        render: function () {
            this.CommentCollection.sort();
            var converter = new showdown.Converter();
            this.template = _.template(TicketViewTpl);
            this.$el.html(this.template({
                status: this.TicketModel.toJSON().status,
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON(),
                content: converter.makeHtml(this.TicketModel.toJSON().content),
                timeAgo: app.timeAgo,
            }));
            $('select').selectpicker();
            if (this.TicketModel.toJSON().assigned) for (assigned in this.TicketModel.toJSON().assigned) {
                var userid = this.TicketModel.toJSON().assigned[assigned]._id;
                $("option[value=" + userid + "]").prop('selected', true);
            }
            return this;
        },

        onChStatus: function (e) {
            e.preventDefault();
            if (e.target.checkValidity() === true) {
                var status = this.$('input[name=status-options]:checked', '#status-form').val();
                if (status == "delete") {
                    this.TicketModel.destroy({
                        success: function (model, response) {
                            Backbone.history.navigate('/', true);
                        },
                        error: function (model, response) {
                            console.log("error");
                        }
                    });
                }
                else {
                    var self = this;
                    this.TicketModel.set({
                        status: Number(status)
                    });
                    this.TicketModel.save(null, {
                        success: function (model, response) {
                            self.render();
                        },
                        error: function (model, response) {
                            app.showAlert(response.status, "alert-danger");
                        }
                    });
                }
            } else e.target.classList.add('was-validated');
        },

        onChBounty: function (e) {
            e.preventDefault();
            if (e.target.checkValidity() === true) {
                var bounty = this.$('input[name=bounty-options]:checked', '#bounty-form').val();
                this.TicketModel.set({
                    bounty: Number(bounty)
                });
                var self = this;
                this.TicketModel.save(null, {
                    success: function (model, response) {
                        self.render();
                    },
                    error: function (model, response) {
                        app.showAlert(response.status, "alert-danger");
                    }
                });
            } else e.target.classList.add('was-validated');

        },
        onAssign: function (e) {
            e.preventDefault();
            //TODO this is to blown up and not IE8 compatible - a simple for in maybe?
            if (e.target.checkValidity() === true) {
                var self = this;
                var assigned_users = $('#assign-select').val().reduce(function (result, item, index) {
                    var key = "_id"
                    var value = item;
                    var obj = {};
                    obj[key] = value;
                    obj["name"] = _.findWhere(self.UserCollection.toJSON(), { _id: value }).name;
                    result.push(obj);
                    return result;
                }, []);
                this.TicketModel.set({
                    status: 2,
                    assigned: assigned_users
                });
                this.TicketModel.save(null, {
                    success: function (model, response) {
                        self.render();
                    },
                    error: function (model, response) {
                        app.showAlert(response.status, "alert-danger");
                    }
                });
            } else e.target.classList.add('was-validated');
        },
        onCrComment: function (e) {
            e.preventDefault();
            if (e.target.checkValidity() === true) {
                var self = this;
                this.CommentCollection.create({
                    content: this.$("#comment-content").val(),
                    ticket_id: this.options.ticket_id
                }, {
                        success: function (model, response) {
                            self.render();
                        }, error: function (model, response) {
                            app.showAlert(response.status, "alert-danger");
                        }
                    }
                );
            } else e.target.classList.add('was-validated');
        },

    });

    return TicketView;
});