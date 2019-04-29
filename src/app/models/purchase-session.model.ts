


export interface PurchaseSession {
  userId: string;
  status: 'ongoing' | 'completed';

  plan?:string;
  courseId?:string;
}

