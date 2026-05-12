import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { IconService } from "@services/icons.service"
import { ImgShimmerDirective } from "@app/directives/img-shimmer.directive"

@Component ( {
  selector: "app-header",
  imports: [
    FaIconComponent,
    ImgShimmerDirective
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HeaderComponent {
  public readonly iconSvc: IconService = inject ( IconService )
}
