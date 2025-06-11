export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
}

export interface AIInsight {
  id: string;
  type: 'behavioral' | 'predictive' | 'comparison';
  message: string;
  impact: 'low' | 'medium' | 'high';
  suggestion?: string;
  createdAt: Date;
}