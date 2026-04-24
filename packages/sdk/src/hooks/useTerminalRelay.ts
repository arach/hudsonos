'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RelayStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface UseTerminalRelayOptions {
  /** WebSocket URL. Defaults to ws://localhost:3600 */
  url?: string;
  /** System prompt to pass to the Claude CLI session */
  systemPrompt?: string;
  /** Working directory for the PTY session. Defaults to $HOME on the server. */
  cwd?: string;
  /** Files to bootstrap in the CWD before spawning. Keys are relative paths, values are content. Only created if missing. */
  workspaceFiles?: Record<string, string>;
  /** Auto-connect on mount. Defaults to false. */
  autoConnect?: boolean;
  /** Stable key for persisting the sessionId across reloads and browser restarts.
   *  If provided, the hook will attempt to reconnect to the previous session on mount. */
  sessionKey?: string;
  /** How long (ms) the server keeps the PTY alive after disconnect. Defaults to 30 min. */
  orphanTTL?: number;
  /** PTY backend: 'pty' (default) spawns a fresh process, 'tmux' attaches to a persistent tmux session. */
  backend?: 'pty' | 'tmux';
  /** For tmux backend: the named tmux session to create/attach to. */
  tmuxSession?: string;
  /** CLI agent to spawn. 'claude' (default) or 'pi'. */
  agent?: 'claude' | 'pi';
  /** For pi agent: provider name (e.g. 'minimax', 'openai'). */
  provider?: string;
  /** For pi agent: model ID (e.g. 'MiniMax-M1'). */
  model?: string;
}

