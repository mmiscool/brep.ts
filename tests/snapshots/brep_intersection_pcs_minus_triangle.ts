new BRep(
  [
    new RotationFace(
      new ProjectedCurveSurface(
        new BezierCurve(V3.O, V(-0.1, -1, 0), V(1.1, 1, 0), V3.X, -0.1, 1.1),
        V(0, 0, -1),
        -0.1,
        1.1,
        -1,
        0
      ),
      [
        new StraightEdge(
          new L3(
            V(0.6720378035955893, 0.15204861513358436, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(0.6720378035955893, 0.15204861513358436, 0),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          0,
          1.0000000000000002
        ),
        new PCurveEdge(
          new BezierCurve(
            V3.Z,
            V(-0.1, -1, 1),
            V(1.1, 1, 1),
            V(1, 0, 1),
            -0.1,
            1.1
          ),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          V(0.9283999999999999, -0.39600000000000046, 1),
          0.606150070371036,
          1.1,
          undefined,
          V(1.5621108679697486, 1.2971789260840345, 0),
          V(-1.1580000000000013, -4.980000000000002, 0),
          "looseSegment14"
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(0.9283999999999999, -0.39600000000000046, 1),
          V(0.9283999999999999, -0.39600000000000046, 0),
          1,
          0
        ),
        new PCurveEdge(
          new BezierCurve(V3.O, V(-0.1, -1, 0), V(1.1, 1, 0), V3.X, -0.1, 1.1),
          V(0.9283999999999999, -0.39600000000000046, 0),
          V(0.6720378035955893, 0.15204861513358436, 0),
          1.1,
          0.606150070371036,
          undefined,
          V(1.1580000000000013, 4.980000000000002, 0),
          V(-1.5621108679697486, -1.2971789260840345, 0),
          "looseSegment12"
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(
          V(-0.6787925315325739, -0.7343301022943289, 0),
          -0.3393962657662869
        ),
        V(0.7343301022943289, -0.6787925315325739, 0),
        V3.Z,
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(
            V(0.5294091156647089, -0.027184896832924313, 0),
            V(0, 0, -1),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 1),
          V(0.5294091156647089, -0.027184896832924244, 0),
          -1,
          0
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 0),
            V(-0.7343301022943289, 0.6787925315325739, 0),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 0),
          V(0.9283999999999999, -0.39600000000000046, 0),
          0.5433399544546661,
          0
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(0.9283999999999999, -0.39600000000000046, 0),
          V(0.9283999999999999, -0.39600000000000046, 1),
          0,
          1
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 1),
            V(-0.7343301022943289, 0.6787925315325739, 0),
            -4096,
            4096
          ),
          V(0.9283999999999999, -0.39600000000000046, 1),
          V(0.5294091156647089, -0.027184896832924244, 1),
          0,
          0.5433399544546661
        ),
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
        new StraightEdge(
          new L3(
            V(0.05899926794769185, -0.18074085943087592, 0),
            V(0.9506336292991003, 0.31031548921318847, 0),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 0),
          V(1.0055749701976777, 0.1282500000000001, 0),
          0.4948382144484505,
          0.9957313449429445
        ),
        new StraightEdge(
          new L3(
            V(0.014198157920535026, 0.19898693000423617, 0),
            V(-0.997464109640633, 0.07117127214557296, 0),
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 0),
          V(0.6720378035955893, 0.15204861513358436, 0),
          -0.9938972266724629,
          -0.6595120960412912
        ),
        new PCurveEdge(
          new BezierCurve(V3.O, V(-0.1, -1, 0), V(1.1, 1, 0), V3.X, -0.1, 1.1),
          V(0.6720378035955893, 0.15204861513358436, 0),
          V(0.9283999999999999, -0.39600000000000046, 0),
          0.606150070371036,
          1.1,
          undefined,
          V(1.5621108679697486, 1.2971789260840345, 0),
          V(-1.1580000000000013, -4.980000000000002, 0),
          "looseSegment12"
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 0),
            V(-0.7343301022943289, 0.6787925315325739, 0),
            -4096,
            4096
          ),
          V(0.9283999999999999, -0.39600000000000046, 0),
          V(0.5294091156647089, -0.027184896832924244, 0),
          0,
          0.5433399544546661
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
          new L3(
            V(0.05899926794769185, -0.18074085943087592, 1),
            V(-0.9506336292991003, -0.31031548921318847, 0),
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 1),
          V(0.5294091156647089, -0.027184896832924244, 1),
          -0.9957313449429445,
          -0.4948382144484505
        ),
        new StraightEdge(
          new L3(
            V(0.9283999999999999, -0.39600000000000046, 1),
            V(-0.7343301022943289, 0.6787925315325739, 0),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 1),
          V(0.9283999999999999, -0.39600000000000046, 1),
          0.5433399544546661,
          0
        ),
        new PCurveEdge(
          new BezierCurve(
            V3.Z,
            V(-0.1, -1, 1),
            V(1.1, 1, 1),
            V(1, 0, 1),
            -0.1,
            1.1
          ),
          V(0.9283999999999999, -0.39600000000000046, 1),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          1.1,
          0.606150070371036,
          undefined,
          V(1.1580000000000013, 4.980000000000002, 0),
          V(-1.5621108679697486, -1.2971789260840345, 0),
          "looseSegment14"
        ),
        new StraightEdge(
          new L3(
            V(0.014198157920535026, 0.19898693000423617, 1),
            V(0.997464109640633, -0.07117127214557296, 0),
            -4096,
            4096
          ),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          V(1.0055749701976777, 0.1282500000000001, 1),
          0.6595120960412912,
          0.9938972266724629
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(
          V(-0.31031548921318847, 0.9506336292991003, 0),
          -0.19012672585982007
        ),
        V(0.9506336292991003, 0.31031548921318847, 0),
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(
            V(0.5294091156647089, -0.027184896832924313, 0),
            V(0, 0, -1),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 0),
          V(0.5294091156647089, -0.027184896832924244, 1),
          0,
          -1
        ),
        new StraightEdge(
          new L3(
            V(0.05899926794769185, -0.18074085943087592, 1),
            V(-0.9506336292991003, -0.31031548921318847, 0),
            -4096,
            4096
          ),
          V(0.5294091156647089, -0.027184896832924244, 1),
          V(1.0055749701976777, 0.1282500000000001, 1),
          -0.4948382144484505,
          -0.9957313449429445
        ),
        new StraightEdge(
          new L3(
            V(1.0055749701976777, 0.1282500000000001, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 1),
          V(1.0055749701976777, 0.1282500000000001, 0),
          1,
          0
        ),
        new StraightEdge(
          new L3(
            V(0.05899926794769185, -0.18074085943087592, 0),
            V(0.9506336292991003, 0.31031548921318847, 0),
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 0),
          V(0.5294091156647089, -0.027184896832924244, 0),
          0.9957313449429445,
          0.4948382144484505
        ),
      ],
      []
    ),
    new PlaneFace(
      new PlaneSurface(
        new P3(
          V(-0.07117127214557296, -0.997464109640633, 0),
          -0.19949282192812662
        ),
        V(-0.997464109640633, 0.07117127214557296, 0),
        V(0, 0, -1),
        -100,
        100,
        -100,
        100
      ),
      [
        new StraightEdge(
          new L3(
            V(0.6720378035955893, 0.15204861513358436, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          V(0.6720378035955893, 0.15204861513358436, 0),
          1.0000000000000002,
          0
        ),
        new StraightEdge(
          new L3(
            V(0.014198157920535026, 0.19898693000423617, 0),
            V(-0.997464109640633, 0.07117127214557296, 0),
            -4096,
            4096
          ),
          V(0.6720378035955893, 0.15204861513358436, 0),
          V(1.0055749701976777, 0.1282500000000001, 0),
          -0.6595120960412912,
          -0.9938972266724629
        ),
        new StraightEdge(
          new L3(
            V(1.0055749701976777, 0.1282500000000001, 0),
            V3.Z,
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 0),
          V(1.0055749701976777, 0.1282500000000001, 1),
          0,
          1
        ),
        new StraightEdge(
          new L3(
            V(0.014198157920535026, 0.19898693000423617, 1),
            V(0.997464109640633, -0.07117127214557296, 0),
            -4096,
            4096
          ),
          V(1.0055749701976777, 0.1282500000000001, 1),
          V(0.6720378035955893, 0.15204861513358436, 1.0000000000000002),
          0.9938972266724629,
          0.6595120960412912
        ),
      ],
      []
    ),
  ],
  false
)