import React from 'react';

const QUICK_PROMPTS = [
  {
    id: 'eligibility',
    category: 'Placement Eligibility',
    icon: '🎓',
    prompt: 'Am I eligible for campus placements?',
  },
  {
    id: 'interview',
    category: 'Interview Preparation',
    icon: '💼',
    prompt: 'How should I prepare for a technical interview?',
  },
  {
    id: 'dsa',
    category: 'DSA Preparation',
    icon: '⚡',
    prompt: 'Give me a DSA preparation plan.',
  },
  {
    id: 'resume',
    category: 'Resume Help',
    icon: '📄',
    prompt: 'How can I improve my resume?',
  },
  {
    id: 'aptitude',
    category: 'Aptitude Preparation',
    icon: '📊',
    prompt: 'How should I prepare for aptitude tests?',
  },
];

export default function QuickPrompts({ onSelectPrompt, disabled }) {
  return (
    <div className="quick-prompts-container">
      <div className="quick-prompts-header">Quick Prompts</div>
      <div className="quick-prompts-grid">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="prompt-card"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
          >
            <span className="prompt-category">
              <span>{item.icon}</span>
              <span>{item.category}</span>
            </span>
            <span className="prompt-text">"{item.prompt}"</span>
          </button>
        ))}
      </div>
    </div>
  );
}
