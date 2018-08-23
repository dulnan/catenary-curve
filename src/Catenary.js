import Point from './Point'

const EPSILON = Number.EPSILON
const LIMIT = 500

class Catenary {
  /**
   * constructor
   *
   * @param {object} settings
   * @param {number} settings.chainLength The length for the chain
   * @param {(number|string)} settings.segments Number of segments of the chain. 'auto' will adjust segments in relation to chainLength
   * @param {number} settings.iterationLimit Max amount iterations for getting catenary parameters
   */
  constructor ({ chainLength = 200, segments = 'auto', iterationLimit = 'auto' } = {}) {
    this.p1 = new Point()
    this.p2 = new Point()

    this.chainLength = chainLength

    this._segments = segments
    this._iterationLimit = iterationLimit
  }

  get segments () {
    return this._segments === 'auto' ? this.chainLength / 10 : this._segments
  }

  get iterationLimit () {
    return this._iterationLimit === 'auto' ? this.chainLength / 10 : this._iterationLimit
  }

  drawToCanvas (context, p1, p2) {
    this.p1.update(p1)
    this.p2.update(p2)
    const distance = this.p1.getDistanceTo(p2)

    console.log(this.chainLength)

    this.calculateCatenary(this.p1, this.p2, this.chainLength, context)
  }

  calculateCatenary (point1, point2, chainLength, context) {
    const isFlipped = point1.x > point2.x

    const p1 = isFlipped ? point2 : point1
    const p2 = isFlipped ? point1 : point2

    const distance = p1.getDistanceTo(p2)

    if (distance < chainLength) {
      const diff = p2.x - p1.x
      if (diff >= 0.01) {
        let d = p2.x - p1.x
        let h = p2.y - p1.y
        let a = -this.getCatenaryParameter(d, h, chainLength)
        let x = (a * Math.log((chainLength + h) / (chainLength - h)) - d) * 0.5
        let y = a * Math.cosh(x / a)
        let offsetX = p1.x - x
        let offsetY = p1.y - y
        this.curve = this.drawCatenary(a, p1, p2, offsetX, offsetY, context, this.segments)
      } else {
        let mx = (p1.x + p2.x) * 0.5
        let my = (p1.y + p2.y + chainLength) * 0.5

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
    while (Math.abs(x - prevx) > 0 && count < LIMIT) {
      prevx = x
      x = x - (Math.sinh(x) - m * x) / (Math.cosh(x) - m)
      count++
    }
    return d / (2 * x)
  }

  drawCatenary (a, p1, p2, offsetX, offsetY, context, segments) {
    let data = [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY]
    const d = p2.x - p1.x
    const length = segments - 1

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
