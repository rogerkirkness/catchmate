// Serve barcodes to local client devices
var http = Meteor.npmRequire('http');
var bwipjs = Meteor.npmRequire('bwip-js');

http.createServer(function(req, res) {
    if (req.url.indexOf('/?bcid=') != 0) {
        res.writeHead(404, { 'Content-Type':'text/plain' });
        res.end('BWIP-JS: Unknown request format.', 'utf8');
    } else {
        bwipjs(req, res);
    }
}).listen(8082);