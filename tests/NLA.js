var P3 = NLA.Plane3
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	console.log(errorMsg, url, lineNumber, column, errorObj);
}
QUnit.assert.matrixEquals = function(actual, expected, message, precision) {
	this.push(actual.equalsMatrix(expected, precision), actual.toString(), expected.toString(), message)
}
QUnit.assert.matrixEquivalent = function(actual, expected, message, precision) {
	this.push(actual.normalized().equalsMatrix(expected.normalized(), precision), actual.toString(), expected.toString(), message)
}
QUnit.assert.V3equals = function(actual, expected, message, precision) {
	this.push(false, actual.toString(), expected.toString(), message)
}
QUnit.assert.V3like = function(actual, expected, message, precision) {
	this.push(expected.like(actual), actual.toString(), expected.toString(), (message ?message:'V3like')+ "; |dv| = " + expected.distanceTo(actual))
}

QUnit.module('NLA')
/**
 *
 * @param name
 * @param {function (Object, M4)} test
 * @param {M4=} extra
 *
 */
QUnit.testDifferentSystems = function (name, test, extra) {
	QUnit.test(name, assert => {
		console.log(`TESTING '${name}' WITH M4.IDENTITY`)
		assert.push(true,undefined,undefined, `TESTING '${name}' WITH IDENTITY.FOO`)
		test(assert, M4.IDENTITY)

		console.log(`TESTING '${name}' WITH M4.FOO`)
		assert.push(true,undefined,undefined, `TESTING '${name}' WITH M4.FOO`)
		test(assert, M4.FOO)

		if (extra) {
			console.log(`TESTING '${name}' WITH extra`)
			assert.push(true, undefined, undefined, `TESTING '${name}' WITH extra`)
			test(assert, extra)
		}
	})
}
QUnit.test( "Vector.isParallelTo", function( assert ) {
	assert.equal(1, new NLA.Line(V3.ZERO, V3.X).distanceToPoint(V3(1, 1, 0)))
});
QUnit.test( "NLA.eq etc", function( assert ) {
	assert.notOk(NLA.lt(2, 2 + NLA.PRECISION / 2))
	assert.notOk(NLA.lt(2, 2 - NLA.PRECISION / 2))
	assert.ok(NLA.le(2, 2 + NLA.PRECISION / 2))
	assert.ok(NLA.le(2, 2 - NLA.PRECISION / 2))

	assert.notOk(NLA.gt(2, 2 + NLA.PRECISION / 2))
	assert.notOk(NLA.gt(2, 2 - NLA.PRECISION / 2))
	assert.ok(NLA.ge(2, 2 + NLA.PRECISION / 2))
	assert.ok(NLA.ge(2, 2 - NLA.PRECISION / 2))

	assert.ok(NLA.lt(2, 3))
	assert.ok(NLA.gt(3, 2))
	assert.ok(NLA.le(2, 3))
	assert.ok(NLA.ge(3, 2))

	assert.ok(NLA.equals(2, 2 + NLA.PRECISION) == !NLA.gt(2, 2 + NLA.PRECISION))
	assert.ok(NLA.equals(2, 2 + NLA.PRECISION) == NLA.ge(2, 2 + NLA.PRECISION))
});
QUnit.test( "arrayCopyStep", function( assert ) {
	var a = [1, 2, 3, 4, 5, 6, 7, 8]
	var b = [-1, -2, -3, -4]
	NLA.arrayCopyStep(b, 0, 1, a, 1, 2, 3)
	assert.deepEqual(a, [1, -1, 3, -2, 5, -3, 7, 8])
});
QUnit.test( "arrayCopy", function( assert ) {
	var a = [1, 2, 3, 4, 5, 6, 7, 8]
	var b = [-1, -2, -3, -4]
	NLA.arrayCopy(b, 1, a, 2, 2)
	assert.deepEqual(a, [1, 2, -2, -3, 5, 6, 7, 8])
});
QUnit.test( "matrix rowArrays", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	assert.deepEqual(a.rowArray(0, Array), [6, 3])
	assert.deepEqual(a.rowArray(1, Array), [4, 3])
	assert.deepEqual(a.asRowArrays(Array), [[6, 3],[4, 3]])
});
QUnit.test( "matrix transposed", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	assert.deepEqual(a.transposed().asRowArrays(Array), [[6, 4],[3, 3]])
});
QUnit.test( "matrix transpose", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	a.transpose()
	assert.deepEqual(a.asRowArrays(Array), [[6, 4],[3, 3]])

	a = NLA.Matrix.fromRowArrays([6, 3, 4, 3])
	a.transpose()
	assert.deepEqual(a.asRowArrays(Array), [[6],[3],[4],[3]])
	a.transpose()
	assert.deepEqual(a.asRowArrays(Array), [[6, 3, 4, 3]])
});
QUnit.test( "Matrix.prototype.times", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	assert.deepEqual(NLA.Matrix.identity(2).times(a).asRowArrays(Array), [[6, 3],[4, 3]])
	assert.deepEqual(a.times(NLA.Matrix.identity(2)).asRowArrays(Array), [[6, 3],[4, 3]])
});
QUnit.test( "Matrix.identity", function( assert ) {
	var a = NLA.Matrix.identity(2)
	assert.deepEqual(a.asRowArrays(Array), [[1, 0],[0, 1]])
});
QUnit.test( "Matrix.prototype.rowsIndependent", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	var b = NLA.Matrix.fromRowArrays([6, 3],[12, 6])

	// all rows on plane through origin with normal = V3(1, -1, 0)
	var c = NLA.Matrix.fromRowArrays([1, -1, 1],[1, 1, 1],[-1, 0, -1])
	assert.ok(a.rowsIndependent())
	assert.notOk(b.rowsIndependent())
	assert.notOk(c.rowsIndependent())
});
QUnit.test( "Matrix.prototype.rank", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	var b = NLA.Matrix.fromRowArrays([6, 3],[12, 6])

	// all rows on plane through origin with normal = V3(1, -1, 0)
	var c = NLA.Matrix.fromRowArrays([1, -1, 1],[1, 1, 1],[-1, 0, -1])
	assert.equal(a.rank(), 2)
	assert.equal(b.rank(), 1)
	assert.equal(c.rank(), 2)

	var d = NLA.Matrix.fromRowArrays([1, 1, 0, 2],[-1, -1, 0, -2])
	assert.equal(d.rank(), 1)
	assert.equal(d.transposed().rank(), 1)


	let e = M4(
		-60.16756109919886, 1, 1, 0,
		3, -56.16756109919886, 8, 0,
		21, 34, -5.167561099198863, 0,
		0, 0, 0, 1)
	console.log(e.rank())
	console.log(e.determinant())

});
QUnit.test( "LU Decomposition", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([6, 3],[4, 3])
	var aLU = a.luDecomposition()
	assert.deepEqual(aLU.L.asRowArrays(Array), [[1, 0],[4/6, 1]])
	assert.deepEqual(aLU.U.asRowArrays(Array), [[6, 3],[0, 1]])
	assert.deepEqual(aLU.P.asRowArrays(Array), [[1, 0],[0, 1]])
	assert.matrixEquals(aLU.P.times(a), aLU.L.times(aLU.U))
});
QUnit.test( "LU Decomposition 2", function( assert ) {
	var a = NLA.Matrix.fromFunction(8, 8, (i, j) => Math.round((Math.random() - 0.5) * 4096))
	//var a = NLA.Matrix.fromRowArrays2([[-1636, 1740, -516], [-708, 403, 1986], [-1256, -1493, 996]])
	assert.ok(a.rowsIndependent())
	var aLU = a.luDecomposition()
	assert.ok(aLU.P.isPermutation())
	assert.ok(aLU.L.isLowerTriangular())
	assert.ok(aLU.U.isUpperTriangular())
	assert.matrixEquals(aLU.P.times(a), aLU.L.times(aLU.U))
});
QUnit.test( "LU Decomposition 3", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([0,1,1],[1,1,1],[1,2,3])
	var aLU = a.luDecomposition()
	assert.deepEqual(aLU.U.asRowArrays(Array), [[1,1,1],[0,1,1],[0,0,1]])
	assert.deepEqual(aLU.L.asRowArrays(Array), [[1,0,0],[0,1,0],[1,1,1]])
	assert.deepEqual(aLU.P.asRowArrays(Array), [[0,1,0],[1,0,0],[0,0,1]])
	assert.matrixEquals(aLU.P.times(a), aLU.L.times(aLU.U))
});
QUnit.test( "Matrix.isOrthogonal", function( assert ) {
	var a = NLA.Matrix.identity(4)
	assert.ok(a.isOrthogonal())
	var b = NLA.Matrix.fromRowArrays([Math.sqrt(2) / 2, Math.sqrt(2) / 2],[-Math.sqrt(2) / 2, Math.sqrt(2) / 2])
	assert.ok(a.isOrthogonal())
});
QUnit.test( "Matrix.prototype.solveLinearSystem", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([0,1,1],[1,1,1],[1,2,3])
	var b = NLA.Vector.fromArguments(1, 2, 3)
	var x = a.solveLinearSystem(b)
	assert.ok(x.equals(NLA.Vector.fromArguments(1, 1, 0)))
	assert.ok(a.timesVector(x).equals(b))
});
QUnit.test( "Matrix.prototype.inverse", function( assert ) {
	var a = NLA.Matrix.fromRowArrays([0,1,1],[1,1,1],[1,2,3])
	var aInverse = a.inversed()
	console.log(aInverse.toString())
	assert.matrixEquals(a.times(aInverse), NLA.Matrix.identity(3))
});
QUnit.test( "Matrix.prototype.inverse 2", function( assert ) {
	var a = NLA.Matrix.random(8, 8)
	var aInverse = a.inversed()
	assert.matrixEquals(a.times(aInverse), NLA.Matrix.identity(8))
});
QUnit.test( "Matrix.prototype.qrDecompositionGivensRotation", function( assert ) {
	var sqrt = Math.sqrt
	var m = NLA.Matrix.fromRowArrays([3,5], [0,2], [0,0], [4,5])
	var {Q, R} = m.qrDecompositionGivensRotation()
	assert.matrixEquals(Q, NLA.Matrix.fromRowArrays(
		[3/5, 4/5/sqrt(5), 0, -8/5/sqrt(5)],
		[0, 2/sqrt(5), 0, 1/sqrt(5)],
		[0,0,1,0],
		[4/5, -3/5/sqrt(5), 0, 6/5/sqrt(5)]
	))
	assert.ok(Q.isOrthogonal())
	assert.matrixEquals(R, NLA.Matrix.fromRowArrays(
		[5,7],
		[0, sqrt(5)],
		[0,0],
		[0,0]
	))
	assert.matrixEquals(Q.times(R), NLA.Matrix.fromRowArrays([3,5], [0,2], [0,0], [4,5]))
});

