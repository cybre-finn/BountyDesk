/**
 * @desc		Handles the Tickets-Endpoint
 */
define([
    "app"
], function(app){

    var TicketModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);
        },

        defaults: {

        }

    });
    
    return TicketModel;
});

