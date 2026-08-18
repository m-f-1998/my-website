import { ChangeDetectionStrategy, Component } from "@angular/core"
import { SectionHeadingComponent } from "../section-heading/section-heading.component"

@Component ( {
  selector: "app-experience",
  imports: [ SectionHeadingComponent ],
  templateUrl: "./experience.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ExperienceComponent {

  public experiences = [
    {
      company: "IQX",
      period: "September 2023 - Present",
      roles: [
        "Senior Web Developer",
        "Web Developer"
      ],
      description: "Leading full-stack web and cross-platform mobile development — TypeScript, Angular, Capacitor, and Fastify APIs with enterprise database integrations and secure auth."
    },
    {
      company: "Exterity",
      period: "June 2019 - October 2022",
      roles: [
        "Graduate Software Engineer",
        "Software Engineer Intern"
      ],
      description: "IPTV and video-over-IP products across the full stack, from head-end to set-top box. Later worked on AWS cloud virtualisation for server-based products."
    },
    {
      company: "Master's Degree",
      period: "2016 - 2021",
      roles: [
        "1st Class MEng Software Engineering with Distinction"
      ],
      description: "Heriot-Watt University",
      achievements: [
        "Year 1 of Study: Certificate of Merit", "Year 2 of Study: Certificate of Merit & Deputy Principal's Award"
      ]
    }
  ]

}
