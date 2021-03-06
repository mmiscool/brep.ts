import chroma from 'chroma-js'
import { AABB, addOwnProperties, arrayFromFunction, DEG, int, M4, TAU, V, V3, Vector } from 'ts3dutils'
import { GL_COLOR, GL_COLOR_BLACK, Mesh, Shader, TSGLContext } from 'tsgl'

import {
	B2T,
	BezierCurve,
	Curve,
	CustomPlane,
	Edge,
	EllipseCurve,
	HyperbolaCurve,
	ImplicitCurve,
	L3,
	NURBS,
	ParabolaCurve,
	PICurve,
	PPCurve,
} from './index'
import { ceil, floor, pow, sign } from './math'
import * as shaders from './shaders'

export function parseGetParams(str: string) {
	const result: { [key: string]: string } = {}
	str.split('&').forEach(function(item) {
		const splitIndex = item.indexOf('=')
		if (-1 == splitIndex) {
			result[item] = item
		} else {
			result[item.substr(0, splitIndex)] = decodeURI(item.substr(splitIndex + 1))
		}
	})
	return result
}

export const COLORS = {
	RD_FILL: chroma('#9EDBF9'),
	RD_STROKE: chroma('#77B0E0'),
	TS_FILL: chroma('#D19FE3'),
	TS_STROKE: chroma('#A76BC2'),
	PP_FILL: chroma('#F3B6CF'),
	PP_STROKE: chroma('#EB81B4'),
}
export interface BREPGLContext extends TSGLContext {}
export class BREPGLContext {
	shaders: SHADERS_TYPE

	cachedMeshes: WeakMap<any, Mesh & { TRIANGLES: int[]; normals: V3[] }> = new WeakMap()

	constructor(gl: BREPGLContext) {
		this.shaders = initShaders(gl)
		initMeshes((this.meshes = {}), gl)
	}

	static create(gl: TSGLContext) {
		addOwnProperties(gl, BREPGLContext.prototype)
		addOwnProperties(gl, new BREPGLContext(gl as BREPGLContext))
		return gl as BREPGLContext
	}

	drawPoint(p: V3, color: GL_COLOR = GL_COLOR_BLACK, size = 5) {
		this.pushMatrix()
		this.translate(p)
		this.scale(size / 2, size / 2, size / 2)
		this.shaders.singleColor.uniforms({ color: color }).draw(this.meshes.sphere1)
		this.popMatrix()
	}

	drawEdge(edge: Edge, color: GL_COLOR = GL_COLOR_BLACK, width = 2) {
		CURVE_PAINTERS[edge.curve.constructor.name](this, edge.curve, color, edge.minT, edge.maxT, width)
	}

	drawCurve(curve: Curve, color: GL_COLOR = GL_COLOR_BLACK, width = 2, tStart: number, tEnd: number) {
		CURVE_PAINTERS[curve.constructor.name](this, curve, color, tStart, tEnd, width)
	}

	drawVector(vector: V3, anchor: V3, color: GL_COLOR = GL_COLOR_BLACK, size = 1) {
		if (vector.likeO()) return
		this.pushMatrix()

		const headLength = size * 4
		if (headLength > vector.length()) return

		const vT = vector.getPerpendicular().unit()
		this.multMatrix(M4.forSys(vector.unit(), vT, vector.cross(vT).unit(), anchor))
		this.scale(vector.length() - headLength, size / 2, size / 2)

		this.shaders.singleColor
			.uniforms({
				color: color,
			})
			.draw(this.meshes.vectorShaft)

		this.scale(1 / (vector.length() - headLength), 1, 1)
		this.translate(vector.length() - headLength, 0, 0)
		this.scale(headLength / 2, 1, 1)

		this.shaders.singleColor.draw(this.meshes.vectorHead)
		this.popMatrix()
	}

	drawVectors(drVs: { v: V3; anchor: V3; color?: GL_COLOR }[], size: number | undefined = undefined) {
		this.drawVector(V3.X, V3.O, chroma('red').gl(), size)
		this.drawVector(V3.Y, V3.O, chroma('green').gl(), size)
		this.drawVector(V3.Z, V3.O, chroma('blue').gl(), size)

		drVs.forEach(vi => this.drawVector(vi.v, vi.anchor, vi.color, size))
	}

