import { Component, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatchService } from '../../services/match';
import { User } from '../../services/user';
import { MatchCard } from './match-card/match-card';

@Component({
  selector: 'pm-dashboard',
  imports: [MatchCard, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly matchService = inject(MatchService);
  private readonly userService = inject(User);

  // Active filter tab
  readonly activeTab = signal<'all' | 'scheduled' | 'live' | 'finished'>('all');

  // Reactive computed matches based on tab filter
  readonly filteredMatches = computed(() => {
    const tab = this.activeTab();
    switch (tab) {
      case 'live':
        return this.matchService.liveMatches();
      case 'scheduled':
        return this.matchService.scheduledMatches();
      case 'finished':
        return this.matchService.finishedMatches();
      default:
        return this.matchService.matchesWithPredictions();
    }
  });

  // Expose user stats to the sidebar
  readonly stats = this.userService.stats;

  // Handler to change active tab filter
  setTab(tab: 'all' | 'scheduled' | 'live' | 'finished') {
    this.activeTab.set(tab);
  }
}
