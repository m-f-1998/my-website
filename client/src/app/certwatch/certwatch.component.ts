import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"
import { FooterComponent } from "../components/footer/footer.component"

@Component ( {
  selector: "app-certwatch",
  imports: [ FooterComponent, RouterLink ],
  templateUrl: "./certwatch.component.html",
  styleUrl: "./certwatch.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CertwatchComponent implements OnInit {
  private readonly title = inject ( Title )

  public ngOnInit ( ): void {
    this.title.setTitle ( "CertWatch — Matthew Frankland" )
  }
}
