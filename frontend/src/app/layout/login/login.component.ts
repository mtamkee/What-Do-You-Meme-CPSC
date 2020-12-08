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
 
  @Input()
  public get logout(): boolean {
    return this._logout;
  }
  public set logout(value: boolean) {
    console.log("Login component: logout value changed to " + value);
    this._logout = value;
    if (this._logout === true) {
      this.callSignOut();
    }
  }

  @Output() loginEvent = new EventEmitter<{id: string, username: string}>(true);

  constructor(public auth: AngularFireAuth) {
    // this.auth.onAuthStateChanged((user) => {
    //   if (user !== null) {
    //     this.userName = user.displayName || user.email;
    //      // This gets called on logout for some reason... 
    //      // Guess Firebase is passing in a usser object when it should be null...
    //     //this.loginEvent.emit({id: user.uid, username: this.userName});
    //     //this._showSignIn = false;
    //   } else {
    //     this.userName = null;
    //     //this._showSignIn = true;
    //   }
    // });
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
        this.loginEvent.emit({id: user.user.uid, username: user.user.displayName});
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
        // ...
        this.clearErrorMessage();
        this.loginEvent.emit({id: user.user.uid, username: user.user.email})
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
        this.loginEvent.emit({id: user.user.uid, username: user.user.email})
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.showErrorMessage(errorMessage);
        this.toggleSignUp();
      });

      this.toggleSignUp();
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
