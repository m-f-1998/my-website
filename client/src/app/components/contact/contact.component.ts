import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { RecaptchaV3Module, ReCaptchaV3Service } from "ng-recaptcha-2"
import { Subscription } from "rxjs"
import { ApiService } from "../../services/api.service"

@Component ( {
  selector: "app-contact",
  imports: [
    FaIconComponent,
    ReactiveFormsModule,
    RecaptchaV3Module
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ContactComponent implements OnInit, OnDestroy {
  public processing = signal ( false )
  public error = signal ( false )
  public success = signal ( false )
  public message = signal ( "" )

  public contactForm: FormGroup = new FormGroup ( {
    subject: new FormControl ( "", Validators.required ),
    message: new FormControl ( "", Validators.required )
  } )
  public captchaToken: string | null = null

  public faSpinner = faSpinner
  public faCheck = faCheck
  public faExclamationTriangle = faExclamationTriangle

  private readonly toastrSvc: ToastrService = inject ( ToastrService )
  private readonly formSvc: FormBuilder = inject ( FormBuilder )
  private readonly recaptchaSvc: ReCaptchaV3Service = inject ( ReCaptchaV3Service )
  private readonly apiSvc: ApiService = inject ( ApiService )

  private subscription: Subscription | null = null

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

    this.processing.set ( true )

    this.apiSvc.post ( "/api/mail", {
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      recaptchaToken: this.captchaToken
    } ).then ( ( ) => {
      this.message.set ( "Email sent!" )
      this.success.set ( true )
      this.processing.set ( false )
    } ).catch ( ( e: any ) => {
      this.error.set ( true )
      this.message.set ( "An Error Occurred. Please Try Again Later." )
      console.error ( e )
      this.processing.set ( false )
    } )
  }

}
