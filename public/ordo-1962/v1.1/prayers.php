<?php

  header ( 'Content-Type: application/json; charset=utf-8' );

  require_once  __DIR__ . '/db/functions.php';

  $operations = new Functions ( );

  if ( !empty ( $_POST [ 'lang' ] ) ) {

    echo json_encode ( $operations->GetPrayers ( $_POST [ 'lang' ] ) );
  
  } else {

    http_response_code ( 400 );
    echo 'Missing Parameters';

  }

?>
