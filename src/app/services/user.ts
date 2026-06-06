import { Injectable, signal } from '@angular/core';
import { UserProfile, UserStats } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class User {
  // User Profile signal
  readonly profile = signal<UserProfile>({
    name: 'Carlos Rodriguez',
    email: 'carlos.r@ejemplo.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgE3AFl3T53PPW7fv5urN9cO0JFh-BwvrZj7ONYkY8wQKCO1DM6XW2D6W5ikGgdiekbomimwOpJzUOot1wtMPiU_i-1pVyKAeC0j3OhGZOktzMYkXCdrNSvnoMaInlyzwOMorUQdpZriz7pJK-jmmBhZikrLjaWyDDGQyNzoEieMF4NbLHvxxJDnzpGxmXjpPvkszxdDw6hu3Q7GoZ1beSJoPL4pxreL7tRxJ5Phm8IIG0ML6Eu8tNeSkdoFAOliHliX8ouguk0ABS'
  });

  // User Stats signal
  readonly stats = signal<UserStats>({
    totalPoints: 1250,
    accuracy: 68,
    globalRank: 42
  });

  // Mutator for points (when a prediction gets evaluated, etc.)
  updatePoints(points: number) {
    this.stats.update(prev => ({
      ...prev,
      totalPoints: points
    }));
  }

  // Mutator for profile
  updateProfile(name: string, email: string) {
    this.profile.update(prev => ({
      ...prev,
      name,
      email
    }));
  }
}
