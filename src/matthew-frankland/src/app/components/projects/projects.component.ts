import { Component } from "@angular/core"

@Component ( {
  selector: "app-projects",
  standalone: true,
  imports: [],
  templateUrl: "./projects.component.html",
  styleUrl: "./projects.component.scss"
} )
export class ProjectsComponent {

  public projects = [
    {
      imageUrl: "assets/project-1.jpg",
      altTag: "Trench Heating Project",
      title: "Trench Heating Specification Tool",
      description: "An online PDF specification generator which provides the best Trench Heating solution for a customer\"s large scale project.",
      fullText: false,
      links: [
        {
          url: "https://www.turnbull-scott.co.uk/heating/perimeter-trench-heating/product-specification-selection-tool/",
          label: "View the Website"
        }
      ]
    },
    {
      imageUrl: "assets/project-2.jpeg",
      altTag: "AvediaStream",
      title: "Solution Builder",
      description: "AvediaStream is a Exterity IP Digital Media platform that includes a variety of Video Encoders; Servers; Transcoders; Gateways and more. Solution Builder generates specifications for customers based upon their setup, including compatability, price and requirements.",
      fullText: false,
      links: []
    },
    {
      imageUrl: "assets/project-3.webp",
      altTag: "The Hawick Paper",
      title: "The Hawick Paper",
      description: "An App on iOS and Android for my local paper.",
      fullText: false,
      links: [
        {
          url: "https://apps.apple.com/us/app/the-hawick-paper/id1520637565",
          label: "iOS App Store"
        }
      ]
    },
    {
      imageUrl: "assets/project-4.png",
      altTag: "1962 Ordo App",
      title: "1962 Liturgical Ordo",
      description: "An App for Traditional Catholics Sold Worldwide.",
      fullText: false,
      links: [
        {
          url: "https://apps.apple.com/in/app/1962-liturgical-ordo/id6450934181",
          label: "iOS App Store"
        }
      ]
    },
    {
      imageUrl: "assets/project-5.png",
      altTag: "Hons Degree Dissertation",
      title: "My Dissertation",
      description: "A prototype Learning Management System I delivered as part of my Honours Dissertation. This system uses a traditional distributed client server architecture to connects multiple clients to the same server over a network connection.",
      fullText: false,
      links: [
        {
          url: "https://github.com/m-f-1998/university/blob/master/honours_dissertation/dissertation.pdf",
          label: "Read My Paper"
        }
      ]
    },
    {
      imageUrl: "assets/project-6.png",
      altTag: "Topic Modelling Graph",
      title: "Topic Modelling",
      description: "Topic Maps are a tool developed by the Strategic Futures Laboratory of Heriot-Watt University. They use a Latent Dirichlet Allocation (LDA) algorithm to extract topics from supplied texts, this project developed a tool which uses various metrics to investigate models that are produced.",
      fullText: false,
      links: [
        {
          url: "https://github.com/m-f-1998/university/tree/master/topic_modelling",
          label: "View Project"
        }
      ]
    }
  ];

  public readmore ( project: any ) {
    project.fullText = !project.fullText
  }

}
