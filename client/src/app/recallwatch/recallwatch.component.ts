import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"
import { FooterComponent } from "../components/footer/footer.component"

@Component ( {
  selector: "app-recallwatch",
  imports: [ FooterComponent, RouterLink ],
  templateUrl: "./recallwatch.component.html",
  styleUrl: "./recallwatch.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class RecallwatchComponent implements OnInit {
  private readonly title = inject ( Title )

  public ngOnInit ( ): void {
    this.title.setTitle ( "Recall Watch — Matthew Frankland" )
  }
}
