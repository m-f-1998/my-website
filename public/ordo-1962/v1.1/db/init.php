<?php

class DB {

    private $conn;

    function __construct ( ) { }

    function connect ( ) {

        require_once dirname ( __DIR__ ) . '/../../../private/ordo-1962/db-constants.php';

        $this->conn = new mysqli ( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME );

        if ( mysqli_connect_errno ( ) ) {

            $response = array ( );

            $response [ 'error' ] = true;
            $response [ 'user' ] = "Failed To Connect To MySQL: " . mysqli_connect_error ( );

            echo json_encode ( $response );

        }

        return $this->conn;

    }

}

?>