import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from "@angular/core"

@Directive ( {
  selector: "[appCountUp]"
} )
export class CountUpDirective implements OnInit, OnDestroy {
  public readonly appCountUp = input.required<number> ( )
  public readonly suffix = input ( "" )
  public readonly prefix = input ( "" )
  public readonly duration = input ( 1400 )

  private readonly el = inject ( ElementRef<HTMLElement> )
  private observer: IntersectionObserver | null = null
  private started = false

  public ngOnInit ( ) {
    this.el.nativeElement.textContent = `${this.prefix ( )}0${this.suffix ( )}`

    this.observer = new IntersectionObserver (
      entries => {
        if ( entries [ 0 ]?.isIntersecting && !this.started ) {
          this.started = true
          this.animate ( )
          this.observer?.disconnect ( )
        }
      },
      { threshold: 0.45 }
    )

    this.observer.observe ( this.el.nativeElement )
  }

  public ngOnDestroy ( ) {
    this.observer?.disconnect ( )
  }

  private animate ( ) {
    const target = this.appCountUp ( )
    const start = performance.now ( )
    const element = this.el.nativeElement

    const tick = ( now: number ) => {
      const progress = Math.min ( ( now - start ) / this.duration ( ), 1 )
      const eased = 1 - Math.pow ( 1 - progress, 3 )
      const current = Math.round ( target * eased )
      element.textContent = `${this.prefix ( )}${current}${this.suffix ( )}`
      if ( progress < 1 ) {
        requestAnimationFrame ( tick )
      }
    }

    requestAnimationFrame ( tick )
  }
}
