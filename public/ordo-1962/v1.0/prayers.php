<?php

  header ( 'Content-Type: application/json; charset=utf-8' );

  require __DIR__.'/vendor/autoload.php';
  require_once  __DIR__ . '/db/functions.php';

  $operations = new Functions ( );
  use Kreait\Firebase\Factory;

  if ( isset ( $_POST [ 'user_id' ] ) && isset ( $_POST [ 'lang' ] ) ) {

    if ( ctype_alnum ( $_POST [ 'user_id' ] ) && $_POST [ 'user_id' ] !== "" && $_POST [ 'lang' ] !== "" ) {

      $factory = ( new Factory )->withServiceAccount ( dirname ( __DIR__ ) . '/../../private/ordo-1962/v1.0/ordo-1962-firebase-adminsdk-fy1k4-2db9663aea.json' );
      $auth = $factory->createAuth ( );

      try {

        $auth->getUser ( $_POST [ 'user_id' ] );

        echo json_encode ( $operations->GetPrayers ( $_POST [ 'lang' ] ) );

      } catch ( \Kreait\Firebase\Exception\Auth\UserNotFound $e ) {

        http_response_code ( 401 );
        echo 'Authorization Failed';

      } catch ( \Kreait\Firebase\Exception\AuthException $e ) {

        http_response_code ( 400 );
        echo 'Unkown Error Occured';
      
      }

    } else {

      http_response_code ( 422 );
      echo 'Unprocessable User ID';

    }
  
  } else {

    http_response_code ( 400 );
    echo 'Missing Parameters';

  }

?>
