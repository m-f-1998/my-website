import { Service } from "@angular/core"

@Service ( )
export class ScrollService {

  public scrollTo ( id: string ): void {
    document.getElementById ( id )?.scrollIntoView ( { behavior: "smooth", block: "start" } )
  }

  public scrollToTop ( ): void {
    document.documentElement.scrollTo ( { top: 0, behavior: "smooth" } )
  }

}
