class SemiEllipsoidSurface extends Surface {
    readonly center: V3
    readonly f1: V3
    readonly f2: V3
    readonly f3: V3
    readonly matrix: M4
    readonly inverseMatrix: M4
    readonly normalMatrix: M4
    readonly normalDir: number // -1 | 1

	constructor(center: V3, f1: V3, f2: V3, f3: V3) {
		super()
		assertVectors(center, f1, f2, f3)
		this.center = center
		this.f1 = f1
		this.f2 = f2
		this.f3 = f3
		this.matrix = M4.forSys(f1, f2, f3, center)
		this.inverseMatrix = this.matrix.inversed()
		this.normalDir = sign(this.f1.cross(this.f2).dot(this.f3))
		this.normalMatrix = this.matrix.as3x3().inversed().transposed().timesScalar(this.normalDir)
	}

	equals(obj: any): boolean {
		return this == obj ||
			Object.getPrototypeOf(obj) == this.constructor.prototype
			&& this.matrix.equals(obj.matrix)
	}

    edgeLoopCCW(contour) {
        return SemiEllipsoidSurface.unitArea(contour.map(edge => edge.transform(this.inverseMatrix))) > 0
        //let totalAngle = 0
        //for (let i = 0; i < contour.length; i++) {
        //    const ipp = (i + 1) % contour.length
        //    const edge = contour[i], nextEdge = contour[ipp]
        //    totalAngle += edge.bDir.angleRelativeNormal(nextEdge.aDir, this.normalAt(edge.b))
        //}
        //return le(0, totalAngle)
	}

    like(object) {
        if (!this.isCoplanarTo(object)) return false
        // normals need to point in the same direction (outwards or inwards) for both
        return this.matrix.determinant3() * object.matrix.determinant3() > 0
    }

	static unitArea(contour: Edge[]) {
        const totalArea = contour.map(edge => {
            if (edge.curve instanceof SemiEllipseCurve || edge.curve instanceof PICurve) {
                const f = (t) => {
                    const at = edge.curve.at(t), tangent = edge.curve.tangentAt(t)
                    const angleXY = abs(at.angleXY())
                    //const arcLength = angleXY * Math.sqrt(1 - at.z ** 2) ( == at.lengthXY())
                    //const scaling = tangent.z / at.lengthXY()
                    return angleXY * tangent.z
                }
                const val = glqInSteps(f, edge.aT, edge.bT, 1)
                return val
            } else {
                assertNever()
            }
        }).sum()
        return totalArea
    }

	rootPoints() {

    }

    toSource() {
        return `new SemiEllipsoidSurface(${this.center.toSource()}, ${this.f1.toSource()}, ${this.f2.toSource()}, ${this.f3.toSource()})`
    }

