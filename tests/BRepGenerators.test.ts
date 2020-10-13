import {
  b2equals,
  bRepEqual,
  bRepSnapshot,
  outputLink,
  suite,
  test,
  testBRepOp,
} from "./manager"

import chroma from "chroma-js"
import * as fs from "fs"
import { AABB, DEG, M4, TAU, V, V3 } from "ts3dutils"
import { Mesh } from "tsgl"

import {
  B2T,
  BRep,
  ConicSurface,
  CylinderSurface,
  Edge,
  EllipseCurve,
  L3,
  P3,
  PCurveEdge,
  PlaneFace,
  PlaneSurface,
  RotatedCurveSurface,
  RotationFace,
  StraightEdge,
  edgeForCurveAndTs,
} from ".."

suite("BRep generators", () => {
  test("rotStep w/ straight edges", async (assert) => {
    const actual = B2T.rotStep(
      StraightEdge.chain([V(2, 0, 2), V(4, 0, 2), V(4, 0, 4)]),
      TAU,
      5,
    )
    await bRepSnapshot(assert, actual)
  })

  test("rotStep w/ circle", async (assert) => {
    const actual = B2T.rotStep(
      [
        edgeForCurveAndTs(
          EllipseCurve.semicircle(2, V(3, 0)).rotateX(90 * DEG),
        ),
        StraightEdge.throughPoints(V(1, 0, 0), V(5, 0, 0)),
      ],
      [0.1, 1, 2],
    )
    // prettier-ignore
    const expected = new BRep([
            new RotationFace(new CylinderSurface(new EllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(0.0499791692706789, -0.9987502603949664, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new EllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(1, 1.4997597826618576e-32, 2.4492935982947064e-16), V(5, 0, 0), 3.141592653589793, 0, undefined, V(2.4492935982947064e-16, 1.2246467991473532e-16, 2), V(0, -1.2246467991473532e-16, -2), undefined),
                new StraightEdge(new L3(V(5, 0, 0), V(-0.0499791692706789, 0.9987502603949664, 0)), V(5, 0, 0), V(4.9750208263901285, 0.4991670832341408, 0), 0, 0.49979169270678325),
                new PCurveEdge(new EllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(4.9750208263901285, 0.4991670832341408, 0), V(0.9950041652780257, 0.09983341664682815, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), V(-2.3147966581475544e-16, -1.4630500144349825e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V3.X, V(-0.0499791692706789, 0.9987502603949664, 0)), V(0.9950041652780257, 0.09983341664682815, 0), V3.X, 0.09995833854135665, 0)], []),
            new RotationFace(new CylinderSurface(new EllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(0.522687228930659, -0.8525245220595058, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new EllipseCurve(V(2.985012495834077, 0.29950024994048446, 0), V(1.9900083305560514, 0.1996668332936563, 0), V(-1.222606741444822e-17, 1.2185286661460182e-16, 2), 0, 3.141592653589793), V(0.9950041652780257, 0.09983341664682815, 2.4492935982947064e-16), V(4.9750208263901285, 0.4991670832341408, 0), 3.141592653589793, 0, undefined, V(2.3147966581475544e-16, 1.4630500144349825e-16, 2), V(1.222606741444822e-17, -1.2185286661460182e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(4.9750208263901285, 0.4991670832341408, 0), V(-0.522687228930659, 0.8525245220595058, 0)), V(4.9750208263901285, 0.4991670832341408, 0), V(2.701511529340699, 4.207354924039483, 0), 0, 4.349655341112302),
                new PCurveEdge(new EllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(2.701511529340699, 4.207354924039483, 0), V(0.5403023058681398, 0.8414709848078965, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), V(-2.928542307863416e-17, -2.722688985694075e-16, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(0.9950041652780257, 0.09983341664682815, 0), V(-0.5226872289306591, 0.8525245220595058, 0)), V(0.5403023058681398, 0.8414709848078965, 0), V(0.9950041652780257, 0.09983341664682815, 0), 0.8699310682224602, 0)], []),
            new RotationFace(new CylinderSurface(new EllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(0.9974949866040544, -0.07073720166770292, 0), 0, 3.141592653589793, -Infinity, Infinity), [
                new PCurveEdge(new EllipseCurve(V(1.6209069176044193, 2.5244129544236893, 0), V(1.0806046117362795, 1.682941969615793, 0), V(-1.0305047481203616e-16, 6.616794894533516e-17, 2), 0, 3.141592653589793), V(0.5403023058681398, 0.8414709848078965, 2.4492935982947064e-16), V(2.701511529340699, 4.207354924039483, 0), 3.141592653589793, 0, undefined, V(2.928542307863416e-17, 2.722688985694075e-16, 2), V(1.0305047481203616e-16, -6.616794894533516e-17, -2), 'undefinedundefined'),
                new StraightEdge(new L3(V(2.701511529340699, 4.207354924039483, 0), V(-0.9974949866040544, 0.07073720166770292, 0)), V(2.701511529340699, 4.207354924039483, 0), V(-2.080734182735712, 4.546487134128409, 0), 0, 4.79425538604203),
                new PCurveEdge(new EllipseCurve(V(-1.2484405096414273, 2.727892280477045, 0), V(-0.8322936730942848, 1.8185948536513634, 0), V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), 0, 3.141592653589793), V(-2.080734182735712, 4.546487134128409, 0), V(-0.4161468365471424, 0.9092974268256817, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), V(2.132833965940505e-16, -1.7175034751172367e-16, -2), 'undefinedundefined'),
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
                new PCurveEdge(new EllipseCurve(V(3, 0, 0), V(2, 0, 0), V(0, 1.2246467991473532e-16, 2), 0, 3.141592653589793), V(5, 0, 0), V(1, 1.4997597826618576e-32, 2.4492935982947064e-16), 0, 3.141592653589793, undefined, V(0, 1.2246467991473532e-16, 2), V(-2.4492935982947064e-16, -1.2246467991473532e-16, -2), undefined),
                new StraightEdge(new L3(V3.X, V3.X), V3.X, V(5, 0, 0), 0, 4)], []),
            new PlaneFace(new PlaneSurface(new P3(V(-0.9092974268256817, -0.4161468365471424, 0), 0), V(0.4161468365471424, -0.9092974268256817, 0), V3.Z), [
                new StraightEdge(new L3(V(-0.4161468365471424, 0.9092974268256817, 0), V(-0.4161468365471424, 0.9092974268256817, 0)), V(-2.080734182735712, 4.546487134128409, 0), V(-0.4161468365471424, 0.9092974268256817, 0), 4, 0),
                new PCurveEdge(new EllipseCurve(V(-1.2484405096414273, 2.727892280477045, 0), V(-0.8322936730942848, 1.8185948536513634, 0), V(-1.1135681832349957e-16, -5.0963289135275475e-17, 2), 0, 3.141592653589793), V(-0.4161468365471424, 0.9092974268256817, 2.4492935982947064e-16), V(-2.080734182735712, 4.546487134128409, 0), 3.141592653589793, 0, undefined, V(-2.132833965940505e-16, 1.7175034751172367e-16, 2), V(1.1135681832349957e-16, 5.0963289135275475e-17, -2), 'undefinedundefined')], [])], false)
    await bRepSnapshot(assert, actual)
  })
  test("rotateEdges w/ straight edges", (assert) => {
    const actual = B2T.rotateEdges(
      StraightEdge.chain([V(2, 0, 2), V(4, 0, 2), V(4, 0, 4)]),
      TAU,
    )
    // prettier-ignore
    const expected = new BRep([
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), -2), V3.Y, V3.X), [
                new StraightEdge(new L3(V(2, 0, 2), V3.X), V(4, 0, 2), V(2, 0, 2), 2, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(2, 0, 0), V(0, 2, 0), 0, 3.141592653589793), V(2, 0, 2), V(-2, 2.4492935982947064e-16, 2), 0, 3.141592653589793, undefined, V(0, 2, 0), V(-2.4492935982947064e-16, -2, 0), 'rotateEdges0rib0'),
                new StraightEdge(new L3(V(-2, 2.4492935982947064e-16, 2), V(-1, 1.2246467991473532e-16, 0)), V(-2, 2.4492935982947064e-16, 2), V(-4, 4.898587196589413e-16, 2), 0, 2),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 2), V(4, 0, 2), 3.141592653589793, 0, undefined, V(4.898587196589413e-16, 4, 0), V(0, -4, 0), 'rotateEdges0rib1')], []),
            new RotationFace(new CylinderSurface(new EllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V3.Z, 0, 3.141592653589793, 0, 2), [
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 4), V(4, 0, 2), 2, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(4, 0, 2), V(-4, 4.898587196589413e-16, 2), 0, 3.141592653589793, undefined, V(0, 4, 0), V(-4.898587196589413e-16, -4, 0), 'rotateEdges0rib1'),
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 2), V3.Z), V(-4, 4.898587196589413e-16, 2), V(-4, 4.898587196589413e-16, 4), 0, 2),
                new PCurveEdge(new EllipseCurve(V(0, 0, 4), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 4), V(4, 0, 4), 3.141592653589793, 0, undefined, V(4.898587196589413e-16, 4, 0), V(0, -4, 0), 'rotateEdges0rib2')], []),
            new RotationFace(new ConicSurface(V3.O, V(-4, 0, 0), V(0, 4, 0), V(0, 0, 4)), [
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(2, 0, 2), V(4, 0, 4), 2.8284271247461903, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 4), V(4, 0, 0), V(0, 4, 0), 0, 3.141592653589793), V(4, 0, 4), V(-4, 4.898587196589413e-16, 4), 0, 3.141592653589793, undefined, V(0, 4, 0), V(-4.898587196589413e-16, -4, 0), 'rotateEdges0rib2'),
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 4), V(0.7071067811865475, -8.659560562354932e-17, -0.7071067811865475)), V(-4, 4.898587196589413e-16, 4), V(-2, 2.4492935982947064e-16, 2), 0, 2.8284271247461903),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(2, 0, 0), V(0, 2, 0), 0, 3.141592653589793), V(-2, 2.4492935982947064e-16, 2), V(2, 0, 2), 3.141592653589793, 0, undefined, V(2.4492935982947064e-16, 2, 0), V(0, -2, 0), 'rotateEdges0rib0')], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1), -2), V3.Y, V3.X), [
                new StraightEdge(new L3(V(-2, 2.4492935982947064e-16, 2), V(-1, 1.2246467991473532e-16, 0)), V(-4, 4.898587196589413e-16, 2), V(-2, 2.4492935982947064e-16, 2), 2, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(-2, 2.4492935982947064e-16, 0), V(-2.4492935982947064e-16, -2, 0), 0, 3.141592653589793), V(-2, 2.4492935982947064e-16, 2), V(2, 0, 2), 0, 3.141592653589793, undefined, V(-2.4492935982947064e-16, -2, 0), V(4.898587196589413e-16, 2, 0), 'rotateEdges0rib0'),
                new StraightEdge(new L3(V(2, 0, 2), V3.X), V(2, 0, 2), V(4, 0, 2), 0, 2),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(4, 0, 2), V(-4, 4.898587196589413e-16, 2), 3.141592653589793, 0, undefined, V(-9.797174393178826e-16, -4, 0), V(4.898587196589413e-16, 4, 0), 'rotateEdges0rib1')], []),
            new RotationFace(new CylinderSurface(new EllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V3.Z, 0, 3.141592653589793, 0, 2), [
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 2), V3.Z), V(-4, 4.898587196589413e-16, 4), V(-4, 4.898587196589413e-16, 2), 2, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 2), V(4, 0, 2), 0, 3.141592653589793, undefined, V(-4.898587196589413e-16, -4, 0), V(9.797174393178826e-16, 4, 0), 'rotateEdges0rib1'),
                new StraightEdge(new L3(V(4, 0, 2), V3.Z), V(4, 0, 2), V(4, 0, 4), 0, 2),
                new PCurveEdge(new EllipseCurve(V(0, 0, 4), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(4, 0, 4), V(-4, 4.898587196589413e-16, 4), 3.141592653589793, 0, undefined, V(-9.797174393178826e-16, -4, 0), V(4.898587196589413e-16, 4, 0), 'rotateEdges0rib2')], []),
            new RotationFace(new ConicSurface(V3.O, V(4, -4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), V(0, 0, 4)), [
                new StraightEdge(new L3(V(-4, 4.898587196589413e-16, 4), V(0.7071067811865475, -8.659560562354932e-17, -0.7071067811865475)), V(-2, 2.4492935982947064e-16, 2), V(-4, 4.898587196589413e-16, 4), 2.8284271247461903, 0),
                new PCurveEdge(new EllipseCurve(V(0, 0, 4), V(-4, 4.898587196589413e-16, 0), V(-4.898587196589413e-16, -4, 0), 0, 3.141592653589793), V(-4, 4.898587196589413e-16, 4), V(4, 0, 4), 0, 3.141592653589793, undefined, V(-4.898587196589413e-16, -4, 0), V(9.797174393178826e-16, 4, 0), 'rotateEdges0rib2'),
                new StraightEdge(new L3(V(4, 0, 4), V(-0.7071067811865475, 0, -0.7071067811865475)), V(4, 0, 4), V(2, 0, 2), 0, 2.8284271247461903),
                new PCurveEdge(new EllipseCurve(V(0, 0, 2), V(-2, 2.4492935982947064e-16, 0), V(-2.4492935982947064e-16, -2, 0), 0, 3.141592653589793), V(2, 0, 2), V(-2, 2.4492935982947064e-16, 2), 3.141592653589793, 0, undefined, V(-4.898587196589413e-16, -2, 0), V(2.4492935982947064e-16, 2, 0), 'rotateEdges0rib0')], [])], false)
    bRepEqual(assert, actual, expected)
  })

  test("pyramidEdges", (assert) => {
    const actual = B2T.pyramidEdges(
      [
        edgeForCurveAndTs(EllipseCurve.semicircle(2, V(3, 0))),
        StraightEdge.throughPoints(V(1, 0, 0), V(5, 0, 0)),
      ],
      V(0, 0, 4),
    )
    // prettier-ignore
    const expected = new BRep([
            new RotationFace(new ConicSurface(V(0, 0, 4),V(-2, 0, 0),V(0, 2, 0),V(3, 0, -4)), [
                new StraightEdge(new L3(V(0, 0, 4),V(0.7808688094430304, 0, -0.6246950475544243)),V(0, 0, 4),V(5, 0, 0),0,6.4031242374328485),
                new PCurveEdge(new EllipseCurve(V(3, 0, 0),V(2, 0, 0),V(0, 2, 0),0,3.141592653589793),V(5, 0, 0),V(1, 2.4492935982947064e-16, 0),0,3.141592653589793,undefined,V(0, 2, 0),V(-2.4492935982947064e-16, -2, 0),undefined),
                new StraightEdge(new L3(V(0, 0, 4),V(0.24253562503633297, 0, -0.9701425001453319)),V3.X,V(0, 0, 4),4.123105625617661,0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, -1, 0),0),V3.X,V3.Z), [
                new StraightEdge(new L3(V(0, 0, 4),V(0.24253562503633297, 0, -0.9701425001453319)),V(0, 0, 4),V3.X,0,4.123105625617661),
                new StraightEdge(new L3(V3.X,V3.X),V3.X,V(5, 0, 0),0,4),
                new StraightEdge(new L3(V(0, 0, 4),V(0.7808688094430304, 0, -0.6246950475544243)),V(5, 0, 0),V(0, 0, 4),6.4031242374328485,0)], []),
            new PlaneFace(new PlaneSurface(new P3(V(0, 0, -1),0),V3.Y,V3.X), [
                new StraightEdge(new L3(V3.X,V3.X),V(5, 0, 0),V3.X,4,0),
                new PCurveEdge(new EllipseCurve(V(3, 0, 0),V(2, 0, 0),V(0, 2, 0),0,3.141592653589793),V(1, 2.4492935982947064e-16, 0),V(5, 0, 0),3.141592653589793,0,undefined,V(2.4492935982947064e-16, 2, 0),V(0, -2, 0),undefined)], [])], false)
    bRepEqual(assert, actual, expected)
  })

  test("torus", (assert) => {
    const actual = B2T.torus(1, 2)

    // region expected
    const expected = new BRep(
      [
        new RotationFace(
          new RotatedCurveSurface(
            new EllipseCurve(
              V(2, 0, 0),
              V3.X,
              V(0, 6.123233995736766e-17, 1),
              0,
              3.141592653589793,
            ),
            M4.IDENTITY,
            0,
            3.141592653589793,
          ),
          [
            new PCurveEdge(
              new EllipseCurve(
                V(2, 0, 0),
                V3.X,
                V(0, 6.123233995736766e-17, 1),
                0,
                3.141592653589793,
              ),
              V(1, 7.498798913309288e-33, 1.2246467991473532e-16),
              V(3, 0, 0),
              3.141592653589793,
              0,
              undefined,
              V(1.2246467991473532e-16, 6.123233995736766e-17, 1),
              V(0, -6.123233995736766e-17, -1),
              "undefined.rotateX(1.5707963267948966)undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(3, 0, 0),
                V(0, 3, 0),
                0,
                3.141592653589793,
              ),
              V(3, 0, 0),
              V(-3, 3.6739403974420594e-16, 0),
              0,
              3.141592653589793,
              undefined,
              V(0, 3, 0),
              V(-3.6739403974420594e-16, -3, 0),
              "torus0rib0undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V(-2, 2.4492935982947064e-16, 0),
                V(-1, 1.2246467991473532e-16, 0),
                V(-7.498798913309288e-33, -6.123233995736766e-17, 1),
                0,
                3.141592653589793,
              ),
              V(-3, 3.6739403974420594e-16, 0),
              V(-1, 1.2246467991473532e-16, 1.2246467991473532e-16),
              0,
              3.141592653589793,
              undefined,
              V(-7.498798913309288e-33, -6.123233995736766e-17, 1),
              V(1.2246467991473532e-16, 6.123233995736765e-17, -1),
              "undefined.rotateX(1.5707963267948966)undefinedundefined",
            ),
            new PCurveEdge(
              new EllipseCurve(V3.O, V3.X, V3.Y, 0, 3.141592653589793),
              V(-1, 1.2246467991473532e-16, 0),
              V3.X,
              3.141592653589793,
              0,
              undefined,
              V(1.2246467991473532e-16, 1, 0),
              V(0, -1, 0),
              "torus0rib1undefined",
            ),
          ],
          [],
        ),
        new RotationFace(
          new RotatedCurveSurface(
            new EllipseCurve(
              V(2, 0, 0),
              V(-1, 0, 0),
              V(0, -6.123233995736766e-17, -1),
              0,
              3.141592653589793,
            ),
            M4.IDENTITY,
            0,
            3.141592653589793,
          ),
          [
            new PCurveEdge(
              new EllipseCurve(
                V(2, 0, 0),
                V(-1, 0, 0),
                V(0, -6.123233995736766e-17, -1),
                0,
                3.141592653589793,
              ),
              V(3, -7.498798913309288e-33, -1.2246467991473532e-16),
              V3.X,
              3.141592653589793,
              0,
              undefined,
              V(-1.2246467991473532e-16, -6.123233995736766e-17, -1),
              V(0, 6.123233995736766e-17, 1),
              "undefined.rotateX(1.5707963267948966)undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(V3.O, V3.X, V3.Y, 0, 3.141592653589793),
              V3.X,
              V(-1, 1.2246467991473532e-16, 0),
              0,
              3.141592653589793,
              undefined,
              V3.Y,
              V(-1.2246467991473532e-16, -1, 0),
              "torus0rib1undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V(-2, 2.4492935982947064e-16, 0),
                V(1, -1.2246467991473532e-16, 0),
                V(7.498798913309288e-33, 6.123233995736766e-17, -1),
                0,
                3.141592653589793,
              ),
              V(-1, 1.2246467991473532e-16, 0),
              V(-3, 3.6739403974420594e-16, -1.2246467991473532e-16),
              0,
              3.141592653589793,
              undefined,
              V(7.498798913309288e-33, 6.123233995736766e-17, -1),
              V(-1.2246467991473532e-16, -6.123233995736765e-17, 1),
              "undefined.rotateX(1.5707963267948966)undefinedundefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(3, 0, 0),
                V(0, 3, 0),
                0,
                3.141592653589793,
              ),
              V(-3, 3.6739403974420594e-16, 0),
              V(3, 0, 0),
              3.141592653589793,
              0,
              undefined,
              V(3.6739403974420594e-16, 3, 0),
              V(0, -3, 0),
              "torus0rib0undefined",
            ),
          ],
          [],
        ),
        new RotationFace(
          new RotatedCurveSurface(
            new EllipseCurve(
              V(2, 0, 0),
              V3.X,
              V(0, 6.123233995736766e-17, 1),
              0,
              3.141592653589793,
            ),
            M4.forSys(
              V(-1, 1.2246467991473532e-16, 0),
              V(-1.2246467991473532e-16, -1, 0),
              V3.Z,
            ),
            0,
            3.141592653589793,
          ),
          [
            new PCurveEdge(
              new EllipseCurve(
                V(-2, 2.4492935982947064e-16, 0),
                V(-1, 1.2246467991473532e-16, 0),
                V(-7.498798913309288e-33, -6.123233995736766e-17, 1),
                0,
                3.141592653589793,
              ),
              V(-1, 1.2246467991473532e-16, 1.2246467991473532e-16),
              V(-3, 3.6739403974420594e-16, 0),
              3.141592653589793,
              0,
              undefined,
              V(-1.2246467991473532e-16, -6.123233995736765e-17, 1),
              V(7.498798913309288e-33, 6.123233995736766e-17, -1),
              "undefined.rotateX(1.5707963267948966)undefinedundefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(-3, 3.6739403974420594e-16, 0),
                V(-3.6739403974420594e-16, -3, 0),
                0,
                3.141592653589793,
              ),
              V(-3, 3.6739403974420594e-16, 0),
              V(3, 0, 0),
              0,
              3.141592653589793,
              undefined,
              V(-3.6739403974420594e-16, -3, 0),
              V(7.347880794884119e-16, 3, 0),
              "torus0rib0undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V(2, 0, 0),
                V3.X,
                V(0, 6.123233995736766e-17, 1),
                0,
                3.141592653589793,
              ),
              V(3, 0, 0),
              V(1, 7.498798913309288e-33, 1.2246467991473532e-16),
              0,
              3.141592653589793,
              undefined,
              V(0, 6.123233995736766e-17, 1),
              V(-1.2246467991473532e-16, -6.123233995736766e-17, -1),
              "undefined.rotateX(1.5707963267948966)undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(-1, 1.2246467991473532e-16, 0),
                V(-1.2246467991473532e-16, -1, 0),
                0,
                3.141592653589793,
              ),
              V3.X,
              V(-1, 1.2246467991473532e-16, 0),
              3.141592653589793,
              0,
              undefined,
              V(-2.4492935982947064e-16, -1, 0),
              V(1.2246467991473532e-16, 1, 0),
              "torus0rib1undefined",
            ),
          ],
          [],
        ),
        new RotationFace(
          new RotatedCurveSurface(
            new EllipseCurve(
              V(2, 0, 0),
              V(-1, 0, 0),
              V(0, -6.123233995736766e-17, -1),
              0,
              3.141592653589793,
            ),
            M4.forSys(
              V(-1, 1.2246467991473532e-16, 0),
              V(-1.2246467991473532e-16, -1, 0),
              V3.Z,
            ),
            0,
            3.141592653589793,
          ),
          [
            new PCurveEdge(
              new EllipseCurve(
                V(-2, 2.4492935982947064e-16, 0),
                V(1, -1.2246467991473532e-16, 0),
                V(7.498798913309288e-33, 6.123233995736766e-17, -1),
                0,
                3.141592653589793,
              ),
              V(-3, 3.6739403974420594e-16, -1.2246467991473532e-16),
              V(-1, 1.2246467991473532e-16, 0),
              3.141592653589793,
              0,
              undefined,
              V(1.2246467991473532e-16, 6.123233995736765e-17, -1),
              V(-7.498798913309288e-33, -6.123233995736766e-17, 1),
              "undefined.rotateX(1.5707963267948966)undefinedundefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(-1, 1.2246467991473532e-16, 0),
                V(-1.2246467991473532e-16, -1, 0),
                0,
                3.141592653589793,
              ),
              V(-1, 1.2246467991473532e-16, 0),
              V3.X,
              0,
              3.141592653589793,
              undefined,
              V(-1.2246467991473532e-16, -1, 0),
              V(2.4492935982947064e-16, 1, 0),
              "torus0rib1undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V(2, 0, 0),
                V(-1, 0, 0),
                V(0, -6.123233995736766e-17, -1),
                0,
                3.141592653589793,
              ),
              V3.X,
              V(3, -7.498798913309288e-33, -1.2246467991473532e-16),
              0,
              3.141592653589793,
              undefined,
              V(0, -6.123233995736766e-17, -1),
              V(1.2246467991473532e-16, 6.123233995736766e-17, 1),
              "undefined.rotateX(1.5707963267948966)undefined",
            ),
            new PCurveEdge(
              new EllipseCurve(
                V3.O,
                V(-3, 3.6739403974420594e-16, 0),
                V(-3.6739403974420594e-16, -3, 0),
                0,
                3.141592653589793,
              ),
              V(3, 0, 0),
              V(-3, 3.6739403974420594e-16, 0),
              3.141592653589793,
              0,
              undefined,
              V(-7.347880794884119e-16, -3, 0),
              V(3.6739403974420594e-16, 3, 0),
              "torus0rib0undefined",
            ),
          ],
          [],
        ),
      ],
      false,
    )
    // endregion

    outputLink(
      assert,
      { mesh: actual.faces[0].surface.sce + ".flipped().toMesh()" },
      "testtt",
    )
    bRepEqual(assert, actual, expected)
  })

  test("fromBPT", (assert) => {
    const bpt = fs.readFileSync(__dirname + "/fixtures/teapotrim.bpt", "utf8")
    const actual = B2T.fromBPT(bpt)
    const expected = BRep.EMPTY
    actual[0].toMesh()
    outputLink(assert, {
      mesh: actual.map((x) => x.flipped()).toSource() + ".map(x => x.toMesh())",
    })
    //bRepEqual(assert, actual, expected)
  })

  test("chroma lab rgb", (assert) => {
    const r = 8 * 2
    const drPs = Mesh.box(r, r, r).vertices.map((p) => {
      const c = chroma.gl(...p.toArray(), 1)
      return { p: V(c.lab()), color: c.hex() }
    })
    const aabb = new AABB(V(0, -87, -108), V(100, 99, 95))

    const obb = M4.forSys(
      V(-0.433, -0.665, -0.609).toLength(124.525),
      V(-0.354, 0.746, -0.564).toLength(250.71),
      V(0.829, -0.028, -0.558).toLength(86.463),
      V(99.707, -28.17, 152.469),
    )
    console.log("aabb vol", aabb.volume())
    console.log("obb vol", obb.determinant())
    //; cX: (45.848, -110.990, 76.664); cY: (10.883, 158.919, 11.178); cZ: (171.393, -30.598, 104.189)

    outputLink(assert, { drPs, boxes: [obb, aabb.getM4()] })

    const wedgeVol = (3602639 / 0x1_00_00_00) * aabb.volume()
    console.log("wedgeVol " + wedgeVol)
    console.log("wedgeVol/aabb vol " + wedgeVol / aabb.volume())
    console.log("wedgeVol/obb vol " + wedgeVol / obb.determinant())
    //let c = 0,m=aabb.getM4()
    //for(let i=0;i<0x1_00_00_00;i++){
    //    const [x,y,z]=chroma.num(i).gl()
    //    const [l,a,b]=m.transformPoint(new V3(x,y,z))
    //    if (!chroma.lab(l,a,b).clipped())c++
    //
    //}
    //console.log("c",c)
  })
})
