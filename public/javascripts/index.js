$(function () {
    var socket = io();
    $('form').submit(function(){

    var now = new Date();
    // Cas in datum v JSON format
    var jsonDate = now.toJSON();
      var msg ={
      	user_g_id: $('#g_id').val(),
      	name: $('#name').val(),
      	msg_content: $('#m').val(),
      	date_time: jsonDate
      }
      socket.emit('chat message', msg);
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg.name + " : " + msg.msg_content));
    });
  });