QUnit.test( "Plane3.prototype.projectedVector", function( assert ) {
	var p = NLA.Plane3(V3(0,0,1), 2)
	assert.ok(V3(1, 1, 0).like(p.projectedVector(V3(1,1,1))))
});
QUnit.test( "Line3.prototype.distanceToLine", function( assert ) {
	assert.equal(L3.X.distanceToLine(L3(V3.Z, V3.Y)), 1)
	assert.equal(L3.X.distanceToLine(L3(V3.Z, V3.X)), 1)
});
QUnit.test( "Plane3.prototype.transformed", function( assert ) {
	var p = NLA.Plane3(V3(0,0,1), 2)
	assert.ok(P3.XY.like(P3.XY.transform(M4.identity())))
});
QUnit.test( "Matrix4x4.prototype.isAxisAligned", function( assert ) {
	assert.ok(M4.rotationX(Math.PI / 2).isAxisAligned())
	console.log(M4.rotationX(Math.PI / 4).toString())
	console.log(false + true + true)
	assert.notOk(M4.rotationX(Math.PI / 4).isAxisAligned())
});
QUnit.test( "Matrix4x4.prototype.rotationLine", function( assert ) {
	assert.matrixEquals(M4.rotationLine(V3.ZERO, V3.X, 1), M4.rotationX(1))
	assert.matrixEquals(M4.rotationLine(V3.ZERO, V3.Y, 1), M4.rotationY(1))
	assert.matrixEquals(M4.rotationLine(V3.ZERO, V3.Z, 1), M4.rotationZ(1))

	var a = V3(1, 2, 3), PI = Math.PI;
	assert.matrixEquals(
		M4.rotationLine(a, V3(1, 1, 0).unit(), 1),
		M4.multiplyMultiple(M4.translation(a), M4.rotationZ(PI / 4), M4.rotationX(1), M4.rotationZ(-PI / 4), M4.translation(a.negated())),
		"",
		1e-6)
});
QUnit.test( "Matrix4x4.multiplyMultiple", function( assert ) {
	assert.matrixEquals(M4.multiplyMultiple(M4.rotationX(1), M4.rotationZ(1)), M4.rotationX(1).times(M4.rotationZ(1)))
});
QUnit.test( "Plane3.prototype.intersectionWithPlane", function( assert ) {
	assert.ok(P3.XY.intersectionWithPlane(P3.ZX).equals(L3.X))
	assert.ok(P3.ZX.intersectionWithPlane(P3.XY).equals(L3.X))
	assert.notOk(P3.ZX.intersectionWithPlane(P3.XY).equals(L3.Y))
});
QUnit.test( "Line3.prototype.isPointsWithLine", function(assert ) {
	console.log(L3.X.intersectionWithLine(L3(V3(1, 1, 0), V3.Y)).ss)
	assert.ok(L3.X.intersectionWithLine(L3(V3(1, 1, 0), V3.Y)).equals(V3.X))
});
QUnit.test( "V3.prototype.zip", function( assert ) {
	var a = V3(1, 2, 3), b = V3(4, 5, 6)
	assert.ok(V3.zip((a, b) => a + 3 * b, a, b).equals(a.plus(b.times(3))))
});
QUnit.test( "NLA.magic", function( assert ) {
	var a = V3(1, 2, 3), b = V3(4, 5, 6)
	//assert.ok(NLA.magic("a b c s => abs(a) x b .. c + 3 + ")(a, b, c, 3).equals(a.abs().cross(b).dot(c) + 3))
});
QUnit.test( "AABB", function( assert ) {
	var a = new AABB(V3.ZERO, V3(20, 10, 30))
	var b = new AABB(V3.ZERO, V3(1, 1, 1))
	assert.ok(a.likeAABB(a))
	assert.notOk(a.likeAABB(a.translate(10, 0, 0)))
	assert.ok(a.withoutAABB(b).likeAABB(new AABB(V3(0, 0, 1), V3(20, 10, 30))))
});
QUnit.test( "V3.areDisjoint", function(assert ) {

	assert.ok(V3.areDisjoint([V3.ZERO, V3.X, V3.Y].entries()))
	assert.ok(V3.areDisjoint([V3.ZERO, V3.X, V3.X, V3.Y].entries())) // same value twice is ok, as same reference
	assert.notOk(V3.areDisjoint([V3.ZERO, V3.X, V3(0, 0, 0), V3.Y].entries())) // not ok as V3.ZERO != V3(0, 0, 0)
	assert.notOk(V3.areDisjoint([V3.ZERO, V3.X, V3(NLA.PRECISION / 2, 0, 0), V3.Y].entries())) // not ok as !V3.ZERO.like(V3(...))
	assert.ok(V3.areDisjoint([V3(NLA.PRECISION * -0.7, 0, 0), V3(NLA.PRECISION * 0.7, 0, 0)].entries())) // not ok as V3.ZERO != V3(0, 0, 0)
});
QUnit.test( "V3.areDisjoint2", function(assert ) {
	console.log(~~2147483657)
	var s = new NLA.CustomSet()
	var a = V3(0, 2.7499999999999996, -5), b = V3(0, 2.749999999999999, -5)
	s.canonicalizeLike(a)
	console.log(s._map, a.like(b), a.hashCodes(), b.hashCodes(), a.hashCode(), b.hashCode())
	assert.ok(s.canonicalizeLike(b) == a)
});
QUnit.test( "NLA.arrayBinaryInsert", function(assert ) {
	var arr = [1, 2, 3, 4]
	NLA.arrayBinaryInsert(arr, 2.5, (a, b) => a - b)
	assert.deepEqual(arr, [1, 2, 2.5, 3, 4])

	var arr2 = []
	NLA.arrayBinaryInsert(arr2, -2, NLA.minus)
	NLA.arrayBinaryInsert(arr2, 5, NLA.minus)
	assert.deepEqual(arr2, [-2, 5])
});
QUnit.test( "NLA.arrayBinaryIndexOf", function(assert ) {
	assert.equal([1, 2, 2.5, 3, 4].binaryIndexOf(3, (a, b) => a - b), 3)
	assert.equal([1, 2, 2.5, 3, 4].binaryIndexOf(2.6, (a, b) => a - b), -3-1)
});
QUnit.test( "newtonIterate2d", function (assert) {
	var res = newtonIterate2d((s, t) => s - 2, (s, t) => t - 4, 5, 5)
	assert.push(res.like(V3(2, 4)), res.ss, V3(2, 4).ss)
});

