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
var hostserver = 'http://cq.net16.net/netcab/';


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
            showLoader();
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
    if (userEmail == '')
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
        openCity('btn_bk', 'get-a-cab');
        getLocation();
    }

}

function authentication(fieldID) {
    showLoader();
    var VARstring = '';
    var fieldVal = '';
    var allok = true;
    var phoneVal = '';
    userEmail = getCookie("email");
    userEmail = window.localStorage.getItem("email");

    if (userEmail != '' && userEmail != null)
        VARstring = "&email=" + userEmail + '&';

    if (fieldID == 'auth-email') {
        if (!validEmail('email'))
            allok = false;
        VARstring = "email=" + $('#email').val();

    } else if (fieldID == 'auth-code') {
        if (!validText('code'))
            allok = false;
        VARstring += "code=" + $('#code').val();
    } else if (fieldID == 'auth-login') {
        if (!validText('pwd'))
            allok = false;
        VARstring += "pwd=" + $('#pwd').val();
    } else if (fieldID == 'auth-reset') {
        if (getCookie("email") != '')
            fieldVal = getCookie("email");
        else if (window.localStorage.getItem("email") != '')
            fieldVal = getCookie("email");
        VARstring += "resetpw=" + 'reset';
        if (fieldVal == '')
            allok = false;
    } else if (fieldID == 'auth-signup') {
        if (!validTelno('phone'))
            allok = false;
        phoneVal = $("#phone").val().replace(/&/g, "#") + "\n";
        if (!validText('username'))
            allok = false;
        VARstring += "username=" + $('#username').val() + "&phone=" + phoneVal;
    }

    if (allok) {
        $.ajax({
            type: "POST",
            url: hostserver + 'api/authentication.php',
            data: VARstring,
            success: function (r)
            {
                var response = r;
                var userData = response.split("_");
                var success = userData[0];
                var valData = userData[1];
                var usrname = userData[2];

                if (success == 'y')
                {

                    if (fieldID == 'auth-email') {
                        setCookie('email', valData, 365);
                        window.localStorage.setItem("email", valData);
                        openCity('', 'auth-signup');
                    } else if (fieldID == 'auth-code') {
                        openCity('', 'auth-login');
                    } else if (fieldID == 'auth-signup') {
                        setCookie('username', valData, 365);
                        window.localStorage.setItem("username", valData);
                        openCity('', 'auth-code');
                    } else if (fieldID == 'auth-reset') {
                        openCity('', 'code');
                    } else if (fieldID == 'auth-login') {
                        setCookie('status', valData, 365);
                        window.localStorage.setItem("status", valData);
                        setCookie('username', usrname, 365);
                        window.localStorage.setItem("username", usrname);
                        //openCity('btn_bk', 'get-a-cab');
                        location.reload();
                    }
                } else if (success == 's') {
                    if (fieldID == 'auth-email') {
                        setCookie('email', valData, 365);
                        window.localStorage.setItem("email", valData);
                        openCity('', 'auth-login');
                    }
                } else {
                    var msg = "There is a problem with your login details! Please try again";
                    var title = "Authentication Error!";
                    displayModal(title, msg);
                    openCity('', fieldID);
                }

            },
            dataType: "HTML"
        });

    }
    showPage();
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
    showLoader();
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
    var VARstring = '';

    VARstring += "&from=" + $("#from").val();
    VARstring += "&destination=" + $("#destination").val();
    VARstring += "&distance=" + $("#distance").val();

    $.ajax({
        type: "POST",
        url: hostserver + 'api/quotes.php',
        data: VARstring,
        dataType: "HTML",
        success: function (r)
        {

            document.getElementById("cab-prices").innerHTML = r;

            openCity('btn_pr', 'cab-prices');


        },
        error: function (r, textStatus, errorThrown) {

            var msg = "Ooops we can't get any cabs at the moment.!";
            var title = "No cabs available!";
            displayModal(title, msg);
        }


    });
    showPage();
    $("#btn_route").prop("disabled", false);
}
var myVar = '';

