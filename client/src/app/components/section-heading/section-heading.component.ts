import { ChangeDetectionStrategy, Component, input } from "@angular/core"

@Component ( {
  selector: "app-section-heading",
  templateUrl: "./section-heading.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.section-heading-host-compact]": "compact()"
  }
} )
export class SectionHeadingComponent {
  public readonly title = input.required<string> ( )
  public readonly subtitle = input<string> ( )
  public readonly eyebrow = input<string> ( )
  public readonly compact = input ( false )
}
