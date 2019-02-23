/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
    "app"
], function(app){

    var UserModel = Backbone.Model.extend({

        initialize: function(){
            
        },

        defaults: {
            name: '',
            email: '',
            password: '',
            rep: 0
        },
        idAttribute: 'name'

    });
    
    return UserModel;
});

