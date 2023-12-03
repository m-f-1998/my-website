<?php

require __DIR__ . "/vendor/autoload.php";

if ( $_SERVER [ "REQUEST_METHOD" ] === "GET" ) {

  require_once __DIR__ . "/../../../private/ordo-1962/db-constants.php";

  db ( )->connect ( DB_HOST, DB_NAME, DB_USER, DB_PASSWORD );

  $year = intval ( request ( )->get ( "year" ) );

  if ( $year ) {
    response ( )->json ( GetOrdo ( $year ) );
  } else {
    response ( )->json ( "Unprocessable Year", 422 );
  }

} else {

  response ( )->json ( "Request Invalid", 422 );

}

function GetOrdo ( $year ) {

  $res = array (
    "Jan" => [], "Feb" => [], "Mar" => [], "Apr" => [],
    "May" => [], "Jun" => [], "Jul" => [], "Aug" => [],
    "Sep" => [], "Oct" => [], "Nov" => [], "Dec" => []
  );

  $celebrations = db ( )
    ->select ( "Celebrations", "id, date, options, season, feast" )
    ->where ( "YEAR ( date )", "?" )
    ->bind ( $year )
    ->orderBy ( "date", "ASC" )
    ->all ( );

  $previousDay = NULL;

  foreach ( $celebrations as $celebration ) {

    $season = db ( )
      ->select ( "Season", "title, colors" )
      ->where ( "id", "?" )
      ->bind ( $celebration [ "season" ] )
      ->first ( );
    $feast = db ( )
      ->select ( "Feast", "title, `rank`, colors" )
      ->where ( "id", "?" )
      ->bind ( $celebration [ "feast" ] )
      ->first ( );
    $propers = db ( )
      ->select ( "Propers" )
      ->hidden ( "id", "date", "feast" )
      ->where ( "feast", "?" )
      ->where ( "date", "?" )
      ->bind ( $celebration [ "feast" ], $celebration [ "date" ] )
      ->all ( );

    $date = new DateTime ( $celebration [ "date" ] );
    $short_month = $date->format ( "M" );
    $formatted_date = $date->format ( "D d" );

    if ( ( $short_month == "Nov" || $short_month == "Dec" ) && str_contains ( $feast [ "title" ], "Epiphany" ) ) {
      $feast [ "title" ] = "(Resumed) " . $feast [ "title" ];
    }

    if ( $previousDay != $formatted_date ) {
      array_push ( $res [ $short_month ], array (
        "date" => $formatted_date,
        "celebrations" => array ( ),
        "season" => array (
          "title" => $season [ "title" ],
          "colors" => $season [ "colors" ]
        )
      ) );
      $previousDay = $formatted_date;
    }

    array_push ( $res [ $short_month ] [ count ( $res [ $short_month ] ) - 1 ] [ "celebrations" ],
      array (
        "rank" => $feast [ "rank" ],
        "title" => $feast [ "title" ],
        "colors" => $feast [ "colors" ],
        "options" => $celebration [ "options" ],
        "propers" => count ( $propers ) > 0 ? GetProperTexts  ( $propers [ 0 ] ) : array ( ),
        "commemorations" => GetCommemorations ( $celebration [ "id" ] )
      )
    );

  }

  return $res;
  
}

function GetCommemorations ( $celebration ) {

  $commemorations = db ( )
    ->select ( "Commemorations", "feast, collect, secret, postcommunion" )
    ->where ( "celebration", "?" )
    ->bind ( $celebration )
    ->all ( );

  $res = array ( );

  if ( count ( $commemorations ) > 0 ) {

    foreach ( $commemorations as $commemoration ) {

      $feast = db ( )
        ->select ( "Feast", "title, `rank`, colors" )
        ->where ( "id", "?" )
        ->bind ( $commemoration [ "feast" ] )
        ->first ( );

      array_push ( $res, array_merge (
        array (
          "title" => $feast [ "title" ],
          "rank" => $feast [ "rank" ],
          "colors" => $feast [ "colors" ]
        ),
        GetProperTexts ( $commemoration )
      ) );
    
    }

  }

  return $res;

}

function GetProperTexts ( $propers ) {

  $res = array ( );

  if ( $propers ) {

    $proper_texts = db ( )->query ( 'SELECT `category`, `english`, `latin` FROM ProperText WHERE HEX(`id`) IN ("'
      . implode ( '", "', array_map ( fn ( $value ): string => bin2hex ( $value ), array_filter ( $propers ) ) ) .
    '")' )->all ( );

    foreach ( $proper_texts as $proper ) {
      
      $res [ $proper [ "category" ] ] = array (

        "english" => $proper [ "english" ],
        "latin" => $proper [ "latin" ]
      
      );

    }

  }

  return $res;

}