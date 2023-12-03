<?php

require __DIR__ . "/vendor/autoload.php";

if ( $_SERVER [ "REQUEST_METHOD" ] === "GET" ) {

  require_once __DIR__ . "/../../../private/ordo-1962/db-constants.php";

  db ( )->connect ( DB_HOST, DB_NAME, DB_USER, DB_PASSWORD );

  $res = array ( );
  foreach ( db ( )->select ( "Prayers", "language, category, title, body" )->all ( ) as $row ) {
    $res [ $row [ "language" ] ] [ $row [ "category" ] ] [ $row [ "title" ] ] = $row [ "body" ];
  }

  response ( )->json ( $res );

} else {

  response ( )->json ( "Request Invalid", 422 );

}