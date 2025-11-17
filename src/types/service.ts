export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};
