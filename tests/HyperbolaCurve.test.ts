import { suite, test, testCurve, testCurveTransform, testISTs } from './manager'

import { DEG, M4, V } from 'ts3dutils'
import { HyperbolaCurve, intersectionUnitHyperbolaLine, P3 } from '..'

import { sqrt } from '../src/math'

suite('HyperbolaCurve', () => {
	test('testCurve', assert => {
		testCurve(assert, HyperbolaCurve.XY)
	})
	test('testCurve 2', assert => {
		const hbSheared = HyperbolaCurve.XY.shearX(2, 3)
		assert.notOk(hbSheared.isOrthogonal())
		const hbShearedRA = hbSheared.rightAngled()
		assert.ok(hbShearedRA.isOrthogonal(), 'hbShearedRA.isOrthogonal()')
		assert.ok(hbSheared.isColinearTo(hbShearedRA))
		testCurve(assert, hbShearedRA)

		assert.deepEqual(intersectionUnitHyperbolaLine(1, 0, 2), { x1: 2, y1: sqrt(3), x2: 2, y2: -sqrt(3) })
	})
	test('isTsWithPlane', assert => {
		testISTs(assert, HyperbolaCurve.XY, P3.YZ, 0)
		testISTs(assert, HyperbolaCurve.XY, P3.YZ.translate(1), 1)
		testISTs(assert, HyperbolaCurve.XY, P3.YZ.translate(2), 2)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 2).unit(), 2), 1)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 2).unit(), 2).flipped(), 1)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, -2).unit(), 2), 1)

		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 1).unit(), 2), 1)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 1).unit(), 2).flipped(), 1)

		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, 1).unit(), 2), 2)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, 1).unit(), 2).flipped(), 2)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, 1).unit(), 0.85), 2)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, 1).unit(), 0.5), 0)
	})
	test('isTsWithPlane no IS with planes X < 0', assert => {
		testISTs(assert, HyperbolaCurve.XY, P3.YZ, 0)
		testISTs(assert, HyperbolaCurve.XY, P3.YZ.translate(-2), 0)

		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 2).unit(), -2).flipped(), 1)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, -2).unit(), -2), 1)

		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 1).unit(), -2), 0)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(1, 1).unit(), 0), 0)

		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, 1).unit(), -2), 0)
		testISTs(assert, HyperbolaCurve.XY, new P3(V(2, -1).unit(), -2), 0)
	})

	test('transform4', assert => {
		const c = HyperbolaCurve.XY.withBounds(-1, 1).translate(1, -4, 0)
		const m = M4.product(M4.rotateX(90 * DEG), M4.perspective(45, 1, 2, 5), M4.rotateX(-90 * DEG))
		testCurveTransform(assert, c, m)
	})
})
