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
      imageUrl: "project-1.jpg",
      altTag: "Trench Heating Project",
      title: "Trench Heating Specification Tool",
      description: "An online PDF specification generator which provides the best Trench Heating solution for a customer\"s large scale project.",
      links: [
        {
          url: "https://www.turnbull-scott.co.uk/heating/perimeter-trench-heating/product-specification-selection-tool/",
          label: "View the Website"
        }
      ]
    },
    {
      imageUrl: "project-2.jpeg",
      altTag: "AvediaStream",
      title: "Solution Builder",
      description: "AvediaStream is a Exterity IP Digital Media platform that includes a variety of Video Encoders; Servers; Transcoders; Gateways and more. Solution Builder generates specifications for customers based upon their setup, including compatability, price and requirements.",
      links: []
    },
    {
      imageUrl: "project-3.webp",
      altTag: "The Hawick Paper",
      title: "The Hawick Paper",
      description: "An App on iOS and Android for my local paper.",
      links: [
        {
          url: "https://apps.apple.com/us/app/the-hawick-paper/id1520637565",
          label: "iOS App Store"
        },
        {
          url: "https://play.google.com/store/apps/details?id=com.hawick_paper&hl=en&gl=GB",
          label: "Google Play"
        }
      ]
    },
    {
      imageUrl: "project-4.png",
      altTag: "1962 Ordo App",
      title: "1962 Liturgical Ordo",
      description: "An App for Traditional Catholics Sold Worldwide.",
      links: [
        {
          url: "https://apps.apple.com/in/app/1962-liturgical-ordo/id6450934181",
          label: "iOS App Store"
        },
        {
          url: "https://play.google.com/store/apps/details?id=com.mfrankland.ordo_1962&hl=en_GB&gl=US",
          label: "Google Play"
        }
      ]
    },
    {
      imageUrl: "project-5.png",
      altTag: "Hons Degree Dissertation",
      title: "My Dissertation",
      description: "The purpose of this research is to develop a new prototype Learning Management System. This system is designed using a traditional distributed client server architecture model that connects multiple clients to the same server over a network connection.",
      links: [
        {
          url: "https://github.com/m-f-1998/university/blob/master/honours_dissertation/dissertation.pdf",
          label: "Read My Paper"
        }
      ]
    },
    {
      imageUrl: "project-6.png",
      altTag: "Topic Modelling Graph",
      title: "Topic Modelling",
      description: "Topic Maps are a tool developed by the Strategic Futures Laboratory of Heriot-Watt University. They use a Latent Dirichlet Allocation (LDA) algorithm to extract topics from supplied texts, this project developed a tool which uses various metrics to investigate models that are produced.",
      links: [
        {
          url: "https://github.com/m-f-1998/university/tree/master/topic_modelling",
          label: "View Project"
        }
      ]
    }
  ];

}
