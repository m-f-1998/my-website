import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { ApiService } from "@services/api.service"
import { IconService } from "@services/icons.service"
import { SectionHeadingComponent } from "../section-heading/section-heading.component"
import { CountUpDirective } from "@app/directives/count-up.directive"

interface ContributionDay {
  date: string
  count: number
  level: number
  weekday: number
}

interface ContributionsResponse {
  totalContributions: number
  weeks: ContributionDay [ ] [ ]
  users: string [ ]
  source: "graphql" | "events"
}

@Component ( {
  selector: "app-github-activity",
  imports: [
    FaIconComponent,
    SectionHeadingComponent,
    CountUpDirective
  ],
  templateUrl: "./github-activity.component.html",
  styleUrl: "./github-activity.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class GithubActivityComponent implements OnInit {
  public readonly iconSvc = inject ( IconService )
  private readonly apiSvc = inject ( ApiService )

  public weeks = signal<ContributionDay [ ] [ ]> ( [ ] )
  public totalContributions = signal ( 0 )
  public users = signal<string [ ]> ( [ ] )
  public source = signal<"graphql" | "events" | null> ( null )
  public loading = signal ( true )
  public error = signal ( false )
  public tooltip = signal<{ text: string; x: number; y: number } | null> ( null )

  public readonly monthLabels = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  public readonly weekdayLabels = [ "", "Mon", "", "Wed", "", "Fri", "" ]

  public ngOnInit ( ) {
    this.apiSvc.get<ContributionsResponse> ( "/api/github/contributions" )
      .then ( response => {
        this.weeks.set ( response.weeks ?? [ ] )
        this.totalContributions.set ( response.totalContributions ?? 0 )
        this.users.set ( response.users ?? [ ] )
        this.source.set ( response.source ?? null )
        this.loading.set ( false )
      } )
      .catch ( () => {
        this.error.set ( true )
        this.loading.set ( false )
      } )
  }

  public monthMarkers ( ): { label: string; index: number } [ ] {
    const weeks = this.weeks ( )
    const markers: { label: string; index: number } [ ] = [ ]
    let lastMonth = -1

    weeks.forEach ( ( week, index ) => {
      const firstDay = week [ 0 ]
      if ( !firstDay ) return
      const month = new Date ( `${firstDay.date}T00:00:00` ).getMonth ( )
      if ( month !== lastMonth ) {
        markers.push ( { label: this.monthLabels [ month ], index } )
        lastMonth = month
      }
    } )

    return markers
  }

  public dayTooltip ( day: ContributionDay ): string {
    const date = new Date ( `${day.date}T00:00:00` ).toLocaleDateString ( "en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    } )
    const noun = day.count === 1 ? "contribution" : "contributions"
    return `${day.count} ${noun} on ${date}`
  }

  public showTooltip ( day: ContributionDay, event: Event ) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect ( )
    this.tooltip.set ( {
      text: this.dayTooltip ( day ),
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    } )
  }

  public hideTooltip ( ) {
    this.tooltip.set ( null )
  }
}
