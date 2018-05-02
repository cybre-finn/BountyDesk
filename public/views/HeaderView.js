define([
    "app",
    "text!templates/header.html",
    "bootstrap",
    "fontawesome"
], function(app, HeaderTpl){

    var HeaderView = Backbone.View.extend({

        template: _.template(HeaderTpl),

        initialize: function () {
            _.bindAll(this, 'onLoginStatusChange')

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.onLoginStatusChange);
        },
        
        events: {
            "click #logout-link"         : "onLogoutClick",
            "submit #search-form"         : "onSearch"
        },
      
        onLoginStatusChange: function(e){
            this.render();
            if(!app.session.get("logged_in")) {
                app.showAlert("Logout: See ya!", "alert-success");
                Backbone.history.navigate("/authentification", true);
            }
        },

        onLogoutClick: function(e) {
            e.preventDefault();
            app.session.logout({});  // No callbacks needed b/c of session event listening
        },

        onSearch: function(e) {
            e.preventDefault();
            Backbone.history.navigate("/TicketQuery?search="+this.$("#search-query").val(), {trigger: true, replace: true});
        },

        render: function () {
            if(DEBUG) console.log("RENDER::", app.session.user.toJSON(), app.session.toJSON());
            this.$el.html(this.template({ 
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON() 
            }));
            return this;
        },

    });

    return HeaderView;
});
