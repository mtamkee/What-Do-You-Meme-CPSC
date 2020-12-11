import { Component, EventEmitter, Input, Output} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public showSignUp = false;
  private _logout: boolean;
  public showSignInForm = false;
  public showSignInButtons = true;
  public emailInput: string;
  public passwordInput: string;
  public errorMessageText: string;
 
  constructor(public auth: AngularFireAuth) {

  }

  toggleSignUp() {
    this.showSignUp = !this.showSignUp;
    this.showSignInButtons = true;
  }

  toggleSignInForm() {
    this.showSignInForm = !this.showSignInForm;
    this.showSignInButtons = true;
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((user) => {
        // Signed in
        this.clearErrorMessage();
      })
      .catch((error) => {
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
      });
  }

  loginWithEmail() {
    this.auth.signInWithEmailAndPassword(this.emailInput, this.passwordInput)
      .then((user) => {
        // Signed in
        this.clearErrorMessage();
        this.toggleSignInForm();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
      });
  }

  signUpWithEmail() {
    this.auth.createUserWithEmailAndPassword(this.emailInput, this.passwordInput)
      .then((user) => {
        // Signed in
        this.toggleSignUp();
        this.clearErrorMessage();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
      });
  }
  
  callSignOut() {
    this.auth.signOut();
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
