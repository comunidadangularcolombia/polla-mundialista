import { Component, inject, signal, linkedSignal } from '@angular/core';
import { User } from '../../services/user';

@Component({
  selector: 'pm-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly userService = inject(User);

  // Expose user profile signal
  readonly profile = this.userService.profile;

  // Toggle edit state
  readonly editMode = signal(false);

  // Form inputs using linkedSignal (synced with service state)
  readonly nameInput = linkedSignal(() => this.profile().name);
  readonly emailInput = linkedSignal(() => this.profile().email);

  // Notification toggles
  readonly liveAlerts = signal(true);
  readonly finalResults = signal(false);

  // Password change feedback
  readonly passwordMessage = signal<string | null>(null);

  // Profile save action
  toggleEdit() {
    if (this.editMode()) {
      // Save changes to the service
      this.userService.updateProfile(this.nameInput(), this.emailInput());
      this.editMode.set(false);
    } else {
      this.editMode.set(true);
    }
  }

  // Handle inputs
  onNameChange(event: Event) {
    this.nameInput.set((event.target as HTMLInputElement).value);
  }

  onEmailChange(event: Event) {
    this.emailInput.set((event.target as HTMLInputElement).value);
  }

  // Live Alerts toggle
  toggleLiveAlerts() {
    this.liveAlerts.update(v => !v);
  }

  // Final Results toggle
  toggleFinalResults() {
    this.finalResults.update(v => !v);
  }

  // Simulate password change
  changePassword() {
    this.passwordMessage.set('¡Contraseña actualizada con éxito!');
    setTimeout(() => this.passwordMessage.set(null), 3000);
  }
}
