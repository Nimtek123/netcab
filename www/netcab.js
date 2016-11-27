// JavaScript Document
var lotude = '';
var latude = '';
var Address = '';
var geocoder = '';
var infowindow;
var marker;
var source, destination, via;
var directionsDisplay;
var directionsService;

var userName = '';
var userID = '';
var userEmail = '';
var status = '';
var map;
var infoWindow;
var hostserver = 'http://localhost/netcab/www/';
hostserver = 'http://cq.net16.net/netcab/';


//$2y$10$QnAbpjDfflUYr001HTkSFOwvb.hxflhTISRZVNZSYKSOLsx66ErkO

$(document).ready(function ()
{
    $(".via, #resetPass, #loginForm, #googleMap, #btnFavorites, [id^='page_'], [id^='msg']").hide();
    $("#page_route").show();
    $(':text').val('');
    $("#distance, #duration").prop('disabled', true);

    $('[data-toggle="tooltip"]').tooltip();

    $("#viaShow").click(function ()
    {
        $(".via").toggle();
    });
    checkCookie();


    $("#viaShow").click(function ()
    {
        $('#cq_Via').val('');
        $("#viaArea").text('');
        if ($("#viaShow").prop('checked')) {
        } else
        {
            if ($("#from").val() != '' && $("#destination").val() != '')
            {
                $("#cq_distance").val('Calculating...');
                setTimeout(function () {
                    calcRoute();
                }, 2000);
            }
        }
    });

    //calc route
    $("#from, #destination").change(function ()
    {
        var txtID = $(this).prop('id');
        if ($("#from").val() != '') {
            $("#destination").prop('disabled', false);
        }
        if ($("#from").val() != '' && $("#destination").val() != '')
        {
            $("#distance").val('Calculating...');
            setTimeout(function () {
                calcRoute();
            }, 2000);
        } else
        {
            $("#distance").val('');
        }
    });


    $(".popover").on('show', function ()
    {
        dateApp.close();
        dateApp.alert();
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    status = getCookie("status");
    userName = getCookie("username");
    userID = getCookie("userID");
    userEmail = getCookie("email");
    if (userName == '')
    {
        userName = window.localStorage.getItem("username");
        userID = window.localStorage.getItem("userID");
        userEmail = window.localStorage.getItem("email");
        status = window.localStorage.getItem('status');
    }
    $("#lbl_username").html(userName);

    if (status != 'logged') {
        $("#auth-email").css("display", "block");
        openCity('', 'auth-email');
        showPage();
    } else {
        $("#cab_booking").css("display", "block");
        $(".navbar").show();
        openCity('', 'get-a-cab');
        getLocation();
    }

}

function authentication(fieldID) {

    var VARstring = '';
    var fieldVal = $("#" + fieldID).val();
    var allok = true;
    var phoneVal = '';

    if (fieldID == 'auth-email') {
        if (!validEmail('email'))
            allok = false;
        VARstring = "email=" + fieldVal;

    } else if (fieldID == 'auth-code') {
        if (!validNum('code'))
            allok = false;
        VARstring = "code=" + fieldVal;
    } else if (fieldID == 'auth-login') {
        if (!validText('pwd'))
            allok = false;
        VARstring = "pwd=" + fieldVal;
    } else if (fieldID == 'auth-reset') {
        if (getCookie("email") != '')
            fieldVal = getCookie("email");
        else if (window.localStorage.getItem("email") != '')
            fieldVal = getCookie("email");
        VARstring = "resetpw=" + fieldVal;
        if (fieldVal == '')
            allok = false;
    } else if (fieldID == 'auth-signup') {
        if (!validTelno('phone'))
            allok = false;
        phoneVal = $("#phone").val().replace(/&/g, "#") + "\n";
        if (validText('username'))
            allok = false;
        VARstring = "username=" + fieldVal + "&phone=" + phoneVal;
    }
    if (userEmail != '')
        VARstring = "&email=" + userEmail;

    if (allok) {
        /*$.ajax({
         type: "POST",
         url: hostserver+'api/authentication.php',
         data: VARstring,
         success: function (r)
         {
         var response = r;
         var userData = response.split("_");
         var success = userData[1];
         
         $("#WaitingGif").hide();*/
        var success = 'y';
        if (success == 'y')
        {
            var valData = 'nimrod';//userData[2];

            if (fieldID == 'auth-email') {
                setCookie('email', valData, 365);
                window.localStorage.setItem("email", valData);
                openCity('', 'auth-login');
            } else if (fieldID == 'auth-code') {
                openCity('', 'auth-login');
            } else if (fieldID == 'auth-signup') {
                setCookie('username', valData, 365);
                window.localStorage.setItem("username", valData);
                openCity('', 'auth-code');
            } else if (fieldID == 'auth-reset') {
                openCity('', 'code');
            } else if (fieldID == 'auth-login') {
                setCookie('status', 'logged', 365);
                window.localStorage.setItem("status", 'logged');
                openCity('btn_bk', 'get-a-cab');
            }
        } else {
            if (fieldID == 'auth-email') {
                setCookie('email', valData, 365);
                window.localStorage.setItem("email", valData);
                openCity('', 'auth-signup');
            } else
                openCity('', fieldID);
        }
        /*
         },
         dataType: "JSON"
         });
         $("#WaitingGif").hide();*/
    }

}

function Logout()
{
    $("#WaitingGif").show();
    navigator.app.exitApp();

    setCookie('status', 'logout', 365);
    window.localStorage.setItem("status", 'logout');
    location.reload();

    $("#WaitingGif").hide();

}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

// Try HTML5 geolocation
function getLocation()
{
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -28.1810881, lng: 15.6463597},
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow({map: map});
    directionsService = new google.maps.DirectionsService();

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function (position)
        {
            lotude = position.coords.longitude;
            latude = position.coords.latitude;
            var latlng = new google.maps.LatLng(latude, lotude);

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your current location.');
            map.setCenter(pos);

            //codeLatLng(latude, lotude);
            geocoder.geocode({'latLng': latlng}, function (results, status)
            {

                if (status == google.maps.GeocoderStatus.OK)
                {
                    if (results[1])
                    {
                        $("#from").val(results[0].formatted_address);
                        $("#destination").prop('disabled', false);
                    } else
                        alert('No results found');
                    //if ($("#cq_From").val() != '' && $("#cq_To").val() != '') calcRoute();
                } else
                    alert('Geocoder failed due to: ' + status);
            });

        }, function () {
            handleNoGeolocation(true);
        });

    } else
    {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('from')),
            {types: ['geocode']});
    autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('destination')),
            {types: ['geocode']});
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
    showPage();
}


