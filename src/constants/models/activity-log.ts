export interface IActivityLog {
  id: string;
  event: string;
  model: string;
  modelId: string;
  data: any;
  createdAt: string;
  createdBy: string;
}

export interface ActivityLogCompare {
  currentLog: IActivityLog,
  previousLog: IActivityLog
}