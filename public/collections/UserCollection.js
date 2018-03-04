define([
    "app",
    "models/UserModel"
], function (app, UserModel) {
    var UserCollection = Backbone.Collection.extend({

        initialize: function () {
            _.bindAll(this);
        },
        model: UserModel,
        "url": function () {
            return app.API + '/users';
        }
    });

    return UserCollection;

});