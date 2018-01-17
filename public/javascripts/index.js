$(function () {
  $(window).scrollTop( $("#top").offset().top );
  var socket = io();
  $('#chat').submit(function(){
  var chatRoomID = $('#chatRoomID').val();
  var now = new Date();
  // Cas in datum v JSON format

    var msg ={
    	user_g_id: $('#g_id').val(),
    	name: $('#name').val(),
    	msg_content: $('#m').val(),
    	date_time: now,
      chatRoomID: $('#chatRoomID').val()
    }
    socket.emit('chat message', msg);
    $('#m').val('');
    return false;
  });
  socket.on(chatRoomID.value, function(msg){
      $('#messages').append($('<li>').text(msg.name + " : " + msg.msg_content));
      $(window).scrollTop( $("#top").offset().top );
  });
});
