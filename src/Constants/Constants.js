export const SCENE_CONFIG = {
    width: window.innerWidth - 60,
    height: window.innerHeight - 95.45
}

export const DRAWING_MODE = {
    UNDEFINED: 0,
    SELECTION: 1,
    COLLECTION: 2,
    PAN: 3
}

export const INTERSECTION_TYPE = {
    DO_NOT_INTERSECT: 0,
    DO_INTERSECT: 1,
    TOUCH: 2,
    COLLINEAR: 3
}

export const SIGN = {
    NEGATIVE: -1,
    ZERO: 0,
    POSITIVE: 1
}

export const CURVE_TYPE = {
    LINE: 0,
    POLYLINE: 1,
    CIRCLE: 2
}

export const COLORS = {
    PATCH_COLORS: {
        default: [0.4, 1.0, 0.6, 1.0],
        selected: [0.0, 0.0, 0.8, 0.2],
    },
    CURVE_COLORS: {
        default: [0.0,0.0,0.0,1],
        selected: [1.0,0.0,0.0,1],
    },
    VERTEX_COLORS: {
        default: [0.0,0.0,0.0,1],
        selected: [1.0,0.0,0.0,1],
    }
}

export const MESH = {
    meshTypes: [
        {
            name: 'Bilinear Transfinite',
            value: 1
        },
        {
            name: 'Trilinear Transfinite',
            value: 2
        },
        {
            name: 'Quadrilateral Template',
            value: 3
        },
        {
            name: 'Quadrilateral Seam',
            value: 4
        },
        {
            name: 'Triangular Boundary Contraction',
            value: 5
        }
    ],
    shapeTypes: [
        {
            name: 'Triangular',
            value: 1
        },
        {
            name: 'Quadrilateral',
            value: 2
        }
    ],
    elemTypes: [
        {
            name: 'Linear',
            value: 1
        },
        {
            name: 'Quadratic',
            value: 2
        }
    ],
    diagTypes: [
        {
            name: 'Right',
            value: 1
        },
        {
            name: 'Left',
            value: 2
        },
        {
            name: 'Union Jack',
            value: 3
        },
        {
            name: 'Optimal',
            value: 4
        }
    ]
}

export const PI = 3.14159265359;
