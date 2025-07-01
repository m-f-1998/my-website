import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component ( {
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NavbarComponent {

  public scrollto ( id: string ) {
    const element = document.getElementById ( id )
    if ( element ) {
      element.scrollIntoView ( { behavior: "smooth" } )
      if ( document.getElementsByClassName ( "navbar-toggler" ).length > 0 ) {
        if ( !document.getElementsByClassName ( "navbar-toggler" ) [ 0 ].classList.contains ( "collapsed" ) ) {
          ( document.getElementsByClassName ( "navbar-toggler" ) [ 0 ] as HTMLButtonElement ).click ( )
        }
      }
    }
  }

}
