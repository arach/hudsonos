# Hudson Documentation

## npm Packages

Published packages for building and managing Hudson apps.

### [@hudsonos/sdk](npm/sdk/getting-started.md)

The core SDK for building Hudson apps — types, hooks, utilities, and components.

- [Getting Started](npm/sdk/getting-started.md) — Installation and first app
- [Building Apps](npm/sdk/building-apps.md) — Provider + Slots + Hooks architecture
- [API Reference](npm/sdk/api-reference.md) — Complete type and function reference
- [Hooks](npm/sdk/hooks.md) — usePersistentState, useAppSettings, useTerminalRelay
- [Intents](npm/sdk/intents.md) — LLM/voice/search intent system
- [Services](npm/sdk/services.md) — Service registry and dependencies
- [Ports](npm/sdk/ports.md) — Inter-app data piping
- [Platform](npm/sdk/platform.md) — Platform adapters for web and native hosts
- [Theme](npm/sdk/theme.md) — SHELL_THEME tokens and Tailwind setup
- [Sounds](npm/sdk/sounds.md) — UI sound library

### [@hudsonos/hx](npm/hx/hx.md)

Local service registry and smart router.

- [Guide](npm/hx/hx.md) — Daemon lifecycle, service registration, proxy, API reference

## CLI Tools

Developer tooling for the Hudson ecosystem.

- [Overview](cli.md) — How the CLI tools fit together
- [create-hudson-app](cli/create-hudson-app.md) — Scaffold a new Hudson app
- [hudson-relay](cli/relay.md) — WebSocket PTY relay for embedded terminals
