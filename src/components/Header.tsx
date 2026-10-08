import React from 'react';
import { HeartPulse, Download, RotateCcw } from 'lucide-react';

export type NavTab = 'dashboard' | 'anatomy' | 'performance' | 'explainability' | 'dataset' | 'paper' | 'about';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onReset: () => void;
  onExport: () => void;
  hasResults: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onReset,
  onExport,
  hasResults
}) => {
  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'anatomy', label: '3D Anatomy' },
    { id: 'performance', label: 'Model Performance' },
    { id: 'explainability', label: 'Explainability' },
    { id: 'dataset', label: 'Dataset Insights' },
    { id: 'paper', label: 'Research Paper' },
    { id: 'about', label: 'About & Safety' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-rose-600 transition-colors text-left"
          >
            Cardio3D AI
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, subtle active/hover state) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
                activeTab === item.id
                  ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {hasResults && (
            <button
              onClick={onReset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Reset patient data and visualization"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === item.id
                ? 'bg-rose-50 text-rose-700 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
