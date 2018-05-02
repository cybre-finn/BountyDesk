/**
 * @desc		Handles the Comment-Endpoint
 */
define([
    "app"
], function(app){

    var CommentModel = Backbone.Model.extend({
        
        initialize: function(){
            
        },
       
        defaults: {
            
        },
        urlRoot: '/comments'
    });
    
    return CommentModel;
});