    isCurvesWithSurface(surface: Surface) {
        function iii(ists, surface, curve, min, max) {
            ists.sort((a, b) => a - b)
            if (!eq(ists[0], min)) {
                ists.splice(0, 0, min)
            }
            if (!eq(ists.last(), max)) {
                ists.push(max)
            }
            const result = []
            for (let i = 0; i < ists.length - 1; i++) {
                const aT = ists[i], bT = ists[i + 1]
                const a = curve.at(aT), b = curve.at(bT)
                const aNormal = surface.normalAt(a), bNormal = surface.normalAt(b)
                const aInside = dotCurve2(curve, aT, aNormal, 1) < 0
                const bInside = dotCurve2(curve, bT, bNormal, -1) < 0
                //assert(bInside == aInside)
                if (surface.containsPoint(a) ? aInside : bInside) {
                    result.push([aT, ists[i + 1]])
                }
            }
            return result
        }
        function getIntervals(ts: number[], min, max): [number, number][] {
            ts.sort((a, b) => a - b)
            if (!eq(ts[0], min)) {
                ts.splice(0, 0, min)
            }
            if (!eq(ts.last(), max)) {
                ts.push(max)
            }
            return NLA.arrayFromFunction(ts.length - 1, i => [ts[i], ts[i + 1]])
        }



        if (surface instanceof PlaneSurface) {
            return this.isCurvesWithPlane(surface.plane)
        } else if (surface instanceof SemiCylinderSurface) {
            return this.isCurvesWithSemiCylinderSurface(surface)
        } else if (surface instanceof SemiEllipsoidSurface) {
            const surfaceLC = surface.transform(this.inverseMatrix)
            return SemiEllipsoidSurface.unitISCurvesWithEllipsoidSurface(surfaceLC)
                .map(c => c.transform(this.matrix))
        } else if (surface instanceof ProjectedCurveSurface) {
            //return []
            const surfaceLC = surface.transform(this.inverseMatrix)
            const baseCurveLC = surfaceLC.baseCurve.project(new P3(surfaceLC.dir1, 0))
            const ists = baseCurveLC.isTsWithSurface(EllipsoidSurface.UNIT)
            const insideIntervals = getIntervals(ists, baseCurveLC.tMin, baseCurveLC.tMax)
                .filter(([a, b]) => baseCurveLC.at((a + b) / 2).length() < 1)
            const projectedCurves = [0, 1].map(id => {
                return t => {
                    const atSqr = NLA.snap(baseCurveLC.at(t).squared(), 1)
                    const lineISTs = /* +- */ sqrt(1 - atSqr)
                    //assert(!isNaN(lineISTs))
                    return eq0(lineISTs) ? baseCurveLC.at(t) : baseCurveLC.at(t).plus(surfaceLC.dir1.times(sign(id - 0.5) * lineISTs))
                }
            })
            const dProjectedCurves = [0, 1].map(id => {
                return t => {
                    // d/dt sqrt(1 - baseCurveLC.at(t).squared())
                    // = -1/2 * 1/sqrt(1 - baseCurveLC.at(t).squared()) * -2*baseCurveLC.at(t) * baseCurveLC.tangentAt(t)
                    const atSqr = NLA.snap(baseCurveLC.at(t).squared(), 1)
                    const lineISTs = /* +- */ baseCurveLC.at(t).times(-1/sqrt(1 - atSqr)).dot(baseCurveLC.tangentAt(t))
                    //assert(!isNaN(lineISTs))
                    return baseCurveLC.tangentAt(t).plus(surfaceLC.dir1.times(sign(id - 0.5) * lineISTs))
                }
            })
            //const f2 = t => sqrt(1 - baseCurveLC.at(t).squared())
            //const df2 = t => baseCurveLC.at(t).times(-1 / sqrt(1 - baseCurveLC.at(t).squared())).dot(baseCurveLC.tangentAt(t))
            //checkDerivate(f2, df2, 0.31, 0.60)
            const curves = []
            for (const [aT, bT] of insideIntervals) {
                //const aLine = new L3(baseCurveLC.at(aT), surfaceLC.dir1)
                //const a = EllipsoidSurface.UNIT.isTsForLine(aLine).map(t => aLine.at(t))
                //const bLine = new L3(baseCurveLC.at(bT), surfaceLC.dir1)
                //const b = EllipsoidSurface.UNIT.isTsForLine(bLine).map(t => bLine.at(t))
                for (const i of [0, 1]) {
                    const f = t => projectedCurves[i](t).y
                    const df = t => dProjectedCurves[i](t).y
                    checkDerivate(f, df, aT + 0.1, bT - 0.1)
                    const tsAtY0 = getRoots(f, aT + NLA_PRECISION, bT - NLA_PRECISION, 1 / (1 << 11), df)
                    const ii2 = getIntervals(tsAtY0, aT, bT).filter(([a, b]) => f((a + b) / 2) > 0)
                    for (const [aT2, bT2] of ii2) {
                        let aP = projectedCurves[i](aT2), bP = projectedCurves[i](bT2)
                        0 === i && ([aP, bP] = [bP, aP])
                        assert(EllipsoidSurface.UNIT.containsPoint(aP))
                        assert(EllipsoidSurface.UNIT.containsPoint(bP))
                        curves.push(new PICurve(surface, this, this.matrix.transformPoint(aP), this.matrix.transformPoint(bP), -1))
                    }
                }
            }
            const f = (t) => baseCurveLC.at(t).length() - 1
            const fRoots = null
            return curves
        } else {
            assert(false)
        }
    }

    isCurvesWithPlane(p: P3) {
        const planeLC = p.transform(this.inverseMatrix)
        return SemiEllipsoidSurface.unitISCurvesWithPlane(planeLC).map(c => c.transform(this.matrix))
    }

    isCurvesWithSemiCylinderSurface(surface: SemiCylinderSurface): Curve[] {
        if (new L3(surface.baseCurve.center, surface.dir1).containsPoint(this.center)) {
            assert(this.isSphere())
            const ellipseProjected = surface.baseCurve.transform(M4.projection(surface.baseCurve.getPlane(), surface.dir1))
            assert(ellipseProjected.isCircular())
            const thisRadius = this.f1.length()
            const surfaceRadius = ellipseProjected.f1.length()
            // sphereRadius² = distanceISFromCenter² + isRadius²
            if (eq(thisRadius, surfaceRadius)) {
                // return
            } else if (surfaceRadius < thisRadius) {

            }
        } else {
            assert(false)
        }
    }

    isTsForLine(line) {
        assertInst(L3, line)
        // transforming line manually has advantage that dir1 will not be renormalized,
        // meaning that calculated values t for localLine are directly transferable to line
        const anchorLC = this.inverseMatrix.transformPoint(line.anchor)
	    const dirLC = this.inverseMatrix.transformVector(line.dir1)
	    return SemiEllipsoidSurface.unitISTsWithLine(anchorLC, dirLC)
    }

	isCoplanarTo(surface) {
		if (this === surface) return true
		if (surface.constructor !== SemiEllipsoidSurface) return false
		if (!this.center.like(surface.center)) return false
		if (this.isSphere()) return surface.isSphere() && NLA.eq(this.f1.length(), this.f2.length())

		const otherMatrixLC = this.inverseMatrix.times(surface.matrix)
		// Ellipsoid with matrix otherMatrixLC is unit sphere iff otherMatrixLC is orthogonal
		return otherMatrixLC.is3x3() && otherMatrixLC.isOrthogonal()
	}

	containsEllipse(ellipse: SemiEllipseCurve): boolean {
		const ellipseLC = ellipse.transform(this.inverseMatrix)
		const distEllipseLCCenter = ellipseLC.center.length()
		const correctRadius = Math.sqrt(1 - distEllipseLCCenter ** 2)
		return NLA.lt(distEllipseLCCenter, 1)
            && ellipseLC.isCircular()
            && ellipseLC.f1.hasLength(correctRadius)
            //&& le(0, ellipseLC.getAABB().min.y)
	}

    containsCurve(curve) {
        if (curve instanceof SemiEllipseCurve) {
            return this.containsEllipse(curve)
        } else if (curve instanceof PICurve) {
            return curve.points.every(this.containsPoint, this)
        } else {
            return false
        }
    }

