/**
 * x² - y² = 1
 *
 */
class HyperbolaCurve extends Curve {
	readonly normal: V3
	readonly center: V3
	readonly f1: V3
	readonly f2: V3
	readonly matrix: M4
	readonly inverseMatrix: M4

	constructor(center: V3, f1: V3, f2: V3, tMin: number = -1, tMax: number = 1) {
		super(tMin, tMax)
        assertVectors(center, f1, f2)
        this.center = center
        this.f1 = f1
        this.f2 = f2
        this.normal = f1.cross(f2).unit()
        this.matrix = M4.forSys(f1, f2, this.normal, center)
        this.inverseMatrix = this.matrix.inversed()
    }

    toSource() {
        return `new HyperbolaCurve(${this.center} ${this.f1} ${this.f2})`
    }

    at(t: number) {
        return this.center.plus(this.f1.times(Math.cosh(t))).plus(this.f2.times(Math.sinh(t)))
    }

    at2(xi: number, eta: number) {
        return this.center.plus(this.f1.times(xi)).plus(this.f2.times(eta))
    }

    tangentAt(t: number): V3 {
        assertNumbers(t)
        return this.f1.times(Math.sinh(t)).plus(this.f2.times(Math.cosh(t)))
    }

	tangentAt2(xi: number, eta: number) {
		return this.f1.times(eta).plus(this.f2.times(xi))
	}

    ddt(t: number): V3 {
        assertNumbers(t)
        return this.f1.times(Math.cosh(t)).plus(this.f2.times(Math.sinh(t)))
    }

    isCircular() {
        return NLA.eq(this.f1.length(), this.f2.length())
    }

    equals(curve) {
        return this == curve ||
	        curve.constructor == HyperbolaCurve
            && this.center.like(curve.center)
            && this.f1.like(curve.f1)
            && this.f2.like(curve.f2)
    }

    isColinearTo(curve: Curve) {
        if (curve.constructor != HyperbolaCurve) {
            return false
        }
        if (!curve.center || !this.center.like(curve.center)) {
            return false
        }
        if (this === curve) {
            return true
        }
        assert(false)
        const {f1: f1, f2: f2} = this.rightAngled(), {f1: c1, f2: c2} = curve.rightAngled()
        return NLA.eq(f1.squared(), Math.abs(f1.dot(c1)))
            && NLA.eq(f2.squared(), Math.abs(f2.dot(c2)))
    }

    normalAt(t: number): V3 {
        return this.tangentAt(t).cross(this.normal)
    }

    pointT(p, hint) {
        assertVectors(p)
        const p2 = this.inverseMatrix.transformPoint(p)
        return Math.asinh(p2.y)
    }

    isOrthogonal(): boolean {
        return this.f1.isPerpendicularTo(this.f2)
    }

    rightAngled(): HyperbolaCurve {
        const f1 = this.f1, f2 = this.f2, a = f1.dot(f2), b = f2.squared() + f1.squared()
        if (NLA.eq0(a)) {
            return this
        }
        const g1 = 2 * a, g2 = b + Math.sqrt(b * b - 4 * a * a)
        const {x1: xi, y1: eta} = intersectionUnitHyperbolaLine(g1, g2, 0)
        return new HyperbolaCurve(this.center, f1.times(xi).plus(f2.times(eta)), f1.times(eta).plus(f2.times(xi)))
    }

    transform(m4: M4) {
        return new HyperbolaCurve(
        	m4.transformPoint(this.center),
	        m4.transformVector(this.f1),
	        m4.transformVector(this.f2),
            this.tMin, this.tMax) as this
    }

    eccentricity(): number {
        const mainAxes = this.rightAngled()
        const f1length = mainAxes.f1.length(), f2length = mainAxes.f1.length()
        const [a, b] = f1length > f2length ? [f1length, f2length] : [f2length, f1length]
        return Math.sqrt(1 + b * b / a / a)
    }

    getPlane() {
        return P3.normalOnAnchor(this.normal, this.center)
    }

	containsPoint(p: V3): boolean {
        const pLC = this.inverseMatrix.transformPoint(p)
        return pLC.x > 0 && NLA.eq0(pLC.z) && NLA.eq(1, pLC.x * pLC.x - pLC.y * pLC.y)
    }

    static forAB(a: number, b: number, center: V3): HyperbolaCurve {
        return new HyperbolaCurve(center || V3.O, V(a, 0, 0), V(0, b, 0))
    }

    static UNIT = new HyperbolaCurve(V3.O, V3.X, V3.Y)
}