export interface Product {
  category_id: string;
  sub_category_id: string;
  user_id: string;
  price: string;
  description: string;
  name: string;
  status: Status;
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
