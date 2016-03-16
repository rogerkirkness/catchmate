// Node.JS module for gathering scale data
var net = Meteor.npmRequire('net');

// Publication of scale data
Meteor.publish('update', function(port, host) {
  check(arguments, [Match.Any]);
  if (this.userId) {
    var self = this;
    var weight = 0;
    self.added("scale", "weight", {weight: weight});
    var handleInterval = Meteor.setInterval(function() {

      // Test algorithm output success with 0.5kg dummy weight
      if (port == 99999) {
        var data = 500;
        self.changed("scale", "weight", {weight: data});

      // Gather information from Serial -> TCP/IP device
      } else if (port == 1001) {
        var socket = net.createConnection(port, host, function () {
          socket.on('data', function (data) {
            var rData = data.toString('utf8');
            var sData = rData.substring(rData.indexOf(":"),rData.indexOf("G"));
            var output = sData.replace(/\D+/g, '');
            self.changed("scale", "weight", {weight: output});
            socket.destroy();
          });
        });

      // Gather information from TCP/IP Matrix scale
      } else if (port != null) {
        var socket = net.createConnection(port, host, function () {
          socket.write('P');
          socket.on('data', function (data) {
            var rawOutput = data.toString();
            var output = rawOutput.replace(/\D+/g, '');
            self.changed("scale", "weight", {weight: output});
            socket.destroy();
          });
        });

      // No connection, display 1kg dummy weight
      } else {
        var data = 1000;
        self.changed("scale", "weight", {weight: data});
      }
    },500);
    self.ready();
    self.onStop(function(){
      handleInterval && Meteor.clearInterval(handleInterval);
    });
  }
});