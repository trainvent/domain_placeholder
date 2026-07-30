"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];
type Matrix = [[number, number], [number, number]];
type Affine = {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
};

const CONFIG = {
  targetDeg: 60,
  trianglesPerCycle: 6,
  buildSeconds: 1.3,
  zoomSeconds: 0.8,
  keepHistoryCycles: 2,
  maxDepth: 1500,
  strokeWidth: 8,
  strokeColor: "#101010",
  showFill: true,
  fillBaseHue: 26,
  fillSaturation: 73,
  fillLightness: 52,
  hueStep: 7,
  removingOld: true,
  oneByOne: false,
  zoomSpin: false,
};

const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const subtract = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const multiply = (a: Point, scalar: number): Point => [a[0] * scalar, a[1] * scalar];
const matrixVector = (matrix: Matrix, point: Point): Point => [
  matrix[0][0] * point[0] + matrix[0][1] * point[1],
  matrix[1][0] * point[0] + matrix[1][1] * point[1],
];

function equilateral(center: Point, radius: number): Point[] {
  return Array.from({ length: 3 }, (_, index) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / 3;
    return [
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle),
    ];
  });
}

function solveLinear6(matrix: number[][], values: number[]): number[] | null {
  const size = 6;
  const work = matrix.map((row, index) => row.concat([values[index]]));

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(work[row][column]) > Math.abs(work[pivot][column])) {
        pivot = row;
      }
    }
    if (Math.abs(work[pivot][column]) < 1e-12) return null;
    [work[column], work[pivot]] = [work[pivot], work[column]];

    const pivotValue = work[column][column];
    for (let index = column; index <= size; index += 1) {
      work[column][index] /= pivotValue;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = work[row][column];
      for (let index = column; index <= size; index += 1) {
        work[row][index] -= factor * work[column][index];
      }
    }
  }

  return work.map((row) => row[size]);
}

function solveInnerTriangle(outer: Point[], angleDegrees: number): Point[] | null {
  const angle = angleDegrees * Math.PI / 180;
  const rotation: Matrix = [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)],
  ];
  const matrix = Array.from({ length: 6 }, () => Array(6).fill(0));
  const values = Array(6).fill(0);

  for (let index = 0; index < 3; index += 1) {
    const vertex = outer[index];
    const nextVertex = outer[(index + 1) % 3];
    const edge = subtract(nextVertex, vertex);
    const rotated = matrixVector(rotation, vertex);
    const rowX = 2 * index;
    const rowY = rowX + 1;

    matrix[rowX][0] = rotated[0];
    matrix[rowX][1] = 1;
    matrix[rowX][3 + index] = -edge[0];
    values[rowX] = vertex[0];

    matrix[rowY][0] = rotated[1];
    matrix[rowY][2] = 1;
    matrix[rowY][3 + index] = -edge[1];
    values[rowY] = vertex[1];
  }

  const result = solveLinear6(matrix, values);
  if (!result || result[0] > 0.999999) return null;

  const scale = result[0];
  const translation: Point = [result[1], result[2]];
  return outer.map((point) =>
    add(multiply(matrixVector(rotation, point), scale), translation),
  );
}

function affineFromTriangles(source: Point[], destination: Point[]): Affine {
  const matrix = source.flatMap((point) => [
    [point[0], point[1], 1, 0, 0, 0],
    [0, 0, 0, point[0], point[1], 1],
  ]);
  const values = destination.flatMap((point) => point);
  const result = solveLinear6(matrix, values);

  if (!result) {
    return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
  }

  return {
    a: result[0],
    b: result[1],
    tx: result[2],
    c: result[3],
    d: result[4],
    ty: result[5],
  };
}

function scaleOnlyAffineFromTriangles(
  source: Point[],
  destination: Point[],
): Affine {
  const centroid = (points: Point[]): Point => [
    points.reduce((sum, point) => sum + point[0], 0) / points.length,
    points.reduce((sum, point) => sum + point[1], 0) / points.length,
  ];
  const sourceCenter = centroid(source);
  const destinationCenter = centroid(destination);
  const sideLength = (points: Point[]) =>
    Math.hypot(
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    );
  const scale = sideLength(destination) / sideLength(source);

  return {
    a: scale,
    b: 0,
    c: 0,
    d: scale,
    tx: destinationCenter[0] - scale * sourceCenter[0],
    ty: destinationCenter[1] - scale * sourceCenter[1],
  };
}

