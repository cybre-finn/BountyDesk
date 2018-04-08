/**
 * @desc        backbone router for pushState page routing
 */

define([
    "app",

    "models/SessionModel",
    "models/UserModel",
    "models/TicketModel",

    "collections/TicketCollection",

    "views/HeaderView",
    "views/MainPageView",
    "views/TicketView",
    "views/LoginPageView",
    "views/CreateTicketView",
    "views/CreateUserView",
    "views/RoomsView",
    "views/MyTicketsView"
], function(app, SessionModel, UserModel, TicketModel, 
    TicketCollection,
    HeaderView, MainPageView, TicketView, LoginPageView, 
    CreateTicketView, CreateUserView,
    RoomsView, MyTicketsView){

    var WebRouter = Backbone.Router.extend({

        initialize: function(){
            _.bindAll(this);
        },

        routes: {
            "" : "main",
            "authentification" : "login",
            "ticket/:viewid" : "ViewTicket",
            "CreateTicket" : "CreateTicket",
            "CreateUser" : "CreateUser",
            "AllRooms" : "Rooms",
            "MyTickets" : "MyTickets"
        },

        show: function(view, options){

            // Every page view in the router should need a header.
            // Instead of creating a base parent view, just assign the view to this
            // so we can create it if it doesn't yet exist
            if(!this.headerView){
                this.headerView = new HeaderView({});
                this.headerView.setElement($(".header")).render();
            }

            // Close and unbind any existing page view
            if(this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();

            // Establish the requested view into scope
            this.currentView = view;

            // Need to be authenticated before rendering view.
            // For cases like a user's settings page where we need to double check against the server.
            if (typeof options !== 'undefined' && options.requiresAuth){        
                var self = this;
                app.session.checkAuth({
                    success: function(res){
                        
                        // If auth successful, render inside the page wrapper
                        $('#content').html( self.currentView.render().$el);
                    }, error: function(res){
                        self.navigate("#authentification", { trigger: true, replace: true });
                    }
                });

            } else {
                // Render inside the page wrapper
                $('#content').html(this.currentView.render().$el);
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }

        },

        main: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new MainPageView({}), {requiresAuth: true});
        },

        login: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new LoginPageView({}));
        },
        ViewTicket: function(viewid) {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new TicketView({ticket_id: viewid}));
        },
        CreateTicket: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new CreateTicketView({}), {requiresAuth: false});
        },
        CreateUser: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new CreateUserView({}), {requiresAuth: true});
        },
        Rooms: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new RoomsView({}), {requiresAuth: true});
        },
        MyTickets: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(new MyTicketsView({}), {requiresAuth: true});
        }

    });

    return WebRouter;

});