	drawPlane(customPlane: CustomPlane, color: GL_COLOR, dotted: boolean = false) {
		this.pushMatrix()
		this.multMatrix(M4.forSys(customPlane.right, customPlane.up, customPlane.normal1))
		this.translate(customPlane.uMin, customPlane.vMin, customPlane.w)
		this.scale(customPlane.uMax - customPlane.uMin, customPlane.vMax - customPlane.vMin, 1)

		const mesh = dotted ? this.meshes.xyDottedLinePlane : this.meshes.xyLinePlane
		this.shaders.singleColor.uniforms({ color: color }).draw(mesh, this.LINES)

		this.popMatrix()
	}

	drawBox(m4: M4, color?: GL_COLOR) {
		this.pushMatrix()
		this.multMatrix(m4)
		if (color) {
			this.shaders.singleColor.uniforms({ color: color }).draw(this.meshes.cube, this.LINES)
		} else {
			this.shaders.multiColor.draw(this.meshes.cube, this.LINES)
		}
		this.popMatrix()
	}
}

function conicPainter(
	mode: 0 | 1 | 2,
	gl: BREPGLContext,
	ellipse: EllipseCurve,
	color: GL_COLOR,
	startT: number,
	endT: number,
	width = 2,
) {
	gl.shaders.ellipse3d
		.uniforms({
			f1: ellipse.f1,
			f2: ellipse.f2,
			center: ellipse.center,
			color: color,
			startT: startT,
			endT: endT,
			scale: width,
			mode: mode,
		})
		.draw(gl.meshes.pipe)
}

export const CURVE_PAINTERS: {
	[curveConstructorName: string]: (
		gl: BREPGLContext,
		curve: Curve,
		color: GL_COLOR,
		startT: number,
		endT: number,
		width: number,
	) => void
} = {
	[EllipseCurve.name]: conicPainter.bind(undefined, 0),
	[ParabolaCurve.name]: conicPainter.bind(undefined, 1),
	[HyperbolaCurve.name]: conicPainter.bind(undefined, 2),
	[ImplicitCurve.name](gl, curve: ImplicitCurve, color, startT, endT, width = 2) {
		let mesh = gl.cachedMeshes.get(curve)
		const RES = 4
		if (!mesh) {
			mesh = new Mesh().addIndexBuffer('TRIANGLES').addVertexBuffer('normals', 'ts_Normal')
			curve.addToMesh(mesh, RES)
			mesh.compile()
			gl.cachedMeshes.set(curve, mesh)
		}
		const startIndex = ceil(startT)
		const endIndex = floor(endT)
		if (startIndex <= endIndex) {
			const indexFactor =
				2 * // no of triangles per face
				RES * // no of faces
				3 // no of indexes per triangle
			gl.shaders.generic3d
				.uniforms({
					color: color,
					scale: width,
				})
				.draw(mesh, gl.TRIANGLES, startIndex * indexFactor, (floor(endT) - startIndex) * indexFactor)
			if (startT % 1 !== 0) {
				const p = curve.at(startT)
				gl.pushMatrix()
				const m = M4.forSys(
					p.to(curve.points[startIndex]),
					mesh.normals[startIndex * RES].toLength(width),
					mesh.normals[startIndex * RES + 1].toLength(width),
					p,
				)
				gl.multMatrix(m)
				gl.shaders.singleColor.uniforms({ color: color }).draw(gl.meshes.pipeSegmentForICurve)
				console.log(gl.meshes.pipeSegmentForICurve)
				gl.popMatrix()
			}
			if (endT % 1 !== 0) {
				const p = curve.at(endT)
				gl.pushMatrix()
				const m = M4.forSys(
					curve.points[endIndex].to(p),
					mesh.normals[endIndex * RES].toLength(width),
					mesh.normals[endIndex * RES + 1].toLength(width),
					curve.points[endIndex],
				)
				gl.multMatrix(m)
				gl.shaders.singleColor.uniforms({ color: color }).draw(gl.meshes.pipeSegmentForICurve)
				gl.popMatrix()
			}
		} else {
			const p1 = curve.at(startT)
			const p2 = curve.at(endT)
			gl.pushMatrix()
			const v0 = p1.to(p2),
				v1 = v0.getPerpendicular().toLength(width),
				v2 = v0.cross(v1).toLength(width)
			const m = M4.forSys(v0, v1, v2, p1)
			gl.multMatrix(m)
			gl.shaders.singleColor.uniforms({ color: color }).draw(gl.meshes.pipeSegmentForICurve)
			gl.popMatrix()
		}
	},
	[BezierCurve.name](gl, curve: BezierCurve, color, startT, endT, width = 2, normal = V3.Z) {
		gl.shaders.bezier3d
			.uniforms({
				p0: curve.p0,
				p1: curve.p1,
				p2: curve.p2,
				p3: curve.p3,
				color: color,
				startT: startT,
				endT: endT,
				scale: width,
				normal: normal,
			})
			.draw(gl.meshes.pipe)
	},
	[NURBS.name](gl, curve: NURBS, color, startT, endT, width = 2, normal = V3.Z) {
		gl.shaders.nurbs
			.uniforms({
				'points[0]': Vector.pack(curve.points),
				degree: curve.degree,
				'knots[0]': curve.knots,
				color: color,
				startT: startT,
				endT: endT,
				scale: width,
				normal: normal,
			})
			.draw(gl.meshes.pipe)
	},
	[L3.name](gl, curve: L3, color, startT, endT, width = 2, normal = V3.Z) {
		gl.pushMatrix()
		const a = curve.at(startT),
			b = curve.at(endT)
		const ab = b.minus(a),
			abT = ab.getPerpendicular().unit()
		const m = M4.forSys(ab, abT, ab.cross(abT).unit(), a)
		gl.multMatrix(m)
		gl.scale(1, width, width)
		gl.shaders.singleColor
			.uniforms({
				color: color, // TODO: error checking
			})
			.draw(gl.meshes.pipe)

		gl.popMatrix()
	},
}
CURVE_PAINTERS[PICurve.name] = CURVE_PAINTERS[ImplicitCurve.name]
CURVE_PAINTERS[PPCurve.name] = CURVE_PAINTERS[ImplicitCurve.name]

