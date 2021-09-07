 export default class Utils {
     static addPoints(pt_a, pt_b){
         return {x: pt_a.x + pt_b.x, y: pt_a.y + pt_b.y};
     }

     static subtractPoints(pt_a, pt_b){
        return {x: pt_a.x - pt_b.x, y: pt_a.y - pt_b.y};
    }

     static divideScalar(pt, scalar){
         return {x: pt.x / scalar, y: pt.y / scalar};
     }

     static multiplyScalar(pt, scalar){
        return {x: pt.x * scalar, y: pt.y * scalar};
    }

    static dotProd(v1, v2){
        return v1.x * v2.x + v1.y * v2.y;
    }

    static size(p){
        return Math.sqrt(Utils.sizeSquare(p));
    }

    static sizeSquare(p){
        return (p.x * p.x + p.y * p.y);
    }

    static distance(pt_a, pt_b){
        const diffX = pt_b.x - pt_a.x;
        const diffY = pt_b.y - pt_a.y;
        
        return (Math.sqrt((diffX ^ 2) + (diffY ^ 2)));
    }
 }