//######################################################################################################################
//process booking
var check_resp = '';
var respID ='';
function booking(cabID)
{
    $("#" + cabID).prop("disabled", true);
    showLoader();
    var allOK = true;
    var booked = '';
    
    gcmkey = getCookie("registrationId");
    if (gcmkey == '' || gcmkey == null) gcmkey = window.localStorage.getItem("registrationId");
    if (gcmkey == '' || gcmkey == null) app.initialize();
    
    if (allOK)
    {
        var VARstring = 'cabID=' + cabID;
        VARstring += "&username=" + userName;
        VARstring += "&userEmail=" + userEmail;
        VARstring += "&gcmkey=" + gcmkey;

        // route details
        VARstring += "&from=" + $("#from").val();
        VARstring += "&destination=" + $("#destination").val();
        VARstring += "&distance=" + $("#distance").val();
        VARstring += "&pdate=" + $("#pdate").val();
        VARstring += "&ptime=" + $("#ptime").val();

        // send booking 
        $.ajax({
            type: "POST",
            url: hostserver + 'api/booking.php',
            data: VARstring,
            success: function (r)
            {
                var response = r;
                var userData = response.split("_");
                var success = userData[0];
                respID = userData[1];
                var cabname = userData[2];
                //var i;
                if (success == 'y') {
                    var out = '<div onclick="readMsg(this.id)" class="card" id="' + respID + '">';
                    out += '<div class="card-header">';
                    out += ' <div data-avatar-id="1" class="row"><i class="fa fa-cab" style="font-size:20px;color:orange"></i>';
                    out += '<span style="margin-left:20px;"> ' + cabname + ' cab booked </span>&nbsp;';
                    out += '<span style="margin-left:20px;" id="resp' + respID + '"><span class="glyphicon glyphicon-chevron-down" id="chv' + respID + '"></span>';
                    out += '&nbsp; <span id="stat_icon" ><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px; color:orange;"></i></span> </div>';
                    out += '<div id="msg' + respID + '" class="card-content" style="display: none;"><div class="card-content-inner">';
                    out += '<table class="table table-striped"><tr><td class="rhs">From: </td><td>' + $("#from").val() + '</td></tr>';
                    out += '<tr><td class="rhs">To: </td><td>' + $("#destination").val() + '</td></tr>';
                    out += '<tr><td class="rhs">Pickup Date: </td><td>' + $("#pdate").val() +' Time: ' + $("#ptime").val() + '</td></tr>';
                    out += '</div></div></div>';

                    //run every 20 sec
                    var startTime = new Date().getTime();
                    check_resp = setInterval(function () {
                        if (new Date().getTime() - startTime > 100000) {
                            clearInterval(check_resp);
                            checkMSG(respID, false);
                            return;
                        }
                        checkMSG(respID, true);
                    }, 20000);

                } else {
                    var msg = "There seem to be a problem with you booking please try another cab or try in a few minutes!";
                    var title = "Error booking!";
                    displayModal(title, msg);
                }

                document.getElementById("boxMsg").innerHTML += out;
                openCity('btn_co', 'cab-confirmation');

            },
            dataType: "HTML"
        });

    }
    $("#" + cabID).prop("disabled", false);
    showPage();
    move();

}

var counter = 1;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkMSG(respID, running) {
    var VARstring = "bookID=" + respID;
    if (counter === 3) VARstring += "&status=n";
    VARstring += "&userEmail=" + userEmail;
    if (!running)
    {
        //inbox(respID, "n");
        VARstring += "&status=n";
        VARstring += "&userEmail=" + userEmail;
    } 
        $.ajax({
            type: "POST",
            url: hostserver + 'api/response.php',
            data: VARstring,
            success: function (r)
            {
                var response = r;
                inbox(respID, response);
                //setTimeout("clearInterval(myVar)", 30000);    
            },
            dataType: "html"
        });
counter++;
}

function inbox(respID, response)
{
    var lbl = '';
    if (response != 'p')
    {
        if (response == 'c') {
            lbl = 'Confirmed';
            $("#stat_icon").html(' <i class="material-icons" style="font-size:20px;color:green">sentiment_very_satisfied</i>');
        } else if (response == 'd') {
            lbl = 'Declined';
            $("#stat_icon").html(' <i class="material-icons" style="font-size:20px;color:red">sentiment_dissatisfied</i>');
        } else if (response == 'n') {
            lbl = 'No Response';
            $("#stat_icon").html(' <i class="material-icons" style="font-size:20px;color:orange">sentiment_dissatisfied</i>');
        }
        clearInterval(check_resp);
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

function move() {
    $("#myBar").show();
    var elem = document.getElementById("myBar");
    var width = 100;
    var id = setInterval(frame, 1000);
    function frame() {
        if (width == 0) {
            clearInterval(id);
            checkMSG(respID, false);
            inbox(respID, 'n');
        } else {
            width--;
            elem.style.width = width + '%';
            document.getElementById("label").innerHTML = width * 1 + 'sec';
        }
    }
}