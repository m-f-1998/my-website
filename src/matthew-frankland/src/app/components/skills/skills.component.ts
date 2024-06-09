import { Component } from "@angular/core";

@Component ( {
  selector: "app-skills",
  standalone: true,
  imports: [],
  templateUrl: "./skills.component.html",
  styleUrl: "./skills.component.scss"
} )
export class SkillsComponent {

  public skillGroups = [
    {
      skills: [
        {
          name: "Vanilla Web Technologies",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
          ],
          optional: true,
        },
        {
          name: "Scripting Languages",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original-wordmark.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"
          ]
        },
        {
          name: "Typed Angular",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
          ]
        }
      ]
    },
    {
      skills: [
        {
          optional: true,
          name: "MongoDB",
          icons: ["https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg"]
        },
        {
          name: "SQL",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg"
          ]
        },
        {
          name: "NodeJS & Package Management",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg"
          ]
        }
      ]
    },
    {
      skills: [
        {
          name: "Web Services",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/centos/centos-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg"
          ]
        },
        {
          optional: true,
          name: "Git Source Control",
          icons: ["https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"]
        },
        {
          name: "Mobile Applications",
          icons: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ionic/ionic-original.svg"
          ]
        }
      ]
    }
  ]

}
