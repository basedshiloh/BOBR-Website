'use client';

import { useState, useEffect } from 'react';
import {
  Accessibility, X, Plus, Minus,
  Type, ALargeSmall, Baseline,
  Eye, MousePointer2, ScanLine, Link2, ImageOff, Pause,
  RotateCcw, Contrast,
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

function StepControl({
  label, icon: Icon, value, min, max, onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-bobr-500" />
        <span className="text-sm text-ink-soft">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-rule/50 text-ink-soft transition-colors hover:bg-rule disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-xs font-semibold text-ink">
          {value > 0 ? `+${value}` : value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-rule/50 text-ink-soft transition-colors hover:bg-rule disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ToggleOption({
  label, icon: Icon, active, onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-bobr-50 font-medium text-bobr-700'
          : 'text-ink-soft hover:bg-rule/40'
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? 'text-bobr-600' : 'text-ink-soft/50'}`} />
      <span className="flex-1 text-left">{label}</span>
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
        active ? 'bg-bobr-100 text-bobr-700' : 'bg-rule text-ink-soft'
      }`}>
        {active ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

export default function AccessibilityPanel() {
  const { settings, update, reset, mounted, isModified } = useAccessibility();
  const [open, setOpen] = useState(false);

  // Reading guide follows cursor
  useEffect(() => {
    if (!settings.readingLine) return;
    function handleMouse(e: MouseEvent) {
      const guide = document.getElementById('a11y-reading-guide');
      if (guide) guide.style.top = `${e.clientY - 6}px`;
    }
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [settings.readingLine]);

  // Alt+A keyboard shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Reading guide line (hidden via CSS until a11y-reading-line class active) */}
      <div id="a11y-reading-guide" />

      {/* Floating trigger */}
      <button
        onClick={() => setOpen(!open)}
        title="Accessibility adjustments (Alt+A)"
        aria-label="Open accessibility panel"
        className={`fixed z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${
          open
            ? 'bottom-6 right-6 bg-rule'
            : 'bottom-24 right-4 bg-bobr-600 hover:scale-110 hover:bg-bobr-700 md:bottom-6 md:right-6'
        }`}
      >
        {open
          ? <X className="h-5 w-5 text-ink-soft" />
          : <Accessibility className="h-6 w-6 text-white" />
        }
        {isModified && !open && (
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-paper bg-amber-500" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-2xl md:bottom-20 md:right-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-bobr-600" />
              <h2 className="text-sm font-bold text-ink">Accessibility</h2>
            </div>
            {isModified && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-xs text-ink-soft/60 transition-colors hover:text-red-500"
              >
                <RotateCcw className="h-3 w-3" />
                Reset all
              </button>
            )}
          </div>

          {/* Scrollable content */}
          <div className="space-y-5 overflow-y-auto p-4">
            <div>
              <h3 className="kicker mb-3 text-ink-soft/50">Text</h3>
              <div className="space-y-3">
                <StepControl label="Font Size"      icon={ALargeSmall} value={settings.fontSize}      min={-2} max={4} onChange={(v) => update({ fontSize: v })} />
                <StepControl label="Line Height"    icon={Baseline}    value={settings.lineHeight}    min={0}  max={3} onChange={(v) => update({ lineHeight: v })} />
                <StepControl label="Letter Spacing" icon={Type}        value={settings.letterSpacing} min={0}  max={3} onChange={(v) => update({ letterSpacing: v })} />
                <ToggleOption label="Dyslexia-Friendly Font" icon={Type} active={settings.dyslexiaFont} onChange={(v) => update({ dyslexiaFont: v })} />
              </div>
            </div>

            <div>
              <h3 className="kicker mb-3 text-ink-soft/50">Visual</h3>
              <div className="space-y-1">
                <ToggleOption label="High Contrast"     icon={Contrast}  active={settings.highContrast}    onChange={(v) => update({ highContrast: v })} />
                <ToggleOption label="Monochrome"        icon={Eye}       active={settings.monochrome}      onChange={(v) => update({ monochrome: v })} />
                <ToggleOption label="Pause Animations"  icon={Pause}     active={settings.pauseAnimations} onChange={(v) => update({ pauseAnimations: v })} />
                <ToggleOption label="Hide Images"       icon={ImageOff}  active={settings.hideImages}      onChange={(v) => update({ hideImages: v })} />
              </div>
            </div>

            <div>
              <h3 className="kicker mb-3 text-ink-soft/50">Navigation</h3>
              <div className="space-y-1">
                <ToggleOption label="Big Cursor"      icon={MousePointer2} active={settings.bigCursor}     onChange={(v) => update({ bigCursor: v })} />
                <ToggleOption label="Reading Guide"   icon={ScanLine}      active={settings.readingLine}   onChange={(v) => update({ readingLine: v })} />
                <ToggleOption label="Highlight Links" icon={Link2}         active={settings.highlightLinks} onChange={(v) => update({ highlightLinks: v })} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-rule bg-paper-card px-4 py-2.5">
            <p className="text-center text-[10px] text-ink-soft/50">
              Press{' '}
              <kbd className="rounded bg-rule px-1 py-0.5 font-mono text-[9px]">Alt+A</kbd>
              {' '}to toggle
            </p>
          </div>
        </div>
      )}
    </>
  );
}
