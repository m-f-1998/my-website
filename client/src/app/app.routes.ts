import { Routes } from "@angular/router"
import { HomeComponent } from "./home/home.component"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "error/:code",
    loadComponent: ( ) => import ( "./http-error/http-error.component" ).then ( m => m.HttpErrorComponent )
  },
  { path: "**", redirectTo: "/error/404" }
]
