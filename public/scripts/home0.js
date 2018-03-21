
var map;
var map_id;
function trips(){
$.ajax({
  url:'/trips/null',
  method:'get',
  success:function(ok){
    var trip=ok.trip;
    console.log(ok);
  var content=$('#content');
  content.append(`
    <div class="card">


        <div class="view overlay">
            <img src= ' ${trip.image_start[0]} ' class="img-fluid" alt="">
            <a href="#">
                <div class="mask rgba-white-slight"></div>
            </a>
        </div>


        <div class="card-body">

            <h4 class="card-title"> ${trip.name}</h4>

            <p class="card-text"> ${trip.description}</p>

        </div>


    </div>
    `);
    ok.posts.forEach(function(post){
      content.append(`
        <div class="card">


            <div class="view overlay">
                <img src= ' ${post.images[0]} ' class="img-fluid" alt="">
                <a href="#">
                    <div class="mask rgba-white-slight"></div>
                </a>
            </div>


            <div class="card-body">

                <h4 class="card-title"> ${post.title}</h4>

                <p class="card-text"> ${post.description}</p>

            </div>


        </div>
        `);
    });

  },
  error:function(err){
    console.log(err)
  }
});
}
$(document).ready(function(){
trips();
});