QUnit.test( "NLA.M4.projection", function (assert) {
	var plane = P3(V3(1, 2, 3).normalized(), 5);
	var proj = M4.projection(plane)
	console.log(proj.transformPoint(V3(2, 4, 6)))
	assert.V3like(proj.transformPoint(V3(2, 4, 6)), plane.anchor)
	assert.V3like(proj.transformVector(V3(2, 4, 6)), V3.ZERO)
	var p2 = V3(3, 5, 22)
	assert.ok(proj.transformPoint(p2).minus(p2).isParallelTo(plane.normal))
	assert.ok(plane.containsPoint(proj.transformPoint(p2)))
	assert.ok(proj.transformVector(p2).minus(p2).isParallelTo(plane.normal))
	assert.ok(proj.transformVector(p2).isPerpendicularTo(plane.normal))
});
QUnit.test( "NLA.M4.projection 2", function (assert) {
	var plane = P3(V3(1, 2, 3).normalized(), 5);
	var dir = V3(1, 1, 1);
	var proj = M4.projection(plane, dir)
	var p2 = V3(3, 5, 22)
	assert.ok(proj.transformPoint(p2).minus(p2).isParallelTo(dir))
	assert.ok(plane.containsPoint(proj.transformPoint(p2)))
	assert.ok(proj.transformVector(p2).minus(p2).isParallelTo(dir))
	assert.ok(proj.transformVector(p2).isPerpendicularTo(plane.normal))
});
QUnit.test( "NLA.M4.isIdentity", function (assert) {
	assert.ok(M4.identity().isIdentity())
	assert.notOk(M4.scaling(1, 2, 3).isIdentity())
});
QUnit.test( "ParabolaCurve", function (assert) {
	var curve = new ParabolaCurve(V3(1, 1), V3(4, 1, -2), V3(1, 10, 2))
	assert.ok(curve.containsPoint(curve.at(0)))
	assert.ok(curve.containsPoint(curve.at(1)))
	assert.ok(curve.containsPoint(curve.at(-1)))
	var plane = P3(V3(2,7,1).normalized(), 10)
	var iss = curve.isTsWithPlane(plane)
	assert.equal(iss.length, 2)
	assert.ok(plane.containsPoint(curve.at(iss[0])), plane.distanceToPointSigned(curve.at(iss[0])))
	assert.ok(plane.containsPoint(curve.at(iss[1])), plane.distanceToPointSigned(curve.at(iss[1])))


	var curveRA = curve.rightAngled()
	NLA.arrayRange(-10, 10, 1).forEach(t => assert.ok(curveRA.containsPoint(curve.at(t))))

	//var curve = ParabolaCurve.forAB(10, 20)
	var startT = -2, endT = 3, steps = 1000
	console.log(integrateCurve(curve, startT, endT, 1000))
	console.log(curve.arcLength(startT, endT))
});
QUnit.test( "BezierCurve", function (assert) {
	var curve = BezierCurve.graphXY(2,-3,-3,2)//.rotateZ(PI/3)
	//NLA.arrayRange(-1, 1, 0.1).forEach(t => assert.ok(NLA.equals(curve.at(t).x, t)))
	//curve.pointLambda(V3.ZERO)//(V3(1,-2))
	NLA.arrayRange(-1, 1, 0.1).forEach(t => assert.push(NLA.equals(t, curve.pointLambda(curve.at(t))), t, curve.pointLambda(curve.at(t))))
});
QUnit.test( "BezierCurve.distanceToPoint", function (assert) {
	var curve = BezierCurve.graphXY(0,0,0,1)//.rotateZ(PI/3)
//        assert.ok(NLA.equals2(curve.distanceToPoint(V3(0.5, 0)), 1, NLA.PRECISION))

	let curve2 = BezierCurve.graphXY(2,-3,-3,2)
	let p = V3(0.5, 0.2)
	let closestT = curve2.closestTToPoint(p)
	let pDist = curve2.at(closestT).distanceTo(p)
	assert.push(pDist < curve2.at(closestT - 0.001).distanceTo(p), curve2.at(closestT - 0.001).distanceTo(p), "> " + pDist, "" + (pDist - curve2.at(closestT - 0.001).distanceTo(p)) + "larger")
	assert.push(pDist < curve2.at(closestT + 0.001).distanceTo(p), curve2.at(closestT + 0.001).distanceTo(p), "> " + pDist)

	let curve3 = BezierCurve.graphXY(2,-3,-3,2).scale(100, 100, 100)
	let p3 = V3(71, -65, 0)
	let closestT3 = curve3.closestTToPoint(p3)
	let pDist3 = curve3.at(closestT3).distanceTo(p3)
	assert.push(pDist3 < curve3.at(closestT3 - 0.001).distanceTo(p3), curve3.at(closestT3 - 0.001).distanceTo(p3), "> " + pDist3, "" + (pDist3 - curve3.at(closestT3 - 0.001).distanceTo(p3)) + "larger")
	assert.push(pDist3 < curve3.at(closestT3 + 0.001).distanceTo(p3), curve3.at(closestT3 + 0.001).distanceTo(p3), "> " + pDist3)

});
QUnit.test( "BezierCurve.isPointsWithLine", function (assert) {
	console.log(solveCubicReal2(1, 0, 0, 0))
	let curve = BezierCurve.graphXY(2,-3,-3,2)
	let line = L3(V3.Y, V3.X)
	let isPoints = curve.isPointsWithLine(line)
	console.log(isPoints)
	assert.equal(isPoints.length, 3)
	isPoints.forEach(p => {
		assert.ok(line.containsPoint(p))
		assert.ok(curve.containsPoint(p))
	})


	let line2 = L3(V3(0, 2, 1), V3.Z)
	let isPoints2 = curve.isPointsWithLine(line2)
	console.log(isPoints2)
	assert.equal(isPoints2.length, 1)
	assert.ok(V3(0, 2, 0).like(isPoints2[0]))


	let line3 = L3(V3.Z, V3.X)
	assert.equal(curve.isPointsWithLine(line3).length, 0)

	let df = t => curve.tangentAt(t).length()
	let last0 = 0, last1 = 0
	console.log("should be", "4.1246674172501227247060156659")
	for (let i = 10000; i < 10003; i++) {
		// 4999 4.124667416843331
		let x0 = curve.arcLength(0.5, 0.77, i),
			x1 = curveLengthByDerivative(df, 0.5, 0.77, i)
		console.log(i, x0, x0 - last0, x1, x1 - last1)
		last0 = x0
		last1 = x1
	}
});
QUnit.test( "BezierCurve.isTsWithPlane", function (assert) {
	let curve = BezierCurve.graphXY(2,-3,-3,2)
	let plane = P3(V3(0, 1, 1).normalized(), 1)

	let iss = curve.isTsWithPlane(plane)
	assert.equal(iss.length, 3)
	iss.forEach(t => {
		assert.ok(plane.containsPoint(curve.at(t)))
	})
});

