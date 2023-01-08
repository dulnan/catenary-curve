/**
 * Given two points and a length, calculate and draw the catenary.
 *
 * TypeScript implementation:
 * Copyright (c) 2018, 2023 Jan Hug <me@dulnan.net>
 * Released under the MIT license.
 *
 * ----------------------------------------------------------------------------
 *
 * Original ActionScript implementation:
 * Copyright poiasd ( http://wonderfl.net/user/poiasd )
 * MIT License ( http://www.opensource.org/licenses/mit-license.php )
 * Downloaded from: http://wonderfl.net/c/8Bnl
 *
 * ----------------------------------------------------------------------------
 *
 * Archived by and downloaded from:
 * http://wa.zozuar.org/code.php?c=8Bnl
 */

const EPSILON = 1e-6

export interface Point {
  x: number
  y: number
}

/**
 * The arguments for the quadraticCurveTo canvas function.
 */
export type QuadrativCurve = [cpx: number, cpy: number, x: number, y: number]

/**
 * The arguments for the lineTo canvas function.
 */
export type Line = [x: number, y: number]

/**
 * The result object if the approximation resulted in a catenary.
 */
export type CatenaryCurveQuadraticResult = {
  type: 'quadraticCurve'
  start: [x: number, y: number]
  curves: QuadrativCurve[]
}

/**
 * The result object if the approximation resulted in a singe line without any
 * visible curve.
 */
export type CatenaryCurveLineResult = {
  type: 'line'
  start: [x: number, y: number]
  lines: Line[]
}

/**
 * Possible result from the approximation.
 */
export type CatenaryCurveResult =
  | CatenaryCurveLineResult
  | CatenaryCurveQuadraticResult

export interface CatenaryOptions {
  /**
   * Number of segments of the chain.
   */
  segments?: number

  /**
   * Maximum amount iterations for getting catenary parameters.
   */
  iterationLimit?: number
}

/**
 * Calculate the catenary curve.
 * Increasing the segments value will produce a catenary closer
 * to reality, but will require more calcluations.
 */
function getCurve(
  // The catenary parameter.
  a: number,
  // First point.
  p1: Point,
  // Second point.
  p2: Point,
  // The calculated offset on the x axis.
  offsetX: number,
  // The calculated offset on the y axis.
  offsetY: number,
  // How many "parts" the chain should be made of.
  segments: number
): [x: number, y: number][] {
  const data: [x: number, y: number][] = [
    // Calculate the first point on the curve
    [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY]
  ]

  const d = p2.x - p1.x
  const length = segments - 1

  // Calculate the points in between the first and last point
  for (let i = 0; i < length; i++) {
    const x = p1.x + (d * (i + 0.5)) / length
    const y = a * Math.cosh((x - offsetX) / a) + offsetY
    data.push([x, y])
  }

  // Calculate the last point on the curve
  data.push([p2.x, a * Math.cosh((p2.x - offsetX) / a) + offsetY])

  return data
}
/**
 * Draws a straight line between two points.
 *
 */
function getLineResult(data: Line[]): CatenaryCurveLineResult {
  return {
    type: 'line',
    start: data[0],
    lines: data.slice(1)
  }
}
/**
 * Determines catenary parameter.
 *
 */
function getCatenaryParameter(
  h: number,
  v: number,
  length: number,
  limit: number
): number {
  const m = Math.sqrt(length * length - v * v) / h
  let x = Math.acosh(m) + 1
  let prevx = -1
  let count = 0

  // Iterate until we find a suitable catenary parameter or reach the iteration
  // limit
  while (Math.abs(x - prevx) > EPSILON && count < limit) {
    prevx = x
    x = x - (Math.sinh(x) - m * x) / (Math.cosh(x) - m)
    count++
  }

  return h / (2 * x)
}

/**
 * Draws a quadratic curve between every calculated catenary segment,
 * so that the segments don't look like straight lines.
 */
