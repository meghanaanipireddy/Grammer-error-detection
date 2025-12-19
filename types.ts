
export interface Token {
  word: string;
  pos: string;
  dependency: string;
  role: 'Subject' | 'Verb' | 'Object' | 'Modifier' | 'Other';
}

export interface GrammarIssue {
  detected: boolean;
  explanation: string;
  correctedSentence: string;
}

export interface AnalysisResponse {
  originalSentence: string;
  tokens: Token[];
  syntacticSummary: string;
  grammarIssues: GrammarIssue;
  improvedSuggestion: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