    transform(m4) {
        return new SemiEllipsoidSurface(
            m4.transformPoint(this.center),
            m4.transformVector(this.f1),
            m4.transformVector(this.f2),
            m4.transformVector(this.f3).times(m4.isMirroring() ? -1 : 1)) as this
    }

    isInsideOut(): boolean {
        return this.f1.cross(this.f2).dot(this.f3) < 0
    }

    flipped(): SemiEllipsoidSurface {
        return new SemiEllipsoidSurface(
            this.center,
            this.f1,
            this.f2,
            this.f3.negated())
    }


    toMesh(subdivisions: int = 3): GL.Mesh {
	    return GL.Mesh.parametric(this.parametricFunction(), this.parametricNormal(), 0, PI, -PI / 2, PI / 2, 16, 16)
        //return GL.Mesh.sphere(subdivisions).transform(this.matrix)
    }

    parametricNormal() {
        // ugh
        // paramtric ellipsoid point q(a, b)
        // normal == (dq(a, b) / da) X (dq(a, b) / db) (Cross product of partial derivatives
        // normal == cos b * (f2 X f3 * cos b * cos a + f3 X f1 * cos b * sin a + f1 X f2 * sin b)
        return (a, b) => {
            let {f1, f2, f3} = this
            let normal = f2.cross(f3).times(Math.cos(b) * Math.cos(a))
                .plus(f3.cross(f1).times(Math.cos(b) * Math.sin(a)))
                .plus(f1.cross(f2).times(Math.sin(b)))
                //.times(Math.cos(b))
                .unit()
            return normal
        }
    }

    normalAt(p) {
    	return this.normalMatrix.transformVector(this.inverseMatrix.transformPoint(p)).unit()
    }

    normalST(s, t) {
    	return this.normalMatrix.transformVector(V3.sphere(s, t))
    }

    parametricFunction() {
        // this(a, b) = f1 cos a cos b + f2 sin a cos b + f2 sin b
        return (alpha, beta) => {
            return this.matrix.transformPoint(V3.sphere(alpha, beta))
        }
    }

	pointToParameterFunction() {
		return (pWC: V3) => {
			const pLC = this.inverseMatrix.transformPoint(pWC)
			const alpha = abs(pLC.angleXY())
			const beta = Math.asin(NLA.clamp(pLC.z, -1, 1))
            assert(isFinite(alpha))
            assert(isFinite(beta))
			return new V3(alpha, beta, 0)
		}
    }

	isSphere(): boolean {
		return NLA.eq(this.f1.length(), this.f2.length())
			&& NLA.eq(this.f2.length(), this.f3.length())
			&& NLA.eq(this.f3.length(), this.f1.length())
			&& this.f1.isPerpendicularTo(this.f2)
			&& this.f2.isPerpendicularTo(this.f3)
			&& this.f3.isPerpendicularTo(this.f1)
	}

	isVerticalSpheroid(): boolean {
        return NLA.eq(this.f1.length(), this.f2.length())
	        && this.f1.isPerpendicularTo(this.f2)
	        && this.f2.isPerpendicularTo(this.f3)
	        && this.f3.isPerpendicularTo(this.f1)
	}

    implicitFunction() {
        return (pWC) => {
            const pLC = this.inverseMatrix.transformPoint(pWC)
            return (pLC.y > 0
                ? pLC.length() - 1
                : (-pLC.y + Math.hypot(pLC.x, pLC.z) - 1)) * this.normalDir
        }
    }
    didp(pWC) {
        const pLC = this.inverseMatrix.transformPoint(pWC)
        const didpLC = (pLC.y > 0
                    ? pLC.unit()
                    : V(pLC.x / Math.hypot(pLC.x, pLC.z), -1, pLC.z / Math.hypot(pLC.x, pLC.z))).times(this.normalDir)
        return this.inverseMatrix.transformVector(didpLC)
    }

