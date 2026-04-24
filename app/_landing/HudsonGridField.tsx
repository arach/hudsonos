'use client';

import { useEffect, useRef } from 'react';
import { useGlyphWavesParams } from './GlyphWavesParams';

type CursorMode = 'idle' | 'dragging';

interface WindowReplica {
  col: number;
  row: number;
  widthCells: number;
  titleRows: number;
  bodyRows: number;
  bornAt: number;
  lifespanMs: number;
  phase: number;
}

interface GridLayout {
  cols: number;
  rows: number;
  spacing: number;
  majorEvery: number;
  majorStep: number;
}

interface RectBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface CursorState {
  mode: CursorMode;
  modeStartedAt: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

function createLayout(width: number, height: number, spacing: number, majorEvery: number): GridLayout {
  const cols = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;
  const majorStep = spacing * majorEvery;
  return { cols, rows, spacing, majorEvery, majorStep };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function snapToMajorCells(valueCells: number, majorEvery: number): number {
  return Math.round(valueCells / majorEvery) * majorEvery;
}

function boundsForWindow(windowReplica: WindowReplica): RectBounds {
  return {
    left: windowReplica.col,
    top: windowReplica.row,
    right: windowReplica.col + windowReplica.widthCells,
    bottom: windowReplica.row + windowReplica.titleRows + windowReplica.bodyRows,
  };
}

function intersects(a: RectBounds, b: RectBounds): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function createWindowReplicaNear(
  now: number,
  layout: GridLayout,
  bodyMajor: number,
  titleMinor: number,
  lifespanMs: number,
  existingWindows: WindowReplica[],
  nearCol: number,
  nearRow: number,
  jitterMajor: number,
): WindowReplica | null {
  const widthCells = Math.max(layout.majorEvery * bodyMajor, layout.majorEvery * 2);
  const bodyRows = Math.max(layout.majorEvery * bodyMajor, layout.majorEvery * 2);
  const titleRows = Math.max(1, Math.round(titleMinor));
  const totalRows = titleRows + bodyRows;

  if (layout.cols <= widthCells + 2 || layout.rows <= totalRows + 2) {
    return null;
  }

  const maxMajorX = Math.floor((layout.cols - widthCells - 1) / layout.majorEvery);
  const maxMajorY = Math.floor((layout.rows - totalRows - 1) / layout.majorEvery);
  if (maxMajorX < 0 || maxMajorY < 0) {
    return null;
  }

  const nearMajorX = clamp(Math.round(nearCol / layout.majorEvery), 0, maxMajorX);
  const nearMajorY = clamp(Math.round(nearRow / layout.majorEvery), 0, maxMajorY);
  const jitter = Math.max(0, Math.round(jitterMajor));

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const radius = Math.min(jitter + Math.floor(attempt / 6), Math.max(maxMajorX, maxMajorY));
    const dx = Math.floor((Math.random() * 2 - 1) * radius);
    const dy = Math.floor((Math.random() * 2 - 1) * radius);
    const majorX = clamp(nearMajorX + dx, 0, maxMajorX);
    const majorY = clamp(nearMajorY + dy, 0, maxMajorY);

    const col = majorX * layout.majorEvery + 1;
    const row = majorY * layout.majorEvery + 1;

    const candidate: WindowReplica = {
      col,
      row,
      widthCells,
      titleRows,
      bodyRows,
      bornAt: now,
      lifespanMs,
      phase: Math.random() * Math.PI * 2,
    };

    const candidateBounds = boundsForWindow(candidate);
    const overlapping = existingWindows.some((existing) => intersects(candidateBounds, boundsForWindow(existing)));
    if (!overlapping) {
      return candidate;
    }
  }

  return null;
}

export function HudsonGridField() {
  const { gridParams } = useGlyphWavesParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    const canvasContext = canvasElement.getContext('2d');
    if (!canvasContext) {
      return;
    }

    const canvas = canvasElement;
    const context = canvasContext;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let layout = createLayout(
      window.innerWidth,
      window.innerHeight,
      Math.max(8, gridParams.spacing),
      Math.max(2, Math.round(gridParams.majorEvery)),
    );

    let windows: WindowReplica[] = [];
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const lifespanMs = Math.max(30, gridParams.windowLifespanSec) * 1000;
    const bodyMajor = Math.max(2, Math.round(gridParams.windowBodyMajor));
    const titleMinor = Math.max(1, Math.round(gridParams.windowTitleMinor));
    const updateInterval = Math.max(80, gridParams.updateIntervalMs);
    const targetCount = Math.max(1, Math.round(gridParams.windowTargetCount));
    const cursorHoldMs = Math.max(300, gridParams.cursorHoldMs);
    const cursorDragMs = Math.max(400, gridParams.cursorDragMs);
    const cursorSpeed = Math.max(0.2, gridParams.cursorSpeed);

    const cursor: CursorState = {
      mode: 'idle',
      modeStartedAt: performance.now(),
      x: viewportWidth * 0.2,
      y: viewportHeight * 0.25,
      startX: viewportWidth * 0.2,
      startY: viewportHeight * 0.25,
      targetX: viewportWidth * 0.6,
      targetY: viewportHeight * 0.4,
    };

    let lastSpawnTick = 0;

    function setCursorDestination(now: number) {
      const marginX = layout.majorStep * 1.2;
      const marginY = layout.majorStep * 1.2;
      const minX = clamp(marginX, 24, Math.max(24, viewportWidth - marginX));
      const maxX = clamp(viewportWidth - marginX, minX, viewportWidth - 24);
      const minY = clamp(marginY, 24, Math.max(24, viewportHeight - marginY));
      const maxY = clamp(viewportHeight - marginY, minY, viewportHeight - 24);

      const nextTargetX = lerp(minX, maxX, Math.random());
      const nextTargetY = lerp(minY, maxY, Math.random());

      cursor.startX = cursor.x;
      cursor.startY = cursor.y;
      cursor.targetX = nextTargetX;
      cursor.targetY = nextTargetY;
      cursor.mode = 'dragging';
      cursor.modeStartedAt = now;
    }

    function spawnWindowAtCursor(now: number) {
      const nearCol = snapToMajorCells(cursor.x / layout.spacing, layout.majorEvery);
      const nearRow = snapToMajorCells(cursor.y / layout.spacing, layout.majorEvery);

      const nextWindow = createWindowReplicaNear(
        now,
        layout,
        bodyMajor,
        titleMinor,
        lifespanMs,
        windows,
        nearCol,
        nearRow,
        gridParams.cursorJitterMajor,
      );

      if (nextWindow) {
        windows.push(nextWindow);
      }
    }

    function applyResize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      viewportWidth = width;
      viewportHeight = height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      layout = createLayout(
        width,
        height,
        Math.max(8, gridParams.spacing),
        Math.max(2, Math.round(gridParams.majorEvery)),
      );

      const now = performance.now();
      windows = windows.filter((w) => {
        const totalRows = w.titleRows + w.bodyRows;
        return w.col + w.widthCells < layout.cols && w.row + totalRows < layout.rows && now - w.bornAt < w.lifespanMs;
      });

      cursor.x = clamp(cursor.x, 24, viewportWidth - 24);
      cursor.y = clamp(cursor.y, 24, viewportHeight - 24);
      cursor.startX = cursor.x;
      cursor.startY = cursor.y;
      cursor.targetX = cursor.x;
      cursor.targetY = cursor.y;
    }

