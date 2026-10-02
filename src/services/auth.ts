import { UserProfile } from '../types';
import { dbService } from './db';

const SESSION_KEY = 'sahayak_current_user';
const USERS_KEY = 'sahayak_registered_users';

interface StoredUser {
  profile: UserProfile;
  passwordHash: string;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_ramesh_demo_01',
  user_id: 'usr_ramesh_demo_01',
  full_name: 'Ramesh Sharma',
  shop_name: 'Sharma Kirana & General Store',
  email: 'ramesh.sharma@kirana.in',
  phone: '+91 98201 45892',
  preferred_language: 'hi-IN',
  created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  updated_at: new Date().toISOString(),
};

class AuthService {
  private getRegisteredUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        // Seed default demo user
        const initial = [{
          profile: DEFAULT_DEMO_USER,
          passwordHash: 'demo123'
        }];
        localStorage.setItem(USERS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveRegisteredUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  public getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public signup(
    fullName: string,
    shopName: string,
    email: string,
    password: string,
    preferredLanguage: 'hi-IN' | 'mr-IN' | 'en-IN' = 'hi-IN'
  ): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();

    if (users.some(u => u.profile.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newId = 'usr_' + Math.random().toString(36).substring(2, 10);
    const newProfile: UserProfile = {
      id: newId,
      user_id: newId,
      full_name: fullName.trim(),
      shop_name: shopName.trim(),
      email: cleanEmail,
      preferred_language: preferredLanguage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push({
      profile: newProfile,
      passwordHash: password
    });
    this.saveRegisteredUsers(users);

    // Set current active session
    localStorage.setItem(SESSION_KEY, JSON.stringify(newProfile));

    // Initialize initial catalog demo for smooth onboard
    dbService.loadDemoShop(newId);

    return { success: true, user: newProfile };
  }

  public login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const found = users.find(u => u.profile.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No shop account found with this email address.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(found.profile));
    dbService.initUserCatalog(found.profile.user_id);
    return { success: true, user: found.profile };
  }

  public loginDemoUser(): UserProfile {
    const users = this.getRegisteredUsers();
    let demo = users.find(u => u.profile.user_id === DEFAULT_DEMO_USER.user_id);

    if (!demo) {
      demo = { profile: DEFAULT_DEMO_USER, passwordHash: 'demo123' };
      users.push(demo);
      this.saveRegisteredUsers(users);
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(demo.profile));
    dbService.initUserCatalog(demo.profile.user_id);
    return demo.profile;
  }

  public updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.profile.user_id === userId);
    if (idx === -1) return null;

    users[idx].profile = {
      ...users[idx].profile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveRegisteredUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx].profile));
    return users[idx].profile;
  }

  public logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}

export const authService = new AuthService();
