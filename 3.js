var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var port = process.argv[2];
app.listen(port);

function handler (req, res) {
	fs.readFile(__dirname + '/3.html',
		function (err, data) {
			res.writeHead(200);
			res.end(data);
		});
}



io.on('connection', function (socket) {
	setInterval(function () {
		var d = new Date();
		var n = d.getTime();
		socket.volatile.emit('date', { date: d , milliseconds: n});
	}, 500);
});