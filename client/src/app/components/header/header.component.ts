import { ChangeDetectionStrategy, Component } from "@angular/core"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faFacebook, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"

@Component( {
  selector: "app-header",
  imports: [
    FaIconComponent
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HeaderComponent {

  public socialLinks = [
    {
      url: "http://facebook.com/mattfrank48/",
      icon: faFacebook,
      class: "btn btn-lg btn-icon facebook-link",
      tooltip: "Contact me on Facebook"
    },
    {
      url: "https://www.linkedin.com/in/mf48/",
      icon: faLinkedin,
      class: "btn btn-lg btn-icon linkedin-link",
      tooltip: "Connect with me on LinkedIn",
    },
    {
      url: "https://github.com/m-f-1998/",
      icon: faGithub,
      class: "btn btn-lg btn-icon github-link",
      tooltip: "Follow me on GitHub"
    },
  ]

}