export function initMeshes(_meshes: { [name: string]: Mesh }, _gl: BREPGLContext) {
	_gl.makeCurrent()
	_meshes.cube = (() => {
		const cube = B2T.box()
			.toMesh()
			.addVertexBuffer('colors', 'ts_Color')
		cube.colors = cube.vertices.map(p => [p.x, p.y, p.z, 1].map(x => x * 0.9))
		cube.compile()
		return cube
	})()
	_meshes.sphere1 = Mesh.sphere(2)
	_meshes.segment = Mesh.plane({ startY: -0.5, height: 1, detailX: 128 })
	_meshes.text = Mesh.plane()
	_meshes.vector = Mesh.rotation([V3.O, V(0, 0.05, 0), V(0.8, 0.05), V(0.8, 0.1), V(1, 0)], L3.X, TAU, 16, true)
	_meshes.vectorShaft = Mesh.rotation([V3.O, V3.Y, V3.XY], L3.X, TAU, 8, true)
	_meshes.vectorHead = Mesh.rotation([V3.Y, V(0, 2, 0), V(2, 0, 0)], L3.X, TAU, 8, true)
	_meshes.pipe = Mesh.rotation(arrayFromFunction(512, (i, l) => new V3(i / (l - 1), -0.5, 0)), L3.X, TAU, 8, true)
	_meshes.xyLinePlane = Mesh.plane()
	_meshes.xyDottedLinePlane = makeDottedLinePlane()
	_meshes.pipeSegmentForICurve = Mesh.offsetVertices(
		M4.rotateY(90 * DEG).transformedPoints(arrayFromFunction(4, i => V3.polar(1, TAU * i / 4))),
		V3.X,
		true,
	)
}

