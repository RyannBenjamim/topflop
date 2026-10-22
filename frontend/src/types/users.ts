export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  email_verified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserSummary = Pick<User, 'id' | 'username' | 'email' | 'name'>;

export interface ProfileOutletContext {
  profileUser: User;
  isMyProfile: boolean;
  followersVersion: number;
}

export interface UserProfilePicture {
  avatarUrl: string | null;
  avatarPath: string | null;
}