    mainAxes(): SemiEllipsoidSurface {
        // q(a, b) = f1 cos a cos b + f2 sin a cos b + f3 sin b
        // q(s, t, u) = s * f1 + t * f2 + u * f3 with s² + t² + u² = 1
        // (del q(a, b) / del a) = f1 (-sin a) cos b  + f2 cos a cos b
        // (del q(a, b) / del b) = f1 cos a (-sin b) + f2 sin a (-sin b) + f2 cos b
        // del q(s, t, u) / del a = -t f1 + s f2
        // (del q(a, b) / del a) DOT q(a, b) == 0
        // (f1 (-sin a) cos b  + f2 cos a cos b) DOT (f1 cos a cos b + f2 sin a cos b + f2 sin b) == 0
        // (del q(a, b) / del b) DOT q(a, b) == 0
        // (f1 cos a (-sin b) + f2 sin a (-sin b) + f2 cos b) DOT (f1 cos a cos b + f2 sin a cos b + f2 sin b) == 0

        // Solve[
        // (f1 (-sin a) cos b  + f2 cos a cos b) * (f1 cos a cos b + f2 sin a cos b + f2 sin b) = 0,
        // (f1 cos a (-sin b) + f2 sin a (-sin b) + f2 cos b) * (f1 cos a cos b + f2 sin a cos b + f2 sin b) = 0}, a, b]
        const {f1, f2, f3} = this

	    if (eq0(f1.dot(f2)) && eq0(f2.dot(f3)) && eq0(f3.dot(f1))) {
        	return this
	    }

		//const f = ([a, b], x?) => {
		//    const sinA = Math.sin(a), cosA = Math.cos(a), sinB = Math.sin(b), cosB = Math.cos(b)
		//    const centerToP = V3.add(f1.times(cosA * cosB), f2.times(sinA * cosB), f3.times(sinB))
		//    const centerToPdelA = f1.times(-sinA * cosB).plus(f2.times(cosA * cosB))
		//    const centerToPdelB = V3.add(f1.times(cosA * -sinB), f2.times(sinA * -sinB), f3.times(cosB))
		//    x && console.log(centerToP.sce, centerToPdelA.sce, centerToPdelB.sce)
		//    return [centerToP.dot(centerToPdelA), centerToP.dot(centerToPdelB)]
		//}
		//const mainF1Params = newtonIterate(f, [0, 0], 8), mainF1 = this.parametricFunction()(mainF1Params[0], mainF1Params[1])
		//console.log(f(mainF1Params, 1).sce)
		//const mainF2Params = newtonIterate(f, this.pointToParameterFunction()(f2.rejectedFrom(mainF1)).toArray(2), 8),
	     //   mainF2 = this.parametricFunction()(mainF2Params[0], mainF2Params[1])
		//console.log(this.parametricNormal()(mainF2Params[0], mainF2Params[1]).sce)
		//assert(mainF1.isPerpendicularTo(mainF2), mainF1, mainF2, mainF1.dot(mainF2), mainF1Params)
		//const mainF3Params = this.pointToParameterFunction()(mainF1.cross(mainF2)), mainF3 = this.parametricFunction()(mainF3Params[0], mainF3Params[1])
		//return new EllipsoidSurface(this.center, mainF1, mainF2, mainF3)

	    const {U, SIGMA} = this.matrix.svd3()
	    assert(SIGMA.isDiagonal())
	    assert(U.isOrthogonal())
	    const U_SIGMA = U.times(SIGMA)
	    // column vectors of U_SIGMA
	    const [mainF1, mainF2, mainF3] = NLA.arrayFromFunction(3, i => new V3(U_SIGMA.m[i], U_SIGMA.m[i + 4], U_SIGMA.m[i + 8]))
	    return new SemiEllipsoidSurface(this.center, mainF1, mainF2, mainF3)
    }

    containsPoint(p) {
        return NLA.eq0(this.implicitFunction()(p))
    }

    boundsFunction() {
        return (a, b) => NLA.between(a, 0, PI) && NLA.between(b, -PI, PI)
    }

    /**
     * unit sphere: x² + y² + z² = 1
     * line: p = anchor + t * dir |^2
     * p² = (anchor + t * dir)^2
     * 1 == (anchor + t * dir)^2
     * 1 == anchor DOT anchor + 2 * anchor * t * dir + t² * dir DOT dir
     */
    static unitISTsWithLine(anchor: V3, dir: V3): number[] {
        // for 0 = a t² + b t + c
        const a = dir.dot(dir)
        const b = 2 * anchor.dot(dir)
        const c = anchor.dot(anchor) - 1
        return pqFormula(b / a, c / a).filter(t => le(0, anchor.y + t * dir.y))
    }

    /**
     * unit sphere: x² + y² + z² = 1
     * plane: normal DOT p = w
     */
    static unitISCurvesWithPlane(plane: P3): SemiEllipseCurve[] {
        const distPlaneCenter = Math.abs(plane.w)
        if (NLA.lt(distPlaneCenter, 1)) {
            // result is a circle
            // radius of circle: imagine right angled triangle (origin -> center of intersection circle -> point on
            // intersection circle) pythagoras: 1² == distPlaneCenter² + isCircleRadius² => isCircleRadius == sqrt(1 -
            // distPlaneCenter²)
            const isCircleRadius = Math.sqrt(1 - distPlaneCenter ** 2)
            const anchorY = plane.normal.y * plane.w
            const d = abs(distPlaneCenter *isCircleRadius)
            if (le(anchorY, -d) && !eq0(distPlaneCenter)) {
                return []
            } else if (le(anchorY, 0) && !plane.normal.isParallelTo(V3.Y)) {
                let f1 = plane.normal.isParallelTo(V3.Y) ? V3.Z : plane.normal.cross(V3.Y).toLength(isCircleRadius)
                const f2 = f1.cross(plane.normal)
                const minEta = -anchorY / f2.y, minT = max(0, Math.asin(minEta))
                return [new SemiEllipseCurve(plane.anchor, f1, f2, minT, PI - minT)]
            } else {
                const f2 = (plane.normal.isParallelTo(V3.Y) ? V3.X : plane.normal.cross(V3.Y)).toLength(isCircleRadius)
                const f1 = f2.cross(plane.normal)
                const minXi = eq0(f1.y) ? -1 : -anchorY / f1.y, maxT = Math.acos(max(-1, minXi))
                return [new SemiEllipseCurve(plane.anchor, f1.negated(), f2, PI - maxT, PI),
                    new SemiEllipseCurve(plane.anchor, f1, f2.negated(), 0, maxT)]
            }
        } else {
            return []
        }
    }

