import net from 'net';

Meteor.publish('update', function(port, host) {
  check(arguments, [Match.Any]);
  if (this.userId) {
    var self = this;
    var weight = 0;
    self.added("scale", "weight", {weight: weight});
    if (port != null) {
      var socket = new net.Socket();
      socket.connect(port, host, function() {
        function writeSocket() {
          socket.write('P');
        };
        setInterval(writeSocket, 300);
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