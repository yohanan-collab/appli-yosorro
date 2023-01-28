import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  linkwebsite = "https://frederic-lossignol.com";
  linkangularprogramm = "https://frederic-lossignol.com/formations/angular/1";

  constructor() { }

  ngOnInit() {
  }

}