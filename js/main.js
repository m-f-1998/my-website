function sendEmail(event) {
  event.preventDefault();
  var subject = document.getElementsByName('subject')[0].value;
  var message = document.getElementsByName('message')[0].value;
  var email = "admin@matthewfrankland.co.uk";
  var href = "mailto:" + email + "?subject=" + subject + "&body=" + message;
  window.location.href = href;
}
addEventListener("submit", sendEmail);

window.addEventListener ( "load", ( ) => {
  if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme','dark')
  } else {
    document.documentElement.setAttribute('data-bs-theme','light')
  }
}, { passive: true });