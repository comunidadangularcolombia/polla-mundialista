import { TestBed } from '@angular/core/testing';
import { MatchService } from './match';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchService);
  });

  it('should be created', () => {
    // Arrange & Act & Assert
    expect(service).toBeTruthy();
  });

  describe('savePrediction', () => {
    it('should successfully save a new prediction on a scheduled match (Happy Path)', () => {
      // Arrange
      const matchId = '2'; // France vs England (scheduled)
      const homeScore = 3;
      const awayScore = 1;
      const initialPrediction = service.predictions().find(p => p.matchId === matchId);
      expect(initialPrediction).toBeUndefined();

      // Act
      const result = service.savePrediction(matchId, homeScore, awayScore, false);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const savedPrediction = service.predictions().find(p => p.matchId === matchId);
        expect(savedPrediction).toBeDefined();
        expect(savedPrediction?.homeScore).toBe(homeScore);
        expect(savedPrediction?.awayScore).toBe(awayScore);
      }
    });

    it('should fail with PREDICTION_LOCKED error when saving on a live match', () => {
      // Arrange
      const matchId = '1'; // Brazil vs Argentina (live)
      const homeScore = 2;
      const awayScore = 2;

      // Act
      const result = service.savePrediction(matchId, homeScore, awayScore, false);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('PREDICTION_LOCKED');
        expect(result.error.error).toContain('en vivo');
        expect(result.error.timestamp).toBeDefined();
      }
    });

    it('should fail with PREDICTION_LOCKED error when saving on a finished match', () => {
      // Arrange
      const matchId = '4'; // USA vs Netherlands (finished)
      const homeScore = 1;
      const awayScore = 1;

      // Act
      const result = service.savePrediction(matchId, homeScore, awayScore, false);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('PREDICTION_LOCKED');
        expect(result.error.error).toContain('finalizado');
        expect(result.error.timestamp).toBeDefined();
      }
    });

    it('should fail with DUPLICATE_PREDICTION when trying to save a prediction that already exists (not updating)', () => {
      // Arrange
      const matchId = '3'; // Spain vs Germany (scheduled)
      const homeScore = 2;
      const awayScore = 0;
      // Confirm a prediction already exists for this match
      const existingPrediction = service.predictions().find(p => p.matchId === matchId);
      expect(existingPrediction).toBeDefined();

      // Act
      const result = service.savePrediction(matchId, homeScore, awayScore, false); // isUpdate = false

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('DUPLICATE_PREDICTION');
        expect(result.error.error).toContain('Ya existe un pronóstico');
      }
    });

    it('should successfully update a prediction that already exists when isUpdate is true', () => {
      // Arrange
      const matchId = '3'; // Spain vs Germany (scheduled)
      const homeScore = 2;
      const awayScore = 0;
      const existingPrediction = service.predictions().find(p => p.matchId === matchId);
      expect(existingPrediction).toBeDefined();

      // Act
      const result = service.savePrediction(matchId, homeScore, awayScore, true); // isUpdate = true

      // Assert
      expect(result.success).toBe(true);
      const updatedPrediction = service.predictions().find(p => p.matchId === matchId);
      expect(updatedPrediction?.homeScore).toBe(homeScore);
      expect(updatedPrediction?.awayScore).toBe(awayScore);
    });
  });

  describe('calculatePredictionScore', () => {
    it('should fail with SCORE_CALCULATION_NOT_ALLOWED when calculation is performed on scheduled match', () => {
      // Arrange
      const matchId = '2'; // France vs England (scheduled)

      // Act
      const result = service.calculatePredictionScore(matchId);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('SCORE_CALCULATION_NOT_ALLOWED');
        expect(result.error.error).toContain('aún no ha concluido');
      }
    });

    it('should fail with SCORE_CALCULATION_NOT_ALLOWED when calculation is performed on live match', () => {
      // Arrange
      const matchId = '1'; // Brazil vs Argentina (live)

      // Act
      const result = service.calculatePredictionScore(matchId);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('SCORE_CALCULATION_NOT_ALLOWED');
        expect(result.error.error).toContain('aún no ha concluido');
      }
    });

    it('should return 3 points when prediction exactly matches finished score', () => {
      // Arrange
      // Let's create a finished match and save an exact prediction for it
      const matchId = '4'; // USA (1) vs Netherlands (3)
      // Verify match state
      const match = service.matches().find(m => m.id === matchId);
      expect(match?.status).toBe('finished');
      
      // Inject prediction manually into predictions signal
      service.predictions.update(preds => [
        ...preds,
        { matchId, homeScore: 1, awayScore: 3, savedAt: new Date().toISOString() }
      ]);

      // Act
      const result = service.calculatePredictionScore(matchId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(3);
      }
    });

    it('should return 1 point when prediction matches winner but not exact score', () => {
      // Arrange
      const matchId = '4'; // USA (1) vs Netherlands (3) - Netherlands wins
      
      // Inject prediction of 0-2 (Netherlands wins, but not exact match)
      service.predictions.update(preds => [
        ...preds,
        { matchId, homeScore: 0, awayScore: 2, savedAt: new Date().toISOString() }
      ]);

      // Act
      const result = service.calculatePredictionScore(matchId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(1);
      }
    });

    it('should return 0 points when prediction has wrong winner/result', () => {
      // Arrange
      const matchId = '4'; // USA (1) vs Netherlands (3) - Netherlands wins
      
      // Inject prediction of 2-1 (USA wins)
      service.predictions.update(preds => [
        ...preds,
        { matchId, homeScore: 2, awayScore: 1, savedAt: new Date().toISOString() }
      ]);

      // Act
      const result = service.calculatePredictionScore(matchId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });
  });
});