function calcRoute()
{
    showLoader();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -28.1810881, lng: 15.6463597},
        zoom: 15
    });
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var waypts = [];

    //*********DIRECTIONS AND ROUTE**********************//
    source = document.getElementById("from").value;
    destination = document.getElementById("destination").value;

    var request = {
        origin: source,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];

            $("#distance").val();
            for (var i = 0; i < route.legs.length; i++)
            {
                var routeSegment = i + 1;
                $("#distance").val(route.legs[i].distance.text);
                $("#duration").val(route.legs[i].duration.text);
            }
        }
    });
    showPage();
}

function validateRoute()
{
    $("#btn_route").prop("disabled", true);
    showLoader();
    var allok = true;

    // Route

    if (!validText('from'))
        allok = false;
    if (!validText('destination'))
        allok = false;

    //dates and time
    /*if (!validText('pdate'))
     allok = false;
     if (!validText('ptime'))
     allok = false;*/

    if (allok)
    {
        setTimeout(get_quotes, 3000);

    } else
    {
        var msg = "Please scroll up the page and fill in any missing or incorrect information that you see highlighted in red!";
        var title = "Missing Info";
        showPage();
        displayModal(title, msg);
        $("#btn_route").prop("disabled", false);
    }

}

var destination;
var route_from;
var distance;

function get_quotes()
{
    var VARstring = "username=" + userName;
    VARstring += "&userID=" + userID;
    VARstring += "&userEmail=" + userEmail;

    // route details
    route_from = $("#from").val();
    destination = $("#destination").val();
    distance = $("#distance").val();

    VARstring += "&from=" + route_from;
    VARstring += "&destination=" + destination;
    VARstring += "&distance=" + distance;
    //VARstring += "&pdate=" + $("#pdate").val();
    //VARstring += "&ptime=" + $("#ptime").val();

    $.ajax({
        type: "POST",
        url: hostserver + 'api/quotes.php',
        data: VARstring,
        success: function (r)
        {
            var arr = JSON.parse(r);
            var i;

            var out = '<table class="table table-striped"><tbody><tr><th>Cab</th><th>$</th><th>Book</th><th>No. Cabs</th></tr>';

            for (i = 0; i < arr.length; i++)
            {
                if (arr[i].success == 'y') {
                    out += '<tr><td>' + arr[i].cabName + '</td><td>' + arr[i].price + '</td>';
                    out += '</td><td><input type="button" onclick="booking(this.id)" id ="' + arr[i].id + '" value="Book Cab" class="btn btn-success"></td></tr>';
                } else {
                    out += '<tr><td>No Cabs</td><td>Available</td>';
                    out += '</td><td>retry!</td></tr>';
                }
            }
            out += '</tbody></table>';
            document.getElementById("cab-prices").innerHTML = out;
            openCity('btn_pr', 'cab-prices');
        },
        dataType: "JSON"
    });
    showPage();
    $("#btn_route").prop("disabled", false);
}
var myVar = '';