export function initShaders(_gl: TSGLContext) {
	_gl.makeCurrent()
	return {
		singleColor: Shader.create(shaders.vertexShaderBasic, shaders.fragmentShaderColor),
		multiColor: Shader.create(shaders.vertexShaderColor, shaders.fragmentShaderVaryingColor),
		singleColorHighlight: Shader.create(shaders.vertexShaderBasic, shaders.fragmentShaderColorHighlight),
		textureColor: Shader.create(shaders.vertexShaderTexture, shaders.fragmentShaderTextureColor),
		arc: Shader.create(shaders.vertexShaderRing, shaders.fragmentShaderColor),
		arc2: Shader.create(shaders.vertexShaderArc, shaders.fragmentShaderColor),
		ellipse3d: Shader.create(shaders.vertexShaderConic3d, shaders.fragmentShaderColor),
		generic3d: Shader.create(shaders.vertexShaderGeneric, shaders.fragmentShaderColor),
		bezier3d: Shader.create(shaders.vertexShaderBezier3d, shaders.fragmentShaderColor),
		nurbs: Shader.create(shaders.vertexShaderNURBS, shaders.fragmentShaderColor3),
		bezier: Shader.create(shaders.vertexShaderBezier, shaders.fragmentShaderColor),
		lighting: Shader.create(shaders.vertexShaderLighting, shaders.fragmentShaderLighting),
		waves: Shader.create(shaders.vertexShaderWaves, shaders.fragmentShaderLighting),
	}
}

function makeDottedLinePlane(count: int = 128) {
	const mesh = new Mesh().addIndexBuffer('LINES')
	const OXvertices = arrayFromFunction(count, i => new V3(i / count, 0, 0))
	mesh.vertices.push(...OXvertices)
	mesh.vertices.push(...M4.forSys(V3.Y, V3.O, V3.O, V3.X).transformedPoints(OXvertices))
	mesh.vertices.push(...M4.forSys(V3.X.negated(), V3.O, V3.O, new V3(1, 1, 0)).transformedPoints(OXvertices))
	mesh.vertices.push(...M4.forSys(V3.Y.negated(), V3.O, V3.O, V3.Y).transformedPoints(OXvertices))
	mesh.LINES = arrayFromFunction(count * 4, i => i - (i >= count * 2 ? 1 : 0))
	mesh.compile()
	return mesh
}

export type Eye = { pos: V3; focus: V3; up: V3; zoomFactor: number }
export function initNavigationEvents(_gl: BREPGLContext, eye: Eye, paintScreen: () => void) {
	const canvas = _gl.canvas
	let lastPos: V3 = V3.O
	//_gl.onmousedown.push((e) => {
	//	e.preventDefault()
	//	e.stopPropagation()
	//})
	//_gl.onmouseup.push((e) => {
	//	e.preventDefault()
	//	e.stopPropagation()
	//})
	canvas.addEventListener('mousemove', (e: MouseEvent) => {
		const pagePos = V(e.pageX, e.pageY)
		const delta = lastPos.to(pagePos)
		//noinspection JSBitwiseOperatorUsage
		if (e.buttons & 4) {
			// pan
			const moveCamera = V(-delta.x * 2 / _gl.canvas.width, delta.y * 2 / _gl.canvas.height)
			const inverseProjectionMatrix = _gl.projectionMatrix.inversed()
			const worldMoveCamera = inverseProjectionMatrix.transformVector(moveCamera)
			eye.pos = eye.pos.plus(worldMoveCamera)
			eye.focus = eye.focus.plus(worldMoveCamera)
			setupCamera(eye, _gl)
			paintScreen()
		}
		// scene rotation
		//noinspection JSBitwiseOperatorUsage
		if (e.buttons & 2) {
			const rotateLR = -delta.x / 6.0 * DEG
			const rotateUD = -delta.y / 6.0 * DEG
			// rotate
			let matrix = M4.rotateLine(eye.focus, eye.up, rotateLR)
			//let horizontalRotationAxis = focus.minus(pos).cross(up)
			const horizontalRotationAxis = eye.up.cross(eye.pos.minus(eye.focus))
			matrix = matrix.times(M4.rotateLine(eye.focus, horizontalRotationAxis, rotateUD))
			eye.pos = matrix.transformPoint(eye.pos)
			eye.up = matrix.transformVector(eye.up)

			setupCamera(eye, _gl)
			paintScreen()
		}
		lastPos = pagePos
	})
	canvas.addEventListener('wheel', (e: WheelEvent) => {
		// zoom
		const wheelY = -sign(e.deltaY) * 2
		// console.log(e.deltaY, e.deltaX)
		eye.zoomFactor *= pow(0.9, -wheelY)
		const mouseCoordsOnCanvas = getPosOnTarget(e)
		const mousePosFrustrum = V(
			mouseCoordsOnCanvas.x * 2 / _gl.canvas.offsetWidth - 1,
			-mouseCoordsOnCanvas.y * 2 / _gl.canvas.offsetHeight + 1,
			0,
		)
		const moveCamera = mousePosFrustrum.times(1 - 1 / pow(0.9, -wheelY))
		const inverseProjectionMatrix = _gl.projectionMatrix.inversed()
		const worldMoveCamera = inverseProjectionMatrix.transformVector(moveCamera)
		//console.log("moveCamera", moveCamera)
		//console.log("worldMoveCamera", worldMoveCamera)
		eye.pos = eye.pos.plus(worldMoveCamera)
		eye.focus = eye.focus.plus(worldMoveCamera)

		// tilt
		const mousePosWC = inverseProjectionMatrix.transformPoint(mousePosFrustrum)
		const tiltMatrix = M4.rotateLine(mousePosWC, eye.pos.to(eye.focus), -sign(e.deltaX) * 10 * DEG)
		eye.up = tiltMatrix.transformVector(eye.up)
		eye.pos = tiltMatrix.transformPoint(eye.pos)
		eye.focus = tiltMatrix.transformPoint(eye.focus)
		setupCamera(eye, _gl)
		paintScreen()
		e.preventDefault()
	})
}
/**
 * Transforms position on the screen into a line in world coordinates.
 */
