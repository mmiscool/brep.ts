import { DEG, M4, TAU, V, V3 } from 'ts3dutils'
import {
	B2T,
	BRep,
	ConicSurface,
	Edge,
	L3,
	P3,
	PCurveEdge,
	PlaneFace,
	PlaneSurface,
	RotatedCurveSurface,
	RotationFace,
	SemiCylinderSurface,
	SemiEllipseCurve,
	StraightEdge,
} from '..'
import { b2equals, bRepEqual, outputLink, suite, test, testBRepOp } from './manager'

// prettier-ignore
suite('BRep generators', () => {
    test('rotStep w/ straight edges', assert => {
        const actual = B2T.rotStep(StraightEdge.chain([V(2, 0, 2), V(4, 0, 2), V(4, 0, 4)]), TAU, 5)
        const expected = new BRep([
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), -2), V3.Y, V3.X), [
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 2), V(0.5877852522924731, 0.8090169943749473, 0)), V(4, 0, 2), V(1.236067977499789, -3.8042260651806146, 2), 4.702282018339786, 0),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 2), V(0.9510565162951536, -0.3090169943749476, 0)), V(1.236067977499789, -3.8042260651806146, 2), V(-3.23606797749979, -2.351141009169892, 2), 4.702282018339784, 0),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 2), V(-9.444121133484361e-17, -1, 0)), V(-3.23606797749979, -2.351141009169892, 2), V(-3.2360679774997894, 2.351141009169893, 2), 4.702282018339785, 0),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 2), V(-0.9510565162951536, -0.3090169943749473, 0)), V(-3.2360679774997894, 2.351141009169893, 2), V(1.2360679774997898, 3.804226065180614, 2), 4.702282018339785, 0),
                new StraightEdge(new L3(V(4, 0, 2), V(-0.5877852522924731, 0.8090169943749473, 0)), V(1.2360679774997898, 3.804226065180614, 2), V(4, 0, 2), 4.702282018339785, 0)], [[
                new StraightEdge(new L3(V(2, 0, 2), V(-0.5877852522924731, 0.8090169943749473, 0)), V(2, 0, 2), V(0.6180339887498949, 1.902113032590307, 2), 0, 2.3511410091698925),
                new StraightEdge(new L3(V(0.6180339887498949, 1.902113032590307, 2), V(-0.9510565162951536, -0.3090169943749473, 0)), V(0.6180339887498949, 1.902113032590307, 2), V(-1.6180339887498947, 1.1755705045849465, 2), 0, 2.3511410091698925),
                new StraightEdge(new L3(V(-1.6180339887498947, 1.1755705045849465, 2), V(-9.444121133484361e-17, -1, 0)), V(-1.6180339887498947, 1.1755705045849465, 2), V(-1.618033988749895, -1.175570504584946, 2), 0, 2.3511410091698925),
                new StraightEdge(new L3(V(-1.618033988749895, -1.175570504584946, 2), V(0.9510565162951536, -0.3090169943749476, 0)), V(-1.618033988749895, -1.175570504584946, 2), V(0.6180339887498945, -1.9021130325903073, 2), 0, 2.351141009169892),
                new StraightEdge(new L3(V(0.6180339887498945, -1.9021130325903073, 2), V(0.5877852522924731, 0.8090169943749473, 0)), V(0.6180339887498945, -1.9021130325903073, 2), V(2, 0, 2), 0, 2.351141009169893)]]),
            new PlaneFace(new PlaneSurface(new P3(V(0.8090169943749473, 0.5877852522924731, 0), 3.2360679774997894), V(-0.5877852522924731, 0.8090169943749473, 0), V3.Z), [
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 4), V(4, 0, 2), 2, 0),
                new StraightEdge(new L3(V(4, 0, 2), V(-0.5877852522924731, 0.8090169943749473, 0)), V(4, 0, 2), V(1.2360679774997898, 3.804226065180614, 2), 0, 4.702282018339785),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 2), V3.Z), V(1.2360679774997898, 3.804226065180614, 2), V(1.2360679774997898, 3.804226065180614, 4), 0, 2),
                new StraightEdge(new L3(V(4, 0, 4), V(-0.5877852522924731, 0.8090169943749473, 0)), V(1.2360679774997898, 3.804226065180614, 4), V(4, 0, 4), 4.702282018339785, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.3090169943749473, 0.9510565162951536, 0), 3.23606797749979), V(-0.9510565162951536, -0.3090169943749473, 0), V3.Z), [
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 2), V3.Z), V(1.2360679774997898, 3.804226065180614, 4), V(1.2360679774997898, 3.804226065180614, 2), 2, 0),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 2), V(-0.9510565162951536, -0.3090169943749473, 0)), V(1.2360679774997898, 3.804226065180614, 2), V(-3.2360679774997894, 2.351141009169893, 2), 0, 4.702282018339785),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 2), V3.Z), V(-3.2360679774997894, 2.351141009169893, 2), V(-3.2360679774997894, 2.351141009169893, 4), 0, 2),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 4), V(-0.9510565162951536, -0.3090169943749473, 0)), V(-3.2360679774997894, 2.351141009169893, 4), V(1.2360679774997898, 3.804226065180614, 4), 4.702282018339785, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-1, 9.444121133484361e-17, 0), 3.23606797749979), V(-9.444121133484361e-17, -1, 0), V3.Z), [
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 2), V3.Z), V(-3.2360679774997894, 2.351141009169893, 4), V(-3.2360679774997894, 2.351141009169893, 2), 2, 0),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 2), V(-9.444121133484361e-17, -1, 0)), V(-3.2360679774997894, 2.351141009169893, 2), V(-3.23606797749979, -2.351141009169892, 2), 0, 4.702282018339785),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 2), V3.Z), V(-3.23606797749979, -2.351141009169892, 2), V(-3.23606797749979, -2.351141009169892, 4), 0, 2),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 4), V(-9.444121133484361e-17, -1, 0)), V(-3.23606797749979, -2.351141009169892, 4), V(-3.2360679774997894, 2.351141009169893, 4), 4.702282018339785, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.3090169943749476, -0.9510565162951536, 0), 3.23606797749979), V(0.9510565162951536, -0.3090169943749476, 0), V3.Z), [
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 2), V3.Z), V(-3.23606797749979, -2.351141009169892, 4), V(-3.23606797749979, -2.351141009169892, 2), 2, 0),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 2), V(0.9510565162951536, -0.3090169943749476, 0)), V(-3.23606797749979, -2.351141009169892, 2), V(1.236067977499789, -3.8042260651806146, 2), 0, 4.702282018339784),
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 2), V3.Z), V(1.236067977499789, -3.8042260651806146, 2), V(1.236067977499789, -3.8042260651806146, 4), 0, 2),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 4), V(0.9510565162951536, -0.3090169943749476, 0)), V(1.236067977499789, -3.8042260651806146, 4), V(-3.23606797749979, -2.351141009169892, 4), 4.702282018339784, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0.8090169943749473, -0.5877852522924731, 0), 3.236067977499789), V(0.5877852522924731, 0.8090169943749473, 0), V3.Z), [
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 2), V3.Z), V(1.236067977499789, -3.8042260651806146, 4), V(1.236067977499789, -3.8042260651806146, 2), 2, 0),
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 2), V(0.5877852522924731, 0.8090169943749473, 0)), V(1.236067977499789, -3.8042260651806146, 2), V(4, 0, 2), 0, 4.702282018339786),
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 2), V(4, 0, 4), 0, 2),
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 4), V(0.5877852522924731, 0.8090169943749473, 0)), V(4, 0, 4), V(1.236067977499789, -3.8042260651806146, 4), 4.702282018339786, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.6289601696450942, -0.45696631166862733, 0.6289601696450942), 0), V(0.587785252292473, -0.8090169943749473, 0), V(0.508839466027831, 0.3696935119967583, 0.777437524821136)), [
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(2, 0, 2), V(4, 0, 4), 2.8284271247461903, 0),
                new StraightEdge(new L3(V(4, 0, 4), V(-0.5877852522924731, 0.8090169943749473, 0)), V(4, 0, 4), V(1.2360679774997898, 3.804226065180614, 4), 0, 4.702282018339785),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 4), V(-0.21850801222441055, -0.6724985119639573, -0.7071067811865475)), V(1.2360679774997898, 3.804226065180614, 4), V(0.6180339887498949, 1.902113032590307, 2), 0, 2.8284271247461903),
                new StraightEdge(new L3(V(2, 0, 2), V(-0.5877852522924731, 0.8090169943749473, 0)), V(0.6180339887498949, 1.902113032590307, 2), V(2, 0, 2), 2.3511410091698925, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0.24024140723452594, -0.7393870239935166, 0.628960169645094), 0), V(0.9510565162951535, 0.3090169943749473, 0), V(-0.19435938120528395, 0.598176667831072, 0.777437524821136)), [
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 4), V(-0.21850801222441055, -0.6724985119639573, -0.7071067811865475)), V(0.6180339887498949, 1.902113032590307, 2), V(1.2360679774997898, 3.804226065180614, 4), 2.8284271247461903, 0),
                new StraightEdge(new L3(V(1.2360679774997898, 3.804226065180614, 4), V(-0.9510565162951536, -0.3090169943749473, 0)), V(1.2360679774997898, 3.804226065180614, 4), V(-3.2360679774997894, 2.351141009169893, 4), 0, 4.702282018339785),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 4), V(0.5720614028176843, -0.4156269377774536, -0.7071067811865476)), V(-3.2360679774997894, 2.351141009169893, 4), V(-1.6180339887498947, 1.1755705045849465, 2), 0, 2.82842712474619),
                new StraightEdge(new L3(V(0.6180339887498949, 1.902113032590307, 2), V(-0.9510565162951536, -0.3090169943749473, 0)), V(-1.6180339887498947, 1.1755705045849465, 2), V(0.6180339887498949, 1.902113032590307, 2), 2.3511410091698925, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0.777437524821136, -7.342214158127064e-17, 0.628960169645094), 0), V(9.444121133484362e-17, 1, 0), V(-0.628960169645094, 5.939976030265142e-17, 0.777437524821136)), [
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 4), V(0.5720614028176843, -0.4156269377774536, -0.7071067811865476)), V(-1.6180339887498947, 1.1755705045849465, 2), V(-3.2360679774997894, 2.351141009169893, 4), 2.82842712474619, 0),
                new StraightEdge(new L3(V(-3.2360679774997894, 2.351141009169893, 4), V(-9.444121133484361e-17, -1, 0)), V(-3.2360679774997894, 2.351141009169893, 4), V(-3.23606797749979, -2.351141009169892, 4), 0, 4.702282018339785),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 4), V(0.5720614028176843, 0.4156269377774533, -0.7071067811865475)), V(-3.23606797749979, -2.351141009169892, 4), V(-1.618033988749895, -1.175570504584946, 2), 0, 2.8284271247461903),
                new StraightEdge(new L3(V(-1.6180339887498947, 1.1755705045849465, 2), V(-9.444121133484361e-17, -1, 0)), V(-1.618033988749895, -1.175570504584946, 2), V(-1.6180339887498947, 1.1755705045849465, 2), 2.3511410091698925, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0.2402414072345262, 0.7393870239935165, 0.628960169645094), 0), V(-0.9510565162951535, 0.3090169943749477, 0), V(-0.19435938120528418, -0.598176667831072, 0.777437524821136)), [
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 4), V(0.5720614028176843, 0.4156269377774533, -0.7071067811865475)), V(-1.618033988749895, -1.175570504584946, 2), V(-3.23606797749979, -2.351141009169892, 4), 2.8284271247461903, 0),
                new StraightEdge(new L3(V(-3.23606797749979, -2.351141009169892, 4), V(0.9510565162951536, -0.3090169943749476, 0)), V(-3.23606797749979, -2.351141009169892, 4), V(1.236067977499789, -3.8042260651806146, 4), 0, 4.702282018339784),
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 4), V(-0.21850801222441044, 0.6724985119639574, -0.7071067811865476)), V(1.236067977499789, -3.8042260651806146, 4), V(0.6180339887498945, -1.9021130325903073, 2), 0, 2.82842712474619),
                new StraightEdge(new L3(V(-1.618033988749895, -1.175570504584946, 2), V(0.9510565162951536, -0.3090169943749476, 0)), V(0.6180339887498945, -1.9021130325903073, 2), V(-1.618033988749895, -1.175570504584946, 2), 2.351141009169892, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.628960169645094, 0.45696631166862733, 0.628960169645094), 0), V(-0.5877852522924731, -0.8090169943749475, 0), V(0.508839466027831, -0.3696935119967583, 0.777437524821136)), [
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 4), V(-0.21850801222441044, 0.6724985119639574, -0.7071067811865476)), V(0.6180339887498945, -1.9021130325903073, 2), V(1.236067977499789, -3.8042260651806146, 4), 2.82842712474619, 0),
                new StraightEdge(new L3(V(1.236067977499789, -3.8042260651806146, 4), V(0.5877852522924731, 0.8090169943749473, 0)), V(1.236067977499789, -3.8042260651806146, 4), V(4, 0, 4), 0, 4.702282018339786),
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(4, 0, 4), V(2, 0, 2), 0, 2.8284271247461903),
                new StraightEdge(new L3(V(0.6180339887498945, -1.9021130325903073, 2), V(0.5877852522924731, 0.8090169943749473, 0)), V(2, 0, 2), V(0.6180339887498945, -1.9021130325903073, 2), 2.351141009169893, 0)], [])], false)
        bRepEqual(assert, actual, expected)
    })
    test('rotStep w/ circle', assert => {
        const actual = B2T.rotStep([
            Edge.forCurveAndTs(SemiEllipseCurve.semicircle(2, V(3, 0)).rotateX(90 * DEG)),
            StraightEdge.throughPoints(V(1, 0, 0), V(5, 0, 0))], [0.1, 1, 2])
        const expected = new BRep([
            new RotationFace(new SemiCylinderSurface(new SemiEllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(0.0499791692706789, -0.9987502603949664, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new SemiEllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(1, 1.4997597826618576e-32, 2.4492935982947064e-16), V(5, 0, 0), 3.141592653589793, 0, undefined, V(2.4492935982947064e-16, 1.2246467991473532e-16, 2), V(0, -1.2246467991473532e-16, -2), undefined),
                new StraightEdge(new L3(V(5, 0, 0), V(-0.0499791692706789, 0.9987502603949664, 0)), V(5, 0, 0), V(4.9750208263901285, 0.4991670832341408, 0), 0, 0.49979169270678325),
                new PCurveEdge(new SemiEllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(4.9750208263901285, 0.4991670832341408, 0), V(0.9950041652780257, 0.09983341664682815, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), V(-2.3147966581475544e-16, -1.4630500144349825e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V3.X, V(-0.0499791692706789, 0.9987502603949664, 0)), V(0.9950041652780257, 0.09983341664682815, 0), V3.X, 0.09995833854135665, 0)], []),
            new RotationFace(new SemiCylinderSurface(new SemiEllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(0.522687228930659, -0.8525245220595058, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new SemiEllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(0.9950041652780257, 0.09983341664682815, 2.4492935982947064e-16), V(4.9750208263901285, 0.4991670832341408, 0), 3.141592653589793, 0, undefined, V(2.3147966581475544e-16, 1.4630500144349825e-16, 2), V(1.222606741444822e-17, -1.2185286661460182e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(4.9750208263901285, 0.4991670832341408, 0), V(-0.522687228930659, 0.8525245220595058, 0)), V(4.9750208263901285, 0.4991670832341408, 0), V(2.701511529340699, 4.207354924039483, 0), 0, 4.349655341112302),
                new PCurveEdge(new SemiEllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(2.701511529340699, 4.207354924039483, 0), V(0.5403023058681398, 0.8414709848078965, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), V(-2.928542307863416e-17, -2.722688985694075e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(0.9950041652780257, 0.09983341664682815, 0), V(-0.5226872289306591, 0.8525245220595058, 0)), V(0.5403023058681398, 0.8414709848078965, 0), V(0.9950041652780257, 0.09983341664682815, 0), 0.8699310682224602, 0)], []),
            new RotationFace(new SemiCylinderSurface(new SemiEllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(0.9974949866040544, -0.07073720166770292, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new SemiEllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(0.5403023058681398, 0.8414709848078965, 2.4492935982947064e-16), V(2.701511529340699, 4.207354924039483, 0), 3.141592653589793, 0, undefined, V(2.928542307863416e-17, 2.722688985694075e-16, 2), V(1.0305047481203616e-16, -6.616794894533516e-17, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(2.701511529340699, 4.207354924039483, 0), V(-0.9974949866040544, 0.07073720166770292, 0)), V(2.701511529340699, 4.207354924039483, 0), V(-2.080734182735712, 4.546487134128409, 0), 0, 4.79425538604203),
                new PCurveEdge(new SemiEllipseCurve(V(-1.2484405096414273, 2.727892280477045, 0), V(-0.8322936730942848, 1.8185948536513634, 0), V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), 0, 3.141592653589793), V(-2.080734182735712, 4.546487134128409, 0), V(-0.4161468365471424, 0.9092974268256817, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), V(2.132833965940505e-16, -1.7175034751172367e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(0.5403023058681398, 0.8414709848078965, 0), V(-0.9974949866040544, 0.07073720166770292, 0)), V(-0.4161468365471424, 0.9092974268256817, 0), V(0.5403023058681398, 0.8414709848078965, 0), 0.958851077208406, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), 0), V3.Y, V3.X), [
                new StraightEdge(new L3(V3.X, V(-0.0499791692706789, 0.9987502603949664, 0)), V3.X, V(0.9950041652780257, 0.09983341664682815, 0), 0, 0.09995833854135665),
                new StraightEdge(new L3(V(0.9950041652780257, 0.09983341664682815, 0), V(-0.5226872289306591, 0.8525245220595058, 0)), V(0.9950041652780257, 0.09983341664682815, 0), V(0.5403023058681398, 0.8414709848078965, 0), 0, 0.8699310682224602),
                new StraightEdge(new L3(V(0.5403023058681398, 0.8414709848078965, 0), V(-0.9974949866040544, 0.07073720166770292, 0)), V(0.5403023058681398, 0.8414709848078965, 0), V(-0.4161468365471424, 0.9092974268256817, 0), 0, 0.958851077208406),
                new StraightEdge(new L3(V(-0.4161468365471424, 0.9092974268256817, 0), V(-0.4161468365471424, 0.9092974268256817, 0)), V(-0.4161468365471424, 0.9092974268256817, 0), V(-2.080734182735712, 4.546487134128409, 0), 0, 4),
                new StraightEdge(new L3(V(2.701511529340699, 4.207354924039483, 0), V(-0.9974949866040544, 0.07073720166770292, 0)), V(-2.080734182735712, 4.546487134128409, 0), V(2.701511529340699, 4.207354924039483, 0), 4.79425538604203, 0),
                new StraightEdge(new L3(V(4.9750208263901285, 0.4991670832341408, 0), V(-0.522687228930659, 0.8525245220595058, 0)), V(2.701511529340699, 4.207354924039483, 0), V(4.9750208263901285, 0.4991670832341408, 0), 4.349655341112302, 0),
                new StraightEdge(new L3(V(5, 0, 0), V(-0.0499791692706789, 0.9987502603949664, 0)), V(4.9750208263901285, 0.4991670832341408, 0), V(5, 0, 0), 0.49979169270678325, 0),
                new StraightEdge(new L3(V3.X, V3.X), V(5, 0, 0), V3.X, 4, 0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, -1, 0), 0), V3.X, V3.Z), [
                new PCurveEdge(new SemiEllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(5, 0, 0), V(1, 1.4997597826618576e-32, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(0, 1.2246467991473532e-16, 2), V(-2.4492935982947064e-16, -1.2246467991473532e-16, -2), undefined),
                new StraightEdge(new L3(V3.X, V3.X), V3.X, V(5, 0, 0), 0, 4)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.9092974268256817, -0.4161468365471424, 0), 0), V(0.4161468365471424, -0.9092974268256817, 0), V3.Z), [
                new StraightEdge(new L3(V(-0.4161468365471424, 0.9092974268256817, 0), V(-0.4161468365471424, 0.9092974268256817, 0)), V(-2.080734182735712, 4.546487134128409, 0), V(-0.4161468365471424, 0.9092974268256817, 0), 4, 0),
                new PCurveEdge(new SemiEllipseCurve(V(-1.2484405096414273, 2.727892280477045, 0), V(-0.8322936730942848, 1.8185948536513634, 0), V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), 0, 3.141592653589793), V(-0.4161468365471424, 0.9092974268256817, 2.4492935982947064e-16), V(-2.080734182735712, 4.546487134128409, 0), 3.141592653589793, 0, undefined, V(-2.132833965940505e-16, 1.7175034751172367e-16, 2), V(1.1135681832349957e-16, 5.0963289135275475e-17, -2), 'undefinedundefined')], [])], false)
        bRepEqual(assert, actual, expected)
    })
    test('rotateEdges w/ straight edges', assert => {
        const actual = B2T.rotateEdges(StraightEdge.chain([V(2, 0, 2), V(4, 0, 2), V(4, 0, 4)]), TAU)
        const expected = new BRep([
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), -2), V3.Y, V3.X), [
                new StraightEdge(new L3(V(2, 0, 2), V3.X), V(4, 0, 2), V(2, 0, 2), 2, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(2, 0, 0), V(0, 2, 0), 0, 3.141592653589793), V(2, 0, 2), V(-2, 2.4492935982947064e-16, 2), 0, 3.141592653589793, undefined, V(0, 2, 0), V(-2.4492935982947064e-16, -2, 0), 'rotateEdges0rib0'),
                new StraightEdge(new L3(V(-2, 2.4492935982947064e-16, 2), V(-1, 1.2246467991473532e-16, 0)), V(-2, 2.4492935982947064e-16, 2), V(-4, 4.898587196589413e-16, 2), 0, 2),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 2), V(4, 0, 2), 3.141592653589793, 0, undefined, V(4.898587196589413e-16, 4, 0), V(0, -4, 0), 'rotateEdges0rib1')], []),
            new RotationFace(new SemiCylinderSurface(new SemiEllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V3.Z, 0, 3.141592653589793, 0, 2), [
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 4), V(4, 0, 2), 2, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(4, 0, 2), V(-4, 4.898587196589413e-16, 2), 0, 3.141592653589793, undefined, V(0, 4, 0), V(-4.898587196589413e-16, -4, 0), 'rotateEdges0rib1'),
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 2), V3.Z), V(-4, 4.898587196589413e-16, 2), V(-4, 4.898587196589413e-16, 4), 0, 2),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 4), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 4), V(4, 0, 4), 3.141592653589793, 0, undefined, V(4.898587196589413e-16, 4, 0), V(0, -4, 0), 'rotateEdges0rib2')], []),
            new RotationFace(new ConicSurface(V3.O, V(-4, 0, 0), V(0, 4, 0), V(0, 0, 4)), [
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(2, 0, 2), V(4, 0, 4), 2.8284271247461903, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 4), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(4, 0, 4), V(-4, 4.898587196589413e-16, 4), 0, 3.141592653589793, undefined, V(0, 4, 0), V(-4.898587196589413e-16, -4, 0), 'rotateEdges0rib2'),
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 4), V(0.7071067811865475, -8.659560562354932e-17, -0.7071067811865475)), V(-4, 4.898587196589413e-16, 4), V(-2, 2.4492935982947064e-16, 2), 0, 2.8284271247461903),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(2, 0, 0), V(0, 2, 0), 0, 3.141592653589793), V(-2, 2.4492935982947064e-16, 2), V(2, 0, 2), 3.141592653589793, 0, undefined, V(2.4492935982947064e-16, 2, 0), V(0, -2, 0), 'rotateEdges0rib0')], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), -2), V3.Y, V3.X), [
                new StraightEdge(new L3(V(-2, 2.4492935982947064e-16, 2), V(-1, 1.2246467991473532e-16, 0)), V(-4, 4.898587196589413e-16, 2), V(-2, 2.4492935982947064e-16, 2), 2, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(-2, 2.4492935982947064e-16, 0), V(-2.4492935982947064e-16, -2, 0), 0, 3.141592653589793), V(-2, 2.4492935982947064e-16, 2), V(2, 0, 2), 0, 3.141592653589793, undefined, V(-2.4492935982947064e-16, -2, 0), V(4.898587196589413e-16, 2, 0), 'rotateEdges0rib0'),
                new StraightEdge(new L3(V(2, 0, 2), V3.X), V(2, 0, 2), V(4, 0, 2), 0, 2),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(4, 0, 2), V(-4, 4.898587196589413e-16, 2), 3.141592653589793, 0, undefined, V(-9.797174393178826e-16, -4, 0), V(4.898587196589413e-16, 4, 0), 'rotateEdges0rib1')], []),
            new RotationFace(new SemiCylinderSurface(new SemiEllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V3.Z, 0, 3.141592653589793, 0, 2), [
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 2), V3.Z), V(-4, 4.898587196589413e-16, 4), V(-4, 4.898587196589413e-16, 2), 2, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 2), V(4, 0, 2), 0, 3.141592653589793, undefined, V(-4.898587196589413e-16, -4, 0), V(9.797174393178826e-16, 4, 0), 'rotateEdges0rib1'),
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 2), V(4, 0, 4), 0, 2),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 4), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(4, 0, 4), V(-4, 4.898587196589413e-16, 4), 3.141592653589793, 0, undefined, V(-9.797174393178826e-16, -4, 0), V(4.898587196589413e-16, 4, 0), 'rotateEdges0rib2')], []),
            new RotationFace(new ConicSurface(V3.O, V(4, -4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), V(0, 0, 4)), [
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 4), V(0.7071067811865475, -8.659560562354932e-17, -0.7071067811865475)), V(-2, 2.4492935982947064e-16, 2), V(-4, 4.898587196589413e-16, 4), 2.8284271247461903, 0),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 4), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 4), V(4, 0, 4), 0, 3.141592653589793, undefined, V(-4.898587196589413e-16, -4, 0), V(9.797174393178826e-16, 4, 0), 'rotateEdges0rib2'),
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(4, 0, 4), V(2, 0, 2), 0, 2.8284271247461903),
                new PCurveEdge(new SemiEllipseCurve(V(0, 0, 2), V(-2, 2.4492935982947064e-16, 0), V(-2.4492935982947064e-16, -2, 0), 0, 3.141592653589793), V(2, 0, 2), V(-2, 2.4492935982947064e-16, 2), 3.141592653589793, 0, undefined, V(-4.898587196589413e-16, -2, 0), V(2.4492935982947064e-16, 2, 0), 'rotateEdges0rib0')], [])], false)
        bRepEqual(assert, actual, expected)
    })

    test('pyramidEdges', assert => {
        const actual = B2T.pyramidEdges([
            Edge.forCurveAndTs(SemiEllipseCurve.semicircle(2, V(3, 0))),
            StraightEdge.throughPoints(V(1, 0, 0), V(5, 0, 0))], V(0, 0, 4))
        const expected = new BRep([
            new RotationFace(new ConicSurface(V(0, 0, 4),V(-2, 0, 0),V(0, 2, 0),V(3, 0, -4)), [
                new StraightEdge(new L3(V(0, 0, 4),V(0.7808688094430304, 0, -0.6246950475544243)),V(0, 0, 4),V(5, 0, 0),0,6.4031242374328485),
                new PCurveEdge(new SemiEllipseCurve(V(3, 0, 0),V(2, 0, 0),V(0, 2, 0),0,3.141592653589793),V(5, 0, 0),V(1, 2.4492935982947064e-16, 0),0,3.141592653589793,undefined,V(0, 2, 0),V(-2.4492935982947064e-16, -2, 0),undefined),
                new StraightEdge(new L3(V(0, 0, 4),V(0.24253562503633297, 0, -0.9701425001453319)),V3.X,V(0, 0, 4),4.123105625617661,0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, -1, 0),0),V3.X,V3.Z), [
                new StraightEdge(new L3(V(0, 0, 4),V(0.24253562503633297, 0, -0.9701425001453319)),V(0, 0, 4),V3.X,0,4.123105625617661),
                new StraightEdge(new L3(V3.X,V3.X),V3.X,V(5, 0, 0),0,4),
                new StraightEdge(new L3(V(0, 0, 4),V(0.7808688094430304, 0, -0.6246950475544243)),V(5, 0, 0),V(0, 0, 4),6.4031242374328485,0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1),0),V3.Y,V3.X), [
                new StraightEdge(new L3(V3.X,V3.X),V(5, 0, 0),V3.X,4,0),
                new PCurveEdge(new SemiEllipseCurve(V(3, 0, 0),V(2, 0, 0),V(0, 2, 0),0,3.141592653589793),V(1, 2.4492935982947064e-16, 0),V(5, 0, 0),3.141592653589793,0,undefined,V(2.4492935982947064e-16, 2, 0),V(0, -2, 0),undefined)], [])], false)
        bRepEqual(assert, actual, expected)
    })

    test('torus', assert => {
        const actual = B2T.torus(1, 2)
        const expected = new BRep([
            new RotationFace(new RotatedCurveSurface(new SemiEllipseCurve(V(2, 0, 0), V3.X, V(0, 6.123233995736766e-17, 1), 0, 3.141592653589793), M4.IDENTITY, 0, 3.141592653589793), [
                new PCurveEdge(new SemiEllipseCurve(V(2, 0, 0),V3.X,V(0, 6.123233995736766e-17, 1),0,3.141592653589793),V(1, 7.498798913309288e-33, 1.2246467991473532e-16),V(3, 0, 0),3.141592653589793,0,undefined,V(1.2246467991473532e-16, 6.123233995736766e-17, 1),V(0, -6.123233995736766e-17, -1),'undefined.rotateX(1.5707963267948966)undefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(3, 0, 0),V(0, 3, 0),0,3.141592653589793),V(3, 0, 0),V(-3, 3.6739403974420594e-16, 0),0,3.141592653589793,undefined,V(0, 3, 0),V(-3.6739403974420594e-16, -3, 0),'torus0rib0undefined'),
                new PCurveEdge(new SemiEllipseCurve(V(-2, 2.4492935982947064e-16, 0),V(-1, 1.2246467991473532e-16, 0),V(-7.498798913309288e-33, -6.123233995736766e-17, 1),0,3.141592653589793),V(-3, 3.6739403974420594e-16, 0),V(-1, 1.2246467991473532e-16, 1.2246467991473532e-16),0,3.141592653589793,undefined,V(-7.498798913309288e-33, -6.123233995736766e-17, 1),V(1.2246467991473532e-16, 6.123233995736765e-17, -1),'undefined.rotateX(1.5707963267948966)undefinedundefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V3.X,V3.Y,0,3.141592653589793),V(-1, 1.2246467991473532e-16, 0),V3.X,3.141592653589793,0,undefined,V(1.2246467991473532e-16, 1, 0),V(0, -1, 0),'torus0rib1undefined')], []),
            new RotationFace(new RotatedCurveSurface(new SemiEllipseCurve(V(2, 0, 0), V(-1, 0, 0), V(0, -6.123233995736766e-17, -1), 0, 3.141592653589793), M4.IDENTITY, 0, 3.141592653589793), [
                new PCurveEdge(new SemiEllipseCurve(V(2, 0, 0),V(-1, 0, 0),V(0, -6.123233995736766e-17, -1),0,3.141592653589793),V(3, -7.498798913309288e-33, -1.2246467991473532e-16),V3.X,3.141592653589793,0,undefined,V(-1.2246467991473532e-16, -6.123233995736766e-17, -1),V(0, 6.123233995736766e-17, 1),'undefined.rotateX(1.5707963267948966)undefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V3.X,V3.Y,0,3.141592653589793),V3.X,V(-1, 1.2246467991473532e-16, 0),0,3.141592653589793,undefined,V3.Y,V(-1.2246467991473532e-16, -1, 0),'torus0rib1undefined'),
                new PCurveEdge(new SemiEllipseCurve(V(-2, 2.4492935982947064e-16, 0),V(1, -1.2246467991473532e-16, 0),V(7.498798913309288e-33, 6.123233995736766e-17, -1),0,3.141592653589793),V(-1, 1.2246467991473532e-16, 0),V(-3, 3.6739403974420594e-16, -1.2246467991473532e-16),0,3.141592653589793,undefined,V(7.498798913309288e-33, 6.123233995736766e-17, -1),V(-1.2246467991473532e-16, -6.123233995736765e-17, 1),'undefined.rotateX(1.5707963267948966)undefinedundefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(3, 0, 0),V(0, 3, 0),0,3.141592653589793),V(-3, 3.6739403974420594e-16, 0),V(3, 0, 0),3.141592653589793,0,undefined,V(3.6739403974420594e-16, 3, 0),V(0, -3, 0),'torus0rib0undefined')], []),
            new RotationFace(new RotatedCurveSurface(new SemiEllipseCurve(V(2, 0, 0), V3.X, V(0, 6.123233995736766e-17, 1), 0, 3.141592653589793), M4.forSys(V(-1, 1.2246467991473532e-16, 0), V(-1.2246467991473532e-16, -1, 0), V3.Z), 0, 3.141592653589793), [
                new PCurveEdge(new SemiEllipseCurve(V(-2, 2.4492935982947064e-16, 0),V(-1, 1.2246467991473532e-16, 0),V(-7.498798913309288e-33, -6.123233995736766e-17, 1),0,3.141592653589793),V(-1, 1.2246467991473532e-16, 1.2246467991473532e-16),V(-3, 3.6739403974420594e-16, 0),3.141592653589793,0,undefined,V(-1.2246467991473532e-16, -6.123233995736765e-17, 1),V(7.498798913309288e-33, 6.123233995736766e-17, -1),'undefined.rotateX(1.5707963267948966)undefinedundefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(-3, 3.6739403974420594e-16, 0),V(-3.6739403974420594e-16, -3, 0),0,3.141592653589793),V(-3, 3.6739403974420594e-16, 0),V(3, 0, 0),0,3.141592653589793,undefined,V(-3.6739403974420594e-16, -3, 0),V(7.347880794884119e-16, 3, 0),'torus0rib0undefined'),
                new PCurveEdge(new SemiEllipseCurve(V(2, 0, 0),V3.X,V(0, 6.123233995736766e-17, 1),0,3.141592653589793),V(3, 0, 0),V(1, 7.498798913309288e-33, 1.2246467991473532e-16),0,3.141592653589793,undefined,V(0, 6.123233995736766e-17, 1),V(-1.2246467991473532e-16, -6.123233995736766e-17, -1),'undefined.rotateX(1.5707963267948966)undefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(-1, 1.2246467991473532e-16, 0),V(-1.2246467991473532e-16, -1, 0),0,3.141592653589793),V3.X,V(-1, 1.2246467991473532e-16, 0),3.141592653589793,0,undefined,V(-2.4492935982947064e-16, -1, 0),V(1.2246467991473532e-16, 1, 0),'torus0rib1undefined')], []),
            new RotationFace(new RotatedCurveSurface(new SemiEllipseCurve(V(2, 0, 0), V(-1, 0, 0), V(0, -6.123233995736766e-17, -1), 0, 3.141592653589793), M4.forSys(V(-1, 1.2246467991473532e-16, 0), V(-1.2246467991473532e-16, -1, 0), V3.Z), 0, 3.141592653589793), [
                new PCurveEdge(new SemiEllipseCurve(V(-2, 2.4492935982947064e-16, 0),V(1, -1.2246467991473532e-16, 0),V(7.498798913309288e-33, 6.123233995736766e-17, -1),0,3.141592653589793),V(-3, 3.6739403974420594e-16, -1.2246467991473532e-16),V(-1, 1.2246467991473532e-16, 0),3.141592653589793,0,undefined,V(1.2246467991473532e-16, 6.123233995736765e-17, -1),V(-7.498798913309288e-33, -6.123233995736766e-17, 1),'undefined.rotateX(1.5707963267948966)undefinedundefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(-1, 1.2246467991473532e-16, 0),V(-1.2246467991473532e-16, -1, 0),0,3.141592653589793),V(-1, 1.2246467991473532e-16, 0),V3.X,0,3.141592653589793,undefined,V(-1.2246467991473532e-16, -1, 0),V(2.4492935982947064e-16, 1, 0),'torus0rib1undefined'),
                new PCurveEdge(new SemiEllipseCurve(V(2, 0, 0),V(-1, 0, 0),V(0, -6.123233995736766e-17, -1),0,3.141592653589793),V3.X,V(3, -7.498798913309288e-33, -1.2246467991473532e-16),0,3.141592653589793,undefined,V(0, -6.123233995736766e-17, -1),V(1.2246467991473532e-16, 6.123233995736766e-17, 1),'undefined.rotateX(1.5707963267948966)undefined'),
                new PCurveEdge(new SemiEllipseCurve(V3.O,V(-3, 3.6739403974420594e-16, 0),V(-3.6739403974420594e-16, -3, 0),0,3.141592653589793),V(3, 0, 0),V(-3, 3.6739403974420594e-16, 0),3.141592653589793,0,undefined,V(-7.347880794884119e-16, -3, 0),V(3.6739403974420594e-16, 3, 0),'torus0rib0undefined')], [])], false)

        outputLink(assert, {mesh: actual.faces[0].surface.sce + '.flipped().toMesh()'}, 'testtt')
        bRepEqual(assert, actual, expected)
    })

})