import net from 'net';

Meteor.publish('update', function() {
  if (this.userId) {
    var self = this;
    var port = Meteor.users.findOne(this.userId).profile.scaleport;
    var host = Meteor.users.findOne(this.userId).profile.scalehost;
    self.added("scale", "weight", {weight: 0});
    if (port = 9999) {
      self.changed("scale", "weight", {weight: 500});

    } else if (port != null) {
      var socket = new net.Socket();
      socket.connect(port, host, function() {
        function writeSocket() {
          if (socket.writable){
            socket.write('P');
          };
        };
        setInterval(writeSocket, 250);
      });
      socket.on('data', function (data) {
        var rawOutput = data.toString();
        var output = rawOutput.replace(/\D+/g, '');
        self.changed("scale", "weight", {weight: output});
      });
      socket.on('error', function (error) {
        console.log(error);
      });
      socket.on('close', function() {
        console.log("Socket closed");
      });
    }
  }
});