const applyAffine = (transform: Affine, point: Point): Point => [
  transform.a * point[0] + transform.b * point[1] + transform.tx,
  transform.c * point[0] + transform.d * point[1] + transform.ty,
];

const mixAffine = (start: Affine, end: Affine, amount: number): Affine => ({
  a: start.a + (end.a - start.a) * amount,
  b: start.b + (end.b - start.b) * amount,
  c: start.c + (end.c - start.c) * amount,
  d: start.d + (end.d - start.d) * amount,
  tx: start.tx + (end.tx - start.tx) * amount,
  ty: start.ty + (end.ty - start.ty) * amount,
});

const easeInOut = (value: number) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;

export function TriangleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const size = 1080;
    const center: Point = [size / 2, size / 2];
    const outerRadius = size * 0.46;
    const triangles: Point[][] = [equilateral(center, outerRadius)];
    const stepDegrees = CONFIG.targetDeg / CONFIG.trianglesPerCycle;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const ensureTriangles = (minimum: number) => {
      while (triangles.length < minimum && triangles.length < CONFIG.maxDepth) {
        const next = solveInnerTriangle(
          triangles[triangles.length - 1],
          stepDegrees,
        );
        if (!next) break;
        triangles.push(next);
      }
    };

    const drawTriangle = (points: Point[], fill: string, alpha = 1) => {
      context.globalAlpha = alpha;
      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      context.lineTo(points[1][0], points[1][1]);
      context.lineTo(points[2][0], points[2][1]);
      context.closePath();
      if (CONFIG.showFill) {
        context.fillStyle = fill;
        context.fill();
      }
      context.lineWidth = CONFIG.strokeWidth;
      context.strokeStyle = CONFIG.strokeColor;
      context.stroke();
      context.globalAlpha = 1;
    };

    const drawBoundary = () => {
      context.beginPath();
      context.arc(center[0], center[1], outerRadius, 0, 2 * Math.PI);
      context.lineWidth = CONFIG.strokeWidth;
      context.strokeStyle = CONFIG.strokeColor;
      context.stroke();
    };

    const depthStep = CONFIG.oneByOne ? 1 : CONFIG.trianglesPerCycle;
    const fullTurn = (angle: number) => {
      const remainder = Math.abs(angle) % 360;
      return remainder < 1e-7 || 360 - remainder < 1e-7;
    };
    let loopIterations = 1;
    const maximumCycles = Math.max(1, Math.floor(CONFIG.maxDepth / depthStep));
    for (let cycles = 1; cycles <= maximumCycles; cycles += 1) {
      const depth = cycles * depthStep;
      if (
        fullTurn(depth * stepDegrees) &&
        fullTurn(depth * CONFIG.hueStep)
      ) {
        loopIterations = cycles;
        break;
      }
      loopIterations = cycles;
    }

    const speedDivisor = CONFIG.oneByOne ? CONFIG.trianglesPerCycle : 1;
    const phaseBuildSeconds = CONFIG.buildSeconds / speedDivisor;
    const phaseZoomSeconds = CONFIG.zoomSeconds / speedDivisor;
    const removalSeconds =
      CONFIG.removingOld || CONFIG.oneByOne ? phaseBuildSeconds : 0;
    const cycleLength =
      phaseBuildSeconds + removalSeconds + phaseZoomSeconds;
    const loopDuration = cycleLength * loopIterations;

    ensureTriangles(loopIterations * depthStep + CONFIG.trianglesPerCycle + 2);

    const render = (timeMilliseconds: number) => {
      const absoluteTime = reducedMotion
        ? phaseBuildSeconds
        : timeMilliseconds / 1000;
      const time = absoluteTime % loopDuration;
      const cycleIndex = Math.floor(time / cycleLength);
      const local = time % cycleLength;
      const removing = CONFIG.oneByOne
        ? local < removalSeconds
        : CONFIG.removingOld &&
          local >= phaseBuildSeconds &&
          local < phaseBuildSeconds + removalSeconds;
      const building = CONFIG.oneByOne
        ? !removing && local < removalSeconds + phaseBuildSeconds
        : local < phaseBuildSeconds;
      const progress = CONFIG.oneByOne
        ? removing
          ? local / removalSeconds
          : building
            ? (local - removalSeconds) / phaseBuildSeconds
            : (local - removalSeconds - phaseBuildSeconds) / phaseZoomSeconds
        : building
          ? local / phaseBuildSeconds
          : removing
            ? (local - phaseBuildSeconds) / removalSeconds
            : (local - phaseBuildSeconds - removalSeconds) / phaseZoomSeconds;

      const maximumDepth = triangles.length - 1;
      const maximumRenderableCycles = Math.max(
        1,
        Math.floor((maximumDepth - depthStep) / depthStep) + 1,
      );
      const baseDepth =
        (cycleIndex % maximumRenderableCycles) * depthStep;
      const startIndex = Math.min(baseDepth, maximumDepth);
      const endIndex = Math.min(baseDepth + depthStep, maximumDepth);
      const cameraStart = CONFIG.zoomSpin
        ? affineFromTriangles(triangles[startIndex], triangles[0])
        : scaleOnlyAffineFromTriangles(triangles[startIndex], triangles[0]);
      const cameraEnd = CONFIG.zoomSpin
        ? affineFromTriangles(triangles[endIndex], triangles[0])
        : scaleOnlyAffineFromTriangles(triangles[endIndex], triangles[0]);
      const camera = building || removing
        ? cameraStart
        : mixAffine(cameraStart, cameraEnd, easeInOut(progress));

      context.clearRect(0, 0, size, size);
      context.save();
      context.beginPath();
      context.arc(center[0], center[1], outerRadius, 0, 2 * Math.PI);
      context.clip();

      const topDepth = building
        ? baseDepth + progress * depthStep
        : baseDepth + depthStep;
      const completeDepth = Math.min(maximumDepth, Math.floor(topDepth));
      const partialAlpha = topDepth - Math.floor(topDepth);
      const historyStart = CONFIG.removingOld
        ? baseDepth
        : Math.max(
            0,
            baseDepth - CONFIG.keepHistoryCycles * depthStep,
          );

      const drawAt = (index: number, alpha: number) => {
        const transformed = triangles[index].map((point) =>
          applyAffine(camera, point),
        );
        const hue = (CONFIG.fillBaseHue + index * CONFIG.hueStep) % 360;
        drawTriangle(
          transformed,
          `hsl(${hue} ${CONFIG.fillSaturation}% ${CONFIG.fillLightness}%)`,
          alpha,
        );
      };

      if (removing) {
        const removableCount = Math.max(0, endIndex - historyStart);
        const removalPosition = progress * removableCount;
        const firstRemaining = Math.min(
          endIndex,
          historyStart + Math.floor(removalPosition),
        );
        const firstAlpha =
          1 - (removalPosition - Math.floor(removalPosition));

        if (firstRemaining < endIndex && firstAlpha > 1e-6) {
          drawAt(firstRemaining, firstAlpha);
        }
        for (
          let index = Math.min(endIndex, firstRemaining + 1);
          index <= endIndex;
          index += 1
        ) {
          drawAt(index, 1);
        }
      } else {
        const drawStart =
          CONFIG.removingOld && !building ? endIndex : historyStart;
        for (
          let index = drawStart;
          index <= completeDepth;
          index += 1
        ) {
          drawAt(index, 1);
        }

        const partialIndex = completeDepth + 1;
        if (partialIndex <= maximumDepth && partialAlpha > 1e-6) {
          drawAt(partialIndex, partialAlpha);
        }
      }

      context.restore();
      drawBoundary();

      if (!reducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="triangle-canvas"
      width={1080}
      height={1080}
      aria-hidden="true"
    />
  );
}
