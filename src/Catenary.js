import { RADIUS_DEFAULT } from './settings'
// import { RADIUS_DEFAULT } from './tools'
import Point from './Point'

const SEGMENTS = 50
const EPSILON = 1e-6

class Catenary {
  /**
   * constructor
   *
   * @param {object} settings
   * @param {number} settings.radius The radius for the lazy area
   * @param {boolean} settings.enabled
   */
  constructor (context) {
    this.p1 = new Point()
    this.p2 = new Point()

    this.context = context

    this.length = 50
  }

  drawToCanvas (p1, p2, length, context) {
    this.p1.update(p1)
    this.p2.update(p2)
    const distance = this.p1.getDistanceTo(p2)

    const catenaryLength = length - (10 * distance / length)

    this.calculateCatenary(this.p1, this.p2, distance, catenaryLength, context)
  }

  calculateCatenary (point1, point2, distance, length, context) {
    const isFlipped = point1.x > point2.x

    const p1 = isFlipped ? point2 : point1
    const p2 = isFlipped ? point1 : point2

    if (distance < length) {
      if (p2.x - p1.x > 0.01) {
        let d = p2.x - p1.x
        let h = p2.y - p1.y
        let a = -this.getCatenaryParameter(d, h, length)
        let x = (a * Math.log((length + h) / (length - h)) - d) * 0.5
        let y = a * Math.cosh(x / a)
        let offsetX = p1.x - x
        let offsetY = p1.y - y
        this.curve = this.drawCatenary(a, p1, p2, offsetX, offsetY, context)
      } else {
        let mx = (p1.x + p2.x) * 0.5
        let my = (p1.y + p2.y + length) * 0.5

        context.moveTo(p1.x, p1.y)
        context.lineTo(mx, my)
        context.lineTo(p2.x, p2.y)
      }
    } else {
      context.moveTo(p1.x, p1.y)
      context.lineTo(p2.x, p2.y)
    }
  }

  getCatenaryParameter (d, h, length) {
    let m = Math.sqrt(length * length - h * h) / d
    let x = Math.acosh(m) + 1
    let prevx = -1
    let count = 0
    while (Math.abs(x - prevx) > EPSILON && count < 130) {
      prevx = x
      x = x - (Math.sinh(x) - m * x) / (Math.cosh(x) - m)
      count++
    }
    return d / (2 * x)
  }

  drawCatenary (a, p1, p2, offsetX, offsetY, context) {
    let data = [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY]
    let d = p2.x - p1.x
    let length = SEGMENTS - 1

    for (let i = 0; i < length; i++) {
      let x = p1.x + d * (i + 0.5) / length
      let y = a * Math.cosh((x - offsetX) / a) + offsetY
      data.push(x, y)
    }

    data.push(p2.x, a * Math.cosh((p2.x - offsetX) / a) + offsetY)

    this.drawCurve(data, context)
  }

  drawCurve (data, context) {
    let length = data.length * 0.5 - 1
    let ox = data[2]
    let oy = data[3]

    context.moveTo(data[0], data[1])

    for (let i = 2; i < length; i++) {
      let x = data[i * 2]
      let y = data[i * 2 + 1]
      let mx = (x + ox) * 0.5
      let my = (y + oy) * 0.5
      context.quadraticCurveTo(ox, oy, mx, my)
      ox = x
      oy = y
    }

    length = data.length
    context.quadraticCurveTo(data[length - 4], data[length - 3], data[length - 2], data[length - 1])
  }
}

export default Catenary
