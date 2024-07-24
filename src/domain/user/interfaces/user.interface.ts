export interface UserInterface {
  id: number;
  userId: string;
  name: string;
  email: string;
  emailAuthenticated: boolean;
  password: string;
  features: string[];
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
