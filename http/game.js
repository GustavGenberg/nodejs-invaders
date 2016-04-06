
var config = [];
config.socket_protocol = 'http';
config.socket_host = 'localhost';
config.socket_port = 7777;

function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onload = callback;
	head.appendChild(script);
}

loadScript('http://code.jquery.com/jquery-2.2.2.min.js', function () {
  loadScript(config.socket_protocol + '://' + config.socket_host + ':' + config.socket_port + '/socket.io/socket.io.js', function () {
    init();
  });
});

var init = function () {



};
