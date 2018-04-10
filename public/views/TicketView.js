define([
    "app",

    "text!templates/Ticket.html",
    "models/TicketModel",
    "collections/UserCollection",

    "bootstrap_select",
    "showdown",
    "parsley"
], function (app, TicketViewTpl, TicketModel, UserCollection, bootstrap_select, showdown) {

    var TicketView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.UserCollection = new UserCollection({});
            this.TicketModel = new TicketModel({ id: this.options.ticket_id });
            var self = this;
            //TODO: Clean up this spagetti
            this.TicketModel.fetch({
                success: function () {
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
            });

        },

        events: {
            "click #status-btn": "onChStatus",
            "click #bounty-btn": "onChBounty",
            "click #assign-btn": "onAssign"
        },

        render: function () {
            var converter = new showdown.Converter();
            this.template = _.template(TicketViewTpl);
            console.log(this.TicketModel.toJSON());
            this.$el.html(this.template({
                status: this.TicketModel.toJSON().status,
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON(),
                content: converter.makeHtml(this.TicketModel.toJSON().content)
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
                        console.log("error");
                    }
                });
            }

        },
        onChBounty: function (e) {
            e.preventDefault();
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
                    console.log("error");
                }
            });

        },
        onAssign: function (e) {
            e.preventDefault();
            //TODO this is to blown up and not IE8 compatible - a simple for in maybe?
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
                    console.log("error");
                }
            });

        }
    });

    return TicketView;
});