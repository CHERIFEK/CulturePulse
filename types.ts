export interface Submission {
  id: string;
  mood: number; // 1 to 5
  feedback: string;
  timestamp: number;
}

export interface ActionPlanResponse {
  points: string[];
  summary: string;
}

export enum AppView {
  SUBMIT = 'SUBMIT',
  DASHBOARD = 'DASHBOARD'
}
