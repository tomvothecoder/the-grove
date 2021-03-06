// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var app = require('express')();
var keystone = require('keystone');
var handlebars = require('express-handlebars');

var http = require('http').Server(app);
var socketio = require('socket.io');



/* app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/views/products.hbs');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
}); */


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'The Grove',
	'brand': 'The Grove',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',


});

// Logo for login page
keystone.set('signin logo', '../images/logo.png');

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	store: 'products',
	posts: ['posts', 'post-categories'],
	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


keystone.set('cloudinary config', {
	cloud_name: 'dh7qhsimh',
	api_key: '831136695471268',
	api_secret: 'LqIe7zO0SuFSDfa5Il8sKpOzEZU'
});



if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------' +
		'\nWARNING: MISSING MAILGUN CREDENTIALS' +
		'\n----------------------------------------' +
		'\nYou have opted into email sending but have not provided' +
		'\nmailgun credentials. Attempts to send will fail.' +
		'\n\nCreate a mailgun account and add the credentials to the .env file to' +
		'\nset up your mailgun integration');
}


keystone.start({
	onHttpServerCreated: function () {
		keystone.set('io', socketio.listen(keystone.httpServer));
	},
	onStart: function () {
		var io = keystone.get('io');
		var session = keystone.expressSession;

		// Share session between express and socketio
		io.use(function (socket, next) {
			session(socket.handshake, {}, next);
		});

		// Socketio connection
		io.on('connect', function (socket) {
			console.log('--- User connected');

			// Set session variables in route controller
			// which is going to load the client side socketio
			// in this case, ./routes/index.js
			console.log(socket.handshake.session);
			socket.emit('msg', socket.handshake.session.message);

			socket.on('chat message', function (msg) {
				io.emit('chat message', msg);
				console.log('message: ' + msg);
			});

			socket.on('disconnect', function () {
				console.log('--- User disconnected');
			});
		});
	}

});
