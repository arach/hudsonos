# Sounds

The SDK includes a tactile UI sound library generated entirely with the Web Audio API. No audio files are shipped.

## Import

```tsx
import { sounds, click, thock, confirm, isMuted, setMuted, preview } from '@hudsonos/sdk';
```

All sound functions and controls are named exports from the SDK barrel.

## Available Sounds

| Function | Description | Suggested Usage |
|----------|-------------|-----------------|
| `click()` | Soft click | Button press, toggle |
| `thock()` | Deep thock with attack | Panel open, focus change |
| `blipUp()` | Rising frequency blip | Success, task complete |
| `blipDown()` | Falling frequency blip | Dismiss, close |
| `pop()` | Quick pop | Command palette open, modal |
| `confirm()` | Two-tone ascending | Save, commit |
| `error()` | Two-tone descending | Soft error |
| `whoosh()` | Noise sweep | Transition, navigation |
| `chime()` | Four-note ascending chime | System init (bypasses mute) |
| `tick()` | Quick tick | Checkbox, step progress |
| `slideIn()` | Rising sweep | Drawer open |
| `slideOut()` | Falling sweep | Drawer close |
| `boot()` | Four-tone ascending sequence | System boot |
| `ping()` | High bell tone | Notification |
| `type()` | Randomized mechanical keystroke | Typing feedback |

## Usage

Call any sound function directly. Sounds are fire-and-forget with no return value.

```tsx
import { sounds, confirm, click } from '@hudsonos/sdk';

function SaveButton() {
  const handleSave = () => {
    save();
    confirm();
  };

  return (
    <button onClick={() => { handleSave(); click(); }}>
      Save
    </button>
  );
}
```

### Using the `sounds` Object

All sounds are also available as a named object for dynamic access:

```tsx
import { sounds } from '@hudsonos/sdk';

// Call by name
sounds.click();
sounds.confirm();

// Dynamic access
const soundName = 'blipUp';
sounds[soundName]();
```

### SoundName Type

```ts
type SoundName = keyof typeof sounds;
// 'click' | 'thock' | 'blipUp' | 'blipDown' | 'pop' | 'confirm' | 'error' | 'whoosh' | 'chime' | 'tick' | 'slideIn' | 'slideOut' | 'boot' | 'ping' | 'type'
```

## Mute Control

Sounds are muted by default. The mute state is persisted in `localStorage` under the key `frame_sounds`.

### isMuted

Returns the current mute state.

```ts
function isMuted(): boolean;
```

### setMuted

Sets the mute state and persists it.

```ts
function setMuted(muted: boolean): void;
```

### toggleMute

Toggles mute and returns the new state.

```ts
function toggleMute(): boolean;
```

### Example: Mute Toggle Button

```tsx
import { isMuted, toggleMute } from '@hudsonos/sdk';
import { useState } from 'react';

function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted());

  const handleToggle = () => {
    toggleMute();
    setMutedState(isMuted());
  };

  return (
    <button onClick={handleToggle}>
      {muted ? 'Unmute' : 'Mute'} sounds
    </button>
  );
}
```

## Preview

The `preview` function plays a sound even when muted. It temporarily disables mute, plays the sound, then restores the previous mute state. Use this in settings panels to let users hear sounds before enabling them.

```ts
function preview(name: SoundName): void;
```

```tsx
import { preview } from '@hudsonos/sdk';
import type { SoundName } from '@hudsonos/sdk';

function SoundPreviewer() {
  const soundNames: SoundName[] = [
    'click', 'thock', 'blipUp', 'blipDown', 'pop',
    'confirm', 'error', 'whoosh', 'tick', 'boot', 'ping',
  ];

  return (
    <div className="space-y-1">
      {soundNames.map((name) => (
        <button
          key={name}
          onClick={() => preview(name)}
          className="block text-xs text-neutral-400 hover:text-cyan-400"
        >
          {name}
        </button>
      ))}
    </div>
  );
}
```

## Technical Details

- Sounds are generated using the Web Audio API's `OscillatorNode` and `BufferSource` (for noise).
- Each sound function creates short-lived audio nodes and schedules them on the `AudioContext` timeline.
- The `AudioContext` is lazily created on first use and resumed if suspended (browser autoplay policy).
- The `type()` sound adds randomized pitch and volume for a natural feel.
- The `chime()` sound always plays, bypassing the mute setting. It is intended for system-level events.
- All sound functions are wrapped in `try/catch` and fail silently if the Web Audio API is unavailable.
