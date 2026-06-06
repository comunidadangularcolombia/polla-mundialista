import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCard } from './match-card';
import { Match } from '../../../models/match.model';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MatchCard', () => {
  let component: MatchCard;
  let fixture: ComponentFixture<MatchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCard);
    component = fixture.componentInstance;

    // Set required signal input 'match'
    const mockMatch: Match = {
      id: '2',
      homeTeam: 'France',
      awayTeam: 'England',
      status: 'scheduled',
      scheduledAt: 'Hoy, 20:00',
      homeFlag: 'FR',
      awayFlag: 'EN'
    };
    fixture.componentRef.setInput('match', mockMatch);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
