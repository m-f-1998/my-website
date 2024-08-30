import { HttpClient } from "@angular/common/http"
import { AfterViewInit, Component } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons"

@Component ( {
  selector: "app-contact",
  standalone: true,
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
  imports: [
    FaIconComponent,
    ReactiveFormsModule
  ]
} )
export class ContactComponent implements AfterViewInit {
  public processing = false
  public error = false
  public success = false
  public message = ""

  public contactForm: FormGroup = this.formSvc.group ( {
    subject: [ "", Validators.required ],
    message: [ "", Validators.required ],
    turnstileToken: [ null, Validators.required ]
  } )
  public turnstileToken: string | null = null

  public faSpinner = faSpinner
  public faCheck = faCheck
  public faExclamationTriangle = faExclamationTriangle

  public constructor (
    private toastrSvc: ToastrService,
    private httpSvc: HttpClient,
    private formSvc: FormBuilder
  ) { }

  public ngAfterViewInit ( ) {
    this.renderAllTurnstiles ( )
  }

  public onTurnstileToken ( token: string ) {
    this.turnstileToken = token
    this.contactForm.patchValue ( { turnstileToken: token } )
  }

  public renderAllTurnstiles ( ) {
    const turnstileElements = document.querySelectorAll ( ".cf-turnstile" )

    turnstileElements.forEach ( element => {
      ( window as any ).turnstile.render ( element, {
        sitekey: "0x4AAAAAAAiWn0sdYI4o7tDr",
        callback: ( token: string ) => this.onTurnstileToken ( token )
      } )
    } )
  }

  public sendEmail ( ) {
    if ( this.contactForm.invalid ) {
      this.toastrSvc.error ( "Please complete all fields" )
      return
    }
    const formData = new FormData ( )
    formData.append ( "subject", this.contactForm.value.subject )
    formData.append ( "message", this.contactForm.value.message )
    formData.append ( "cf-turnstile-response", this.contactForm.value.turnstileToken )

    this.processing = true
    this.httpSvc.post ( "https://api.matthewfrankland.co.uk/mailer/", formData ).subscribe ( {
      next: ( ) => {
        this.message = "Email sent!"
        this.success = true
        this.processing = false
      },
      error: ( e ) => {
        this.error = true
        this.message = "An Error Occurred. Please Try Again Later."
        console.error ( e )
        this.processing = false
      }
    } )
  }

}
