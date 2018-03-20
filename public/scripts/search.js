var map;
var map_id;
var open=false;
var infowindow;
function initAutocomplete() {
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
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      console.log(place);
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        info:`${place.formatted_address}  <br>${place.photos[0].html_attributions[0]}`
      }));
      markers.forEach(function(mk){

        google.maps.event.addListener(mk, 'click', function(){
            console.log('clicked');
          if(open){
            infowindow.close();
            open=false;
          }
          infowindow = new google.maps.InfoWindow({
     content: mk.info
   });
   infowindow.open(map,mk);
   open=true;
 });
});

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });




}


        // Create the search box and link it to the UI element.


        $(document).ready(function(){
        map_id = document.getElementById('map');
        initAutocomplete();
        });
