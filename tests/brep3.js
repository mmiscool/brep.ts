var P3 = NLA.Plane3
QUnit.module('brep3')

QUnit.assert.doTest = function (face, brep2, resultEdges, resultPoints, desc) {
	if (brep2 instanceof B2.Face) {
		brep2 = new B2([brep2])
	}
	this.ok(true, `<html><a style='color: #0000ff; text-decoration: underline;' target='blank'
						href='file:///C:/Users/aval/Desktop/cs/brep2.html?a=${new B2([face]).toSource()}&b=${brep2.toSource()}
						&edges=[${resultEdges.map(e => e.toSource()).join(',')}]
						&points=[${resultPoints.map(e => e.toSource()).join(',')}]'>${desc}</a>`)
	var faceMap = new Map(), edgeMap = new Map()
	brep2.faces.forEach(face2 => {
		face.dooPlaneFace(face2, new B2([face]), brep2, faceMap, edgeMap)
	})
	var edges = faceMap.get(face) || []
	console.log(faceMap)
	this.equal(edges.length, resultEdges.length, 'resultEdges.length == edges.length'+edges.toSource())
	resultEdges.forEach(edge => {
		this.ok(edges.some(edge2 => edge.likeEdge(edge2)), `edges.some(edge2 => edge.likeEdge(edge2)) [${edges.toSource()}] ${edge.toSource()}`)
	})
	var uniquePoints = []
	face.edges.forEach(edge => {
		var em = edgeMap.get(edge)
		em && em.forEach(info => info && !uniquePoints.some(up => up.like(info.p)) && assert(info.p) && uniquePoints.push(info.p))
	})
	this.equal(uniquePoints.length, resultPoints.length, 'points.length == resultPoints.length'+uniquePoints.toSource())
	resultPoints.forEach(p => {
		this.ok(uniquePoints.some(up => up.like(p)), `edges.some(edge2 => edge.likeEdge(edge2)) [${uniquePoints.toSource()}]`)
	})
}
QUnit.assert.doTestWithBrep = function (face, faceBrep, brep2, resultEdges, resultPoints, desc) {
	if (brep2 instanceof B2.Face) {
		brep2 = new B2([brep2])
	}
	this.ok(true, `<html><a style='color: #0000ff; text-decoration: underline;' target='blank'
						href='file:///C:/Users/aval/Desktop/cs/brep2.html?a=${faceBrep.toSource()}&b=${brep2.toSource()}
						&edges=[${resultEdges.map(e => e.toSource()).join(',')}]
						&points=[${resultPoints.map(e => e.toSource()).join(',')}]'>${desc}</a>`)
	var faceMap = new Map(), edgeMap = new Map()
	brep2.faces.forEach(face2 => {
		face.dooPlaneFace(face2, faceBrep, brep2, faceMap, edgeMap)
	})
	var edges = faceMap.get(face) || []
	console.log(faceMap)
	this.equal(edges.length, resultEdges.length, 'resultEdges.length == edges.length'+edges.toSource())
	resultEdges.forEach(edge => {
		this.ok(edges.some(edge2 => edge.likeEdge(edge2)), `edges.some(edge2 => edge.likeEdge(edge2)) [${edges.toSource()}] ${edge.toSource()}`)
	})
	var uniquePoints = []
	face.edges.forEach(edge => {
		var em = edgeMap.get(edge)
		em && em.forEach(info => info && !uniquePoints.some(up => up.like(info.p)) && assert(info.p) && uniquePoints.push(info.p))
	})
	this.equal(uniquePoints.length, resultPoints.length, 'points.length == resultPoints.length'+uniquePoints.toSource())
	resultPoints.forEach(p => {
		this.ok(uniquePoints.some(up => up.like(p)), `uniquePoints.some(up => up.like(p)) [${uniquePoints.toSource()}]`)
	})
}

