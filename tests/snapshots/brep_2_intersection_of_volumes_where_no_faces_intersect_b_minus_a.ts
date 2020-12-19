new BRep(
  [
    new PlaneFace(
      new PlaneSurface(
        new P3(V3.X, 1),
        V(0, -1, 0),
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(1, 3, 1), V3.Z, 0, 2),
          V(1, 3, 1),
          V(1, 3, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(1, 1, 3), V3.Y, 0, 2),
          V(1, 3, 3),
          V(1, 1, 3),
          2,
          0
        ),
        new StraightEdge(new L3(V3.XYZ, V3.Z, 0, 2), V(1, 1, 3), V3.XYZ, 2, 0),
        new StraightEdge(new L3(V3.XYZ, V3.Y, 0, 2), V3.XYZ, V(1, 3, 1), 0, 2),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(0, -1, 0), -3),
        V(-1, 0, 0),
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(3, 3, 1), V3.Z, 0, 2),
          V(3, 3, 1),
          V(3, 3, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(1, 3, 3), V3.X, 0, 2),
          V(3, 3, 3),
          V(1, 3, 3),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(1, 3, 1), V3.Z, 0, 2),
          V(1, 3, 3),
          V(1, 3, 1),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(1, 3, 1), V3.X, 0, 2),
          V(1, 3, 1),
          V(3, 3, 1),
          0,
          2
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(-1, 0, 0), -3),
        V3.Y,
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(3, 1, 1), V3.Z, 0, 2),
          V(3, 1, 1),
          V(3, 1, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(3, 3, 3), V(0, -1, 0), 0, 2),
          V(3, 1, 3),
          V(3, 3, 3),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(3, 3, 1), V3.Z, 0, 2),
          V(3, 3, 3),
          V(3, 3, 1),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(3, 3, 1), V(0, -1, 0), 0, 2),
          V(3, 3, 1),
          V(3, 1, 1),
          0,
          2
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V3.Y, 1),
        V3.X,
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(new L3(V3.XYZ, V3.Z, 0, 2), V3.XYZ, V(1, 1, 3), 0, 2),
        new StraightEdge(
          new L3(V(3, 1, 3), V(-1, 0, 0), 0, 2),
          V(1, 1, 3),
          V(3, 1, 3),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(3, 1, 1), V3.Z, 0, 2),
          V(3, 1, 3),
          V(3, 1, 1),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(3, 1, 1), V(-1, 0, 0), 0, 2),
          V(3, 1, 1),
          V3.XYZ,
          0,
          2
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V3.Z, 1),
        V3.Y,
        V(-1, 0, 0),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(3, 1, 1), V(-1, 0, 0), 0, 2),
          V3.XYZ,
          V(3, 1, 1),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(3, 3, 1), V(0, -1, 0), 0, 2),
          V(3, 1, 1),
          V(3, 3, 1),
          2,
          0
        ),
        new StraightEdge(
          new L3(V(1, 3, 1), V3.X, 0, 2),
          V(3, 3, 1),
          V(1, 3, 1),
          2,
          0
        ),
        new StraightEdge(new L3(V3.XYZ, V3.Y, 0, 2), V(1, 3, 1), V3.XYZ, 2, 0),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(0, 0, -1), -3),
        V3.Y,
        V3.X,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(1, 1, 3), V3.Y, 0, 2),
          V(1, 1, 3),
          V(1, 3, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(1, 3, 3), V3.X, 0, 2),
          V(1, 3, 3),
          V(3, 3, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(3, 3, 3), V(0, -1, 0), 0, 2),
          V(3, 3, 3),
          V(3, 1, 3),
          0,
          2
        ),
        new StraightEdge(
          new L3(V(3, 1, 3), V(-1, 0, 0), 0, 2),
          V(3, 1, 3),
          V(1, 1, 3),
          0,
          2
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(-1, 0, 0), 0),
        V(0, -1, 0),
        V3.Z,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(new L3(V3.O, V3.Y, 0, 10), V(0, 10, 0), V3.O, 10, 0),
        new StraightEdge(new L3(V3.O, V3.Z, 0, 10), V3.O, V(0, 0, 10), 0, 10),
        new StraightEdge(
          new L3(V(0, 0, 10), V3.Y, 0, 10),
          V(0, 0, 10),
          V(0, 10, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(0, 10, 0), V3.Z, 0, 10),
          V(0, 10, 10),
          V(0, 10, 0),
          10,
          0
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V3.Y, 10),
        V(-1, 0, 0),
        V3.Z,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(0, 10, 0), V3.X, 0, 10),
          V(10, 10, 0),
          V(0, 10, 0),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(0, 10, 0), V3.Z, 0, 10),
          V(0, 10, 0),
          V(0, 10, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(0, 10, 10), V3.X, 0, 10),
          V(0, 10, 10),
          V(10, 10, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 10, 0), V3.Z, 0, 10),
          V(10, 10, 10),
          V(10, 10, 0),
          10,
          0
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(new P3(V3.X, 10), V3.Y, V3.Z, -100, 100, -100, 100),
      [
        new StraightEdge(
          new L3(V(10, 10, 0), V(0, -1, 0), 0, 10),
          V(10, 0, 0),
          V(10, 10, 0),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(10, 10, 0), V3.Z, 0, 10),
          V(10, 10, 0),
          V(10, 10, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 10, 10), V(0, -1, 0), 0, 10),
          V(10, 10, 10),
          V(10, 0, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 0, 0), V3.Z, 0, 10),
          V(10, 0, 10),
          V(10, 0, 0),
          10,
          0
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(0, -1, 0), 0),
        V3.X,
        V3.Z,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(10, 0, 0), V(-1, 0, 0), 0, 10),
          V3.O,
          V(10, 0, 0),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(10, 0, 0), V3.Z, 0, 10),
          V(10, 0, 0),
          V(10, 0, 10),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 0, 10), V(-1, 0, 0), 0, 10),
          V(10, 0, 10),
          V(0, 0, 10),
          0,
          10
        ),
        new StraightEdge(new L3(V3.O, V3.Z, 0, 10), V(0, 0, 10), V3.O, 10, 0),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V(0, 0, -1), 0),
        V3.Y,
        V3.X,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(new L3(V3.O, V3.Y, 0, 10), V3.O, V(0, 10, 0), 0, 10),
        new StraightEdge(
          new L3(V(0, 10, 0), V3.X, 0, 10),
          V(0, 10, 0),
          V(10, 10, 0),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 10, 0), V(0, -1, 0), 0, 10),
          V(10, 10, 0),
          V(10, 0, 0),
          0,
          10
        ),
        new StraightEdge(
          new L3(V(10, 0, 0), V(-1, 0, 0), 0, 10),
          V(10, 0, 0),
          V3.O,
          0,
          10
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(V3.Z, 10),
        V3.Y,
        V(-1, 0, 0),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(V(10, 0, 10), V(-1, 0, 0), 0, 10),
          V(0, 0, 10),
          V(10, 0, 10),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(10, 10, 10), V(0, -1, 0), 0, 10),
          V(10, 0, 10),
          V(10, 10, 10),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(0, 10, 10), V3.X, 0, 10),
          V(10, 10, 10),
          V(0, 10, 10),
          10,
          0
        ),
        new StraightEdge(
          new L3(V(0, 0, 10), V3.Y, 0, 10),
          V(0, 10, 10),
          V(0, 0, 10),
          10,
          0
        ),
      ],
      []
    ),
  ],
  false
)