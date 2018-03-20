var map;
var service;
var infowindow;
var markers=[];
var open=false;
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
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
      });
      var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Your actual position'
      });

      var request = {
    location: center,
    radius: '40000',
    types: ['restaurant','lodging']
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request,add_markers);
  function add_markers(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      var image = {
        url: place.icon,
        // This marker is 20 pixels wide by 32 pixels high.
        scaledSize: new google.maps.Size(40, 40),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 0)
      };
      console.log(place);
      markers[i] = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        icon: image,
        title: place.name,
        id: place.id,
        content: `<div>${place.name} <br> ${place.photos[0].html_attributions[0]}</div>`



      });
    markers.forEach(function(mk,i){

      google.maps.event.addListener(mk, 'click', function(){
        if(open){
          infowindow.close();
          open=false;
        }
        infowindow = new google.maps.InfoWindow({
   content: mk.content
 });

        infowindow.open(map,mk);
        open=true;
        $('input[name="lat"]').val(mk.position.lat());
        $('input[name="lng"]').val(mk.position.lng());
        $('input[name="place_id"]').val(mk.id);
        $('input[name="place_name"]').val(mk.title);
        var geocoder = new google.maps.Geocoder;
        var latlng={
          lat:  parseFloat($('input[name="lat"]').val()),
            lng: parseFloat($('input[name="lng"]').val())
        }
        console.log(latlng);
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            console.log(results);
          var street = results[1].address_components[0].long_name;
          var city = results[1].address_components[2].long_name;
          var state= results[1].address_components[4].long_name;
          var zip_code=results[1].address_components[7].long_name;
          $('input[name="street"]').val(street);
          $('input[name="city"]').val(city);
          $('input[name="state"]').val(state);
      $('input[name="zip_code"]').val(zip_code);
          }

        });
      });
    })


  }
  }


}
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
alert(err.responseJSON.message);      }
    })
  });
  $('#add_post').on('submit',function(e){
    e.preventDefault();

    $.ajax({
      url:'/trip/post',
      method:'post',
      data:new FormData(this),
      contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false,
      success:function(){
        console.log('okay');
        window.location.href='/home'
      },
      error:function(err){
        console.log(err);
        alert(err.responseJSON.message);
      }
    });

});
$('#end_trip').on('submit',function(e){
  e.preventDefault();

  $.ajax({
    url:'/trip',
    method:'put',
    data:new FormData(this),
    contentType: false,       // The content type used when sending data to the server.
    cache: false,             // To unable request pages to be cached
    processData:false,
    success:function(){
      console.log('okay');
      window.location.href='/home'
    },
    error:function(err){
      console.log(err)
      alert(err.responseJSON.message.message);
    }
  });

});
});
