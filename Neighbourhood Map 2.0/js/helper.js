//When the markers array is the length of the interests array do this
function createNewArray(){

if(interests.length == markerArr.length){

//console.log(markerArr)

for(var i=0; i<interests.length;i++){
    newInterests[i] = {location: interests[i].location, marker: markerArr[i]}

}

//Bind with new array. After all the callbacks have been executed.
ko.applyBindings(new ViewModel())
//console.log(newInterests)
}
}




//Nav bar
  /*
   * Open the drawer when the menu icon is clicked.
   */
  var menu = document.querySelector('#menu');
  var main = document.querySelector('#main');
  var list = document.querySelector('#listSect');

  menu.addEventListener('click', function(e) {
    list.classList.toggle('open');
    e.stopPropagation();
  });


//Wiki query function
function wikiQuery(query){
    var compiled = ""
    var $wikiElem = $('#wiki-articles');


    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+ query+'&format=json&callback=wikicallback';

    //Deal with failed requests
    var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text ('Failed to get a response from wikipedia');

},5000)

//Wiki API request
$.ajax({
    url: wikiurl,
    dataType: 'jsonp',


    success: function(data){
        //console.log(data)
        // Handle queries that do not return a search result
        if(data[1][0] == undefined){
          compiled = "There does not appear to be a Wikipedia article for this."
          $wikiElem.text("");
          $wikiElem.append(compiled);

        }
        else{
          for (var i = 0; i < 1; i++) {
           title = data[1][i] ;
           extract = data[2][i];
           link = data[3][i];
           compiled = compiled + "<div class = 'results_fo'><a href='" + link + "'target='_blank'><h1>" + title + "</h1><p>" + extract + "</p></a></div>"
           //Clear Old text
           $wikiElem.text("");
           $wikiElem.append(compiled);
        }

       }

        clearTimeout(wikiRequestTimeout)
    }



})

}


//Initializing Google Maps

var map;
var infoWindow
var bounds

function initializeMap(){

//Append map to the map div
map = new google.maps.Map(document.getElementById('mapDiv'));

bounds = new google.maps.LatLngBounds();




/*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {
    // Save location data from the search result object to local variables
    //console.log(placeData)
    var lat = placeData.geometry.location.lat();
    var lon = placeData.geometry.location.lng();
    var address = placeData.formatted_address;
    var name = placeData.name; // name of the place from the place service
    //console.log(address)

    //Save the info as a marker
    var marker = new google.maps.Marker({
        map: map,
        position: placeData.geometry.location,
        title: name,
        address: address
    });



    // Push markers into new array to be used in creation of new array containing places and markers
    markerArr.push(marker)
        // Resize map
   // map.fitBounds(bounds);
    //Center map
   // map.setCenter(bounds.getCenter());

    // Create a new array containing location and markers for Knockout model to be created from.
    // Last thing in callback
    createNewArray()

    };

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);

    }
  }

   function placesArr(locations){
    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var i = 0; i < locations.length; i++) {
    (function(i) {
        var request = {
        query: locations[i].location
     };
        service.textSearch(request, callback);
    })(i)

}
     // locations.forEach(function(place){
      // the search request object
     // var request = {
     //   query: place.location
     // };
      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
     // service.textSearch(request, callback);
    //});
   }
placesArr(interests);

}