import type React from 'react';

// ---------------------------------------------------------------------------
// CommandOption — entries for the command palette
// ---------------------------------------------------------------------------

export interface CommandOption {
  id: string;
  label: string;
  action: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// ContextMenu types
// ---------------------------------------------------------------------------

export interface ContextMenuAction {
  id: string;
  label: string;
  action: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ContextMenuSeparator {
  type: 'separator';
}

export interface ContextMenuGroup {
  type: 'group';
  label: string;
  items: ContextMenuAction[];
}

export type ContextMenuEntry = ContextMenuAction | ContextMenuSeparator | ContextMenuGroup;
