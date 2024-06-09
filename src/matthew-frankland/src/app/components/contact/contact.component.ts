import { Component } from "@angular/core";

@Component ( {
  selector: "app-contact",
  standalone: true,
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss"
} )
export class ContactComponent {

  public sendEmail ( event: Event ) {
    event.preventDefault();
    var subject = (<HTMLInputElement>document.getElementsByName("subject")[0]).value;
    var message = (<HTMLInputElement>document.getElementsByName("message")[0]).value;
    var email = "admin@matthewfrankland.co.uk";
    var href = "mailto:" + email + "?subject=" + subject + "&body=" + message;
    window.location.href = href;
  }

}
