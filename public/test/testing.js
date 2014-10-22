asyncTest('logging in user', function() {
  $.ajax({
  	type: 'POST', 
  	url: 'http://localhost:8080/sessions',
    dataType: 'json',
  	data: { username: 'rujia', password: 'asdfjkll' },
    success : function(data) {
      console.log(data);
      ok(data.success);
      start();
    },
    failure : function (err) {
      console.log("Test failed with error : " + err);
    }
  });
});