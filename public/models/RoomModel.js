/**
 * @desc		Handles the Tickets-Endpoint
 */
define([
    "app"
], function(app){

    var RoomModel = Backbone.Model.extend({
        
        initialize: function(){
            
        },
       
        defaults: {
            
        },
        urlRoot: '/rooms',
        idAttribute: '_id'
    });
    
    return RoomModel;
});

