import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"
import { FooterComponent } from "../../components/footer/footer.component"

@Component ( {
  selector: "app-recallwatch-privacy",
  imports: [ FooterComponent, RouterLink ],
  templateUrl: "./privacy.component.html",
  styleUrl: "./privacy.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class RecallwatchPrivacyComponent implements OnInit {
  private readonly title = inject ( Title )

  public ngOnInit ( ): void {
    this.title.setTitle ( "Recall Watch Privacy Policy — Matthew Frankland" )
  }
}
