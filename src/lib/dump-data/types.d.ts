export declare interface Tool {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export declare interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  isPaid: boolean;
  paymentDate: string | null;
  stripeSessionId: string | null;
  bitrix24ContactId: number | null;
  bitrix24DealId: number | null;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}
