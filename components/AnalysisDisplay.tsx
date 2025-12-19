
import React from 'react';
import { AnalysisResponse, Token } from '../types';

interface Props {
  result: AnalysisResponse;
}

const TokenBadge: React.FC<{ token: Token }> = ({ token }) => {
  const roleColors: Record<string, string> = {
    Subject: 'bg-blue-100 text-blue-800 border-blue-200',
    Verb: 'bg-green-100 text-green-800 border-green-200',
    Object: 'bg-purple-100 text-purple-800 border-purple-200',
    Modifier: 'bg-orange-100 text-orange-800 border-orange-200',
    Other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className={`inline-flex flex-col items-center p-2 rounded-lg border ${roleColors[token.role]} m-1 transition-all hover:shadow-sm`}>
      <span className="text-sm font-bold">{token.word}</span>
      <span className="text-[10px] uppercase opacity-75 font-medium">{token.pos}</span>
      <span className="text-[9px] italic opacity-60">{token.role}</span>
    </div>
  );
};

export const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  const { originalSentence, tokens, syntacticSummary, grammarIssues, improvedSuggestion } = result;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Visual Tokenization */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
          Syntactic Tokenization
        </h3>
        <div className="flex flex-wrap p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {tokens.map((t, idx) => (
            <TokenBadge key={idx} token={t} />
          ))}
        </div>
      </section>

      {/* Dependency Analysis */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Syntactic Summary</h4>
          <p className="text-slate-700 leading-relaxed">{syntacticSummary}</p>
        </div>
        
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Stylistic Improvement</h4>
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-indigo-900 font-medium italic">"{improvedSuggestion}"</p>
          </div>
        </div>
      </section>

      {/* Grammar Feedback */}
      <section>
        <div className={`p-8 rounded-2xl border ${grammarIssues.detected ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} transition-colors`}>
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${grammarIssues.detected ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {grammarIssues.detected ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${grammarIssues.detected ? 'text-red-900' : 'text-emerald-900'}`}>
                {grammarIssues.detected ? 'Issues Detected' : 'Grammatically Perfect!'}
              </h3>
              <p className={`text-sm ${grammarIssues.detected ? 'text-red-700' : 'text-emerald-700'}`}>
                {grammarIssues.detected ? 'Syntactic analysis revealed structural inconsistencies.' : 'Your sentence structure is sound.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Original Sentence</span>
                <p className="text-slate-800 font-medium">{originalSentence}</p>
              </div>
              {grammarIssues.detected && (
                <div className="bg-white/50 p-4 rounded-xl">
                  <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Corrected Sentence</span>
                  <p className="text-slate-800 font-bold underline decoration-indigo-500/50">{grammarIssues.correctedSentence}</p>
                </div>
              )}
            </div>
            
            <div className="bg-white/50 p-4 rounded-xl">
              <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Detailed Explanation</span>
              <p className="text-slate-700">{grammarIssues.explanation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Raw Output Format as requested */}
      <section className="bg-slate-900 p-8 rounded-2xl text-slate-300 mono text-sm overflow-x-auto">
        <h4 className="text-slate-500 mb-4 border-b border-slate-800 pb-2">RAW OUTPUT REPORT</h4>
        <div className="space-y-2">
          <p><span className="text-indigo-400">Original Sentence:</span> {originalSentence}</p>
          <p><span className="text-indigo-400">Syntactic Analysis Summary:</span> {syntacticSummary}</p>
          <p><span className="text-indigo-400">Grammar Issues Detected:</span> {grammarIssues.detected ? 'Yes' : 'No'}</p>
          <p><span className="text-indigo-400">Explanation:</span> {grammarIssues.explanation}</p>
          <p><span className="text-indigo-400">Corrected Sentence:</span> {grammarIssues.correctedSentence}</p>
          <p><span className="text-indigo-400">Improved Writing Suggestion:</span> {improvedSuggestion}</p>
        </div>
      </section>
    </div>
  );
};
