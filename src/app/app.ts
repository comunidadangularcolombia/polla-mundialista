import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'pm-root',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
