import { Directive, ElementRef, inject, OnDestroy, OnInit } from "@angular/core"

@Directive ( {
  selector: "[appSectionReveal]"
} )
export class SectionRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject ( ElementRef<HTMLElement> )
  private observer: IntersectionObserver | null = null

  public ngOnInit ( ) {
    const element = this.el.nativeElement
    element.classList.add ( "section-reveal" )

    this.observer = new IntersectionObserver (
      entries => {
        entries.forEach ( entry => {
          if ( entry.isIntersecting ) {
            entry.target.classList.add ( "section-reveal-visible" )
            this.observer?.unobserve ( entry.target )
          }
        } )
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )

    this.observer.observe ( element )
  }

  public ngOnDestroy ( ) {
    this.observer?.disconnect ( )
  }
}