    static unitISCurvesWithEllipsoidSurface(surface: SemiEllipsoidSurface) {
        if (surface.isSphere()) {
            const surfaceRadius = surface.f1.length()
            const surfaceCenterDist = surface.center.length()
            if (le(1, surfaceCenterDist - surfaceRadius) || le(surfaceCenterDist + surfaceRadius, 1) || le(surfaceCenterDist - surfaceRadius, -1)) {
                return []
            } else {
                // origin, surface.center and points on the intersection curves form a triangle.
                // the height on the segment origin - surface.center is the radius of the is curves
                // the distance from the origin to the lot point is the distance to the intersection plane
                function heron(a, b, c) {
                    const p = (a + b + c) / 2
                    return (p * (p - a) * (p - b) * (p - c)) ** 0.5
                }
                const triangleArea = heron(1, surfaceRadius, surfaceCenterDist)
                const radius = triangleArea * 2 / surfaceCenterDist
                const isCurvesCenterDist = (1 - radius ** 2) ** 0.5
                return SemiEllipsoidSurface.unitISCurvesWithPlane(new P3(surface.center.unit(), isCurvesCenterDist))
            }
        }
        assertNever()
    }

    static unitISCurvesWithSemiCylinderSurface(surface: SemiCylinderSurface): SemiEllipseCurve[] {
        if (new L3(surface.baseCurve.center, surface.dir1).containsPoint(V3.O)) {
            const ellipseProjected = surface.baseCurve.transform(M4.projection(new P3(surface.dir1, 0)))
            const f1Length = ellipseProjected.f1.length(), f2Length = ellipseProjected.f2.length()
            if (lt(1, min(f1Length, f2Length))) return []
            if (ellipseProjected.isCircular()) {
                const distISCurveCenter = Math.sqrt(1 - min(1, f1Length) ** 2)
                const isCurveCenter = (surface.dir1.y < 0 ? surface.dir1.negated() : surface.dir1).times(distISCurveCenter)
                // isCurve.at(t).y = isCurveCenter.y + ellipseProjected.f1.y * cos(t) + ellipseProjected.f2.y * sin(t) = 0
                return [new SemiEllipseCurve(isCurveCenter, ellipseProjected.f1, ellipseProjected.f2)]
            }
        }
        assert(false)
    }

    static sphere(radius: number, center: V3 = V3.O): SemiEllipsoidSurface {
        assertNumbers(radius)
        return new SemiEllipsoidSurface(center, new V3(radius, 0, 0), new V3(0, radius, 0), new V3(0, 0, radius))
    }

    /**
     * x²/a² + y²/b² + z²/c² = 1
     */
    static forABC(a: number, b: number, c: number, center: V3 = V3.O): SemiEllipsoidSurface {
        return new SemiEllipsoidSurface(center, new V3(a, 0, 0), new V3(0, b, 0), new V3(0, 0, c))
    }

    volume(): number {
        return 4 / 3 * Math.PI * this.f1.dot(this.f2.cross(this.f3))
    }

    static calculateAreaSpheroid(a: V3, b: V3, c: V3, edges: Edge[]): number {
    	assertf(() => a.isPerpendicularTo(b))
    	assertf(() => b.isPerpendicularTo(c))
    	assertf(() => c.isPerpendicularTo(a))

	    // handling discontinuities:
	    // option 1: check for intersections with baseline, if there are any integrate parts separetely
	    // "rotate" the edge so that there are no overlaps
    	const matrix = M4.forSys(a, b, c), inverseMatrix = matrix.inversed()
	    const circleRadius = a.length()
	    const c1 = c.unit()
	    const totalArea = edges.map(edge => {
		    if (edge.curve instanceof SemiEllipseCurve) {
			    const f = (t) => {
				    const at = edge.curve.at(t), tangent = edge.tangentAt(t)
				    const localAt = inverseMatrix.transformPoint(at)
				    const angleXY = localAt.angleXY()
				    const arcLength = angleXY * circleRadius * Math.sqrt(1 + localAt.z ** 2)
				    const scaling = Math.sqrt(1 + c1.dot(tangent) ** 2)
				    return arcLength * scaling
			    }
			    const val = glqInSteps(f, edge.aT, edge.bT, 1)
			    console.log("edge", edge, val)
			    return val
		    } else {
			    assertNever()
		    }
	    }).sum()


	    return totalArea
    }

