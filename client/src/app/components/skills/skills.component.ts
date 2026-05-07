import { ChangeDetectionStrategy, Component } from "@angular/core"
import {
  siHtml5, siCss, siJavascript,
  siPython, siGnubash, siPhp,
  siAngular, siTypescript,
  siMongodb, siPostgresql,
  siNodedotjs, siNpm,
  siDocker, siUbuntu, siCloudflare,
  siGit, siSwift, siReact, siIonic
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
          name: "Vanilla Web Technologies",
          icons: [ siHtml5, siCss, siJavascript ],
          optional: true
        },
        {
          name: "Scripting Languages",
          icons: [ siPython, siGnubash, siPhp ]
        },
        {
          name: "Typed Angular",
          icons: [ siAngular, siTypescript ]
        }
      ]
    },
    {
      skills: [
        {
          name: "MongoDB",
          icons: [ siMongodb ],
          optional: true
        },
        {
          name: "SQL",
          icons: [ siPostgresql ]
        },
        {
          name: "Node.js & Package Management",
          icons: [ siNodedotjs, siNpm ]
        }
      ]
    },
    {
      skills: [
        {
          name: "Cloud & DevOps",
          icons: [ siDocker, siUbuntu, siCloudflare ]
        },
        {
          name: "Git Source Control",
          icons: [ siGit ],
          optional: true
        },
        {
          name: "Mobile Applications",
          icons: [ siSwift, siReact, siIonic ]
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
