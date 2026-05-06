import { Injectable } from "@angular/core"

@Injectable ( {
  providedIn: "root"
} )
export class ScrollService {

  public scrollTo ( id: string ): void {
    document.getElementById ( id )?.scrollIntoView ( { behavior: "smooth", block: "start" } )
  }

}
