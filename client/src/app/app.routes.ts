import { Routes } from "@angular/router"
import { HttpErrorComponent } from "./http-error/http-error.component"
import { HomeComponent } from "./home/home.component"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "error/:code", component: HttpErrorComponent },
  { path: "**", redirectTo: "/error/404" }
]
