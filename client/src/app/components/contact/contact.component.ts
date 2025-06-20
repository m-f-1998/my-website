import { HttpClient } from "@angular/common/http"
import { ChangeDetectionStrategy, Component, isDevMode, OnDestroy, OnInit, signal } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { RecaptchaV3Module, ReCaptchaV3Service } from "ng-recaptcha-2"
import { Subscription } from "rxjs"

@Component ( {
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
  imports: [
    FaIconComponent,
    ReactiveFormsModule,
    RecaptchaV3Module
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ContactComponent implements OnInit, OnDestroy {
  public processing = signal ( false )
  public error = signal ( false )
  public success = signal ( false )
  public message = signal ( "" )

  public contactForm: FormGroup = this.formSvc.group ( {
    subject: [ "", Validators.required ],
    message: [ "", Validators.required ]
  } )
  public captchaToken: string | null = null
  private subscription: Subscription | null = null

  public faSpinner = faSpinner
  public faCheck = faCheck
  public faExclamationTriangle = faExclamationTriangle

  public constructor (
    private toastrSvc: ToastrService,
    private httpSvc: HttpClient,
    private formSvc: FormBuilder,
    private recaptchaSvc: ReCaptchaV3Service
  ) { }

  public ngOnInit ( ) {
    this.subscription = this.recaptchaSvc.execute ( "contactForm" ).subscribe ( {
      next: ( token: string ) => {
        this.captchaToken = token
      },
      error: ( ) => {
        this.error.set ( true )
      }
    } )
  }

  public ngOnDestroy ( ) {
    if ( this.subscription ) {
      this.subscription.unsubscribe ( )
    }
  }

  public sendEmail ( ) {
    if ( this.contactForm.invalid ) {
      this.toastrSvc.error ( "Please complete all fields" )
      return
    }

    if ( !this.captchaToken ) {
      this.toastrSvc.error ( "reCAPTCHA invalid" )
      this.error.set ( true )
      return
    }

    // const formData = new FormData ( )
    // formData.append ( "subject", this.contactForm.value.subject )
    // formData.append ( "message", this.contactForm.value.message )
    // formData.append ( "recaptcha-token", this.captchaToken )

    this.processing.set ( true )

    let url = "https://api.matthewfrankland.co.uk/api/mail/"
    if ( isDevMode ( ) ) {
      url = "http://localhost:3000/api/mail/"
    }
    this.httpSvc.post ( url, {
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      "recaptcha-token": this.captchaToken
    } ).subscribe ( {
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
