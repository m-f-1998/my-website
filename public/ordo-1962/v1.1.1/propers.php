<?php
  
  header ( 'Content-Type: application/json; charset=utf-8' );

  require_once  __DIR__ . '/db/functions.php';

  $operations = new Functions ( );

  if ( !empty ( $_POST [ 'year' ] ) ) {

    if ( filter_input ( INPUT_POST, "year", FILTER_VALIDATE_INT ) == false ) {

      http_response_code ( 422 );
      echo 'Unprocessable Year';

    } else {

      echo json_encode ( $operations->GetPropers ( $_POST [ 'year' ] ) );
    
    }
  
  } else {

    http_response_code ( 400 );
    echo 'Missing Parameters';

  }

?>
