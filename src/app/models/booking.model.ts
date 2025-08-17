export interface Booking {
  _id: string;
  adId: { _id: string; title: string; img?: string };
  userId: { username: string; _id: string; email:any };
  ownerId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}