import { ChangeDetectionStrategy, Component } from "@angular/core"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { HeaderComponent } from "../components/header/header.component"
import { AboutComponent } from "../components/about/about.component"
import { SkillsComponent } from "../components/skills/skills.component"
import { ProjectsComponent } from "../components/projects/projects.component"
import { ContactComponent } from "../components/contact/contact.component"
import { FooterComponent } from "../components/footer/footer.component"
import { ExperienceComponent } from "../components/experience/experience.component"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    NavbarComponent,
    HeaderComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
