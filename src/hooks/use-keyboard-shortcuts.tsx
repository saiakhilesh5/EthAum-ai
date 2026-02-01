'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    // Navigation
    { key: 'g', alt: true, description: 'Go to Dashboard', action: () => router.push('/dashboard') },
    { key: 'l', alt: true, description: 'Go to Launches', action: () => router.push('/launches') },
    { key: 'e', alt: true, description: 'Go to Explore', action: () => router.push('/explore') },
    { key: 'm', alt: true, description: 'Go to Matchmaking', action: () => router.push('/matchmaking') },
    { key: 's', alt: true, description: 'Go to Settings', action: () => router.push('/settings') },
    
    // Actions
    { key: 'n', ctrl: true, description: 'New Launch', action: () => router.push('/launches/new') },
    { key: 'k', ctrl: true, description: 'Open Search', action: () => {
      // Dispatch custom event for search modal
      window.dispatchEvent(new CustomEvent('open-search'));
    }},
    { key: '/', description: 'Focus Search', action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    }},
    
    // UI
    { key: 'Escape', description: 'Close Modal/Dialog', action: () => {
      // Dispatch escape event
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }},
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger if typing in input/textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape and Ctrl+K even in inputs
      if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 'k')) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

// Keyboard shortcuts help modal component
export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['Alt', 'G'], description: 'Go to Dashboard' },
      { keys: ['Alt', 'L'], description: 'Go to Launches' },
      { keys: ['Alt', 'E'], description: 'Go to Explore' },
      { keys: ['Alt', 'M'], description: 'Go to Matchmaking' },
      { keys: ['Alt', 'S'], description: 'Go to Settings' },
    ]},
    { category: 'Actions', items: [
      { keys: ['Ctrl', 'N'], description: 'New Launch' },
      { keys: ['Ctrl', 'K'], description: 'Open Search' },
      { keys: ['/'], description: 'Focus Search' },
    ]},
    { category: 'General', items: [
      { keys: ['Esc'], description: 'Close Modal/Dialog' },
      { keys: ['?'], description: 'Show Keyboard Shortcuts' },
    ]},
  ];

  return (
    <div className="space-y-6">
      {shortcuts.map((group) => (
        <div key={group.category}>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            {group.category}
          </h4>
          <div className="space-y-2">
            {group.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.description}</span>
                <div className="flex items-center gap-1">
                  {item.keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                        {key}
                      </kbd>
                      {i < item.keys.length - 1 && <span className="text-muted-foreground mx-1">+</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
