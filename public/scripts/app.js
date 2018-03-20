
function get_current_location() {

  if (navigator.geolocation) {
    getposition = function getposition(position) {
      $('input[name="lat"]').val(position.coords.latitude);
      $('input[name="lng"]').val(position.coords.longitude);
    };

    navigator.geolocation.getCurrentPosition(getposition);
  } else {
    alert('GEO LOCATION NOT SUPPORTED');
  }
}

$(document).ready(function(){
  get_current_location();
$("#btn_signup").on('click',function(){

  var data=$('#signup form').serialize();
  $.ajax({
    url:'/signup',
        method:'post',
      data:data,
    success:function(){window.location.href='/home'},
    error:function(json){
      $('.modal').modal('hide');
      console.log(json);
      $('#error').text(json.responseJSON.message.message);
    }
  });
});
$("#btn_login").on('click',function(){

  var data=$('#login form').serialize();
  $.ajax({
    url:'/login',
        method:'post',
      data:data,
    success:function(){window.location.href='/home'},
    error:function(json){
      $('.modal').modal('hide');
      console.log(json);
      $('#error').text('wrong email and password');
    }
  });
});
});
