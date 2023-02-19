export interface IUpdateTodo {
  id: string;
  text?: string;
  isCompleted?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export type IRemoveListenersHandle = {
  removeListeners: () => void
}