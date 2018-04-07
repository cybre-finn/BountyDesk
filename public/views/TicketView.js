define([
    "app",

    "text!templates/Ticket.html",
    "models/TicketModel",
    "collections/UserCollection",

    "bootstrap_select",
    "parsley"
], function (app, TicketViewTpl, TicketModel, UserCollection, bootstrap_select) {

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
                }
            });

        },

        events: {
            "click #classify-btn": "onClassifyTicket",
            "click #assign-btn": "onAssignTicket"
        },

        render: function () {
            this.template = _.template(TicketViewTpl);
            console.log(this.TicketModel.toJSON());
            this.$el.html(this.template({
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON()
            }));
            $('select').selectpicker();
            $('a').click(function (e) {
                e.preventDefault();
                //return false;
            });
            return this;
        },

        onClassifyTicket: function (e) {
            e.preventDefault();
            if (this.$('input[name=classify-options]:checked', '#classify-form').val() == 5) {
                this.TicketModel.set({
                    status: 5,
                });
            }
            else {
                this.TicketModel.set({
                    status: 1,
                    bounty: $('input[name=classify-options]:checked', '#classify-form').val()
                });
            }
            this.TicketModel.save(null, {
                success: function (model, response) {
                    Backbone.history.navigate('#', true);
                },
                error: function (model, response) {
                    console.log("error");
                }
            });
        },
        onAssignTicket: function (e) {
            e.preventDefault();
            //TODO this is to blown up and not IE8 compatible - a simple for in maybe?
            self=this;
            var assigned_users=$('#assign-select').val().reduce(function (result, item, index) {
                var key = "_id"
                var value = item;
                var obj = {};
                obj[key] = value;
                obj["name"] = _.findWhere(self.UserCollection.toJSON(), {_id: value}).name;
                result.push(obj);
                return result;
            }, []);
            this.TicketModel.set({
                status: 2,
                assigned: assigned_users
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
            
        }
    });

    return TicketView;
});