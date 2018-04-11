export interface TaskItem {
  id: string; // unique id of task item
  text: string;
  createdby: string; // unique id of user that created item
  taggeduser: string; // unique id of user tagged in task
  category: string;
  timecreated: number; // timestamp of time created
  timedone: number; // timestamp of time completed
  done: boolean; // state of task completion
  // priority: number;
}

export interface CategoryObject {
  name: string;
  color: string;
}
