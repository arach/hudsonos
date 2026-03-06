# Services

The service system lets Hudson apps declare dependencies on external services (local servers, databases, language servers, etc.) and manage their lifecycle through a standard interface.

## Overview

Apps declare which services they depend on. The shell provides a service registry that can install, start, stop, and health-check services. This lets users see the status of all required services in one place and start them with a single click.

## ServiceDefinition

A `ServiceDefinition` describes everything needed to manage a service:

```ts
interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  version?: string;
  icon?: string;
  check: {
    healthUrl?: string;
    port?: number;
  };
  install: { command: string; cwd?: string };
  start: { command: string; cwd?: string; env?: Record<string, string> };
  stop?: { command?: string };
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique service identifier. |
| `name` | `string` | Human-readable name. |
| `description` | `string` | What the service does. |
| `version` | `string?` | Expected version string. |
| `icon` | `string?` | Icon identifier for UI display. |
| `check.healthUrl` | `string?` | HTTP URL to probe for health status. |
| `check.port` | `number?` | TCP port to check for availability. |
| `install.command` | `string` | Shell command to install the service. |
| `install.cwd` | `string?` | Working directory for the install command. |
| `start.command` | `string` | Shell command to start the service. |
| `start.cwd` | `string?` | Working directory for the start command. |
| `start.env` | `Record<string, string>?` | Environment variables for the start command. |
| `stop.command` | `string?` | Shell command to stop the service. |

### Example

```ts
import type { ServiceDefinition } from '@hudsonos/sdk';

const terminalRelay: ServiceDefinition = {
  id: 'terminal-relay',
  name: 'Terminal Relay',
  description: 'WebSocket relay for PTY sessions',
  version: '1.0.0',
  check: {
    healthUrl: 'http://localhost:3600/health',
    port: 3600,
  },
  install: {
    command: 'bun install',
    cwd: '/path/to/terminal-relay',
  },
  start: {
    command: 'bun run start',
    cwd: '/path/to/terminal-relay',
    env: { PORT: '3600' },
  },
  stop: {
    command: 'kill $(lsof -ti:3600)',
  },
};
```

## ServiceDependency

Apps declare service dependencies in their `HudsonApp` definition:

```ts
interface ServiceDependency {
  serviceId: string;
  optional?: boolean;
  reason?: string;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `serviceId` | `string` | References a `ServiceDefinition.id` in the registry. |
| `optional` | `boolean?` | If `true`, the app works without this service but with reduced functionality. |
| `reason` | `string?` | Human-readable explanation of why this service is needed. |

### Declaring Dependencies

```tsx
import type { HudsonApp } from '@hudsonos/sdk';

const myApp: HudsonApp = {
  id: 'my-app',
  name: 'My App',
  // ...
  services: [
    {
      serviceId: 'terminal-relay',
      optional: false,
      reason: 'Required for embedded terminal functionality',
    },
    {
      serviceId: 'language-server',
      optional: true,
      reason: 'Enables autocomplete and diagnostics',
    },
  ],
};
```

## Service Status

The registry tracks each service with a `ServiceRecord`:

```ts
interface ServiceRecord {
  serviceId: string;
  status: ServiceStatus;
  pid?: number;
  logFile?: string;
  lastChecked: number;
  lastChanged: number;
  error?: string;
}
```

### ServiceStatus

```ts
type ServiceStatus = 'unknown' | 'not_installed' | 'installed' | 'running' | 'error';
```

| Status | Meaning |
|--------|---------|
| `'unknown'` | Service has not been checked yet. |
| `'not_installed'` | Health check failed and the service is not found. |
| `'installed'` | Service is installed but not running. |
| `'running'` | Service is running and health check passes. |
| `'error'` | Service failed to start or health check failed after start. |

## Service Actions

Every action taken on a service is logged as a `ServiceAction`:

```ts
interface ServiceAction {
  id: string;
  serviceId: string;
  action: 'check' | 'install' | 'start' | 'stop';
  triggeredBy: 'user' | 'agent' | 'system';
  timestamp: number;
  command?: string;
  output?: string;
  exitCode?: number | null;
  success: boolean;
  durationMs: number;
}
```

This provides an audit trail for debugging. You can see what command was run, who triggered it, whether it succeeded, and how long it took.

## Lifecycle

A typical service lifecycle:

```
check -> not_installed -> install -> installed -> start -> running
                                                            |
                                                          stop -> installed
                                                            |
                                                          error -> check -> ...
```

1. **Check**: Probe the health URL or port to determine current status.
2. **Install**: Run the install command if the service is not found.
3. **Start**: Run the start command to bring the service up.
4. **Stop**: Run the stop command to gracefully shut down.

The shell can automate this flow or let users manage each step manually through the service panel.

## Health Checks

Services can declare either a `healthUrl` (HTTP GET that returns 200) or a `port` (TCP port that accepts connections) for health checking.

```ts
// HTTP health check
check: {
  healthUrl: 'http://localhost:3600/health',
}

// Port-based health check
check: {
  port: 5432,
}

// Both (health URL takes precedence)
check: {
  healthUrl: 'http://localhost:8080/healthz',
  port: 8080,
}
```

## Best Practices

1. **Use descriptive service IDs.** Prefer `terminal-relay` over `relay` or `tr`.
2. **Set `optional: true` for non-critical services.** If your app works without it, mark it optional and degrade gracefully.
3. **Provide a reason.** The `reason` field helps users understand why a service is needed.
4. **Include a stop command.** Without one, the shell cannot cleanly shut down the service.
5. **Use health URLs over port checks.** HTTP health endpoints can verify the service is actually functional, not just listening.
