import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { IconService } from "@services/icons.service"
import { FooterComponent } from "../components/footer/footer.component"

@Component ( {
  selector: "app-error-view",
  imports: [
    FaIconComponent,
    FooterComponent
  ],
  templateUrl: "./http-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HttpErrorComponent {
  public code = ""
  public title = ""
  public description = ""

  public readonly iconSvc = inject ( IconService )
  private readonly route: ActivatedRoute = inject ( ActivatedRoute )

  public constructor ( ) {
    this.code = this.route.snapshot.paramMap.get ( "code" ) ?? "500"
    switch ( this.code ) {
      case "400":
        this.title = "Bad Request"
        this.description = "The server cannot process the request."
        break
      case "401":
        this.title = "Unauthorized"
        this.description = "You are not allowed to do that."
        break
      case "403":
        this.title = "Forbidden"
        this.description = "Dinnae even think aboot it."
        break
      case "404":
        this.title = "Not Found"
        this.description = "It ain't here pal."
        break
      default:
        this.code = "500"
        this.title = "Internal Server Error"
        this.description = "Something went wrong."
        break
    }
  }
}
