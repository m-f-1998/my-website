import { Service, inject } from "@angular/core"
import { FaIconLibrary } from "@fortawesome/angular-fontawesome"
import { MockFaIconLibrary } from "@fortawesome/angular-fontawesome/testing"
import { IconName, IconPrefix, IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFacebook, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons"
import {
  faSpinner, faCheck, faExclamationTriangle,
  faCode, faFolderOpen, faBriefcase, faEnvelope, faHome, faUser, faChevronDown,
  faStar, faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons"

@Service ( { } )
export class IconService {
  public readonly faLibrary = inject ( FaIconLibrary )

  public constructor ( ) {
    const faLibrary = this.faLibrary

    if ( !( faLibrary instanceof MockFaIconLibrary ) ) {
      faLibrary.addIcons (
        faFacebook, faLinkedin, faGithub,
        faSpinner, faCheck, faExclamationTriangle,
        faCode, faFolderOpen, faBriefcase, faEnvelope, faHome, faUser, faChevronDown,
        faStar, faArrowUpRightFromSquare
      )
    }
  }

  public getIcon ( prefix: IconPrefix, name: IconName ): IconProp {
    const definition = this.faLibrary.getIconDefinition ( prefix, name )
    if ( definition ) {
      return { prefix, iconName: name }
    }
    return {
      prefix: "fas",
      iconName: "warning"
    }
  }
}