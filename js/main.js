'use strict';

var map;
var markers = [];
var photos = [];
var infowindow;
// error handling by alert user
function mapsApi() {
    alert("google maps couldn't be load you should  reload");

}

// my favourate place data
var myLatLng = [
{
    title: 'Masjid al-Haram',
    location: {lat: 21.4228714, lng: 39.8257347},
    url: 'https://en.wikipedia.org/wiki/Masjid_Al_Haram',

    info: 'called the Grand Mosque,[4] is the largest mosque in the ' +
    "world and surrounds Islam's holiest place, the Kaaba, in the city" +
    'of Mecca, Saudi Arabia. Muslims face in the Qibla (direction of the' +
    'Kaaba) while performing Salat (obligatory daily prayers)',

    id: 'abc',
    photos: []
},
{
    title: 'Makkah Hilton Towers',
    location: {lat: 21.419778, lng: 39.82346},

    url: 'http://www3.hilton.com/en/hotels/saudi-arabia/makkah-hilton-hotel' +
    '-MAKHITW/index.html?WT.mc_id=zELWAKN0EMEA1HI2DMH3LocalSearch4DGGenericx6MAKHITW',

    info: 'Makkah Hilton Hotel is located in the center of Makkah and is ' +
    'just meters away from Holy Haram and Kaaba. Guests can choose between' +
    ' 614 rooms and suites',

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

    info: 'are two small hills now located in the Masjid al-Haram in Mecca' +
    ', Saudi Arabia between which Muslims travel back and forth seven times' +
    ' during the ritual pilgrimages of Hajj and Umrah.',

    id: 'jkl',
    photos: []
},
{
    title: 'Makkah Al Mukarramah Library',
    location: {lat: 21.4249648, lng: 39.8298972},
    url: 'http://wikimapia.org/7578409/Makkah-Al-Mukarramah-Library',

    info: 'It is widely accepted that the library (built in 1951) sits on' +
    ' the site where Prophet Muhammad (peace and blessings of Allah be ' +
    'upon him) was born',

    id: 'mno',
    photos: []
},
{
    title: 'Makkah Clock Royal Tower',
    location: {lat: 21.4180198, lng: 39.8259035},
    url: 'https://en.wikipedia.org/wiki/MAKKAH_CLOCK_ROYAL_TOWER',
    info: 'The Towers of the House is a government-owned megatall complex of' +
    ' seven skyscraper hotels in Mecca, Saudi Arabia. These towers are a par' +
    't of the King Abdulaziz Endowment Project that strives to modernize the' +
    ' city in catering to its pilgrims. The central hotel tower, the Makkah ' +
    'Royal Clock Tower, A Fairmont Hotel, has the world largest clock face a' +
    'nd is the third tallest building and fourth tallest freestanding struct' +
    'ure in the world. The building complex is metres away from the world la' +
    'rgest mosque and Islam most sacred site, the Masjid al-Haram.' ,

    id: 'pqr',
    photos: []
}];

// function to call api to get info
var flickrAjax = function(obj) {
        $.ajax({
            url: 'https://api.flickr.com/services/rest/?method=flickr' +
            '.photos.search&format=json&nojsoncallback=1&api_key=fd67c48b64b182c1ed623' +
            'bbb91df830c&per_page=3&extras=url_s&text=' + obj.title,
            dataType: 'json',
            async: true
        }).done(function(data) {
            var index = myLatLng.indexOf(obj);
            data.photos.photo.forEach(function(obj) {
               myLatLng[index].photos.push(obj.url_s);
            });
        }).fail(function() {
            alert('error loading photos');
        });
};

// iritate places to get info from api by calling flickrAjax function
for (var i = 0; i < myLatLng.length; i++) {
    flickrAjax(myLatLng[i]);
}

// making marker bounce with timeout
function bounce(marker) {

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
           marker.setAnimation(null);
        },1000);
    }

}


// google map api init function for loading map and its data

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng[0].location,
      zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();

    // irritate  over all places to make marker for each place
    for (var i = 0; i < myLatLng.length; i++) {
        var marker = new google.maps.Marker({
                position: myLatLng[i].location,
                map: map,
                animation: google.maps.Animation.DROP,
                title: myLatLng[i].title
            });

        // add listener to make the marker bounce when click
        // add listener on click to pup up information about the place

        marker.addListener('click', function() {
            var that = this;
            bounce(that);
            map.panTo(that.position);
            var data = myLatLng[myLatLng.findIndex(function(obj) {
                return obj.title == that.title;
            })];
            if (data.photos == []) {
                flickrAjax(data);
            }
            infowindow.setContent('<div class="infowindow"><h4>' + that.title +
            '</h4>' + '<div class="infotext"><p>' + data.info +
            '</p> <img src="' + data.photos[0] + '" class="infophoto" ></div>' +
            '<hr><a href="' + data.url + '">URL for more info</a></div>');

            infowindow.open(map, that);
            infowindow.addListener('closeclick', function() {
                this.close();
                that.setAnimation(null);
            });
        });

        // saveing marker in globle varible to call inside the modelview
        markers.push(marker);
    } // end loop

} //end initMap

// handel the project with knock
// create the viewModal function

function viewModal() {
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
            var marker = markers[i];
            if (marker.title != item.title) {
                marker.setMap(null);
            }
            else {
                marker.setMap(map);
                map.panTo(marker.position);
                bounce(marker);

                infowindow.setContent('<div class="infowindow"><h4>' + item.title +
                '</h4>' + '<div class="infotext"><p>' + item.info +
                '</p> <img src="' + item.photos[0] + '" class="infophoto" ></div>' +
                '<hr><a href="' + item.url + '">URL for more info</a></div>');

                infowindow.open(map, marker);
            }
        }
    };

    that.filter = function(x, y) {
        // save the filtered in keword when user type
        var keyword = that.input();
        // useing filter from undersore lib to make array of object that have the keword
        var filtered = _.filter(myLatLng, function(obj) {
            if (obj.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return obj;
            }
        });

        // now filtering markers that match the keword
        var markersFilterd = _.filter(markers, function(obj) {
            if (obj.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return obj;
            }
        });

        // close info window when filter applied
        infowindow.close();

        // removing all marker
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        // set markers that match the keword on the map
        markersFilterd.forEach(function(marker) {
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.DROP);

        });
        // apply the filter on the view list
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
        photos = data.photos;
        that.place_photo(data.photos[0]);
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
}

// activating the binding
ko.applyBindings(new viewModal());
