'use strict';

function parseQuote(response) {
	$('.chatbox').append('<div class="userBallon2">'+ response.quoteText + '<p>' + response.quoteAuthor + '</p>' + '</div>' + "<p></p>");
}

function renderQuote (quote) {
	console.log(quote);
	$('.chatbox').append('<div class="userBallon">'+ quote.content + '</div> ');
}


$(function () {


	$.ajax({
		method: "GET",
		url: '/messages',
		success: function (msgs) {
			msgs.forEach(function (msg) {
				renderQuote(msg);
			});
		}
	});

	$(".userMsg").keyup(function(event){
		let chatDiv = document.getElementsByClassName('chatBox')[0];
		chatDiv.scrollTop = chatDiv.scrollHeight;
    if(event.keyCode == 13){
        $("#send").click();
			}
		});

	$('#send').click(function() {

		let chatDiv = document.getElementsByClassName('chatBox')[0];
		chatDiv.scrollTop = chatDiv.scrollHeight;

		let newMsg = $('.userMsg').val();
		$('.chatbox').append('<div class="userBallon">' + newMsg + '</div>');
		$('.userMsg').val('');

		$.ajax({
			method: 'POST',
			url: '/userMsgs',
			data: JSON.stringify({
				user: 'user1',
				content: newMsg,
				timestamp: Date.now()
			}),
			success: function (data) {
				renderQuote(data);
			},
			dataType: 'json',
			contentType: 'application/json'
		});

		$.ajax({
			method: "GET",
			url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=parseQuote&lang=en",
			dataType: "jsonp",
			success: function (data) {

			}
		})

		$.ajax({
			method: 'POST',
			url: '/quoteMsgs',
			data: response.quoteText + response.quoteAuthor,
			success: function (data) {
				renderQuote(data);
			},
			dataType: 'json'
		});


	});

	$('#delete').click(function() {
		$.ajax({
			method: 'POST',
			url: '/deleteMsgs',
			data: '',
			success: function (data) {
			},
			dataType: 'json'
		});
	});
});
