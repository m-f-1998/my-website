import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core"
import { ScrollService } from "@services/scroll.service"

@Component ( {
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NavbarComponent {
  private readonly scrollSvc = inject ( ScrollService )
  public menuOpen = signal ( false )

  public toggleMenu ( ) {
    this.menuOpen.update ( open => !open )
  }

  public scrollTo ( id: string ) {
    this.scrollSvc.scrollTo ( id )
    this.menuOpen.set ( false )
  }
}
