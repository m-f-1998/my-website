<?php

class Functions {

    private $conn;

    function __construct () {

      require_once  __DIR__ . '/db.php';
      
      $db = new DB ();
      $this->conn = $db->connect ();

    }

  /**
   *
   * Get Ordo Dates For A Given Year
   *
   */
    public function GetOrdoYear ( $year ) {
      
      $res = array (
        'January' => [], 'February' => [], 'March' => [], 'April' => [],
        'May' => [], 'June' => [], 'July' => [], 'August' => [],
        'September' => [], 'October' => [], 'November' => [], 'December' => []
      );

      foreach ( $res as $month => $value ) {

        $days = $this->conn->execute_query (
          "SELECT c.`date`, DATE_FORMAT(c.`date`, '%a %d') as `formatted_date`, s.`title` as `season_title`, s.`colors` as `season_colors`
            FROM `Celebrations` c
            JOIN `Season` s ON c.`season`=s.`id`
            WHERE YEAR(c.`date`)=? AND MONTHNAME(c.`date`)=? 
            GROUP BY c.`date`
            ORDER BY `c`.`date`
            ASC",
          [ $year, $month ]
        );
        
        foreach ( $days as $day ) {

          $celebrations = array ( );

          $celebrations_query = $this->conn->execute_query (
            "SELECT BIN_TO_UUID(c.`id`) as `id`, f.`rank`, f.`title`, f.`colors`, c.`options`
              FROM `Celebrations` c
              JOIN `Feast` f ON c.`feast`=f.`id`
              WHERE c.`date`=?",
            [ $day [ 'date' ] ]
          );

          foreach ( $celebrations_query as $row ) {
            $row [ "commemorations" ] = $this->conn->execute_query (
              "SELECT BIN_TO_UUID(f.`id`) as `id`, f.`rank`, f.`title`, f.`colors`
                FROM `Commemorations` c
                JOIN `Feast` f ON c.`feast`=f.`id`
                WHERE c.`celebration`=UUID_TO_BIN(?)",
              [ $row [ 'id' ] ]
            )->fetch_all ( MYSQLI_ASSOC );

            $date = new DateTime( $day [ "date" ] );
            if ( ( $date->format('M') == "Nov" || $date->format('M') == "Dec" ) && str_contains ( $row [ "title" ], "Epiphany" ) ) {
              $row [ "title" ] = "(Resumed) " . $row [ "title" ];
            }
            
            array_push ( $celebrations, $row );
          }

          array_push ( $res [ $month ], array (
            "id" => bin2hex ( openssl_random_pseudo_bytes ( 16 ) ),
            "date" => $day [ "formatted_date" ],
            "celebrations" => $celebrations,
            "season" => array (
              "title" => $day [ "season_title" ],
              "colors" => $day [ "season_colors" ]
            )
          ) );
        
        }

      }

      return $res;
    
    }

  /**
   *
   * Get Next 7 Liturgical Days
   *
   */
    public function GetOrdoWeek ( $timestamp ) {

      $res = array ( );
      
      date_default_timezone_set ( $timestamp );
      
      $today = date ( 'Y-m-d' );
      $next_week = date ( 'Y-m-d', strtotime ( '+1 week' ) );

      $celebrations = $this->conn->execute_query (
        "SELECT BIN_TO_UUID(c.`id`) as `id`, DATE_FORMAT(c.`date`, '%a %d') as `formatted_date`, c.`date`, f.`rank`, f.`title`, f.`colors`
          FROM `Celebrations` c, `Feast` f
          WHERE c.`feast`=f.`id` AND c.`date` BETWEEN ? AND ?
          ORDER BY `c`.`date`
          ASC",
        [ $today, $next_week ]
      );
        
      foreach ( $celebrations as $celebration ) {

        $date = new DateTime( $celebration [ "date" ] );
        if ( ( $date->format('M') == "Nov" || $date->format('M') == "Dec" ) && str_contains ( $celebration [ "title" ], "Epiphany" ) ) {
          $celebration [ "title" ] = "(Resumed) " . $celebration [ "title" ];
        }

        array_push ( $res, array (
          "id" => bin2hex ( openssl_random_pseudo_bytes ( 16 ) ),
          "date" => $celebration [ "formatted_date" ],
          "celebrations" => array (
            array (
              "id" => $celebration [ "id" ],
              "rank" => $celebration [ "rank" ],
              "title" => $celebration [ "title" ],
              "colors" => $celebration [ "colors" ]
            )
          )
        ) );

      }

      return $res;

    }

  /**
   *
   * Get Prayers Catalogue In HTML Encoded Format
   *
   */
    public function GetPrayers ( $language ) {

      $res = array ( );
      
      $prayers = $this->conn->execute_query (
        "SELECT `category`, `title`, `body` FROM `Prayers` WHERE `language`=?",
        [ $language ]
      );
        
      foreach ( $prayers as $prayer ) {

        if ( !array_key_exists ( $prayer [ "category" ], $res ) ) {

          $res [ $prayer [ "category" ] ] = array ( );

        }

        $res [ $prayer [ "category" ] ] [ $prayer [ "title" ] ] = $prayer [ "body" ];

      }

      return $res;

    }

  /**
   *
   * Get The Propers For The Holy Masses In A Given Year
   *
   */
    public function GetPropers ( $year ) {

      $res = array (
        'January' => [], 'February' => [], 'March' => [], 'April' => [],
        'May' => [], 'June' => [], 'July' => [], 'August' => [],
        'September' => [], 'October' => [], 'November' => [], 'December' => []
      );

      for ( $month = 1; $month <= 12; $month++ ) {

        for ( $day = 1; $day <= cal_days_in_month ( CAL_GREGORIAN, $month, $year ); $day++ ) {

          $id = vsprintf ( '%s%s-%s-%s-%s-%s%s%s', str_split ( bin2hex ( random_bytes ( 16 ) ), 4 ) );
          $date =  $year . "-" . strval ( $month ) . "-" . strval ( $day );
          
          array_push ( $res [ array_keys ( $res ) [ $month - 1 ] ],
            $this->GetProperText ( $id, $date )
          );

        }

      }

      return $res;
    
    }

    private function GetProperText ( $id, $date ) {

      $query = "SELECT pt.`category`, pt.`english`, pt.`latin`
      FROM `ProperText` pt INNER JOIN (SELECT * FROM `Propers` WHERE `date`=? LIMIT 1) p
        ON (
              p.`introit`=pt.`id`
              OR p.`collect`=pt.`id`
              OR p.`epistle`=pt.`id`
              OR p.`gradual`=pt.`id`
              OR p.`gospel`=pt.`id`
              OR p.`offertory`=pt.`id`
              OR p.`secret`=pt.`id`
              OR p.`preface`=pt.`id`
              OR p.`communion`=pt.`id`
              OR p.`postcommunion`=pt.`id`
          );";
      $res = $this->conn->execute_query ( $query, [ $date ] );

      $result = array ( );
      foreach ( $res as $row ) {
        $result [ $row [ "category" ] ] = array (
          "english" => $row [ "english" ],
          "latin" => $row [ "latin" ]
        );
      }

      return array_merge ( 
        array (
          "id" => $id,
          "date" => date ( 'D d', strtotime ( $date ) )
        ), $result
      );

    }

}

?>