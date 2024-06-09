import { Component } from "@angular/core"

@Component ( {
  selector: "app-footer",
  standalone: true,
  imports: [],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss"
} )
export class FooterComponent {

  public year = new Date ( ).getFullYear ( )
  public socialLinks = [
    {
      url: "http://facebook.com/mattfrank48/",
      icon: "devicon-facebook-plain",
      class: "btn btn-lg btn-icon facebook-link",
      tooltip: "Contact me on Facebook"
    },
    {
      url: "https://www.linkedin.com/in/mf48/",
      icon: "devicon-linkedin-plain",
      class: "btn btn-lg btn-icon linkedin-link",
      tooltip: "Connect with me on LinkedIn",
    },
    {
      url: "https://github.com/m-f-1998/",
      icon: "devicon-github-plain",
      class: "btn btn-lg btn-icon github-link",
      tooltip: "Follow me on GitHub"
    },
  ]

}
