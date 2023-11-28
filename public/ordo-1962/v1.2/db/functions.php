<?php

class Functions {

    private $conn;

    function __construct () {

      require_once  __DIR__ . '/init.php';
      
      $db = new DB ();
      $this->conn = $db->connect ();

    }

  /**
   *
   * Get Ordo Dates For A Decade
   *
   */
    public function GetOrdo ( $year ) {

      $res = array (
        'January' => [], 'February' => [], 'March' => [], 'April' => [],
        'May' => [], 'June' => [], 'July' => [], 'August' => [],
        'September' => [], 'October' => [], 'November' => [], 'December' => []
      );

      $days = $this->conn->execute_query (
        "SELECT BIN_TO_UUID(f.`id`) as `feast_id`, f.`rank`, f.`title`, f.`colors`,
            c.`options`, c.`date`, DATE_FORMAT(c.`date`, '%a %d') as `formatted_date`,
            s.`title` as `season_title`, s.`colors` as `season_colors`,
            (SELECT feast.`rank` FROM `Feast` feast WHERE comm.`feast`=feast.`id`) as `comm_rank`,
            (SELECT feast.`title` FROM `Feast` feast WHERE comm.`feast`=feast.`id`) as `comm_title`,
            (SELECT feast.`colors` FROM `Feast` feast WHERE comm.`feast`=feast.`id`) as `comm_colors`
          FROM `Celebrations` c
          LEFT JOIN `Season` s ON c.`season`=s.`id`
          LEFT JOIN `Feast` f ON c.`feast`=f.`id`
          LEFT JOIN `Commemorations` comm ON comm.`celebration`=c.`id`
          WHERE YEAR(c.`date`)=?
          ORDER BY `c`.`date`
          ASC",
        [ $year ]
      );

      foreach ( $days as $day ) {

        $month = date ( "F", strtotime ( $day [ "date" ] ) );

        $date = new DateTime( $day [ "date" ] );
        if ( ( $date->format('M') == "Nov" || $date->format('M') == "Dec" ) && str_contains ( $day [ "title" ], "Epiphany" ) ) {
          $day [ "title" ] = "(Resumed) " . $day [ "title" ];
        }

        $last_key = array_key_last ( $res [ $month ] );

        if ( !is_null ( $last_key ) &&  $res [ $month ] [ $last_key ] [ "date" ] == $day [ "formatted_date" ] ) {

          $last_celeb_key = array_key_last ( $res [ $month ] [ $last_key ] [ "celebrations" ] );
          
          if ( $res [ $month ] [ $last_key ] [ "celebrations" ] [ $last_celeb_key ] [ "title" ] == $day [ "title" ] ) {

            array_push ( $res [ $month ] [ $last_key ] [ "celebrations" ] [ $last_celeb_key ] [ "commemorations" ], array (
              "rank" => $day [ "comm_rank" ],
              "title" => $day [ "comm_title" ],
              "colors" => $day [ "comm_colors" ]
            ) );

          } else {

            array_push ( $res [ $month ] [ $last_key ] [ "celebrations" ], array (
              "rank" => $day [ "rank" ],
              "title" => $day [ "title" ],
              "colors" => $day [ "colors" ],
              "options" => $day [ "options" ],
              "propers" => $this->GetProperText ( $day [ "feast_id" ], $day [ "date" ] ),
              "commemorations" => is_null ( $day [ "comm_title" ] ) ? array ( ) : array ( array (
                "rank" => $day [ "comm_rank" ],
                "title" => $day [ "comm_title" ],
                "colors" => $day [ "comm_colors" ]
              ) )
            ) );

          }

        } else {

          array_push ( $res [ $month ], array (
            "date" => $day [ "formatted_date" ],
            "celebrations" => array ( array (
              "rank" => $day [ "rank" ],
              "title" => $day [ "title" ],
              "colors" => $day [ "colors" ],
              "options" => $day [ "options" ],
              "propers" => $this->GetProperText ( $day [ "feast_id" ], $day [ "date" ] ),
              "commemorations" => is_null ( $day [ "comm_title" ] ) ? array ( ) : array ( array (
                "rank" => $day [ "comm_rank" ],
                "title" => $day [ "comm_title" ],
                "colors" => $day [ "comm_colors" ]
              ) )
            ) ),
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
   * Get Prayers Catalogue In HTML Encoded Format
   *
   */
    public function GetPrayers ( ) {

      $res = array ( "English" => [ ], "Latin" => [ ] );

      foreach ( array_keys ( $res ) as $lang ) {
        $prayers = $this->conn->execute_query (
          "SELECT `category`, `title`, `body` FROM `Prayers` WHERE `language`=?",
          [ $lang ]
        );

        foreach ( $prayers as $prayer ) {

          if ( !array_key_exists ( $prayer [ "category" ], $res [ $lang ] ) ) {
  
            $res [ $lang ] [ $prayer [ "category" ] ] = array ( );
  
          }
  
          $res [ $lang ] [ $prayer [ "category" ] ] [ $prayer [ "title" ] ] = $prayer [ "body" ];
  
        }
      }

      return $res;

    }

  /**
   *
   * Get The Propers For The Holy Masses In A Given Year
   *
   */
  private function GetProperText ( $feast_id, $date ) {

    $query = $this->conn->execute_query ( "SELECT pt.`category`, pt.`english`, pt.`latin`
    FROM `ProperText` pt
    LEFT JOIN `Propers` p ON
      (
            p.`introit`=pt.`id`
            OR p.`collect`=pt.`id`
            OR p.`epistle`=pt.`id`
            OR p.`gradual`=pt.`id`
            OR p.`sequentia`=pt.`id`
            OR p.`gospel`=pt.`id`
            OR p.`offertory`=pt.`id`
            OR p.`secret`=pt.`id`
            OR p.`preface`=pt.`id`
            OR p.`communion`=pt.`id`
            OR p.`postcommunion`=pt.`id`
            OR p.`lectio_l1`=pt.`id`
            OR p.`graduale_l1`=pt.`id`
            OR p.`oratio_l1`=pt.`id`
            OR p.`lectio_l2`=pt.`id`
            OR p.`graduale_l2`=pt.`id`
            OR p.`oratio_l2`=pt.`id`
            OR p.`lectio_l3`=pt.`id`
            OR p.`graduale_l3`=pt.`id`
            OR p.`oratio_l3`=pt.`id`
            OR p.`lectio_l4`=pt.`id`
            OR p.`graduale_l4`=pt.`id`
            OR p.`oratio_l4`=pt.`id`
            OR p.`lectio_l5`=pt.`id`
            OR p.`oratio_l5`=pt.`id`
            OR p.`super_populum`=pt.`id`
        ) AND p.`feast_id`=UUID_TO_BIN(?) WHERE p.`date`=?", [ $feast_id, $date ] );
    $res = array ( );

    foreach ( $query as $row ) {
      $res [ $row [ "category" ] ] = array (
        "english" => $row [ "english" ],
        "latin" => $row [ "latin" ]
      );
    }

    return count ( $res ) > 0 ? $res : NULL;

  }

}

?>