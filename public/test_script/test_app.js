/* $("#start").click(function(){
  $.get("http://localhost:8080/sessions",function(data,status){
    alert("Data: " + data + "\nStatus: " + status);
  });
}); */

$('#start').click(function(){
  $.ajax({
  	type: 'GET', 
  	url: 'http://localhost:8080/sessions',
  	data: { username: 'rujia', password: 'asdfjkll' }
  })
  	.done(function(msg) {
  		alert( 'Data saved: ' + msg );
  	});
});