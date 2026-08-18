import { ChangeDetectionStrategy, Component } from "@angular/core"
import { HeaderComponent } from "../components/header/header.component"
import { AboutComponent } from "../components/about/about.component"
import { ProjectsComponent } from "../components/projects/projects.component"
import { GithubActivityComponent } from "../components/github-activity/github-activity.component"
import { FooterComponent } from "../components/footer/footer.component"
import { ExperienceComponent } from "../components/experience/experience.component"
import { ContactComponent } from "../components/contact/contact.component"
import { SectionRevealDirective } from "../directives/section-reveal.directive"

@Component ( {
  selector: "app-home",
  imports: [
    HeaderComponent,
    AboutComponent,
    ProjectsComponent,
    ExperienceComponent,
    GithubActivityComponent,
    ContactComponent,
    FooterComponent,
    SectionRevealDirective
  ],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HomeComponent {

}
