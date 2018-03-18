
var map;
var map_id;
function map(){
  // get cookies for lat and lng
  //document.cookie is an array of strings
  var x = document.cookie.split(';');
  console.log(x);
    var lat = x[0].split('=');
    var lng = x[1].split('=');

    map = new google.maps.Map(map_id, {
        center: { lat: parseFloat(lat[1]), lng: parseFloat(lng[1]) },
        zoom: 15
      });
      var center = new google.maps.Marker({
        position: { lat: parseFloat(lat[1]), lng: parseFloat(lng[1]) },
        map: map,
        title: 'Your actual position'
      });
}
$(document).ready(function(){
map_id = document.getElementById('map');
map();
});