    meshSphere(edges: Edge[], subdivisions: int = 3) {
	    const golden = (1 + Math.sqrt(5)) / 2, u = new V3(1, golden, 0).unit(), s = u.x, t = u.y
	    // base vertices of isocahedron
	    const vertices = [
		    new V3(-s, t, 0),
		    new V3(s, t, 0),
		    new V3(-s, -t, 0),
		    new V3(s, -t, 0),

		    new V3(0, -s, t),
		    new V3(0, s, t),
		    new V3(0, -s, -t),
		    new V3(0, s, -t),

		    new V3(t, 0, -s),
		    new V3(t, 0, s),
		    new V3(-t, 0, -s),
		    new V3(-t, 0, s)]
	    // base triangles of isocahedron
	    const triangles = [
		    // 5 faces around point 0
		    0, 11, 5,
		    0, 5, 1,
		    0, 1, 7,
		    0, 7, 10,
		    0, 10, 11,

		    // 5 adjacent faces
		    1, 5, 9,
		    5, 11, 4,
		    11, 10, 2,
		    10, 7, 6,
		    7, 1, 8,

		    // 5 faces around point 3
		    3, 9, 4,
		    3, 4, 2,
		    3, 2, 6,
		    3, 6, 8,
		    3, 8, 9,

		    // 5 adjacent faces
		    4, 9, 5,
		    2, 4, 11,
		    6, 2, 10,
		    8, 6, 7,
		    9, 8, 1,
	    ]

	    /**
	     * Tesselates triangle a b c
	     * a b c must already be in vertices with the indexes ia ib ic
	     * res is the number of subdivisions to do. 0 just results in triangle and line indexes being added to the
	     * respective buffers.
	     */
	    function tesselateRecursively(a, b, c, res, vertices, triangles, ia, ib, ic, lines, fullyInside: boolean) {
		    if (0 == res) {
			    triangles.push(ia, ib, ic)
			    if (ia < ib) lines.push(ia, ib)
			    if (ib < ic) lines.push(ib, ic)
			    if (ic < ia) lines.push(ic, ia)
		    } else {
				const vs = [a, b, c]
			    let edgeIntersectsTriangle = false
		    	for (let i = 0; i < 3; i++) {
		    		const v0 = vs[i], v1 = vs[(i + 1) % 3], v2 = vs[(i + 2) % 3]
				    const plane = new P3(a.cross(b).normalized(), 0)
				    edgeIntersectsTriangle = edgeIntersectsTriangle || edges.some(edge => {
					    return edge.edgeISTsWithPlane(plane).some(t => {
						    const p = edge.curve.at(t)
						    const v01 = v0.to(v1), v0p_1 = v0.to(p).unit(), dot = v01.dot(v0p_1)
						    if (0 <= dot && dot <= 1) {
							    return true
						    }
					    })
				    })
			    }
			    fullyInside = !edgeIntersectsTriangle && SemiEllipseCurve.UNIT.con

			    // subdivide the triangle abc into 4 by adding a vertex (with the correct distance from the origin)
			    // between each segment ab, bc and cd, then calling the function recursively
			    const abMid1 = a.plus(b).toLength(1), bcMid1 = b.plus(c).toLength(1), caMid1 = c.plus(a).toLength(1)
			    // indexes of new vertices:
			    const iabm = vertices.length, ibcm = iabm + 1, icam = iabm + 2
			    vertices.push(abMid1, bcMid1, caMid1)
			    tesselateRecursively(abMid1, bcMid1, caMid1, res - 1, vertices, triangles, iabm, ibcm, icam, lines)
			    tesselateRecursively(a, abMid1, caMid1, res - 1, vertices, triangles, ia, iabm, icam, lines)
			    tesselateRecursively(b, bcMid1, abMid1, res - 1, vertices, triangles, ib, ibcm, iabm, lines)
			    tesselateRecursively(c, caMid1, bcMid1, res - 1, vertices, triangles, ic, icam, ibcm, lines)
		    }
	    }

	    var mesh = new Mesh({normals: true, colors: false, lines: true});
	    mesh.vertices.pushAll(vertices)
	    subdivisions = undefined == subdivisions ? 4 : subdivisions
	    for (var i = 0; i < 20; i++) {
		    var [ia, ic, ib] = triangles.slice(i * 3, i * 3 + 3)
		    tesselateRecursively(vertices[ia], vertices[ic], vertices[ib], subdivisions, mesh.vertices, mesh.triangles, ia, ic, ib, mesh.lines)
	    }

	    mesh.normals = mesh.vertices
	    mesh.compile()
	    console.log('mesh.lines', mesh.lines, mesh.indexBuffers)
	    return mesh

    }

	loopContainsPoint(loop: Edge[], p: V3): PointVsFace {
        if (!this.containsPoint(p)) return PointVsFace.OUTSIDE
		assertVectors(p)
        const pLCXY = this.inverseMatrix.transformPoint(p).withElement('z', 0)
        const testLine = new SemiEllipseCurve(
			this.center,
			this.f3,
            pLCXY.isZero() ? this.f2 : this.matrix.transformVector(pLCXY.unit()))
		const pT = testLine.pointT(p)

        if (P3.normalOnAnchor(this.f2.unit(), this.center).containsPoint(p)) {
            let edgeT
            return loop.some(edge => edge.curve.containsPoint(p) && le(edge.minT, edgeT = edge.curve.pointT(p)) && le(edgeT, edge.maxT)) ? PointVsFace.ON_EDGE : PointVsFace.OUTSIDE
        }

		const lineOut = testLine.normal
		const testPlane = P3.normalOnAnchor(testLine.normal, p)
		const colinearEdges = loop.map((edge) => testLine.isColinearTo(edge.curve))
		let inside = false

		function logIS(isP) {
			const isT = testLine.pointT(isP)
			if (NLA.eq(pT, isT)) {
				return true
			} else if (pT < isT && NLA.le(isT, PI)) {
				inside = !inside
			}
		}

		for (let edgeIndex = 0; edgeIndex < loop.length; edgeIndex++) {
			const edge = loop[edgeIndex]
			const nextEdgeIndex = (edgeIndex + 1) % loop.length, nextEdge = loop[nextEdgeIndex]
			//console.log(edge.toSource()) {p:V(2, -2.102, 0),
			if (colinearEdges[edgeIndex]) {
                let edgeT
				if (edge.curve.containsPoint(p) && le(edge.minT, edgeT = edge.curve.pointT(p)) && le(edgeT, edge.maxT)) {
					return PointVsFace.ON_EDGE
				}
				// edge colinear to intersection
				const nextInside = colinearEdges[nextEdgeIndex] || dotCurve(lineOut, nextEdge.aDir, nextEdge.aDDT) < 0
				if (!nextInside && testLine.containsPoint(edge.b)) {
					if (logIS(edge.b)) return PointVsFace.ON_EDGE
				}
			} else {
				for (const edgeT of edge.edgeISTsWithPlane(testPlane)) {
					if (edgeT == edge.bT) {
						if (!testLine.containsPoint(edge.b)) continue
						// endpoint lies on intersection testLine
						const edgeInside = dotCurve(lineOut, edge.bDir.negated(), edge.bDDT.negated()) < 0 // TODO: bDDT negated?
						const nextInside = colinearEdges[nextEdgeIndex] || dotCurve(lineOut, nextEdge.aDir, nextEdge.aDDT) < 0
						if (edgeInside != nextInside) {
							if (logIS(edge.b)) return PointVsFace.ON_EDGE
						}
					} else if (edgeT != edge.aT) {
						const p = edge.curve.at(edgeT)
						if (!testLine.containsPoint(p)) continue
						// edge crosses testLine, neither starts nor ends on it
						if (logIS(p)) return PointVsFace.ON_EDGE
						// TODO: tangents?
					}
				}
			}
		}
		return inside ? PointVsFace.INSIDE : PointVsFace.OUTSIDE

    }


