define([
    "app",

    "text!templates/Rooms.html",

    "collections/RoomCollection",

    "models/RoomModel",

    "parsley"
], function (app, RoomsViewTpl, RoomCollection, RoomModel) {

    var RoomsView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            this.RoomCollection = new RoomCollection({});
            var self = this;
            this.RoomCollection.fetch({
                success: function () {
                    self.render();
                }
            });
        },

        events: {
            "click #CreateRoom-btn": "onCreateRoom",
            "click #DeleteRoom-btn": "onDeleteRoom"
        },

        render: function () {
            this.template = _.template(RoomsViewTpl);
            this.$el.html(this.template({ user: app.session.user.toJSON() }));
            return this;
            
        },

        onCreateRoom: function (e) {
            e.preventDefault();
            var self = this;
            this.RoomCollection.create({
                room_number: this.$("#CreateRoom-room_number").val(),
                role: this.$("#CreateRoom-role").val(),
            }, {
            success: function(model, response) {
                self.render();
            }}
        );
        },
        onDeleteRoom: function (e) {
            var self = this;
            this.RoomCollection.where({room_number: this.$("#DeleteRoom-btn").val() })[0].destroy({
                success: function(model, response) {
                    self.render();
                }});
        }

    });

    return RoomsView;
});