console.log('script.js says "I\'m here"');


$(function(){

	$('.panel.panel-chat > .panel-body').hide();
	$('.panel.panel-chat > .panel-footer').hide();

	$(".panel.panel-chat > .panel-heading > .chatMinimize").click(function(){
		
		if($(this).parent().parent().hasClass('mini'))
		{
			$(this).parent().parent().removeClass('mini').addClass('normal');

			$('.panel.panel-chat > .panel-body').animate({height: "250px"}, 500).show();

			$('.panel.panel-chat > .panel-footer').animate({height: "75px"}, 500).show();
		}
		else
		{
			$(this).parent().parent().removeClass('normal').addClass('mini');

			$('.panel.panel-chat > .panel-body').animate({height: "0"}, 500);

			$('.panel.panel-chat > .panel-footer').animate({height: "0"}, 500);

			setTimeout(function() {
				$('.panel.panel-chat > .panel-body').hide();
				$('.panel.panel-chat > .panel-footer').hide();
			}, 500);


		}

	});
	$(".panel.panel-chat > .panel-heading > .chatClose").click(function(){
		$(this).parent().parent().remove();
	});
})


/* Function for sockets */
$(function () {
	var socket = io();
	$('.panel-footer').submit(function () {
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});
	socket.on('chat message', function (msg) {
		$('#messages').append($('<li>').text(msg));
	});
});
