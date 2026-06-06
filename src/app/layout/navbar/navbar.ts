import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { User } from '../../services/user';

@Component({
  selector: 'pm-navbar',
  imports: [DecimalPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly userService = inject(User);

  // Expose signals to the template
  readonly profile = this.userService.profile;
  readonly stats = this.userService.stats;
}
