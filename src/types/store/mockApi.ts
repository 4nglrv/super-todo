

export interface ITodoResponse {
  createdAt: string;
  text: string;
  isCompleted: boolean;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ITodoInvalidResponse {
  msg: string;
}