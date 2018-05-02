/**
 * @desc		Handles the Tickets-Endpoint
 */
define([
    "app"
], function(app){

    var TicketModel = Backbone.Model.extend({

        initialize: function(){
            
        },

        defaults: {

        },
        urlRoot: '/tickets'
    });
    
    return TicketModel;
});

