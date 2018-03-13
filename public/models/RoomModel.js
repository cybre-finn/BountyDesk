/**
 * @desc		Handles the Tickets-Endpoint
 */
define([
    "app"
], function(app){

    var RoomModel = Backbone.Model.extend({
        
        initialize: function(){
            _.bindAll(this);
        },
       
        defaults: {
            
        },
        urlRoot: '/rooms',
        idAttribute: '_id'
    });
    
    return RoomModel;
});