QUnit.assert.doTest2 = function (face, brep, resultFaces, desc) {
	if (brep instanceof B2.Face) {
		console.log("blah")
		brep = new B2([brep])
	}
	var faceMap = new Map(), edgeMap = new Map()
	var faceBrep = new B2([face]);
	this.ok(true, `<html><a style='color: #0000ff; text-decoration: underline;' target='blank'
href='file:///C:/Users/aval/Desktop/cs/brep2.html?a=${faceBrep.toSource()}&b=${brep.toSource()}&c=${new B2(resultFaces).toSource()}.translate(20, 0, 0)'>${desc}</a>`)
	brep.faces.forEach(face2 => {
		face.dooPlaneFace(face2, faceBrep, brep, faceMap, edgeMap)
	})
	console.log('faceMap', faceMap)
	var edgeLooseSegments = B2.prototype.getLooseEdgeSegments(edgeMap)
	var newFaces = []
	B2.prototype.reconstituteFaces([face], edgeLooseSegments, faceMap, newFaces)
	this.equal(newFaces.length, resultFaces.length, "number of new faces")
	this.ok(true, `<html><a style='color: #0000ff; text-decoration: underline;' target='blank'
href='file:///C:/Users/aval/Desktop/cs/brep2.html?a=${faceBrep.toSource()}&b=${brep.toSource()}&c=${new B2(newFaces).toSource()}.translate(20, 0, 0)'>result</a>`)
	resultFaces.forEach(face => {
		this.ok(newFaces.some(newFace => newFace.likeFace(face)), `newFaces.some(newFace => newFace.likeFace(face) ${newFaces.toSource()}`)
	})
}
QUnit.test( "two faces cutting each other in the middle", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	console.log(face, B2.Face.prototype.rotateX)
	var face2 = face.rotateX(PI / 2).translate(1, 2, -3)
	assert.doTest(face, face2, [StraightEdge.throughPoints(V3(1, 2), V3(10, 2))], [V3(10, 2)])

	var face3 = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI / 2).translate(1, 2, -3)
	assert.doTest(face, face3, [StraightEdge.throughPoints(V3(1, 2), V3(6, 2))], [])
});
QUnit.test( "face touching edge of test face with its middle", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	var face2 = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(12, 0), V3(12, 10), V3(0, 10)]).rotateX(PI/2).translate(-1, 0, -5)
	assert.doTest(face, face2, [], [V3(0, 0), V3(10, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(10, 0))
	assert.doTest(face, face2.flipped(), [], [])
});
QUnit.test( "testing V-shape with spine touching middle of test face", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, -10), V3(10, -10), V3(10, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/4)
	])

	assert.doTest(face, brep.rotateX(PI/2), [], [])
	assert.doTest(face, brep.rotateX(PI/2).flipped(), [], [])
	assert.doTest(face, brep.rotateX(-PI/2), [], [])
	assert.doTest(face, brep.rotateX(-PI/2).flipped(), [StraightEdge.throughPoints(V3(0, 0), V3(5, 0)), StraightEdge.throughPoints(V3(5, 0), V3(0, 0))], [])
});
QUnit.test( "V-shape splitting test face at spine", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, -10), V3(10, -10), V3(10, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/4),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/4)
	])

	assert.doTest(face, brep, [StraightEdge.throughPoints(V3(0, 0), V3(5, 0))], [])
	assert.doTest(face, brep.flipped(), [StraightEdge.throughPoints(V3(5, 0), V3(0, 0))], [])
});
QUnit.test( "V-shape with spine parallel to test face normal; touching test face edge", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-20, 0), V3(20, 0), V3(20, 10), V3(-20, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/4),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/4)
	]).rotateY(PI/2).translate(0, 0, 2)

	assert.doTest(face, brep, [StraightEdge.throughPoints(V3(0, 0), V3(5 * sqrt(2), 5 * sqrt(2))), StraightEdge.throughPoints(V3(-5 * sqrt(2), 5 * sqrt(2)), V3(0, 0))], [])
	assert.doTest(face, brep.flipped(), [
		StraightEdge.throughPoints(V3(5 * sqrt(2), 5 * sqrt(2)), V3(0, 0)), StraightEdge.throughPoints(V3(0, 0), V3(-5 * sqrt(2), 5 * sqrt(2)))], [])
	assert.doTest(face, brep.rotateZ(PI), [], [])
	assert.doTest(face, brep.rotateZ(PI).flipped(), [], [])
});
QUnit.test( "V-shape with spine parallel to test face normal; touching test face edge; splitting test face edge", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-20, 0), V3(20, 0), V3(20, 10), V3(-20, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/4),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/4)
	]).rotateY(PI/2).translate(0, 0, 2)

	assert.doTest(face, brep.rotateZ(-PI/2), [
		StraightEdge.throughPoints(V3(5 * sqrt(2), 5 * sqrt(2)), V3(0, 0))], [V3(0, 0)])
	assert.doTest(face, brep.rotateZ(-PI/2).flipped(), [
		StraightEdge.throughPoints(V3(0, 0), V3(5 * sqrt(2), 5 * sqrt(2)))], [V3(0, 0)])
});
QUnit.test( "V-shape with spine parallel to test face normal; one wing of V overlaps edge of test face", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, -10), V3(10, -10), V3(10, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/4),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)])
	]).rotateY(PI/2).translate(10, 5, 2)

	assert.doTest(face, brep, [
		StraightEdge.throughPoints(V3(5, 10), V3(10, 5))], [V3(10, 5), V3(5, 10), V3(10, 10)])
	assert.doTest(face, brep.flipped(), [
		StraightEdge.throughPoints(V3(10, 5), V3(5, 10))], [V3(10, 5), V3(5, 10)])
});
QUnit.test( "testing V-shape with spine touching test face, overlapping edge of test face", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, -10), V3(2, -10), V3(2, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/2)
	])

	assert.doTest(face, brep.rotateX(PI/4), [], [])
	assert.doTest(face, brep.rotateX(PI/4).flipped(), [], [])
	assert.doTest(face, brep.rotateX(-PI/4), [StraightEdge.throughPoints(V3(0, 0), V3(2, 0))], [V3(2, 0)])
	assert.doTest(face, brep.rotateX(-PI/4).flipped(), [StraightEdge.throughPoints(V3(2, 0), V3(0, 0))], [V3(2, 0)])
	assert.doTest(face, brep.rotateX(-PI/4 * 3), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3).flipped(), [StraightEdge.throughPoints(V3(2, 0), V3(0, 0)), StraightEdge.throughPoints(V3(0, 0), V3(2, 0))], [])
});
QUnit.test( "testing V-shape with spine touching test face, touching edge of test face", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, -10), V3(5, -10), V3(5, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/2)
	])

	assert.doTest(face, brep.rotateX(PI/4), [], [])
	assert.doTest(face, brep.rotateX(PI/4).flipped(), [], [])
	assert.doTest(face, brep.rotateX(-PI/4), [StraightEdge.throughPoints(V3(0, 0), V3(5, 0))], [V3(5, 0)])
	assert.doTest(face, brep.rotateX(-PI/4).flipped(), [StraightEdge.throughPoints(V3(5, 0), V3(0, 0))], [V3(5, 0)])
	assert.doTest(face, brep.rotateX(-PI/4 * 3), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3).flipped(), [StraightEdge.throughPoints(V3(5, 0), V3(0, 0)), StraightEdge.throughPoints(V3(0, 0), V3(5, 0))], [])
});
QUnit.test( "testing V-shape with spine touching test face edge middle", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, 0), V3(10, 0), V3(10, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/2)
	])

	assert.doTest(face, brep.rotateX(PI/4), [], [])
	assert.doTest(face, brep.rotateX(PI/4).flipped(), [], [V3(0, 0), V3(5, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(5, 0)), StraightEdge.throughPoints(V3(0, 0), V3(5, 0))
	assert.doTest(face, brep.rotateX(-PI/4), [], [V3(0, 0), V3(5, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(5, 0)), StraightEdge.throughPoints(V3(0, 0), V3(5, 0))
	assert.doTest(face, brep.rotateX(-PI/4).flipped(), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3).flipped(), [], [V3(0, 0), V3(5, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(5, 0)), StraightEdge.throughPoints(V3(0, 0), V3(5, 0))
});
QUnit.test( "testing V-shape with spine overlapping test face edge", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(-10, 0), V3(3, 0), V3(3, 10), V3(-10, 10)])
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/2)
	])

	assert.doTest(face, brep.rotateX(PI/4), [], [])
	assert.doTest(face, brep.rotateX(PI/4).flipped(), [], [V3(0, 0), V3(3, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(3, 0)), StraightEdge.throughPoints(V3(0, 0), V3(3, 0))
	assert.doTest(face, brep.rotateX(-PI/4), [], [V3(0, 0), V3(3, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(3, 0)), StraightEdge.throughPoints(V3(0, 0), V3(3, 0))
	assert.doTest(face, brep.rotateX(-PI/4).flipped(), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3), [], [])
	assert.doTest(face, brep.rotateX(-PI/4 * 3).flipped(), [], [V3(0, 0), V3(3, 0)]) // StraightEdge.throughPoints(V3(0, 0), V3(3, 0)), StraightEdge.throughPoints(V3(0, 0), V3(3, 0))
});
QUnit.test( "V-shape with spine parallel to test face normal; touching test face corner", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	// splitting contour in base position:
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/8),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/8)
	]).rotateY(PI/2).translate(0, 0, 2)

	assert.doTest(face, brep, [
		StraightEdge.throughPoints(V3(0, 0), V3.polar(10, PI/2-PI/8))], [V3(0, 0)])
});
QUnit.test( "V-shape with spine parallel to test face normal; touching test face corner", function( assert ) {
	var face = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	// splitting contour in base position:
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped().rotateX(-PI/8),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/8)
	]).rotateY(PI/2).translate(0, 0, 2)

	assert.doTest(face, brep, [
		StraightEdge.throughPoints(V3(0, 0), V3.polar(10, PI/2-PI/8))], [V3(0, 0)])
});
QUnit.test( " ABC V-shape with spine parallel to test face normal; touching test face corner", function( assert ) {
	var box = B2.box(8, 9, 10, "box")
	var face = box.faces[1], testBrep
	// splitting contour in base position:

	testBrep = B2.tetrahedron(V3(-1, 1, 9), V3(5, 1, 9), V3(-1, -4, 14), V3(2, -4, 10))
	assert.doTestWithBrep(face, box, testBrep, [], [],
		"face of tetra touches edge of test face, tetra intersects test volume (test face not part of result, points dont really matter)")

	testBrep = B2.tetrahedron(V3(-1, 1, 9), V3(4, 1, 9), V3(-1, -4, 14), V3(-1, -4, 10)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [StraightEdge.throughPoints(V3(0, 0, 10), V3(3, 0 , 10))], [V3(3, 0, 10), V3(0, 0, 10)],
		"face of _flipped_ tetra touches edge of testface and also intersects main volume (expect point on edge)")

	testBrep = B2.tetrahedron(V3(-1, 0, 10), V3(5, 0, 10), V3(2, 0, 14), V3(2, -4, 10))
	assert.doTestWithBrep(face, box, testBrep, [], [],
		"volumes touch edge-edge but no overlap (empty result volume; generated points dont matter)")

	testBrep = B2.tetrahedron(V3(-1, 0, 10), V3(5, 0, 10), V3(-1, -2, 8), V3(-1, 2, 8)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [], [V3(5, 0, 10), V3(0, 0, 10)],
		"Tetrahedron is flipped, testface only touched at edge, needs point on edge as tetrahedron intersects side of volume")


	testBrep = B2.tetrahedron(V3(-1, 0, 10), V3(5, 0, 10), V3(-1, 0, 14), V3(-1, -4, 9)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [], [],
		"volumes do not intersect, tetra is flipped, touches box edge-edge (result would be entire box, so no points)")
});
QUnit.test( " coplanar things", function( assert ) {
	var box = B2.box(8, 9, 10, "box")
	var face = box.faces[1], testBrep
	// splitting contour in base position:

	testBrep = B2.tetrahedron(V3(-1, -1, 10), V3(-1, 5, 10), V3(5, -1, 10), V3(-1, -1, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [StraightEdge.throughPoints(V3(0, 4, 10), V3(4, 0, 10))], [V3(0, 4, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(-1, -1, 10), V3(-1, 5, 10), V3(4, 0, 10), V3(-1, -1, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [StraightEdge.throughPoints(V3(0, 4, 10), V3(4, 0, 10))], [V3(0, 4, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(1, 0, 10), V3(1, 5, 10), V3(4, 0, 10), V3(-1, -1, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep,
		[StraightEdge.throughPoints(V3(1, 0, 10), V3(1, 5, 10)), StraightEdge.throughPoints(V3(1, 5, 10), V3(4, 0, 10))],
		[V3(1, 0, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(0, 0, 10), V3(0, 5, 10), V3(5, 0, 10), V3(0, 0, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep,
		[StraightEdge.throughPoints(V3(0, 5, 10), V3(5, 0, 10))],
		[V3(0, 5, 10), V3(5, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(0, 0, 10), V3(-1, 5, 10), V3(5, -1, 10), V3(-1, -1, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep, [StraightEdge.throughPoints(V3(0, 4, 10), V3(4, 0, 10))], [V3(0, 4, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(0, 0, 10), V3(1, 5, 10), V3(5, 1, 10), V3(0, 0, 5)).flipped()
	assert.doTestWithBrep(face, box, testBrep,
		[StraightEdge.throughPoints(V3(0, 0, 10), V3(1, 5, 10)), StraightEdge.throughPoints(V3(1, 5, 10), V3(5, 1, 10)), StraightEdge.throughPoints(V3(5, 1, 10), V3(0, 0, 10))],
		[],
		"cut hole at corner of test face")

});
QUnit.test( " coplanar things 2", function( assert ) {
	var box = B2.box(8, 9, 10, "box")
	var face = box.faces[1], testBrep
	// splitting contour in base position:

	testBrep = B2.tetrahedron(V3(-1, -1, 10), V3(-1, 5, 10), V3(5, -1, 10), V3(-1, -1, 5))
	assert.doTestWithBrep(face, box, testBrep, [StraightEdge.throughPoints(V3(0, 4, 10), V3(4, 0, 10))], [V3(0, 4, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

	testBrep = B2.tetrahedron(V3(-1, -1, 10), V3(-1, 5, 10), V3(5, -1, 10), V3(-1, -1, 5)).flipped()
	assert.doTestWithBrep(face, box.flipped(), testBrep, [StraightEdge.throughPoints(V3(0, 4, 10), V3(4, 0, 10))], [V3(0, 4, 10), V3(4, 0, 10)],
		"cut off corner of box with flipped tetra (anti)coplanar to test face")

});




QUnit.test( "test assembly", function( assert ) {
	var baseFace = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])

	var extrude = B2.extrudeVertices([V3(5, -1), V3(2, 2), V3(8, 2)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(4, 0), V3(2, 2), V3(8, 2), V3(6, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	assert.doTest2(baseFace, extrude, [result], "volume cuts edge of test face (twice)")

	var extrude2 = B2.extrudeVertices([V3(5, 0), V3(2, 3), V3(8, 3)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result2 = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)], [V3(5, 0), V3(2, 3), V3(8, 3)])
	assert.doTest2(baseFace, extrude2, [result2], "volume touches inside of test face edge")


	// from test case 3:4
	// V-shape spine touching middle, splits volume enclosing in both directions
	var brep = new B2([
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).flipped(),
		B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 0), V3(5, 10), V3(0, 10)]).rotateX(PI/4)
	]).rotateX(-PI/2).flipped().translate(0, 2, 0)
	// degenerate cycle in middle of face
	var result4 = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)], [V3(5, 2), V3(0, 2)])


	var extrude5 = B2.extrudeVertices([V3(0, 0), V3(3, 2), V3(2, 3)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result5 = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(2, 3), V3(3, 2), V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])
	assert.doTest2(baseFace, extrude5, [result5], "volume touches inside of test face corner")

	var extrude6 = B2.extrudeVertices([V3(1, 0), V3(3, 0), V3(8, 10)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result6 = [B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(1, 0), V3(8, 10), V3(3, 0), V3(10, 0), V3(10, 10), V3(0, 10)])]
	assert.doTest2(baseFace, extrude6, result6, "volume touches inside of test face corner")

	var extrude7 = B2.extrudeVertices([V3(1, 0), V3(3, 0), V3(8, 10), V3(7, 10)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result7 = [B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(1, 0), V3(7, 10), V3(0, 10)]), B2.PlaneFace.forVertices(P3.XY, [V3(10, 10), V3(8, 10), V3(3, 0), V3(10, 0)])]
	assert.doTest2(baseFace, extrude7, result7, "volume touches inside of test face corner")


});

QUnit.test( "test assembly holes", function( assert ) {
	var baseFace = B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])

	var extrude7 = B2.extrudeVertices([V3(0, 0), V3(5, 8), V3(8, 5)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result7 = [B2.PlaneFace.forVertices(P3.XY, [V3(0, 0), V3(5, 8), V3(8, 5), V3(0, 0), V3(10, 0), V3(10, 10), V3(0, 10)])]
	assert.doTest2(baseFace, extrude7, result7, "volume touches inside of test face corner")

	var extrude8 = B2.extrudeVertices([V3(1, 1), V3(1, -1), V3(-1, 1)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result8 = [B2.PlaneFace.forVertices(P3.XY, [V3(1, 0), V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 1), V3(1, 1)])]
	assert.doTest2(baseFace, extrude8, result8, "volume touches inside of test face corner")

	var extrude9 = B2.extrudeVertices([V3(-1, -1), V3(1, 1), V3(1, -1)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result9 = [B2.PlaneFace.forVertices(P3.XY, [V3(1, 0), V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0), V3(1, 1)])]
	assert.doTest2(baseFace, extrude9, result9, "volume touches inside of test face corner")

	var extrude10 = B2.extrudeVertices([V3(1, 1), V3(2, 2), V3(2, 1)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result10 = [B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(2, 2), V3(2, 1)])]
	assert.doTest2(baseFace, extrude10, result10, "adding a hole")

	var baseFace11 = B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(2, 2), V3(2, 1)])
	var extrude11 = B2.extrudeVertices([V3(5, 5), V3(6, 6), V3(6, 5)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result11 = [B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(2, 2), V3(2, 1)], [V3(5, 5), V3(6, 6), V3(6, 5)])]
	assert.doTest2(baseFace11, extrude11, result11, "adding a hole to a face which already has one")


	let baseFace12 = B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(5, 5), V3(5, 1)])
	var extrude12 = B2.extrudeVertices([V3(2, 1.5), V3(2, 4), V3(4.5, 4)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result12 = [B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(5, 5), V3(5, 1), V3(1, 1), V3(2, 2), V3(2, 4), V3(4, 4)])]
	assert.doTest2(baseFace12, extrude12, result12, "extending an existing hole")

	var baseFace13 = B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(5, 5), V3(5, 1)])
	var extrude13 = B2.extrudeVertices([V3(3, -1), V3(4, -1), V3(4, 2), V3(3, 2)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result13 = [B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0), V3(3, 0), V3(3, 1), V3(1, 1), V3(5, 5), V3(5, 1), V3(4, 1), V3(4, 0)])]
	assert.doTest2(baseFace13, extrude13, result13, "removing a hole by cutting a channel")

	var baseFace14 = B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(1, 1), V3(5, 5), V3(5, 1)])
	var extrude14 = B2.extrudeVertices([V3(1, 1), V3(1, 5), V3(5, 5)], P3.XY.flipped(), V3(0, 0, 10)).translate(0, 0, -2).flipped()
	var result14 = [B2.PlaneFace.forVertices(P3.XY, [V3(10, 0), V3(10, 10), V3(0, 10), V3(0, 0)], [V3(5, 5), V3(5, 1), V3(1, 1), V3(1, 5)])]
	assert.doTest2(baseFace14, extrude14, result14, "extending an existing hole")
});
/*
 */