//######################################################################################################################
//process booking
var interval = '';
function booking(cabID)
{
    $("#" + cabID).prop("disabled", true);
    showLoader();
    var allOK = true;
    var booked = '';

    if (allOK)
    {
        var VARstring = 'cabID=' + cabID;
        VARstring += '&userEmail=' + userEmail;
        VARstring += "&from=" + route_from;
        VARstring += "&destination=" + destination;
        VARstring += "&distance=" + distance;
        
        // send booking 
        $.ajax({
            type: "POST",
            url: hostserver + 'api/booking.php',
            data: VARstring,
            success: function (r)
            {
                var arr = JSON.parse(r);
                var i;
                for (i = 0; i < arr.length; i++)
                {
                    if (arr[i].success == 'y') {
                        var out = '<div onclick="readMsg(this.id)" class="card" id="' + arr[i].bookID + '">';
                        out += '<div class="card-header">';
                        out += ' <div data-avatar-id="1" class="row"><i class="fa fa-cab" style="font-size:48px;color:orange"></i>';
                        out += '<span style="margin-left:10px;">' + arr[i].cabName + ' cab booked </span>&nbsp;';
                        out += '<span class="ks-date" id="resp' + arr[i].bookID + '">&nbsp;';
                        out += '<span class="glyphicon glyphicon-chevron-down" id="chv' + arr[i].bookID + '"></span>&nbsp; <span id="stat_icon" ><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px; color:orange;"></i></span> </div>';
                        out += '<div id="msg' + arr[i].bookID + '" class="card-content" style="display: none;"><div class="card-content-inner">';
                        out += '<table class="table table-striped"><tr><td class="rhs">From: </td><td>' + arr[i].routeF + '</td></tr>';
                        out += '<tr><td class="rhs">To: </td><td>' + arr[i].routeT + '</td></tr>';
                        out += '<tr><td class="rhs">Pickup Date & Time: </td><td>' + arr[i].pdate + '</td></tr>';
                        out += '<p class="rhs"><span class="glyphicon glyphicon-chevron-up"></span></p></div></div></div>';

                        var booked = arr[i].success;
                        var respID = arr[i].bookID;
                    }
                }

                document.getElementById("boxMsg").innerHTML += out;

                if (booked == 'y')
                {
                    //run every 10 sec
                    var startTime = new Date().getTime();
                    interval = setInterval(function () {
                        if (new Date().getTime() - startTime > 180000) {
                            clearInterval(interval);
                            checkMSG(respID, false);
                            return;
                        }
                        checkMSG(respID, true);
                    }, 20000);

                    openCity('btn_co', 'cab-confirmation');

                } else {
                    var msg = "There seem to be a problem with you booking please try another cab or try in a few minutes!";
                    var title = "Error booking!";
                    displayModal(title, msg);
                }
            },
            dataType: "JSON"
        });


    }
    $("#" + cabID).prop("disabled", false);
    showPage();
    move();
 
}

function move() {
  var elem = document.getElementById("myBar");   
  var width = 100;
  var id = setInterval(frame, 1000);
  function frame() {
    if (width == 0) {
      clearInterval(id);
      $("#stat_icon").html('material-icons<i class="material-icons" style="font-size:48px;color:orange">sentiment_neutral</i>');
    } else {
      width--; 
      elem.style.width = width + '%'; 
      document.getElementById("label").innerHTML = width * 1  + 'sec';
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkMSG(respID, running) {
    var GETstring = "bookID=" + respID;
    if (!running)
    {
        inbox(respID, "n");
    } else
    {
        $.ajax({
            type: "POST",
            url: hostserver+'api/response.php',
            data: GETstring,
            success: function (r)
            {
                var response = r;
                inbox(respID, response);
                //setTimeout("clearInterval(myVar)", 30000);    
            },
            dataType: "html"
        });
    }

}

function inbox(respID, response)
{
    var lbl = '';
    if (response != 'p')
    {

        if (response == 'c') {
            lbl = 'Confirmed';
            $("#stat_icon").html('material-icons<i class="material-icons" style="font-size:48px;color:green">sentiment_very_satisfied</i>');
        }
        else if (response == 'd') {
            lbl = 'Declined';
            $("#stat_icon").html('material-icons<i class="material-icons" style="font-size:48px;color:orange">sentiment_neutral</i>');
        }
        else if (response == 'n'){
            lbl = 'No Response';
            $("#stat_icon").html('material-icons<i class="material-icons" style="font-size:48px;color:red">sentiment_dissatisfied</i>');
        }

        clearInterval(interval);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
function readMsg(divID)
{
    $('#msg' + divID).slideToggle();
    $('#chv' + divID).toggleClass('glyphicon-chevron-down');
    var newMsg = $("#inboxCounter").text();
    if (newMsg == '')
        newMsg = '';
    else
        newMsg = parseInt(newMsg) - 1;
    if (newMsg == 0)
        newMsg = '';
    $("#inboxCounter").text(newMsg);
    $("#" + divID).removeClass("bg-primary");
}