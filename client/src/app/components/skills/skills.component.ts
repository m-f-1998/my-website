import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component ( {
  selector: "app-skills",
  imports: [],
  templateUrl: "./skills.component.html",
  styleUrl: "./skills.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SkillsComponent {

  public skillGroups = [
    {
      skills: [
        {
          name: "Vanilla Web Technologies",
          icons: [
            "html5.svg",
            "css3.svg",
            "js.svg"
          ],
          optional: true,
        },
        {
          name: "Scripting Languages",
          icons: [
            "python.svg",
            "shell.svg",
            "php.svg"
          ]
        },
        {
          name: "Typed Angular",
          icons: [
            "angular.svg",
            "typescript.svg"
          ]
        }
      ]
    },
    {
      skills: [
        {
          optional: true,
          name: "MongoDB",
          icons: [
            "mongo.svg"
          ]
        },
        {
          name: "SQL",
          icons: [
            "postgres.svg",
            "sql.svg"
          ]
        },
        {
          name: "NodeJS & Package Management",
          icons: [
            "node.svg",
            "npm.svg"
          ]
        }
      ]
    },
    {
      skills: [
        {
          name: "Web Services",
          icons: [
            "googlecloud.svg",
            "centos.svg",
            "ubuntu.svg"
          ]
        },
        {
          optional: true,
          name: "Git Source Control",
          icons: [
            "git.svg"
          ]
        },
        {
          name: "Mobile Applications",
          icons: [
            "swift.svg",
            "react.svg",
            "ionic.svg"
          ]
        }
      ]
    }
  ]

}
