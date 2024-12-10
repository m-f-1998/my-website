import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

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
