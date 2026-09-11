import { Routes } from "@angular/router"
import { HomeComponent } from "./home/home.component"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "certwatch",
    children: [
      {
        path: "",
        loadComponent: ( ) => import ( "./certwatch/certwatch.component" ).then ( m => m.CertwatchComponent )
      },
      {
        path: "privacy",
        loadComponent: ( ) => import ( "./certwatch/privacy/privacy.component" ).then ( m => m.CertwatchPrivacyComponent )
      }
    ]
  },
  {
    path: "error/:code",
    loadComponent: ( ) => import ( "./http-error/http-error.component" ).then ( m => m.HttpErrorComponent )
  },
  { path: "**", redirectTo: "/error/404" }
]
