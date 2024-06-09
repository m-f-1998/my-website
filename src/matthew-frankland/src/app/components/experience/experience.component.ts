import { Component } from "@angular/core";

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [],
  templateUrl: "./experience.component.html",
  styleUrl: "./experience.component.scss"
})
export class ExperienceComponent {

  public experiences = [
    {
      company: "IQX",
      period: "September 2023 - Present",
      roles: [
        "Web Developer"
      ]
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
