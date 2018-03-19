

function get_current_location() {

  if (navigator.geolocation) {
    getposition = function getposition(position) {

      $('input[name="lat"]').val(position.coords.latitude);
      $('input[name="lng"]').val(position.coords.longitude);
    var  center = {
        lat : parseFloat(position.coords.latitude),
        lng : parseFloat(position.coords.longitude)
      };
      map(center);

    };

    navigator.geolocation.getCurrentPosition(getposition);
  } else {
    alert('GEO LOCATION NOT SUPPORTED');
  }
}
function map(center){
  var  map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
      });
      var center = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Your actual position'
      });
}
$(document).ready(function(){
  get_current_location();
  $('#trip').on('submit',function(e){
    e.preventDefault();
    $.ajax({
      url:'/trip',
      method:'post',
      data:new FormData(this),
      contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false,
      success:function(){
        window.location.href='/home'
      },
      error:function(err){
      console.log(err);
      }
    })
  })

});