QUnit.test( "solveCubicReal2()", function (assert) {
	assert.deepEqual(solveCubicReal2(0, 1, 0, 0), [0])
	assert.deepEqual(solveCubicReal2(1, 0, 0, 0), [0])
});

QUnit.test( "M4.projectPlanePoint()", function (assert) {
	var m4 = M4.projectPlanePoint(V3.Z.negated(), P3.XY)
	assert.V3like(m4.transformPoint(V3(4, 0, 1)), V3(2, 0, 0))
	assert.V3like(m4.transformPoint(V3(4, 8, 1)), V3(2, 4, 0))
	assert.V3like(m4.transformPoint(V3(4, 8, 2)), V3(4/3, 8/3, 0))
	assert.matrixEquivalent(
		M4.projectPlanePoint(M4.FOO.transformPoint(V3.Z.negated()), P3.XY.transform(M4.FOO)),
		M4.multiplyMultiple(M4.FOO, m4, M4.BAR))

});
QUnit.test( "ConicSurface.coplanar", function (assert) {
	var unitCone = ConicSurface.UNIT
	assert.ok(unitCone.matrix.isIdentity(), 'unitCone.matrix.isIdentity()')
	assert.V3like(unitCone.parametricFunction()(0,3), V3(3, 0, 3))
	var ellipseAtZ3 = EllipseCurve.UNIT.scale(3, 3, 3).translate(0,0,3)
	var planeAtZ3 = P3.XY.translate(0, 0, 3)
	var issAtZ3 = unitCone.isCurvesWithPlane(planeAtZ3)
	assert.equal(issAtZ3.length, 1)
	assert.push(ellipseAtZ3.isColinearTo(issAtZ3[0]), issAtZ3.toString(), ellipseAtZ3.toString())
	assert.ok(unitCone.containsEllipse(ellipseAtZ3))


	var scaledUnit = ConicSurface.UNIT.scale(2, 2, 1)
	assert.notOk(scaledUnit.isCoplanarTo(unitCone))
	assert.notOk(unitCone.isCoplanarTo(scaledUnit))
	var ell1 = unitCone.isCurvesWithPlane(P3(V3(2, 3, 10).normalized(), 10))[0]
	assert.ok(unitCone.containsEllipse(ell1), 'unitCone.containsEllipse(ell1)')
	var ell2 = unitCone.isCurvesWithPlane(P3(V3(1, 1, 2).normalized(), 4))[0]
	var ell1Cone = ConicSurface.atApexThroughEllipse(V3.ZERO, ell1, 1)
	var ell2Cone = ConicSurface.atApexThroughEllipse(V3.ZERO, ell2, 1)
	console.log(ell1Cone   )
	assert.ok(unitCone.isCoplanarTo(ell1Cone))
	assert.ok(unitCone.isCoplanarTo(ell2Cone))
	assert.ok(ell1Cone.isCoplanarTo(ell2Cone))
	assert.ok(ell2Cone.isCoplanarTo(ell1Cone))
	assert.ok(ell1Cone.foo().isCoplanarTo(ell2Cone.foo()))
});
QUnit.test( "ConicSurface.containsParabola", function (assert) {
	var unitCone = ConicSurface.UNIT
	var pb = unitCone.isCurvesWithPlane(NLA.Plane3(V3(1,0,1).normalized(), 4))[0]
	assert.ok(unitCone.containsParabola(pb))

	var c2 = unitCone.shearedX(2, 3)
	var pb2 = c2.isCurvesWithPlane(NLA.Plane3(V3(1,0,1).normalized(), 4).shearedX(2, 3))[0]
	assert.ok(c2.containsParabola(pb2))
});
QUnit.test( "Hyperbola", function (assert) {
	var hb = HyperbolaCurve.UNIT
	NLA.arrayRange(-10, 10, 1).forEach(t => assert.ok(hb.containsPoint(hb.at(t))))

	var hbSheared = hb.shearedX(2, 3)
	assert.notOk(hbSheared.isOrthogonal())
	var hbScaledRA = hbSheared.rightAngled()
	NLA.arrayRange(-10, 10, 1).forEach(t => assert.ok(hbScaledRA.containsPoint(hbSheared.at(t))))

	assert.deepEqual(intersectionUnitHyperbolaLine(1,0,2), {x1:2,y1:sqrt(3),x2:2,y2:-sqrt(3)})
});
QUnit.testDifferentSystems( "ProjectedCurveSurface", function (assert, m4) {
	let pp = V3(0.5, 1)
	let curve = BezierCurve.graphXY(2,-3,-3,2)
	let pcs = new ProjectedCurveSurface(curve, V3.Z).transform(m4)
	let p = pcs.parametricFunction()(pp.x, pp.y)
	console.log(p.ss, pcs.pointToParameterFunction()(p))
	assert.V3like(pcs.pointToParameterFunction()(p), pp, "ptpf(pcs.pf(pp)) == pp")
});
QUnit.testDifferentSystems( "ProjectedCurveSurface Face line intersection test", function (assert, m4) {
	let curve = BezierCurve.graphXY(2,-3,-3,2)
	let edge = B2.PCurveEdge.forCurveAndTs(curve, 0, 1)
	let edges = [
		edge,
		StraightEdge.throughPoints(curve.at(1), curve.at(1).plus(V3(0, 0, 10))),
		edge.flipped().transform(M4.translation(0, 0, 10)),
		StraightEdge.throughPoints(curve.at(0).plus(V3(0, 0, 10)), curve.at(0))]
	let surface = new ProjectedCurveSurface(curve, V3.Z)
	let face = new B2.Face(surface, edges).transform(m4)
	let line = L3(V3.Z, V3.X).transform(m4)
	let d = face.intersectsLine(line)
	assert.ok(d)
});
QUnit.test( "ProjectedCurveSurface Face containsPoint", function (assert, m4) {
	let face = new B2.RotationFace(new ProjectedCurveSurface(new BezierCurve(V3(142.87578921496748, -191.46078243076332, 0), V3(161.78547089700214, -252.13248349581008, 0), V3(284.63214994898954, -163.59789158697575, 0), V3(372.40411211189405, -210.3992206435476, 0)), V3(0, 0, 1), 0, 1), [
		B2.PCurveEdge.forCurveAndTs(
			new BezierCurve(V3(142.87578921496748, -191.46078243076332, 0), V3(161.78547089700214, -252.13248349581008, 0), V3(284.63214994898954, -163.59789158697575, 0), V3(372.40411211189405, -210.3992206435476, 0)), 1, 0),
		StraightEdge.throughPoints(V3(142.87578921496748, -191.46078243076332, 0), V3(142.87578921496748, -191.46078243076332, -100)),
		B2.PCurveEdge.forCurveAndTs(new BezierCurve(V3(142.87578921496748, -191.46078243076332, -100), V3(161.78547089700214, -252.13248349581008, -100), V3(284.63214994898954, -163.59789158697575, -100), V3(372.40411211189405, -210.3992206435476, -100)), 0, 1),
		StraightEdge.throughPoints(V3(372.40411211189405, -210.3992206435476, -100), V3(372.40411211189405, -210.3992206435476, 0))], [])
	let line = L3(V3(1241.5987, -1214.1894, 38.9886), V3(-0.6705, 0.7386, -0.0696).normalized())
	let isp = face.surface.isPointsWithLine(line)
	assert.equal(isp.length, 1)
	isp.forEach(p => {
		console.log(p.ss)
		assert.ok(line.containsPoint(p))
		assert.ok(face.surface.containsPoint(p))
	})
//		let p = V3(1192.4056247755673, -1243.899135769775, 220.80458903468156)
//		assert.ok(face.surface.containsPoint(p))
});
QUnit.testDifferentSystems( "Matrix4x4 eigenValues and eigenVectors", function (assert, /** M4*/ m4) {
	let eigenValues = m4.realEigenValues3()
	console.log(eigenValues)
//		assert.equal(eigenValues.length, 3)
	eigenValues.forEach((eigenValue, i)=> {
		assert.ok(NLA.isZero(M4.IDENTITY.timesScalar(-eigenValue).plus(m4.as3x3()).determinant()))
		//assert.ok(ei)
	})
	let eigenVectors = m4.realEigenVectors3()
	console.log(eigenVectors)
	eigenVectors.forEach((eigenVector, i) => {
		m4.isNormal() && assert.ok(eigenVector.isPerpendicularTo(eigenVectors[(i+1)%eigenVectors.length]), `eigenVector${i}.isPerpendicularTo(eigenVector${(i+1)%eigenVectors.length})`)
		assert.ok(!eigenVector.isZero(), `'!eigenVector${i}.isZero()` + !eigenVector.isZero())
		assert.ok(eigenVector.isParallelTo(m4.transformVector(eigenVector)), `eigenVector${i}.isParallelTo(m4.transformVector(eigenVector))`)
	})

}, M4(
	3,2,4,0,
	2,0,2,0,
	4,2,3,0,
	0,0,0,1));
