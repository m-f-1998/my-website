import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core"
import { ImgShimmerDirective } from "@app/directives/img-shimmer.directive"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { IconService } from "@services/icons.service"
import { SectionHeadingComponent } from "../section-heading/section-heading.component"

interface ProjectLink {
  url: string
  label: string
}

interface Project {
  imageUrl: string
  altTag: string
  title: string
  description: string
  fullText: boolean
  tags?: string[]
  nda?: boolean
  featured?: boolean
  links: ProjectLink[]
}

@Component ( {
  selector: "app-projects",
  imports: [
    ImgShimmerDirective,
    FaIconComponent,
    SectionHeadingComponent
  ],
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ProjectsComponent {
  public readonly iconSvc = inject ( IconService )

  private readonly initialVisible = 4

  public showAll = signal ( false )

  public projects: Project [ ] = [
    {
      imageUrl: "project-revive-scotland.png",
      altTag: "Revive Scotland",
      title: "Revive Scotland",
      description: "Full-stack website for Revive Scotland — event management, gallery, content admin, and public-facing pages. Built with Angular, Fastify, and deployed via Docker with Cloudflare integration.",
      fullText: false,
      featured: true,
      tags: [ "Angular", "Fastify", "Docker", "TypeScript" ],
      links: [
        { url: "https://revivescotland.co.uk", label: "Live Site" },
        { url: "https://github.com/m-f-1998/revive-scotland", label: "GitHub" }
      ]
    },
    {
      imageUrl: "project-borders-catholic.png",
      altTag: "Borders Catholic",
      title: "Borders Catholic",
      description: "Church website for Ss Mary and David's in the Scottish Borders — schedules, news, and parish information with a modern responsive design.",
      fullText: false,
      featured: true,
      tags: [ "Angular", "TypeScript" ],
      links: [
        { url: "https://borderscatholic.co.uk", label: "Live Site" },
        { url: "https://github.com/m-f-1998/borders-catholic", label: "GitHub" }
      ]
    },
    {
      imageUrl: "project-iqx-npm.png",
      altTag: "quick-pdf and ngx-toastr npm packages",
      title: "quick-pdf & ngx-toastr",
      description: "Open-source npm packages — @iqx-limited/quick-pdf converts PDFs to images in Node.js, and @m-f-1998/ngx-toastr brings toast notifications to Angular apps.",
      fullText: false,
      tags: [ "npm", "Open Source", "TypeScript" ],
      links: [
        { url: "https://www.npmjs.com/package/@iqx-limited/quick-pdf", label: "quick-pdf" },
        { url: "https://www.npmjs.com/package/@m-f-1998/ngx-toastr", label: "ngx-toastr" },
        { url: "https://github.com/IQXLimited/quickpdf", label: "quick-pdf GitHub" },
        { url: "https://github.com/m-f-1998/ngx-toastr", label: "ngx-toastr GitHub" }
      ]
    },
    {
      imageUrl: "project-3.webp",
      altTag: "The Hawick Paper",
      title: "The Hawick Paper",
      description: "Cross-platform mobile app on iOS and Android for my local newspaper.",
      fullText: false,
      tags: [ "Capacitor", "Mobile" ],
      links: [
        { url: "https://apps.apple.com/us/app/the-hawick-paper/id1520637565", label: "iOS App Store" }
      ]
    },
    {
      imageUrl: "project-1.jpg",
      altTag: "Trench Heating Project",
      title: "Trench Heating Specification Tool",
      description: "An online PDF specification generator which provides the best Trench Heating solution for a customer's large scale project.",
      fullText: false,
      nda: true,
      tags: [ "PHP", "Enterprise" ],
      links: [
        { url: "https://www.turnbull-scott.co.uk/heating/perimeter-trench-heating/product-specification-selection-tool/", label: "View the Website" }
      ]
    },
    {
      imageUrl: "project-2.jpeg",
      altTag: "AvediaStream",
      title: "Solution Builder",
      description: "AvediaStream is an Exterity IP Digital Media platform. Solution Builder generates specifications for customers based upon their setup, including compatibility, price and requirements.",
      fullText: false,
      nda: true,
      tags: [ "JavaScript", "Enterprise" ],
      links: []
    },
    {
      imageUrl: "project-5.png",
      altTag: "Honours Degree Dissertation",
      title: "Honours Dissertation",
      description: "A prototype Learning Management System delivered as part of my Honours Dissertation, using a distributed client-server architecture.",
      fullText: false,
      tags: [ "Academic" ],
      links: [
        { url: "https://github.com/m-f-1998/university/blob/master/honours_dissertation/dissertation.pdf", label: "Read My Paper" }
      ]
    },
    {
      imageUrl: "project-4.png",
      altTag: "1962 Ordo App",
      title: "1962 Liturgical Ordo",
      description: "An App for Traditional Catholics sold worldwide on iOS.",
      fullText: false,
      tags: [ "Swift", "iOS" ],
      links: [
        { url: "https://apps.apple.com/in/app/1962-liturgical-ordo/id6450934181", label: "iOS App Store" }
      ]
    }
  ]

  public readonly visibleProjects = computed ( ( ) => {
    return this.showAll ( )
      ? this.projects
      : this.projects.slice ( 0, this.initialVisible )
  } )

  public readonly hiddenCount = computed ( ( ) => {
    return Math.max ( 0, this.projects.length - this.initialVisible )
  } )

  public toggleShowAll ( ) {
    const expanding = !this.showAll ( )
    this.showAll.set ( expanding )

    if ( !expanding ) {
      document.getElementById ( "projects" )?.scrollIntoView ( { behavior: "smooth", block: "start" } )
    }
  }

  public readmore ( project: Project ) {
    project.fullText = !project.fullText
  }

  public openSource = [
    {
      name: "@m-f-1998/ngx-toastr",
      description: "Angular toast library — published to npm and used across my projects.",
      links: [
        { url: "https://www.npmjs.com/package/@m-f-1998/ngx-toastr", label: "npm" },
        { url: "https://github.com/m-f-1998/ngx-toastr", label: "GitHub" }
      ]
    },
    {
      name: "my-website",
      description: "This portfolio — Angular, Fastify, Sharp, Docker.",
      links: [
        { url: "https://github.com/m-f-1998/my-website", label: "GitHub" }
      ]
    }
  ]

}
