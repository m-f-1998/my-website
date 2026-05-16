import { afterNextRender, ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from "@angular/core"
import { DOCUMENT } from "@angular/common"
import { NavigationEnd, Router } from "@angular/router"
import { filter } from "rxjs"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { IconService } from "@services/icons.service"
import { ImgShimmerDirective } from "@app/directives/img-shimmer.directive"

const SECTION_ORDER = [ "home", "about", "skill", "projects", "experience", "contact" ] as const
type SectionId = typeof SECTION_ORDER[number]

@Component ( {
  selector: "app-navbar",
  imports: [ FaIconComponent, ImgShimmerDirective ],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NavbarComponent implements OnDestroy {
  public menuOpen = signal ( false )
  public activeSection = signal<SectionId | null> ( null )
  public readonly iconSvc = inject ( IconService )
  private readonly router = inject ( Router )
  private readonly doc: Document = inject ( DOCUMENT )
  private observer: IntersectionObserver | null = null
  private readonly visible = new Set<SectionId> ()
  private routerSub = this.router.events.pipe (
    filter ( e => e instanceof NavigationEnd )
  ).subscribe ( ( ) => {
    this.activeSection.set ( null )
    this.visible.clear ( )
    this.observer?.disconnect ( )
    setTimeout ( ( ) => this.initScrollSpy ( ), 50 )
  } )

  public constructor ( ) {
    afterNextRender ( ( ) => this.initScrollSpy ( ) )
  }

  public toggleMenu ( ) {
    this.menuOpen.update ( open => !open )
  }

  public goHome ( ) {
    this.menuOpen.set ( false )
    this.router.navigate ( [ "/" ] )
    this.doc.documentElement.scrollTo ( { top: 0, behavior: "smooth" } )
  }

  public scrollTo ( id: string ) {
    this.menuOpen.set ( false )
    const el = this.doc.getElementById ( id )
    if ( el ) {
      el.scrollIntoView ( { behavior: "smooth", block: "start" } )
    } else {
      this.router.navigate ( [ "/" ], { fragment: id } )
    }
  }

  public ngOnDestroy ( ) {
    this.observer?.disconnect ( )
    this.routerSub.unsubscribe ( )
  }

  private initScrollSpy ( ) {
    this.observer = new IntersectionObserver (
      entries => {
        entries.forEach ( entry => {
          const id = entry.target.id as SectionId
          if ( entry.isIntersecting ) {
            this.visible.add ( id )
          } else {
            this.visible.delete ( id )
          }
        } )
        const active = SECTION_ORDER.find ( id => this.visible.has ( id ) ) ?? null
        if ( this.activeSection ( ) !== active ) {
          this.activeSection.set ( active )
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    )

    SECTION_ORDER.forEach ( id => {
      const el = this.doc.getElementById ( id )
      if ( el ) this.observer!.observe ( el )
    } )
  }
}
