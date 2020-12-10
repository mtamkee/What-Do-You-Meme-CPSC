import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  constructor(private router: Router) { }

  title = "What Do You Meme? CPSC";


  appRouterActive() {
    console.log("App router outlet was activated.")
  }




  ngOnInit(): void {

  }


}
