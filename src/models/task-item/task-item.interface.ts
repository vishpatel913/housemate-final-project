export interface TaskItem {
  id: string;
  text: string;
  createdby: string;
  // user: string;
  category: string;
  timecreated: number;
  timedone: number;
  // priority: number;
  done: boolean;
}

export interface CategoryObject {
  name: string;
  color: string;
}