    function drawGridDots() {
      context.fillStyle = `rgba(140, 140, 140, ${gridParams.dotAlpha})`;
      for (let x = 0; x <= viewportWidth; x += layout.spacing) {
        for (let y = 0; y <= viewportHeight; y += layout.spacing) {
          context.fillRect(x, y, 1, 1);
        }
      }
    }

    function drawMajorCrosses() {
      context.strokeStyle = 'rgba(20, 184, 166, 0.14)';
      context.lineWidth = 1;
      const cross = 3;
      for (let x = 0; x <= viewportWidth; x += layout.majorStep) {
        for (let y = 0; y <= viewportHeight; y += layout.majorStep) {
          const cx = x + 0.5;
          const cy = y + 0.5;
          context.beginPath();
          context.moveTo(cx - cross, cy);
          context.lineTo(cx + cross, cy);
          context.moveTo(cx, cy - cross);
          context.lineTo(cx, cy + cross);
          context.stroke();
        }
      }
    }

    function drawWindow(windowReplica: WindowReplica, now: number) {
      const age = now - windowReplica.bornAt;
      const lifeProgress = clamp(age / windowReplica.lifespanMs, 0, 1);
      const fadeIn = clamp(lifeProgress / 0.12, 0, 1);
      const fadeOut = clamp((1 - lifeProgress) / 0.2, 0, 1);
      const lifeAlpha = Math.min(fadeIn, fadeOut);

      const pulse = 0.55 + Math.sin(now * 0.00035 + windowReplica.phase) * 0.45;
      const mainAlpha = lifeAlpha * (0.06 + pulse * gridParams.maxAlpha * 0.56);
      const titleAlpha = lifeAlpha * (0.12 + pulse * gridParams.maxAlpha * 0.72);

      const x = windowReplica.col * layout.spacing;
      const y = windowReplica.row * layout.spacing;
      const width = windowReplica.widthCells * layout.spacing;
      const titleHeight = windowReplica.titleRows * layout.spacing;
      const bodyHeight = windowReplica.bodyRows * layout.spacing;

      context.fillStyle = `rgba(20, 184, 166, ${mainAlpha.toFixed(3)})`;
      context.fillRect(x, y + titleHeight, width, bodyHeight);

      context.fillStyle = `rgba(110, 231, 183, ${titleAlpha.toFixed(3)})`;
      context.fillRect(x, y, width, titleHeight);

      const borderAlpha = clamp(lifeAlpha * 0.26, 0, 1);
      context.strokeStyle = `rgba(45, 212, 191, ${borderAlpha.toFixed(3)})`;
      context.lineWidth = 1;
      context.strokeRect(x + 0.5, y + 0.5, width - 1, titleHeight + bodyHeight - 1);
    }

