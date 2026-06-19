import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component ( {
  selector: "app-experience",
  imports: [],
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
      description: "Leading the development of complex full-stack web and cross-platform mobile applications. I am responsible for designing modern user interfaces utilizing TypeScript, Angular, and Capacitor, while architecting and maintaining robust backend RESTful APIs using Node.js and Fastify. My work involves deep integration with enterprise databases and implementing secure authentication flows, driving the modernization of the company's application stack to ensure high performance and scalability."
    },
    {
      company: "Exterity",
      period: "June 2019 - October 2022",
      roles: [
        "Graduate Software Engineer",
        "Software Engineer Intern"
      ],
      description: "My role as an Exterity (Later VITEC) Intern involved me assisting in the development of next generation products and applications to deliver high quality TV and video over enterprise IP networks. These applications span a full range of IPTV products, from head end through to set top box and server, building a coherent and comprehensive technology stack. I later, as a Graduate Software Engineer, assisted the Cloud Development team in virtualising their server based product using AWS. I have gained experience using the following languages and frameworks: JavaScript/Typescript Angular; Python; REACT Native; PHP; HTML5 & CSS3."
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
