import { Component, Input } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { HeaderComponent } from "../components/header/header.component"

@Component ( {
  selector: "app-error-view",
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: "./http-error.component.html",
  styleUrl: "./http-error.component.scss"
} )
export class HttpErrorComponent {

  @Input ( ) public error = ""
  @Input ( ) public description = ""

  constructor (
    private route: ActivatedRoute
  ) {
    this.error = this.route.snapshot.paramMap.get ( "code" ) ?? "500"
    switch ( this.error ) {
      case "400":
        this.error = "400 Bad Request"
        this.description = "The server cannot process the request."
        break
      case "401":
        this.error = "401 Unauthorized"
        this.description = "You are not allowed to do that."
        break
      case "403":
        this.error = "403 Forbidden"
        this.description = "Dinnae even think aboot it."
        break
      case "404":
        this.error = "404 Not Found"
        this.description = "It ain't here pal."
        break
      default:
        this.error = "500 Internal Server Error"
        this.description = "Something went wrong."
        break
    }
  }

}