export interface TerminalRelayHandle {
  /** Connection status */
  status: RelayStatus;
  /** Session ID assigned by server */
  sessionId: string | null;
  /** Human-readable error when session fails or crashes */
  error: string | null;
  /** Exit code from the last session (null if still running or never started) */
  exitCode: number | null;
  /** Current working directory (editable before connecting) */
  cwd: string;
  /** Update the CWD — only takes effect on next connect/session:init */
  setCwd: (cwd: string) => void;
  /** Register a callback for incoming terminal data */
  onData: (cb: (data: string) => void) => void;
  /** Send raw keystrokes (for keyboard events) */
  sendInput: (data: string) => void;
  /** Send a line of text (appends \r) */
  sendLine: (text: string) => void;
  /** Resize the remote terminal — also used to set initial size before connect */
  resize: (cols: number, rows: number) => void;
  /** Open the WebSocket connection and init or reconnect a session */
  connect: () => void;
  /** Close the WebSocket connection (session stays alive on server) */
  disconnect: () => void;
  /** Kill the current session and start a fresh one (new agent/model/settings take effect) */
  restart: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTerminalRelay(options: UseTerminalRelayOptions = {}): TerminalRelayHandle {
  const {
    url = 'ws://localhost:3600',
    systemPrompt,
    cwd: initialCwd,
    workspaceFiles,
    autoConnect = false,
    sessionKey,
    orphanTTL,
    backend,
    tmuxSession,
    agent,
    provider,
    model,
  } = options;

  const storageKey = sessionKey ? `hudson.relay.${sessionKey}` : null;
  const readPersistedSession = () => {
    if (!storageKey) return null;
    try { return localStorage.getItem(storageKey); } catch { return null; }
  };
  const persistSession = (id: string | null) => {
    if (!storageKey) return;
    try {
      if (id) localStorage.setItem(storageKey, id);
      else localStorage.removeItem(storageKey);
    } catch {}
  };

  const [status, setStatus] = useState<RelayStatus>('disconnected');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [cwd, setCwd] = useState(initialCwd || '~');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dimsRef = useRef({ cols: 80, rows: 24 });
  const initSentRef = useRef(false);
  const cwdRef = useRef(cwd);
  cwdRef.current = cwd;
  const sessionIdRef = useRef<string | null>(readPersistedSession());
  const dataCallbackRef = useRef<((data: string) => void) | null>(null);

  const send = useCallback((data: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    const ws = wsRef.current;
    if (ws) {
      ws.close();
      wsRef.current = null;
    }
    initSentRef.current = false;
    setStatus('disconnected');
  }, []);

  const buildInitMessage = useCallback(() => {
    const activeCwd = cwdRef.current;
    return {
      type: 'session:init' as const,
      cols: dimsRef.current.cols,
      rows: dimsRef.current.rows,
      ...(systemPrompt ? { systemPrompt } : {}),
      ...(activeCwd ? { cwd: activeCwd } : {}),
      ...(workspaceFiles ? { workspaceFiles } : {}),
      ...(orphanTTL ? { orphanTTL } : {}),
      ...(backend ? { backend } : {}),
      ...(tmuxSession ? { tmuxSession } : {}),
      ...(agent ? { agent } : {}),
      ...(provider ? { provider } : {}),
      ...(model ? { model } : {}),
    };
  }, [systemPrompt, workspaceFiles, orphanTTL, backend, tmuxSession, agent, provider, model]);

  const sendInitOrReconnect = useCallback(() => {
    if (initSentRef.current) return;
    initSentRef.current = true;

    if (sessionIdRef.current) {
      send({
        type: 'session:reconnect',
        sessionId: sessionIdRef.current,
        cols: dimsRef.current.cols,
        rows: dimsRef.current.rows,
      });
    } else {
      send(buildInitMessage());
    }
  }, [send, buildInitMessage]);

  const connect = useCallback(async () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    initSentRef.current = false;
    setStatus('connecting');
    setError(null);
    setExitCode(null);

    const httpUrl = url.replace(/^ws(s?):\/\//, 'http$1://');
    try {
      await fetch(`${httpUrl}/health`, { signal: AbortSignal.timeout(2000) });
    } catch {
      setStatus('error');
      setError('Relay service is not running');
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      sendInitOrReconnect();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        switch (msg.type) {
          case 'session:ready':
            sessionIdRef.current = msg.sessionId;
            persistSession(msg.sessionId);
            setSessionId(msg.sessionId);
            setStatus('connected');
            setError(null);
            setExitCode(null);
            break;

          case 'session:expired': {
            sessionIdRef.current = null;
            persistSession(null);
            initSentRef.current = false;
            if (dataCallbackRef.current) {
              dataCallbackRef.current('\x1b[2J\x1b[H');
            }
            send(buildInitMessage());
            initSentRef.current = true;
            break;
          }

          case 'session:error':
            setStatus('error');
            setError(msg.error || 'Session failed to start');
            break;

          case 'terminal:data':
            if (dataCallbackRef.current && msg.data) {
              dataCallbackRef.current(msg.data);
            }
            break;

          case 'session:exit':
            sessionIdRef.current = null;
            persistSession(null);
            setSessionId(null);
            setExitCode(msg.exitCode ?? null);
            if (msg.exitCode !== 0) {
              setStatus('error');
              setError(msg.reason || `Process exited with code ${msg.exitCode}`);
            } else {
              setStatus('disconnected');
            }
            break;

          case 'session:detached':
            sessionIdRef.current = null;
            persistSession(null);
            setSessionId(null);
            break;
        }
      } catch {}
    };

    ws.onclose = () => {
      wsRef.current = null;
      initSentRef.current = false;
      setStatus((prev) => prev === 'error' ? prev : 'disconnected');
    };

    ws.onerror = () => {
      setStatus('error');
      setError('Could not connect to relay');
    };
  }, [url, sendInitOrReconnect, send, systemPrompt, workspaceFiles]);

  const sendInput = useCallback((data: string) => {
    send({ type: 'terminal:input', data });
  }, [send]);

  const sendLine = useCallback((text: string) => {
    send({ type: 'terminal:input', data: text + '\r' });
  }, [send]);

  const resize = useCallback((cols: number, rows: number) => {
    dimsRef.current = { cols, rows };
    if (initSentRef.current) {
      send({ type: 'terminal:resize', cols, rows });
    }
  }, [send]);

  const onData = useCallback((cb: (data: string) => void) => {
    dataCallbackRef.current = cb;
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = useCallback(() => {
    disconnect();
    sessionIdRef.current = null;
    setSessionId(null);
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch {}
    }
    setError(null);
    setExitCode(null);
    setTimeout(() => connect(), 200);
  }, [disconnect, connect, storageKey]);

  return {
    status,
    sessionId,
    error,
    exitCode,
    cwd,
    setCwd,
    onData,
    sendInput,
    sendLine,
    resize,
    connect,
    disconnect,
    restart,
  };
}
