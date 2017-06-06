'use strict';

var map;
var markers = [];
var photos = [];

function mapsApi(){
    alert("google maps couldn't be load you should  reload")

}

// my favourate place data 

var myLatLng = [
{
    title: 'Masjid al-Haram',
    location: {lat: 21.4228714, lng: 39.8257347},
    url: 'https://en.wikipedia.org/wiki/Masjid_Al_Haram',
    info: 'no avaliable data',
    id: 'abc',
    photos: []
},
{
    title: 'Makkah Hilton Towers',
    location: {lat: 21.419778, lng: 39.82346},
    url: 'no avaliable data',
    info: 'no avaliable data',
    id: 'def',
    photos: []


},
{
    title: 'Kaaba',
    location: {lat: 21.422524, lng: 39.826182},
    url: 'https://en.wikipedia.org/wiki/Kaaba',
    info: 'The Kaaba Al Kaaba Al Musharrafah (The Holy Kaaba), is a ' +
    "building at the center of Islam's most sacred mosque, Al-Masjid " +
    'al-Haram, in Mecca, al-Hejaz, Saudi Arabia.',
    id: 'ghi',
    photos: []

},
{
    title: 'Safa and Marwa',
    location: {lat: 21.423526, lng: 39.827374},
    url: 'https://en.wikipedia.org/wiki/Safa_and_Marwah',
    info: 'no avaliable data',
    id: 'jkl',
    photos: []
},
{
    title: 'Makkah Al Mukarramah Library',
    location: {lat: 21.4249648, lng: 39.8298972},
    url: 'no avaliable data',
    info: 'no avaliable data',
    id: 'mno',
    photos: []
},
{
    title: 'Makkah Clock Royal Tower',
    location: {lat: 21.4180198, lng: 39.8259035},
    url: 'https://en.wikipedia.org/wiki/MAKKAH_CLOCK_ROYAL_TOWER',
    info: 'no avaliable data',
    id: 'pqr',
    photos: []
}];

function flickrAjax(){
    for (var i = 0; i < myLatLng.length; i++) {
        $.ajax({
            url: 'https://api.flickr.com/services/rest/?method=flickr' +
            '.photos.search&format=json&nojsoncallback=1&api_key=fd67c48b64b182c1ed623' +
            'bbb91df830c&per_page=3&extras=url_s&text=' + myLatLng[i].title,
            dataType: 'json',
            async: false
        }).done(function(data){
            data.photos.photo.forEach(function(obj) {
               myLatLng[i].photos.push(obj.url_s);
            });
        }).fail(function() {
            alert( "error loading photos" );
        });
    }
}

// google map api init function for loading map and its data

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng[0].location,
      zoom: 15,
    });

    var infowindow = new google.maps.InfoWindow();

    // irritate  over all places to make marker for each place 
    for (var i = 0; i < myLatLng.length; i++) {
        var marker = new google.maps.Marker({
                position: myLatLng[i].location,
                map: map,
                animation: google.maps.Animation.DROP,
                title: myLatLng[i].title
            });

        // add listener to make the marker bounce when dbclick
        marker.addListener('dblclick', function() {

            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }

            });
        // add listener on click to pup up information about the place

        marker.addListener('click', function() {
            var that = this;
            var data = myLatLng[myLatLng.findIndex(function(obj) {
                return obj.title == that.title;
            })];
            infowindow.setContent('<h4>' + that.title + '</h4>' + '<p>' +
                data.info + '<hr>' + data.url + '</p> <img src="' +
                data.photos[0] + '" class="infophoto" >');

            infowindow.open(map, that);
        });
        // saveing marker in globle varible to call inside the modelview 
        markers.push(marker);
    }

}

// handel the project with knock 
// create the viewModal function

function viewModal () {
    var that = this;
    that.place_photo = ko.observable('');
    that.close_btn = ko.observable('none');
    that.display = ko.observable('');
    that.down = ko.observable('none');
    that.input = ko.observable('');
    that.list = ko.observable(myLatLng);

    that.showlist = function() {
        that.down('none');
        that.display('');
    };
    that.hidelist = function() {
        that.display('none');
        that.down('');
    };
    that.goto = function(item) {
        that.input(item.title);
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title != item.title) {
                markers[i].setMap(null);
            }
            else {
               markers[i].setMap(map);
               markers[i].setAnimation(google.maps.Animation.BOUNCE);
            }
        }
    };

    that.filter = function(x, y) {

       var keyword = that.input();
       var filtered = _.filter(myLatLng, function(obj) {
            if (obj.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return obj}
        });
       var markersFilterd = _.filter(markers, function(obj) {
            if (obj.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return obj}
            });

       markers.forEach(function(marker){marker.setMap(null)});
       markersFilterd.forEach(function(marker){
        marker.setMap(map);
        marker.setAnimation(google.maps.Animation.DROP);

       })

       that.list(filtered);
       that.showlist();
       if (y.keyCode === 13) {
        that.goto(filtered[0]);
        that.hidelist();
       }
       if (keyword == '') {
        markers.forEach(function(marker) {marker.setMap(map)});
       }
    };
    that.close = function() {
        that.close_btn('none');
    };
    that.gallery = function(data) {
        that.close_btn('');
        that.place_photo(data.photos[0])
        photos = data.photos;
    };

    that.next = function() {

        var i = 0;
        var y = photos.indexOf(that.place_photo());
        if (y > -1 && y < (photos.length - 1) && photos.length > 0) {
            i = y + 1;
            that.place_photo(photos[i]);
        }
        else if (photos.length > 0) {
            that.place_photo(photos[i]);
        }
    };
};

var activeModel = new viewModal();
// activating the binding 
ko.applyBindings(activeModel);
flickrAjax()