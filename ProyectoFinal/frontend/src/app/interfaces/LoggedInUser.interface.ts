export interface LoggedInUser {
  id: number;        // ← AGREGAR
  username: string;
  email: string;
  lenPassword?: number;
}