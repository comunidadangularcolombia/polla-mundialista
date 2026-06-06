import { Injectable, signal, computed } from '@angular/core';
import { Match, MatchStatus } from '../models/match.model';
import { Prediction } from '../models/prediction.model';
import { AppError } from '../models/app-error.model';

export type Result<T, E> = { success: true; data: T } | { success: false; error: E };

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  // Matches state signal
  readonly matches = signal<Match[]>([
    {
      id: '1',
      homeTeam: 'Brazil',
      awayTeam: 'Argentina',
      homeScore: 1,
      awayScore: 1,
      status: 'live',
      scheduledAt: 'Hoy, 19:30',
      minute: 65,
      homeFlag: 'BR',
      awayFlag: 'AR'
    },
    {
      id: '2',
      homeTeam: 'France',
      awayTeam: 'England',
      status: 'scheduled',
      scheduledAt: 'Hoy, 20:00',
      homeFlag: 'FR',
      awayFlag: 'EN'
    },
    {
      id: '3',
      homeTeam: 'Spain',
      awayTeam: 'Germany',
      status: 'scheduled',
      scheduledAt: 'Mañana, 15:00',
      homeFlag: 'ES',
      awayFlag: 'DE'
    },
    {
      id: '4',
      homeTeam: 'USA',
      awayTeam: 'Netherlands',
      homeScore: 1,
      awayScore: 3,
      status: 'finished',
      scheduledAt: 'Ayer, 14:00',
      homeFlag: 'US',
      awayFlag: 'NL'
    }
  ]);

  // Predictions state signal
  readonly predictions = signal<Prediction[]>([
    {
      matchId: '1',
      homeScore: 2,
      awayScore: 1,
      savedAt: new Date().toISOString()
    },
    {
      matchId: '3',
      homeScore: 1,
      awayScore: 1,
      savedAt: new Date().toISOString()
    }
  ]);

  // Computed signal combining matches with predictions
  readonly matchesWithPredictions = computed(() => {
    const preds = this.predictions();
    return this.matches().map(m => {
      const pred = preds.find(p => p.matchId === m.id);
      return {
        ...m,
        prediction: pred ? { homeScore: pred.homeScore, awayScore: pred.awayScore } : undefined
      };
    });
  });

  // Filtered computed signals
  readonly liveMatches = computed(() => 
    this.matchesWithPredictions().filter(m => m.status === 'live')
  );

  readonly scheduledMatches = computed(() => 
    this.matchesWithPredictions().filter(m => m.status === 'scheduled')
  );

  readonly finishedMatches = computed(() => 
    this.matchesWithPredictions().filter(m => m.status === 'finished')
  );

  /**
   * Registra o actualiza una predicción.
   * Si es un intento de registrar por primera vez, valida duplicados.
   * Si el partido no está programado (está en vivo o finalizado), lanza error PREDICTION_LOCKED.
   */
  savePrediction(matchId: string, homeScore: number, awayScore: number, isUpdate = false): Result<void, AppError> {
    const match = this.matches().find(m => m.id === matchId);
    if (!match) {
      return {
        success: false,
        error: {
          error: `El partido con ID ${matchId} no existe.`,
          code: 'PREDICTION_LOCKED',
          timestamp: new Date().toISOString()
        }
      };
    }

    // Regla de Negocio: PREDICTION_LOCKED
    if (match.status === 'live' || match.status === 'finished') {
      return {
        success: false,
        error: {
          error: 'No se puede guardar o modificar un pronóstico para un partido que está en vivo o finalizado.',
          code: 'PREDICTION_LOCKED',
          timestamp: new Date().toISOString()
        }
      };
    }

    const existingPrediction = this.predictions().find(p => p.matchId === matchId);

    // Regla de Negocio: DUPLICATE_PREDICTION
    // Se dispara si intentamos guardar (sin bandera isUpdate) y ya existe una predicción para este matchId.
    if (existingPrediction && !isUpdate) {
      return {
        success: false,
        error: {
          error: 'Ya existe un pronóstico registrado para este partido. Utiliza la opción de actualizar.',
          code: 'DUPLICATE_PREDICTION',
          timestamp: new Date().toISOString()
        }
      };
    }

    // Guardar / Actualizar predicción
    if (existingPrediction) {
      this.predictions.update(preds => 
        preds.map(p => p.matchId === matchId 
          ? { ...p, homeScore, awayScore, savedAt: new Date().toISOString() } 
          : p
        )
      );
    } else {
      this.predictions.update(preds => [
        ...preds,
        {
          matchId,
          homeScore,
          awayScore,
          savedAt: new Date().toISOString()
        }
      ]);
    }

    return { success: true, data: undefined };
  }

  /**
   * Simulación de cálculo de puntajes.
   * Regla de Negocio: SCORE_CALCULATION_NOT_ALLOWED
   * Lanza error si se intenta calcular el puntaje en un partido no finalizado.
   */
  calculatePredictionScore(matchId: string): Result<number, AppError> {
    const match = this.matches().find(m => m.id === matchId);
    if (!match) {
      return {
        success: false,
        error: {
          error: 'Partido no encontrado.',
          code: 'SCORE_CALCULATION_NOT_ALLOWED',
          timestamp: new Date().toISOString()
        }
      };
    }

    // Regla de Negocio: SCORE_CALCULATION_NOT_ALLOWED
    if (match.status !== 'finished') {
      return {
        success: false,
        error: {
          error: 'No se puede calcular el puntaje de la polla en un partido que aún no ha concluido.',
          code: 'SCORE_CALCULATION_NOT_ALLOWED',
          timestamp: new Date().toISOString()
        }
      };
    }

    const prediction = this.predictions().find(p => p.matchId === matchId);
    if (!prediction) {
      return { success: true, data: 0 }; // Sin predicción = 0 puntos
    }

    // Lógica básica de puntos:
    // - Acierto exacto del marcador: 3 puntos
    // - Acierto del ganador/empate pero no del marcador: 1 punto
    // - Ningún acierto: 0 puntos
    const matchHome = match.homeScore ?? 0;
    const matchAway = match.awayScore ?? 0;
    const predHome = prediction.homeScore;
    const predAway = prediction.awayScore;

    if (matchHome === predHome && matchAway === predAway) {
      return { success: true, data: 3 };
    }

    const matchWinner = matchHome > matchAway ? 'home' : matchHome < matchAway ? 'away' : 'draw';
    const predWinner = predHome > predAway ? 'home' : predHome < predAway ? 'away' : 'draw';

    if (matchWinner === predWinner) {
      return { success: true, data: 1 };
    }

    return { success: true, data: 0 };
  }
}
