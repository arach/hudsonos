// AI types — runtime ships separately as @hudsonos/ai.
// These are exported from the SDK so app authors can type their hooks.

type AIMode = 'cli' | 'api';

export interface AIAttachment {
  /** Short label shown on the toggle (e.g. "SVG", "State", "Screenshot") */
  label: string;
  /** Called at send time to produce the content. Can return string, object, or null to skip. */
  content: () => string | Record<string, unknown> | null;
}

export interface UseHudsonAIOptions {
  /** Toolset ID — matches a registered toolset on the server */
  toolset: string;
  /** Dynamic context sent with each request (current app state) */
  context?: Record<string, unknown>;
  /** Called when the model invokes a tool — apply state changes here */
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void | Promise<void>;
  /** Override inference mode per-call. If omitted, reads the platform default from settings. */
  mode?: AIMode;
  /** Attachable context the user can toggle on per-message */
  attachments?: AIAttachment[];
}

export interface HudsonAIChat {
  messages: unknown[];
  sendMessage: (message: { role: string; content: string }) => void;
  stop: () => void;
  status: string;
  setMessages: (messages: unknown[]) => void;
  clearChat: () => void;
  error: Error | undefined;
  mode: AIMode;
  attachments: AIAttachment[];
  activeAttachments: Set<string>;
  toggleAttachment: (label: string) => void;
}
