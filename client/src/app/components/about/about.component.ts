import { ChangeDetectionStrategy, Component } from "@angular/core"
import { SectionHeadingComponent } from "../section-heading/section-heading.component"
import { CountUpDirective } from "@app/directives/count-up.directive"
import { SkillsComponent } from "../skills/skills.component"

interface Stat {
  label: string
  animate?: boolean
  count?: number
  suffix?: string
  staticValue?: string
}

@Component ( {
  selector: "app-about",
  imports: [
    SectionHeadingComponent,
    CountUpDirective,
    SkillsComponent
  ],
  templateUrl: "./about.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AboutComponent {
  public readonly stats: Stat [ ] = [
    { label: "Years experience", animate: true, count: 8, suffix: "+" },
    { label: "Class MEng", staticValue: "1st" },
    { label: "Shipped projects", animate: true, count: 8, suffix: "+" },
    { label: "npm packages", animate: true, count: 4 }
  ]
}