	calculateArea(edges: Edge[], canApproximate = true): number {
    	assert(this.isVerticalSpheroid())
    	const {f1, f2, f3} = this
		// calculation cannot be done in local coordinate system, as the area doesnt scale proportionally
		const circleRadius = f1.length()
		const f31 = f3.unit()
		const totalArea = edges.map(edge => {
			if (edge.curve instanceof SemiEllipseCurve) {
				const f = (t) => {
					const at = edge.curve.at(t), tangent = edge.curve.tangentAt(t)
					const localAt = this.inverseMatrix.transformPoint(at)
					let angleXY = localAt.angleXY()
					if(eq(Math.abs(angleXY), PI)) {
						if (edge.curve.normal.isParallelTo(this.f2)) {
							angleXY = PI * -Math.sign((edge.bT - edge.aT) * edge.curve.normal.dot(this.f2))
						} else {
							angleXY = PI * dotCurve(this.f2, tangent, edge.curve.ddt(t))
						}
						console.log(angleXY)
					}
					const arcLength = angleXY * circleRadius * Math.sqrt(1 - localAt.z ** 2)
					const dotter = this.matrix.transformVector(new V3(-localAt.z * localAt.x / localAt.lengthXY(), -localAt.z * localAt.y / localAt.lengthXY(), localAt.lengthXY())).unit()
					const df3 = tangent.dot(f31)
					//const scaling = df3 / localAt.lengthXY()
					const scaling = dotter.dot(tangent)
					//console.log(t, at.str, arcLength, scaling)
					return arcLength * scaling
				}
				const val = glqInSteps(f, edge.aT, edge.bT, 1)
				console.log("edge", edge, val)
				return val
			} else {
				assertNever()
			}
		}).sum()



		return totalArea * Math.sign(this.f1.cross(this.f2).dot(this.f3))
	}

	// volume does scale linearly, so this can be done in the local coordinate system
	// first transform edges with inverse matrix
	// then rotate everything edges so the original world Z dir again points in Z dir
	// now we have a problem because edges which originally  did not cross the seam plane can now be anywhere
	// we need to split the transformed loop along the local seam plane
	// and then sum the zDir volumes of the resulting loops
    zDirVolume(loop: Edge[]): {volume: number, centroid: V3} {
	    const angles = this.inverseMatrix.transformVector(V3.Z).toAngles()
	    const T = M4.rotationAB(this.inverseMatrix.transformVector(V3.Z), V3.Z).times(M4.rotationZ(-angles.phi)).times(this.inverseMatrix)
	    function calc(loop) {
		    let totalVolume = 0
		    assert(V3.Z.isParallelTo(T.transformVector(V3.Z)))
		    //const zDistanceFactor = toT.transformVector(V3.Z).length()
		    loop.map(edge => edge.transform(T)).forEach((edge, edgeIndex, edges) => {
			    const nextEdgeIndex = (edgeIndex + 1) % edges.length, nextEdge = edges[nextEdgeIndex]

			    function f(t) {
				    const at = edge.curve.at(t), tangent = edge.curve.tangentAt(t)
				    const r = at.lengthXY()
				    const at2d = at.withElement('z', 0)
				    const angleAdjusted = (at.angleXY() + TAU - NLA_PRECISION) % TAU + NLA_PRECISION
				    const result = angleAdjusted * Math.sqrt(1 - r * r) * r * Math.abs(tangent.dot(at2d.unit())) * Math.sign(tangent.z)
				    //console.log("at2d", at2d.sce, "result", result, 'angle', angleAdjusted, ' edge.tangentAt(t).dot(at2d.unit())', edge.tangentAt(t).dot(at2d.unit()))
				    return result
			    }

			    const volume = gaussLegendreQuadrature24(f, edge.aT, edge.bT)
			    console.log("edge", edge, "volume", volume)
			    totalVolume += volume
		    })
		    return totalVolume
	    }
	    const [front, back] = SemiEllipsoidSurface.splitOnPlaneLoop(loop.map(edge => edge.transform(T)), ccw)
	    const localVolume = calc(front, PI) + calc(back, -PI)

	    return {volume: localVolume * this.f1.dot(this.f2.cross(this.f3)), centroid: null}
	}
    zDirVolumeForLoop2(loop: Edge[]): number {
    	const angles = this.inverseMatrix.getZ().toAngles()
	    const T = M4.rotationY(-angles.theta).times(M4.rotationZ(-angles.phi)).times(this.inverseMatrix)
	    const rot90x = M4.rotationX(PI / 2)
	    let totalVolume = 0
	    assert(V3.X.isParallelTo(T.transformVector(V3.Z)))
	    //const zDistanceFactor = toT.transformVector(V3.Z).length()
	    loop.map(edge => edge.transform(T)).forEach((edge, edgeIndex, edges) => {
		    const nextEdgeIndex = (edgeIndex + 1) % edges.length, nextEdge = edges[nextEdgeIndex]
		    function f (t) {
	    		const at2d = edge.curve.at(t).withElement('x', 0)
			    const result = 1 / 3 * (1 - (at2d.y ** 2 + at2d.z ** 2)) * edge.tangentAt(t).dot(rot90x.transformVector(at2d.unit()))
			    console.log("at2d", at2d.sce, "result", result)
			    return result
		    }
		    //if (edge.)
		    if (edge.b.like(V3.X)) {
			    const angleDiff = (edge.bDir.angleRelativeNormal(nextEdge.aDir, V3.X) + 2 * PI) % (2 * PI)
			    totalVolume += 2 / 3 * angleDiff
			    console.log("xaa")
		    }
		    if (edge.b.like(V3.X.negated())) {
			    const angleDiff = (edge.bDir.angleRelativeNormal(nextEdge.aDir, V3.X) + 2 * PI) % (2 * PI)
			    totalVolume += 2 / 3 * angleDiff
			    console.log("xbb")
		    }
		    const volume = gaussLegendreQuadrature24(f, edge.aT, edge.bT)
		    console.log("edge", edge, "volume", volume)
		    totalVolume += volume
	    })

	    return totalVolume * this.f1.dot(this.f2.cross(this.f3))
	}

