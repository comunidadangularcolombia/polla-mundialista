import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../services/user';

@Component({
  selector: 'pm-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly userService = inject(User);

  // Expose user stats to the template
  readonly stats = this.userService.stats;
}
