import { HttpClient } from "@angular/common/http"
import { AfterViewInit, ChangeDetectionStrategy, Component, signal } from "@angular/core"
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ContactComponent implements AfterViewInit {
  public processing = signal ( false )
  public error = signal ( false )
  public success = signal ( false )
  public message = signal ( "" )

  public contactForm: FormGroup = this.formSvc.group ( {
    subject: [ "", Validators.required ],
    message: [ "", Validators.required ],
    turnstileToken: [ null, Validators.required ]
  } )
  public turnstileToken = signal ( "" )

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
    this.turnstileToken.set ( token )
    this.contactForm.patchValue ( { turnstileToken: token } )
  }

  public renderAllTurnstiles ( ) {
    const turnstileElements = document.querySelectorAll ( ".cf-turnstile" )

    turnstileElements.forEach ( element => {
      ( window as any ).turnstile.render ( element, {
        sitekey: "0x4AAAAAAAiWn0sdYI4o7tDr",
        callback: ( token: string ) => {
          console.log ( token )
          this.onTurnstileToken ( token )
        },
        "error-callback": ( ) => {
          this.error.set ( true )
        }
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

    this.processing.set ( true )
    this.httpSvc.post ( "https://api.matthewfrankland.co.uk/mailer/", formData ).subscribe ( {
      next: ( ) => {
        this.message.set ( "Email sent!" )
        this.success.set ( true )
        this.processing.set ( false )
      },
      error: ( e ) => {
        this.error.set ( true )
        this.message.set ( "An Error Occurred. Please Try Again Later." )
        console.error ( e )
        this.processing.set ( false )
      }
    } )
  }

}
