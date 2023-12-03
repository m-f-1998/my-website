<?php

header ( "Content-Type: application/json; charset=utf-8" );

if ( $_SERVER [ "REQUEST_METHOD" ] === "GET" ) {

  $api_update = date_create ( "03-12-2023 19:12" );

  echo json_encode ( array (
    "latest_version" => 1.2,
    "api_updated" => $api_update->getTimestamp ( )
  ) );

} else {

  http_response_code ( 422 );
  echo "Request Invalid";

}