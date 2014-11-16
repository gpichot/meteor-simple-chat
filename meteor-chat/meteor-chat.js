Messages = new Mongo.Collection('messages');

if (Meteor.isClient) {
    Template.body.helpers({
        'users': function() {
            return Meteor.users.find();
        },
        'messages': function() {
            return Messages.find({}, {sort: {createdAt: -1}});
        },
    });
    Template.body.events({
        "submit .new-message": function (event) {
            if(Meteor.userId() == null) {
                alert('Only authenticated users can send messages');
                return false;
            }
            var text = event.target.text.value;

            var user = Meteor.user();
            if(user.services.google) {
                var username = user.services.google.name;
            } else {
                var username = user.services.github.username;
            }
            Messages.insert({
                text: text,
                createdAt: new Date(),
                author: username,
            });

            event.target.text.value = "";

            return false;
        }
    });
    Template.user.helpers({
        'status': function() {
            console.log(this);
            if(this.status && this.status.idle)
                return "busy";
            else if(this.status && this.status.online)
                return "active";
            else
                return "disconnected";
        },
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