function getCurveResult(data: number[][]): CatenaryCurveQuadraticResult {
  let length: number = data.length - 1
  let ox: number = data[1][0]
  let oy: number = data[1][1]

  const start: [x: number, y: number] = [data[0][0], data[0][1]]
  const curves: QuadrativCurve[] = []

  for (let i = 2; i < length; i++) {
    const x = data[i][0]
    const y = data[i][1]
    const mx = (x + ox) * 0.5
    const my = (y + oy) * 0.5
    curves.push([ox, oy, mx, my])
    ox = x
    oy = y
  }

  length = data.length
  curves.push([
    data[length - 2][0],
    data[length - 2][1],
    data[length - 1][0],
    data[length - 1][1]
  ])

  return { type: 'quadraticCurve', start, curves }
}

/**
 * Pass in the return value from getCatenaryCurve and your canvas context to
 * draw the curve.
 */
export function drawResult(
  result: CatenaryCurveResult,
  context: CanvasRenderingContext2D
) {
  if (result.type === 'quadraticCurve') {
    drawResultCurve(result, context)
  } else if (result.type === 'line') {
    drawResultLine(result, context)
  }
}

/**
 * Draw the curve using lineTo.
 */
export function drawResultLine(
  result: CatenaryCurveLineResult,
  context: CanvasRenderingContext2D
) {
  context.moveTo(...result.start)
  for (let i = 0; i < result.lines.length; i++) {
    context.lineTo(...result.lines[i])
  }
}

/**
 * Draw the curve using quadraticCurveTo.
 */
export function drawResultCurve(
  result: CatenaryCurveQuadraticResult,
  context: CanvasRenderingContext2D
) {
  context.moveTo(...result.start)

  for (let i = 0; i < result.curves.length; i++) {
    context.quadraticCurveTo(...result.curves[i])
  }
}

/**
 * Get the difference for x and y axis to another point
 */
function getDifferenceTo(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

/**
 * Return the distance in pixels between two points.
 */
function getDistanceBetweenPoints(p1: Point, p2: Point): number {
  const diff = getDifferenceTo(p1, p2)

  return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
}

/**
 * Approximates the catenary curve between two points and returns the resulting
 * coordinates.
 *
 * If the curve would result in a single straight line, the approximation is
 * skipped and the input coordinates are returned.
 *
 * It returns an object with a property `type` to differenciate between `line`
 * and `quadraticCurve`. You can pass this object together with your 2D canvas
 * context to `drawResult` to directly draw it to the canvas.
 */
export function getCatenaryCurve(
  point1: Point,
  point2: Point,
  chainLength: number,
  options: CatenaryOptions = {}
): CatenaryCurveResult {
  const segments = options.segments || 25
  const iterationLimit = options.iterationLimit || 6

  // The curves are reversed
  const isFlipped = point1.x > point2.x

  const p1 = isFlipped ? point2 : point1
  const p2 = isFlipped ? point1 : point2

  const distance = getDistanceBetweenPoints(p1, p2)

  if (distance < chainLength) {
    const diff = p2.x - p1.x

    if (diff > 0.01) {
      const h = p2.x - p1.x
      const v = p2.y - p1.y

      const a = -getCatenaryParameter(h, v, chainLength, iterationLimit)
      const x = (a * Math.log((chainLength + v) / (chainLength - v)) - h) * 0.5
      const y = a * Math.cosh(x / a)

      const offsetX = p1.x - x
      const offsetY = p1.y - y
      const curveData = getCurve(a, p1, p2, offsetX, offsetY, segments)
      if (isFlipped) {
        curveData.reverse()
      }
      return getCurveResult(curveData)
    }

    const mx = (p1.x + p2.x) * 0.5
    const my = (p1.y + p2.y + chainLength) * 0.5

    return getLineResult([
      [p1.x, p1.y],
      [mx, my],
      [p2.x, p2.y]
    ])
  }

  return getLineResult([
    [p1.x, p1.y],
    [p2.x, p2.y]
  ])
}
