import { Component, inject, input, signal, linkedSignal } from '@angular/core';
import { Match } from '../../../models/match.model';
import { MatchService } from '../../../services/match';
import { AppError } from '../../../models/app-error.model';

@Component({
  selector: 'pm-match-card',
  imports: [],
  templateUrl: './match-card.html',
  styleUrl: './match-card.css',
})
export class MatchCard {
  private readonly matchService = inject(MatchService);

  // Signal input of the match, including potential prediction details
  readonly match = input.required<Match & { prediction?: { homeScore: number; awayScore: number } }>();

  // Linked signals to manage local draft scores reactively synced with existing prediction
  readonly homeScoreInput = linkedSignal<number>(() => this.match().prediction?.homeScore ?? 0);
  readonly awayScoreInput = linkedSignal<number>(() => this.match().prediction?.awayScore ?? 0);

  // Business error message signal
  readonly errorDetails = signal<AppError | null>(null);
  readonly successMsg = signal<string | null>(null);

  // Score mutations
  incrementHome() {
    this.clearMessages();
    if (this.homeScoreInput() < 9) {
      this.homeScoreInput.update(v => v + 1);
    }
  }

  decrementHome() {
    this.clearMessages();
    if (this.homeScoreInput() > 0) {
      this.homeScoreInput.update(v => v - 1);
    }
  }

  incrementAway() {
    this.clearMessages();
    if (this.awayScoreInput() < 9) {
      this.awayScoreInput.update(v => v + 1);
    }
  }

  decrementAway() {
    this.clearMessages();
    if (this.awayScoreInput() > 0) {
      this.awayScoreInput.update(v => v - 1);
    }
  }

  // Handle score change from text input
  onHomeInputChange(event: Event) {
    this.clearMessages();
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 0 && val <= 9) {
      this.homeScoreInput.set(val);
    } else {
      this.homeScoreInput.set(0);
    }
  }

  onAwayInputChange(event: Event) {
    this.clearMessages();
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 0 && val <= 9) {
      this.awayScoreInput.set(val);
    } else {
      this.awayScoreInput.set(0);
    }
  }

  // Save the prediction
  onSavePrediction() {
    this.clearMessages();
    const isUpdate = !!this.match().prediction;
    const result = this.matchService.savePrediction(
      this.match().id,
      this.homeScoreInput(),
      this.awayScoreInput(),
      isUpdate
    );

    if (result.success) {
      this.successMsg.set(isUpdate ? '¡Pronóstico actualizado!' : '¡Pronóstico guardado!');
      // Auto clear success after 3 seconds
      setTimeout(() => this.successMsg.set(null), 3000);
    } else {
      this.errorDetails.set(result.error);
    }
  }

  private clearMessages() {
    this.errorDetails.set(null);
    this.successMsg.set(null);
  }
}
