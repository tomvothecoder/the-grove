var Email = require('keystone-email')

new Email('test-email.hbs', {
	transport: 'mailgun',

}).send({}, {
	
});
