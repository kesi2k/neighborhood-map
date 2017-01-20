// Add markers to interest array and then perform KO bind
// functions callback, createMapMarker and PlacesArr were sampled/learned from Udacity's resume builder project
// Menu nav feature learned in Udacity's responsive web design project


// Array of places

var interests = [
                {location: 'Georgia Institute of Technology'},
                {location: 'Sivas Atlanta'},
                {location: 'Federal Reserve Bank of Atlanta'},
                {location: 'Atlanta Biltmore Hotel'},
                {location: 'Atlantic Station'},
                {location: 'Piedmont Park'},
                {location: 'Georgia Tech Square'},
                {location: 'Fox Theatre Atlanta'},
                {location: 'Georgia Aquarium'},
                {location: 'Peachtree Walk Condominums'}
                ]

var markerArr=[];

var vm;

var errvm;

var newInterests = [];

var wikiResults = [];

// Takes array of interests and creates a model from them

var ViewModel = function(){
  if (typeof google === 'undefined'){
    var self = this;
    this.errHandle = ko.observable('')
  } else{

    // Assign self to this. Makes passing things around clearer with a function in a function?
    var self = this;

    this.interestsArr = ko.observableArray([])
   // console.log(this.interestsArr())

    // User searches
    self.query = ko.observable('')

    // Take in each location and creates a binding K.O. binding model
    newInterests.forEach(function(aLocation){
        self.interestsArr.push(new locationModel(aLocation))
    })

    // One info window to RULE THEM ALL
    // infoWindows are the little helper windows that open when you click or hover over a pin on a map.
    var infoWindow = new google.maps.InfoWindow();

    // Take in the locationModels and mark their position on the map
    self.interestsArr().forEach(function (aLocation) {
      var name = aLocation.marker.title
      var address = aLocation.marker.address
      var lat = aLocation.marker.position.lat()
      var lng =aLocation.marker.position.lng()
      var marker = aLocation.marker

      marker.addListener('click', function() {
        wikiQuery(name)
        makeBounce()
    });

      function makeBounce(){
        for(var i=0;i<newInterests.length;i++){
          if(newInterests[i].marker.title != marker.title)
          newInterests[i].marker.setAnimation(null)
        }
        if (marker.getAnimation() == null){
          marker.setAnimation(google.maps.Animation.BOUNCE)
          infoWindow.setContent(name+'<br>'+address)
          infoWindow.open(map, marker);
        }
        else { marker.setAnimation(null)}
        }

      //console.log(newInterests)

           // Add pin to the map
          bounds.extend(new google.maps.LatLng(lat, lng));
          // Resize map
          map.fitBounds(bounds);
          //Center map
          map.setCenter(bounds.getCenter());
        })


    //Initialise current location to something from observable array
    this.currentLocation = ko.observable('')

    // When location is clicked set it to current location
    this.setCurrentLocation = function(locationClicked){
        self.currentLocation(locationClicked)
        query = locationClicked.locationName()

        //animate and open window here
        google.maps.event.trigger(locationClicked.marker, 'click');

        wikiQuery(query)

    }

    // Filtering array assistance obtained from
    //http://stackoverflow.com/questions/32343306/live-table-search-in-knockout-calling-function-on-keyup

    self.filteredPl = ko.computed(function(){
      var searches = self.query().toLowerCase()
      if (!searches) {
        self.interestsArr().forEach(function(item) {
        item.marker.setVisible(true);
      });
      return self.interestsArr();
      }
      else{
        return ko.utils.arrayFilter(self.interestsArr(), function(item){
        var locationName = item.locationName().toLowerCase()
        var marker = item.marker;
        var isInName = locationName.indexOf(searches) != -1; // true or false

        marker.setVisible(isInName); // true or false

        return isInName;
        })
        }
        })

    // Wikipedia VM section
    this.wikiTitle = ko.observable('')
    this.wikiArticle = ko.observable('')
    this.wikiLink = ko.observable('')

    // Error handling
    this.errHandle = ko.observable('')
  }
}


// Create location model from each of locations in interest data as well as visibility
// http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
var locationModel= function(info){
    this.locationName = ko.observable(info.location)
    this.marker = info.marker
}



