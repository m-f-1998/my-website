import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"

import { routes } from "./app.routes"
import { provideToastr } from "ngx-toastr"
import { provideHttpClient } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha-2"

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection ( ),
    provideRouter ( routes ),
    provideToastr ( {
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      progressBar: true,
      tapToDismiss: true,
      autoDismiss: true,
      timeOut: 4000,
      extendedTimeOut: 3000
    } ),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6LebYqIqAAAAAPIyOGWY_YD4i55xHdhpO9tOvK5r"
    },
    provideHttpClient ( ),
    provideAnimations ( )
  ]
}
