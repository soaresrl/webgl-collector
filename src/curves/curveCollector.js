import { CURVE_TYPE } from '../Constants/Constants'
import line from '../curves/line'

class curveCollector {
    constructor(){
        this.curve = null;
        this.prevPt = {x: 0.0, y: 0.0};
        this.tempPt = {x: 0.0, y: 0.0};
        this.curveType = CURVE_TYPE.LINE;
    }

    setCurveType(type){
        if (this.curveType === type ) {
            return
        }
        switch (type) {
            case CURVE_TYPE.LINE:
                this.curveType = CURVE_TYPE.LINE;
                break;
            case CURVE_TYPE.POLYLINE:
                this.curveType = CURVE_TYPE.POLYLINE;
                break;
            case CURVE_TYPE.CIRCLE:
                this.curveType = CURVE_TYPE.CIRCLE;
                break;
        }
    }

    getCurveType(){
        return this.curveType;
    }

    startCurveCollection(){
        if (this.curve != null ) {
            delete this.curve;
        }
        switch (this.curveType) {
            case CURVE_TYPE.LINE:
                this.curve = new line();
                break;
            //TODO: create new curve classes for polyline and circle
            case CURVE_TYPE.POLYLINE:
                this.curve = new line();
                break;
            case CURVE_TYPE.CIRCLE:
                this.curve = new line();
                break;
        }
    }

    endCurveCollection(){
        this.curve = null;
    }

    isActive(){
        if(this.curve != null){
            return true;
        }
        return false;
    }

    isCollecting(){
        if (this.curve != null) {
            if (this.curve.getNumberOfPoints() > 0) {
                return true;
            }
        }
        return false;
    }

    getCollectedCurve(){
        return this.curve;
    }

    hasFinished(){
        if (this.curve != null) {
            if (this.curve.isPossible()) {
                return true;
            }
        }

        return false;
    }

    isUnlimited(){
        if (this.curve != null) {
            if (this.curve.isUnlimited()) {
                return true;
            }
        }

        return false;
    }

    insertPoint(x, y, tol){
        if (this.isCollecting()) {
            if (Math.abs(x - this.prevPt.x) <= tol && Math.abs(y - this.prevPt.y) <= tol) {
                return 0;
            }
        }
        this.curve.addPoint(x,y);
        this.prevPt.x = x;
        this.prevPt.y = y;
        return 1;
    }

    addTempPoint(x, y){
        this.tempPt.x = x;
        this.tempPt.y = y;

        return 1;
    }

    getDrawPoints(){
        let pts = this.curve.getPointsToDraw(this.tempPt);
        return pts;
    }

    getPoints(){
        let pts = this.curve.getPoints();
        return pts;
    }

    getBoundBox(bbox){
        if (this.curve != null) {
            return;
        }
        this.curve.getBoundBox(bbox);
    }
    
    reset(){
        if (this.curve != null) {
            delete this.curve;
        }
        this.curve = null;
    }

    kill(){
        if (this.curve != null) {
            delete this.curve;
        }
        delete this;
    }
}

export default curveCollector;