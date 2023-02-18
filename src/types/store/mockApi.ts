

export interface ITodoResponse {
  createdAt: string;
  text: string;
  isCompleted: boolean;
  id: string;
  x: number;
  y: number;
}

export interface ITodoInvalidResponse {
  msg: string;
}