export enum TabId {
  CONCEPT = 'concept',
  ATOMICITY = 'atomicity',
  CONSISTENCY = 'consistency',
  ISOLATION = 'isolation',
  DURABILITY = 'durability',
  QUIZ = 'quiz'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface SimulationStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'success' | 'failed' | 'rolled_back';
}