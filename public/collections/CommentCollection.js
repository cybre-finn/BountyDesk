define([
    "app",
    "models/CommentModel"
], function (app, CommentModel) {
    var CommentCollection = Backbone.Collection.extend({

        initialize: function () {
            
        },
        model: CommentModel,
        "url": function () {
            return app.API + '/comments';
        },
        comparator: function (a, b) {
            return -a.get('created').localeCompare(b.get('created'));;
        }
    });

    return CommentCollection;

});