    function drawCursor(now: number) {
      const blink = 0.5 + 0.5 * Math.sin(now * 0.006);
      const alpha = cursor.mode === 'dragging' ? 0.85 : 0.5 + 0.35 * blink;
      const size = 9;

      context.strokeStyle = `rgba(167, 243, 208, ${alpha.toFixed(3)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(cursor.x - size, cursor.y);
      context.lineTo(cursor.x + size, cursor.y);
      context.moveTo(cursor.x, cursor.y - size);
      context.lineTo(cursor.x, cursor.y + size);
      context.stroke();

      context.beginPath();
      context.arc(cursor.x, cursor.y, 3.5, 0, Math.PI * 2);
      context.stroke();
    }

    function advanceCursor(now: number) {
      const modeElapsed = now - cursor.modeStartedAt;

      if (cursor.mode === 'idle') {
        if (modeElapsed >= cursorHoldMs) {
          setCursorDestination(now);
        }
        return;
      }

      const progress = clamp(modeElapsed / (cursorDragMs / cursorSpeed), 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      cursor.x = lerp(cursor.startX, cursor.targetX, eased);
      cursor.y = lerp(cursor.startY, cursor.targetY, eased);

      if (progress >= 1) {
        spawnWindowAtCursor(now);
        cursor.mode = 'idle';
        cursor.modeStartedAt = now;
      }
    }

    function tick(now: number) {
      if (now - lastSpawnTick < updateInterval) {
        advanceCursor(now);
        return;
      }
      lastSpawnTick = now;

      windows = windows.filter((w) => now - w.bornAt < w.lifespanMs);
      advanceCursor(now);

      if (windows.length < targetCount && cursor.mode === 'idle') {
        spawnWindowAtCursor(now);
      }
    }

    function render(now: number) {
      tick(now);

      context.clearRect(0, 0, viewportWidth, viewportHeight);
      drawGridDots();
      drawMajorCrosses();

      for (const windowReplica of windows) {
        drawWindow(windowReplica, now);
      }
      drawCursor(now);

      rafId = requestAnimationFrame(render);
    }

    function drawStatic() {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      drawGridDots();
      drawMajorCrosses();
    }

    function onResize() {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
        applyResize();
      }, 120);
    }

    function onReducedMotionChange() {
      if (reducedMotionQuery.matches) {
        if (rafId !== 0) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        drawStatic();
        return;
      }

      if (rafId === 0) {
        lastSpawnTick = 0;
        rafId = requestAnimationFrame(render);
      }
    }

    applyResize();
    cursor.x = viewportWidth * 0.2;
    cursor.y = viewportHeight * 0.25;
    cursor.startX = cursor.x;
    cursor.startY = cursor.y;
    cursor.targetX = cursor.x;
    cursor.targetY = cursor.y;
    cursor.modeStartedAt = performance.now();

    windows = [];

    window.addEventListener('resize', onResize);
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);

    if (reducedMotionQuery.matches) {
      drawStatic();
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      window.removeEventListener('resize', onResize);
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
    };
  }, [gridParams]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden
    />
  );
}