export function getMouseLine(pos: { x: number; y: number }, _gl: TSGLContext): L3 {
	const ndc1 = V(pos.x * 2 / _gl.canvas.width - 1, -pos.y * 2 / _gl.canvas.height + 1, 0)
	const ndc2 = V(pos.x * 2 / _gl.canvas.width - 1, -pos.y * 2 / _gl.canvas.height + 1, 1)
	//console.log(ndc)
	const inverseProjectionMatrix = _gl.projectionMatrix.inversed()
	const s = inverseProjectionMatrix.transformPoint(ndc1)
	const dir = inverseProjectionMatrix.transformPoint(ndc2).minus(s)
	return L3.anchorDirection(s, dir)
}
export function getPosOnTarget(e: MouseEvent) {
	const target = e.target as HTMLElement
	const targetRect = target.getBoundingClientRect()
	const mouseCoordsOnElement = {
		x: e.clientX - targetRect.left,
		y: e.clientY - targetRect.top,
	}
	return mouseCoordsOnElement
}

export function setupCamera(_eye: Eye, _gl: TSGLContext, suppressEvents = false) {
	const { pos, focus, up, zoomFactor } = _eye
	//console.log("pos", pos.$, "focus", focus.$, "up", up.$)
	_gl.matrixMode(_gl.PROJECTION)
	_gl.loadIdentity()
	//_gl.perspective(70, _gl.canvas.width / _gl.canvas.height, 0.1, 1000);
	const lr = _gl.canvas.width / 2 / zoomFactor
	const bt = _gl.canvas.height / 2 / zoomFactor
	_gl.ortho(-lr, lr, -bt, bt, -1e4, 1e4)
	_gl.lookAt(pos, focus, up)
	_gl.matrixMode(_gl.MODELVIEW)
	!suppressEvents && cameraChangeListeners.forEach(l => l(_eye))
}
export const cameraChangeListeners: ((eye: Eye) => void)[] = []

export const SHADERS_TYPE_VAR = (false as true) && initShaders(0 as any)
export type SHADERS_TYPE = typeof SHADERS_TYPE_VAR
// let shaders: typeof SHADERS_TYPE_VAR
// declare let a: BRep, b: BRep, c: BRep, d: BRep, edges: Edge[] = [], hovering: any,
// 	, normallines: boolean = false, b2s: BRep[] = []
// const
