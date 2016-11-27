<?php
// API access key from Google API's Console
define( 'API_ACCESS_KEY', 'AIzaSyDumtpP29w_x5kn386F4OqW_csenesx8-s' );
$registrationIds = array('e8rvgQRlqTo:APA91bE6YRh2916gN5CFJ609rqvXpJTfe_v3zboHJ-YSDkNXCt4DctbyBjqbX_oGqPCOjE4ZfaOTa6q7j801nq5Gp-2aau8onxj19cKIlC2Tsep0L06COMSegOgSNyY38sStxsIrjNMy');
// prep the bundle
$msg = array
(
	'message' 	=> 'here is a message. message',
	'title'		=> 'This is a title. title',
	'subtitle'	=> 'This is a subtitle. subtitle',
	'tickerText'	=> 'Ticker text here...Ticker text here...Ticker text here',
	'vibrate'	=> 1,
	'sound'		=> 1,
	'largeIcon'	=> 'large_icon',
	'smallIcon'	=> 'small_icon'
);
$fields = array
(
	'registration_ids' 	=> $registrationIds,
	'data'			=> $msg
);
 
$headers = array
(
	'Authorization: key=' . API_ACCESS_KEY,
	'Content-Type: application/json'
);
 
$ch = curl_init();
curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
curl_setopt( $ch,CURLOPT_POST, true );
curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
$result = curl_exec($ch );
curl_close( $ch );
echo $result;

?>