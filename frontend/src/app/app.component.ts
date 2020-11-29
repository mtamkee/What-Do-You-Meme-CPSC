import { Component } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient, private router: Router) { }


  title = 'What Do You MEME? CPSC';
  /*dummy(): void {
    this.http.post('/dummy', {
      
    });
  }*/
  goToLobby(): String { 

    this.router.navigate(['/lobby']);
    console.log('yup');

    return '';
  }

}


