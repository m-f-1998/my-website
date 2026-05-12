import { Directive, ElementRef, inject, OnInit, Renderer2 } from "@angular/core"

/**
 * Applies a shimmering skeleton effect to images while they load.
 *
 * Strategy:
 * - If the immediate parent (skipping <picture>) wraps only this image,
 *   the shimmer is applied to the parent so the image can fade in on top.
 * - Otherwise (e.g. the parent contains other content like text), the
 *   shimmer background is applied directly to the <img> element — it shows
 *   through before the image src renders and is naturally hidden once the
 *   image content covers it.
 */
@Directive ( {
  selector: "[appImgShimmer]",
  standalone: true,
  host: {
    "(load)": "onLoad()",
    "(error)": "onError()"
  }
} )
export class ImgShimmerDirective implements OnInit {
  private readonly el = inject ( ElementRef<HTMLImageElement> )
  private readonly renderer = inject ( Renderer2 )

  private shimmerTarget: HTMLElement | null = null
  private usesParent = false

  public ngOnInit ( ): void {
    const img = this.el.nativeElement as HTMLImageElement
    const container = this.findCleanContainer ( img )

    if ( container ) {
      this.shimmerTarget = container
      this.usesParent = true
      this.renderer.addClass ( container, "img-shimmer" )
      this.renderer.setStyle ( img, "opacity", "0" )
      this.renderer.setStyle ( img, "transition", "opacity 0.4s ease" )
    } else {
      this.shimmerTarget = img
      this.renderer.addClass ( img, "img-shimmer" )
    }

    if ( img.complete && img.naturalHeight !== 0 ) {
      this.markLoaded ( )
    }
  }

  public onLoad ( ): void {
    this.markLoaded ( )
  }

  public onError ( ): void {
    this.markLoaded ( )
  }

  /**
   * Walk up the DOM past any <picture> element and return the ancestor
   * only if it solely wraps this image (no sibling visible content).
   */
  private findCleanContainer ( img: HTMLImageElement ): HTMLElement | null {
    let el: HTMLElement | null = img.parentElement
    while ( el?.tagName === "PICTURE" ) el = el.parentElement
    if ( !el ) return null

    const onlyWrapsImage = Array.from ( el.children ).every (
      child => child === img || [ "PICTURE", "SOURCE" ].includes ( child.tagName )
    )

    return onlyWrapsImage ? el : null
  }

  private markLoaded ( ): void {
    const img = this.el.nativeElement as HTMLImageElement
    if ( this.shimmerTarget ) {
      this.renderer.removeClass ( this.shimmerTarget, "img-shimmer" )
    }
    if ( this.usesParent ) {
      this.renderer.setStyle ( img, "opacity", "1" )
    }
  }
}
