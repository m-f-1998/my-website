import { ChangeDetectionStrategy, Component } from "@angular/core"
import {
  siHtml5, siCss, siJavascript,
  siPython, siAngular, siTypescript,
  siPostgresql, siMysql,
  siNodedotjs, siFastify,
  siDocker, siGithubactions,
  siReact, siCapacitor, siTailwindcss
} from "simple-icons"
import type { SimpleIcon } from "simple-icons"

interface Skill {
  name: string
  icons: SimpleIcon [ ]
  optional?: boolean
}

@Component ( {
  selector: "app-skills",
  imports: [ ],
  templateUrl: "./skills.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SkillsComponent {
  public skillGroups: { skills: Skill [ ] } [ ] = [
    {
      skills: [
        {
          name: "Languages",
          icons: [ siTypescript, siJavascript, siPython ],
          optional: true
        },
        {
          name: "Frontend & UI",
          icons: [ siAngular, siTailwindcss, siHtml5, siCss ]
        },
        {
          name: "Backend Engineering",
          icons: [ siNodedotjs, siFastify ]
        }
      ]
    },
    {
      skills: [
        {
          name: "Databases",
          icons: [ siPostgresql, siMysql ],
          optional: true
        },
        {
          name: "Cross-Platform Mobile",
          icons: [ siCapacitor, siReact ]
        },
        {
          name: "Cloud & DevOps",
          icons: [ siDocker, siGithubactions ]
        }
      ]
    }
  ]

  public iconColor ( hex: string ): string {
    const r = parseInt ( hex.slice ( 0, 2 ), 16 )
    const g = parseInt ( hex.slice ( 2, 4 ), 16 )
    const b = parseInt ( hex.slice ( 4, 6 ), 16 )
    const luminance = ( 0.299 * r + 0.587 * g + 0.114 * b ) / 255
    return "#" + ( luminance < 0.25 ? "e2e8f0" : hex )
  }
}
