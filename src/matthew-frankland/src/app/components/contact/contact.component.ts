import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

@Component ( {
  selector: "app-contact",
  standalone: true,
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
  imports: [
    FaIconComponent
  ]
} )
export class ContactComponent {
  public processing = false

  public faSpinner = faSpinner

  public constructor (
    private toastrSvc: ToastrService,
    private httpSvc: HttpClient
  ) { }

  // public async handlePost ( request ) {
  //   const body = await request.formData ( )
  //   // Turnstile injects a token in "cf-turnstile-response".
  //   const token = body.get ( "cf-turnstile-response" )
  //   const ip = request.headers.get ( "CF-Connecting-IP" )

  //   // Validate the token by calling the
  //   // "/siteverify" API endpoint.
  //   let formData = new FormData ( )
  //   formData.append ( "secret", "0x4AAAAAAAiWn5CHk99L8WAV7ePNR0AAuRA" )
  //   formData.append ( "response", token )
  //   formData.append ( "remoteip", ip )

  //   const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
  //   const result = await fetch ( url, {
  //     body: formData,
  //     method: "POST",
  //   } )

  //   const outcome = await result.json(  )
  //   if ( outcome.success ) {
  //     // ...
  //   }
  // }

  public sendEmail ( event: Event ) {
    event.preventDefault ( )
    // Get form data from event

    const form = event.target as HTMLFormElement
    const formData = new FormData ( form )
    console.log ( formData )
    var subject = (<HTMLInputElement>document.getElementsByName("subject")[0]).value
    var message = (<HTMLInputElement>document.getElementsByName("message")[0]).value
    var email = "admin@matthewfrankland.co.uk"
    this.processing = true
    this.httpSvc.post ( "https://matthewfrankland.co.uk/mailer/send.php", {
      email: email,
      subject: subject,
      message: message,

    } ).subscribe ( {
      next: ( ) => {
        this.toastrSvc.success ( "Email sent!" )
        this.processing = false
      },
      error: ( e ) => {
        this.toastrSvc.error ( e.error )
        this.processing = false
      }
    } )
  }

}
