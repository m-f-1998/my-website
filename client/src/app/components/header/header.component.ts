import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core"
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
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly iconSvc: IconService = inject ( IconService )

  public readonly highlights = [
    "8+ years experience",
    "MEng 1st Class",
    "TypeScript · Angular · Node",
    "Docker & CI/CD"
  ]

  public readonly roles = [
    "Senior Full-Stack Software Engineer",
    "TypeScript · Angular · Fastify",
    "End-to-end product builder"
  ]

  public roleIndex = signal ( 0 )
  public roleFading = signal ( false )

  private roleTimer: ReturnType<typeof setInterval> | null = null

  public ngOnInit ( ) {
    this.roleTimer = setInterval ( ( ) => this.cycleRole ( ), 4000 )
  }

  public ngOnDestroy ( ) {
    if ( this.roleTimer ) {
      clearInterval ( this.roleTimer )
    }
  }

  private cycleRole ( ) {
    this.roleFading.set ( true )
    setTimeout ( ( ) => {
      this.roleIndex.update ( index => ( index + 1 ) % this.roles.length )
      this.roleFading.set ( false )
    }, 280 )
  }
}
