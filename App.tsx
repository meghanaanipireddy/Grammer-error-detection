
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResponse } from './types';
import { analyzeText } from './services/gemini';
import { AnalysisDisplay } from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(AppState.LOADING);
    setError(null);
    try {
      const analysis = await analyzeText(inputText);
      setResult(analysis);
      setStatus(AppState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStatus(AppState.ERROR);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">LinguistAI</h1>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Syntactic Engine</span>
            </div>
          </div>
          <nav className="hidden sm:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">NLP Lab</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="max-w-2xl mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            Analyze your writing with <span className="text-indigo-600">Syntactic Intelligence.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Get real-time insights into sentence structure, part-of-speech tagging, and dependency mapping to refine your English writing.
          </p>
        </div>

        {/* Input Area */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
            <textarea
              className="w-full h-40 p-6 text-xl text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
              placeholder="Enter your sentence here (e.g., 'The cat sit on the mat.')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
            />
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Press Enter to analyze
              </div>
              <button
                onClick={handleAnalyze}
                disabled={status === AppState.LOADING || !inputText.trim()}
                className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-200"
              >
                {status === AppState.LOADING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    Synthesize Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results / Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Analysis Error</h3>
                <p>{error}</p>
                <button onClick={handleAnalyze} className="mt-4 text-sm font-bold underline">Try Again</button>
              </div>
            </div>
          </div>
        )}

        {status === AppState.SUCCESS && result && (
          <AnalysisDisplay result={result} />
        )}

        {status === AppState.IDLE && !result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
            <div className="p-6 border border-slate-200 rounded-2xl bg-white">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Grammar Check</h4>
              <p className="text-sm text-slate-500">Subject-verb agreement and tense usage verification.</p>
            </div>
            <div className="p-6 border border-slate-200 rounded-2xl bg-white">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">POS Tagging</h4>
              <p className="text-sm text-slate-500">Precise categorization of every word in your sentence.</p>
            </div>
            <div className="p-6 border border-slate-200 rounded-2xl bg-white">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Syntactic Insights</h4>
              <p className="text-sm text-slate-500">Mapping relationships between subjects, verbs, and objects.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2024 LinguistAI - Professional Writing Assistant powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
