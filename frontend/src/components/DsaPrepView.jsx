import React from 'react';
import { Code2, ArrowRight, CheckCircle2, Binary, Cpu } from 'lucide-react';

export default function DsaPrepView({ onAskAI }) {
  const roadmaps = [
    {
      title: 'DSA Comprehensive Roadmap',
      desc: 'Step-by-step roadmap covering Arrays, Strings, Two Pointers, Trees, Graphs, and DP.',
      prompt: 'Give me a structured DSA preparation plan and roadmap for campus recruitment technical rounds.',
    },
    {
      title: 'Top LeetCode Coding Patterns',
      desc: 'Master essential patterns: Sliding Window, Fast/Slow Pointers, Binary Search, and BFS/DFS.',
      prompt: 'What are the top DSA and coding patterns I should focus on for technical assessments and interviews?',
    },
    {
      title: 'Dynamic Programming & Graphs Strategy',
      desc: 'Clear mental models for 1D/2D DP, memoization, shortest path algorithms, and topological sort.',
      prompt: 'How should I master Dynamic Programming and Graph algorithms for top product companies?',
    },
    {
      title: 'Time & Space Complexity Analysis',
      desc: 'Big-O cheat sheets, recursion stack analysis, and optimization techniques.',
      prompt: 'Explain how to analyze and explain time and space complexity during coding interviews.',
    },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge dsa-badge">
          <Code2 className="view-header-icon" />
        </div>
        <div>
          <h1 className="view-title">Data Structures & Algorithms (DSA)</h1>
          <p className="view-subtitle">
            Curated coding roadmaps, algorithm patterns, and AI-assisted problem-solving guidance.
          </p>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-title">DSA Study Guides</h3>
        <div className="interview-grid">
          {roadmaps.map((r, idx) => (
            <div
              key={idx}
              className="prep-action-card"
              onClick={() => onAskAI(r.prompt)}
              role="button"
              tabIndex={0}
            >
              <div className="prep-card-content">
                <div className="prep-card-icon-wrap dsa-icon-wrap">
                  <Binary className="prep-icon" />
                </div>
                <h4 className="prep-card-title">{r.title}</h4>
                <p className="prep-card-desc">{r.desc}</p>
              </div>
              <div className="prep-card-action">
                <span>Ask AI Assistant</span>
                <ArrowRight className="action-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
