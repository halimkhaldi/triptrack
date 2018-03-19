// 
// $(document).ready(function() {
//   console.log("Let's get coding!");
//   $.ajax({
//         method: 'GET',
//         url: '/users/:id'
//         success: function(json) {
//           // console.log(`sent back ${json.metadata.count}`);
//           findFeature(json);
//           // console.log(json.features[0].properties.title)
//           // $("#info").html(json.metadata.count);
//         },
//         error: function() {
//           alert('There was an error getting profile');
//         }
//   });
//   var findFeature = function (json) {
//       console.log(json.metadata.count);
//     $(json.features).each(function (index, feature) {
//         var titles = feature.properties.title;
//         console.log(titles);
//         console.log(index);
//       $('#info').append(`<p>${titles}<p>`);
// 
//     });
//   };
// });