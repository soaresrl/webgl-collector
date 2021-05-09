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
        selected: [0.6, 1.0, 0.4, 1.0],
    },
    CURVE_COLORS: {
        default: [0.20,0.33,0.45,1],
        selected: [1.0,0.0,0.0,1],
    }
}