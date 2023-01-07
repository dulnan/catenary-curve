/**
 * Given two points and a length, calculate and draw the catenary.
 *
 * JavaScript implementation:
 * Copyright (c) 2018 Jan Hug <me@dulnan.net>
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

export interface Point {
  x: number
  y: number
}

export interface CatenaryOptions {
  /**
   * Number of segments of the chain.
   */
  segments?: number

  /**
   * Maximum amount iterations for getting catenary parameters.
   */
  iterationLimit?: number

  /**
   * Draws the individual segments as straight lines instead of curves.
   */
  drawLineSegments?: boolean
}

const EPSILON = 1e-6

/**
 * Returns a point.
 */
function getPoint(x: number, y: number): Point {
  return { x, y }
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
): number[][] {
  const data: number[][] = [
    [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY]
  ]

  const d = p2.x - p1.x
  const length = segments - 1

  for (let i = 0; i < length; i++) {
    const x = p1.x + (d * (i + 0.5)) / length
    const y = a * Math.cosh((x - offsetX) / a) + offsetY
    data.push([x, y])
  }

  data.push([p2.x, a * Math.cosh((p2.x - offsetX) / a) + offsetY])

  return data
}
/**
 * Draws a straight line between two points.
 *
 * @param {Array} data Even indices are x, odd are y.
 * @param {CanvasRenderingContext2D} context The context to draw to.
 */
function drawLine(
  data: number[][],
  context: CanvasRenderingContext2D
): number[][] {
  for (let i = 0; i < data.length - 1; i++) {
    context.moveTo(data[i][0], data[i][1])
    context.lineTo(data[i + 1][0], data[i + 1][1])
  }
  return data
}
/**
 * Determines catenary parameter.
 *
 * @param {Number} h Horizontal distance of both points.
 * @param {Number} v Vertical distance of both points.
 * @param {Number} length The catenary length.
 * @param {Number} limit Maximum amount of iterations to find parameter.
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
 *
 * @param {Array} data Even indices are x, odd are y.
 * @param {CanvasRenderingContext2D} context The context to draw to.
 *
 * @returns {Array} The original segment coordinates.
 */
function drawCurve(
  data: number[][],
  context: CanvasRenderingContext2D
): number[][] {
  let length: number = data.length - 1
  let ox: number = data[1][0]
  let oy: number = data[1][1]

  let temp: number[][] = []

  context.moveTo(data[0][0], data[0][1])

  for (let i = 2; i < length; i++) {
    const x = data[i][0]
    const y = data[i][1]
    const mx = (x + ox) * 0.5
    const my = (y + oy) * 0.5
    temp.push([ox, oy, mx, my])
    context.quadraticCurveTo(ox, oy, mx, my)
    ox = x
    oy = y
  }

  length = data.length
  context.quadraticCurveTo(
    data[length - 2][0],
    data[length - 2][1],
    data[length - 1][0],
    data[length - 1][1]
  )

  return temp
}

/**
 * Get the difference for x and y axis to another point
 */
function getDifferenceTo(p1: Point, p2: Point): Point {
  return getPoint(p1.x - p2.x, p1.y - p2.y)
}

function getDistanceBetweenPoints(p1: Point, p2: Point): number {
  const diff = getDifferenceTo(p1, p2)

  return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
}

/**
 * Draws a catenary given two coordinates, a length and a context.
 */
export function drawCatenaryCurve(
  context: CanvasRenderingContext2D,
  point1: Point,
  point2: Point,
  chainLength: number,
  options: CatenaryOptions = {}
): number[] | number[][] {
  const segments = options.segments || 20
  const iterationLimit = options.segments || 10
  const drawLineSegments = !!options.drawLineSegments

  const isFlipped = point1.x > point2.x

  const p1 = isFlipped ? point2 : point1
  const p2 = isFlipped ? point1 : point2

  const distance = getDistanceBetweenPoints(p1, p2)

  // Prevent "expensive" catenary calculations if it would only result
  // in a straight line.
  if (distance < chainLength) {
    const diff = p2.x - p1.x

    // If the distance on the x axis of both points is too small, don't
    // calculate a catenary.
    if (diff > 0.01) {
      const h = p2.x - p1.x
      const v = p2.y - p1.y
      const a = -getCatenaryParameter(h, v, chainLength, iterationLimit)
      const x = (a * Math.log((chainLength + v) / (chainLength - v)) - h) * 0.5
      const y = a * Math.cosh(x / a)
      const offsetX = p1.x - x
      const offsetY = p1.y - y
      const curveData = getCurve(a, p1, p2, offsetX, offsetY, segments)
      if (drawLineSegments) {
        return drawLine(curveData, context)
      } else {
        return drawCurve(curveData, context)
      }
    }

    const mx = (p1.x + p2.x) * 0.5
    const my = (p1.y + p2.y + chainLength) * 0.5

    return drawLine(
      [
        [p1.x, p1.y],
        [mx, my],
        [p2.x, p2.y]
      ],
      context
    )
  }

  return drawLine(
    [
      [p1.x, p1.y],
      [p2.x, p2.y]
    ],
    context
  )
}
