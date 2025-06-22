export interface WaitlistRecord {
    id: number;
    userType: string;
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    zipCode?: string;
    waitPosition?: number;
    createdAt: string;
  }
  