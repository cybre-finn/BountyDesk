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

        },
        urlRoot: '/tickets'
    });
    
    return TicketModel;
});

