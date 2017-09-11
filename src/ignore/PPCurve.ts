class PPCurve extends Curve {
	parametricSurface1: Surface
	parametricSurface2: Surface

	/**
	 *
	 * @param parametricSurface1
	 * @param parametricSurface2
	 * @param startPoint
	 *
	 * @property {Surface} parametricSurface1
	 * @property {Surface} parametricSurface2
	 */
	constructor(parametricSurface1, parametricSurface2, startPoint) {
		super()
		assert(parametricSurface1.parametricFunction, 'parametricSurface1.parametricFunction')
		assert(parametricSurface2.parametricFunction, 'parametricSurface2.parametricFunction')
		this.parametricSurface1 = parametricSurface1
		this.parametricSurface2 = parametricSurface2
		if (!startPoint) {
			var pmPoint = curvePoint(this.implicitCurve(), V(1, 1, 0))
			this.startPoint = this.parametricSurface.parametricFunction()(pmPoint.x, pmPoint.y)
		} else {
			this.startPoint = startPoint
		}
		this.isLoop = false
		this.calcPoints(this.startPoint)
	}

	containsPoint(p) {
		assertVectors(p)
		// TODO: wrong, as there could be another curve
		return this.parametricSurface1.containsPoint(p) && this.parametricSurface2.containsPoint(p) && !isNaN(this.pointT(p))
	}

	getVerticesNo0() {
		function sliceCyclic(arr, start, end) {
			if (start <= end) {
				return arr.slice(start, end)
			} else {
				return arr.slice(start).concat(arr.slice(0, end))
			}
		}

		// TODOOO
		var start, end, arr
		if (!this.canon) {
			start = Math.floor(this.aT + 1)
			end = ceil(this.bT)
			arr = sliceCyclic(this.curve.points, start, end)
		} else {
			start = Math.floor(this.bT + 1)
			end = ceil(this.aT)
			arr = sliceCyclic(this.curve.points, start, end)
			console.log("this.canon", !!this.canon, arr.length, start, end, this.aT)
			arr.reverse()
		}
		arr.push(this.b)
		return arr
	}

	rootsAprox() {
		let roots = [[], [], []]
		const ps = this.points
		let lastDiff = ps[1].minus(ps[0])
		for (let i = 2; i < ps.length; i++) {
			let diff = ps[i].minus(ps[i - 1])
			for (let dim = 0; dim < 3; dim++) {
				if (Math.sign(lastDiff.e(dim)) != Math.sign(diff.e(dim))) {
					roots[dim].push(i)
				}
			}
			lastDiff = diff
		}
		return roots
	}

	rootPoints() {
		const pF1 = this.parametricSurface1.parametricFunction()
		const pF2 = this.parametricSurface2.parametricFunction()
		const pN1 = this.parametricSurface1.parametricNormal()
		const pN2 = this.parametricSurface2.parametricNormal()

		let rootsAprox = this.rootsAprox()
		let results = [[], [], []]
		for (let dim = 0; dim < 3; dim++) {
			for (let i = 0; i < rootsAprox[dim].length; i++) {
				let lambda = rootsAprox[dim][i]
				let p = this.at(lambda)
				assert(this.parametricSurface1.containsPoint(p))
				let pp1 = this.parametricSurface1.pointToParameterFunction()(p)
				let {x: u, y: v} = this.parametricSurface2.pointToParameterFunction()(p)
				let startValues = [pp1.x, pp1.y, u, v]

				function f(vals) {
					let [s, t, u, v] = vals
					let diff = pF1(s, t).minus(pF2(u, v))
					let n1 = pN1(s, t)
					let n2 = pN2(u, v)
					let tangent = n1.cross(n2)
					return [diff.x, diff.y, diff.z, tangent.e(dim)]
				}

				let pps = newtonIterate(f, startValues, 8)
				// assert(pF1(pps[0], pps[1]).like(pF2(pps[2], pps[3])),
				// 	pF1(pps[0], pps[1]).sce + pF2(pps[2], pps[3]).sce)
				let result = pF1(pps[0], pps[1])
				results[dim].push(result)
			}
		}
		return results
	}

	calcPoints() {
		const STEP_SIZE = 3
		if (!this.points) {
			this.points = []
			this.tangents = []
			const pF1 = this.parametricSurface1.parametricFunction()
			const pF2 = this.parametricSurface2.parametricFunction()
			const pN1 = this.parametricSurface1.parametricNormal()
			const pN2 = this.parametricSurface2.parametricNormal()
			let Q = this.startPoint
			let aParams = this.parametricSurface1.pointToParameterFunction()(Q)
			let bParams = this.parametricSurface2.pointToParameterFunction()(Q)
			console.log('aParams.sce', aParams.sce, pF1(bParams.x, bParams.y).sce)
			console.log('bParams.sce', bParams.sce)
				console.log(Q.sce)
			assert(pF1(aParams.x, aParams.y).like(Q))
			assert(aParams.like(this.parametricSurface1.footParameters(Q, aParams.x, aParams.y)))
			assert(bParams.like(this.parametricSurface2.footParameters(Q, bParams.x, bParams.y)))
			assert(pF2(bParams.x, bParams.y).like(Q))
			for (let j = 0; j < 100; j++) {
				let i = 8
				let a, b, aNormal, bNormal, abNormalsCross
				do {
					// feet of Q on this.parametricSurface1 and this.parametricSurface2 (closest points)
					aParams = this.parametricSurface1.footParameters(Q, aParams.x, aParams.y)
					bParams = this.parametricSurface2.footParameters(Q, bParams.x, bParams.y)
					a = pF1(aParams.x, aParams.y)
					b = pF2(bParams.x, bParams.y)
					// drPs.push({p:a,text:'a'+j+' '+i})
					// drPs.push({p:b,text:'b'+j+' '+i})
					aNormal = pN1(aParams.x, aParams.y)
					bNormal = pN2(bParams.x, bParams.y)
					// next Q is the intersection of the planes
					// (x - a) * aNormal,
					// (x - b) * bNormal and
					// (x - Q) * (aNormal X bNormal)
					abNormalsCross = aNormal.cross(bNormal)
					// drVs.push({anchor: Q, dir: aNormal})
					// drVs.push({anchor: Q, dir: bNormal})
					Q = V3.add(
						bNormal.cross(abNormalsCross).times(a.dot(aNormal)),
						abNormalsCross.cross(aNormal).times(b.dot(bNormal)),
						abNormalsCross.times(abNormalsCross.dot(Q))).div(abNormalsCross.squared())


				} while (--i && a.minus(b).length() > NLA_PRECISION)
				// console.log("ended on" + i)
				assert(this.parametricSurface1.containsPoint(Q))
				assert(this.parametricSurface2.containsPoint(Q))
				this.tangents.push(abNormalsCross)
				this.points.push(Q)
				Q = Q.plus(abNormalsCross.toLength(STEP_SIZE))
			}
		}
	}

	debugToMesh(mesh, bufferName) {
		mesh[bufferName] || mesh.addVertexBuffer(bufferName, bufferName)
		this.points.forEach((p, i) => {
			mesh[bufferName].push(p, p.plus(this.tangents[i].toLength(1)))
		})
	}

	pointTangent(p): V3 {
		assertVectors(p)
		assert(this.containsPoint(p), 'this.containsPoint(p)' + this.containsPoint(p))
		let n1 = this.parametricSurface1.normalAt(p)
		let n2 = this.parametricSurface2.normalAt(p)
		return n1.cross(n2)
	}

        at(t: number): V3 {
		return V3.lerp(this.points[Math.floor(t)], this.points[Math.ceil(t)], t % 1)
	}

	tangentAt(t: number): V3 {
		return V3.lerp(this.tangents[Math.floor(t)], this.tangents[Math.ceil(t)], t % 1)
	}

	pointT(point) {
		assertVectors(point)
		assert(this.containsPoint(point), 'this.containsPoint(p)')
		var pmPoint = this.parametricSurface.pointToParameterFunction()(point)
		var ps = this.points, pmps = this.pmPoints, t = 0, prevDistance, pmDistance = pmPoint.distanceTo(pmps[0])
		while (pmDistance > STEP_SIZE && t < ps.length - 1) { // TODO -1?
			//console.log(t, pmps[t].$, pmDistance)
			t += Math.min(1, Math.round(pmDistance / STEP_SIZE / 2))
			pmDistance = pmPoint.distanceTo(pmps[t])
		}
		if (t >= ps.length - 1) {
			// point is not on this curve
			return NaN
		}
		if (ps[t].like(point)) return t
		var nextT = (t + 1) % ps.length, prevT = (t + ps.length - 1) % ps.length
		if (ps[nextT].distanceTo(point) < ps[prevT].distanceTo(point)) {
			return t + 0.4
		} else {
			return t - 0.4
		}
	}
}