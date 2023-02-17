export interface ITodoResponse {
  createdAt: string;
  text: string;
  isCompleted: boolean;
  id: string;
}

export interface ITodoInvalidResponse {
  msg: string;
}