	surfaceAreaApprox(): number {
    	// See https://en.wikipedia.org/wiki/Ellipsoid#Surface_area
    	const mainAxes = this.mainAxes(),
		    a = mainAxes.f1.length(),
		    b = mainAxes.f2.length(),
		    c = mainAxes.f3.length()
		const p = 1.6075
		return 4 * PI * Math.pow((Math.pow(a * b, p) + Math.pow(b * c, p) + Math.pow(c * a, p)) / 3, 1/p)
	}

	surfaceArea(): number {
		// See https://en.wikipedia.org/wiki/Ellipsoid#Surface_area
		const mainAxes = this.mainAxes(),
			f1l = mainAxes.f1.length(),
			f2l = mainAxes.f2.length(),
			f3l = mainAxes.f3.length(),
			[c, b, a] = [f1l, f2l, f3l].sort()

		// https://en.wikipedia.org/w/index.php?title=Spheroid&oldid=761246800#Area
		function spheroidArea(a, c) {
			if (c < a) {
				const eccentricity2 = 1 - c ** 2 / a ** 2
				const eccentricity = Math.sqrt(eccentricity2)
				return 2 * PI * a ** 2 * (1 + (1 - eccentricity2) / Math.sqrt(eccentricity) * Math.atanh(eccentricity))
			} else {
				const eccentricity = Math.sqrt(1 - a ** 2 / c ** 2)
				return 2 * PI * a ** 2 * (1 + c / a / eccentricity * Math.asin(eccentricity))
			}
		}

		if (eq(a, b)) {
			return spheroidArea(a, c)
		} else if (eq(b, c)) {
			return spheroidArea(b, a)
		} else if (eq(c, a)) {
			return spheroidArea(c, b)
		}

		const phi = Math.acos(c / a)
		const k2 = a ** 2 * (b ** 2 - c ** 2) / (b ** 2 * (a ** 2 - c ** 2)), k = Math.sqrt(k2)
		const incompleteEllipticInt1 = gaussLegendreQuadrature24(phi => Math.pow(1 - k2 * Math.sin(phi) ** 2, -0.5), 0, phi)
		const incompleteEllipticInt2 = gaussLegendreQuadrature24(phi => Math.pow(1 - k2 * Math.sin(phi) ** 2, 0.5), 0, phi)
		return 2 * PI * c ** 2 + 2 * PI * a * b / Math.sin(phi) * (incompleteEllipticInt2 * Math.sin(phi) ** 2 + incompleteEllipticInt1 * Math.cos(phi) ** 2)
	}

	getSeamPlane(): P3 {
    	return P3.forAnchorAndPlaneVectors(this.center, this.f1, this.f3)
	}

	static readonly UNIT = new SemiEllipsoidSurface(V3.O, V3.X, V3.Y, V3.Z)

    asEllipsoidSurface() {
        return new EllipsoidSurface(this.center, this.f1, this.f2, this.f3)
    }

	getExtremePoints(): V3[] {
		assert(this.isSphere())
		const thisRadius = this.f1.length()
		// points on the edge of the hemisphere don't need to be included, because if they can at most be on the edge of a face
		// hemisphere can be orientated anyway, so dot with this.f2 to make sure they are "inside"
		return [V3.X, V3.X.negated(), V3.Y, V3.Y.negated(), V3.Z, V3.Z.negated()]
			.filter(p => lt(0, p.dot(this.f2)))
			.map(p => p.times(thisRadius).plus(this.center))
	}
}
SemiEllipsoidSurface.prototype.uStep = PI / 32
SemiEllipsoidSurface.prototype.vStep = PI / 32
SemiEllipsoidSurface.prototype.sMin = 0
SemiEllipsoidSurface.prototype.sMax = PI
SemiEllipsoidSurface.prototype.tMin = -PI
SemiEllipsoidSurface.prototype.tMax = PI
