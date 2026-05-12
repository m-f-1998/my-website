import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { IconService } from "@services/icons.service"
import { ScrollService } from "@services/scroll.service"
import { ImgShimmerDirective } from "@app/directives/img-shimmer.directive"

@Component ( {
  selector: "app-navbar",
  imports: [ FaIconComponent, ImgShimmerDirective ],
  templateUrl: "./navbar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NavbarComponent {
  public menuOpen = signal ( false )
  public readonly iconSvc = inject ( IconService )
  private readonly scrollSvc = inject ( ScrollService )

  public toggleMenu ( ) {
    this.menuOpen.update ( open => !open )
  }

  public scrollTo ( id: string ) {
    this.scrollSvc.scrollTo ( id )
    this.menuOpen.set ( false )
  }
}
