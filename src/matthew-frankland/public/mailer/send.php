<?php
  /*
  * This is a simple mailer script that will send an email to the specified email address
  * with the specified subject and message.
  */

  session_start();
  // Set rate limiting per IP
  $ip = $_SERVER [ "REMOTE_ADDR" ];
  if ( !isset ( $_SESSION [ "email_attempts" ] ) ) {
    $_SESSION [ "email_attempts" ] = [ ];
  }

  // Remove attempts older than 1 hour
  $_SESSION [ "email_attempts" ] = array_filter ( $_SESSION [ "email_attempts" ], function ( $timestamp ) {
    return $timestamp > ( time ( ) - 3600 );
  } );

  // Limit to 5 submissions per hour
  if ( count ( $_SESSION [ "email_attempts" ] ) >= 5 ) {
    echo json_encode ( "You have reached the limit of emails you can send. Please try again later." );
    http_response_code ( 429 );
    exit ( );
  }

  $_SESSION [ "email_attempts" ] [ ] = time( );

  // Rate limiting based on time
  if ( isset ( $_SESSION [ "last_submit" ] ) && time ( ) - $_SESSION [ "last_submit" ] < 60 ) {
    echo json_encode ( "You are submitting too frequently." );
    http_response_code ( 429 );
    exit ( );
  }
  $_SESSION [ "last_submit" ] = time();

  require "./vendor/autoload.php";
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  header ( "Content-Type: application/json; charset=utf-8" );
  header ( "Access-Control-Allow-Methods: POST, OPTIONS" );
  header ( "Access-Control-Allow-Origin: matthewfrankland.co.uk" );
  header ( "Access-Control-Allow-Headers: Origin, Content-Type, X-Auth" );

  $data = json_decode(file_get_contents("php://input"), true);

  $data [ "subject" ] = htmlspecialchars ( strip_tags ( trim ( $data [ "subject" ] ) ) );
  $data [ "message" ] = htmlspecialchars ( strip_tags ( trim ( $data [ "message" ] ) ) );

  if ( empty ( $data [ "subject" ] ) || empty ( $data [ "message" ] ) ) {
    echo json_encode ( "Please fill in all fields" );
    http_response_code ( 400 );
    exit ( );
  }

  $mail = new PHPMailer(true);

  try {
    // Server settings
    $mail->isSMTP ( );                                    // Send using SMTP
    $mail->Host       = "smtp.mail.me.com";               // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                             // Enable SMTP authentication
    $mail->Username   = "admin@matthewfrankland.co.uk";   // SMTP username
    $mail->Password   = "pjig-ffvw-pyts-qnvz";            // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // Enable TLS encryption; PHPMailer::ENCRYPTION_SMTPS also available
    $mail->Port       = 587;                              // TCP port to connect to
    $mail->SMTPDebug  = 0;                                // Disable debugging output

    //Recipients
    $mail->setFrom ( "admin@matthewfrankland.co.uk" );
    $mail->addAddress (  "admin@matthewfrankland.co.uk", "Matthew Frankland" ); // Add a recipient

    // Content
    $mail->isHTML ( true );                                  // Set email format to HTML
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Subject = "Website Mail: " . $data [ "subject" ];
    $mail->Body    = $data [ "message" ];
    $mail->addCustomHeader ( "X-Mailer", "PHPMailer" );
    $mail->addCustomHeader ( "X-Priority", "3" );            // Normal priority

    $mail->send ( );
    echo json_encode ( "Email sent" );
    http_response_code ( 200 );
  } catch ( Exception $e ) {
    echo json_encode ( "Email failed: {$mail->ErrorInfo}" );
    http_response_code ( 500 );
    exit ( );
  }
