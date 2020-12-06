import { Component} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public showSignUp = false;
  public showSignIn;
  public showSignInForm = false;
  public showSignInButtons = true;
  public emailInput: string;
  public passwordInput: string;
  public errorMessageText: string;
  public userName: string;

  constructor(public auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userName = user.displayName || user.email;
        this.showSignIn = false;
      } else {
        this.userName = null;
        this.showSignIn = true;
      }
    });
  }

  toggleSignUp() {
    this.showSignUp = !this.showSignUp;
    this.showSignInButtons = true;
  }

  toggleSignInForm() {
    this.showSignInForm = !this.showSignInForm;
    this.showSignInButtons = true;
  }
S
  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithEmail() {
    this.auth.signInWithEmailAndPassword(this.emailInput, this.passwordInput)
      .then((user) => {
        // Signed in 
        // ...
        this.clearErrorMessage();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
        this.toggleSignInForm();
      });
      this.showSignInForm = false;
  }

  signUpWithEmail() {
    this.auth.createUserWithEmailAndPassword(this.emailInput, this.passwordInput)
      .then((user) => {
        // Signed in 
        // ...
        this.clearErrorMessage();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
        this.toggleSignUp();
      });

      this.toggleSignUp();
  }
  
  logout() {
    this.auth.signOut();
    this.showSignIn = true;
  }

  showErrorMessage(message: string) {
    this.errorMessageText = message;
    setTimeout(() => {
      this.errorMessageText = "";
    }, 3000);
  }
  
  clearErrorMessage() {
    this.errorMessageText = "";
  }

}
