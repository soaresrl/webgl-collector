import { PI } from "../../Constants/Constants";
import line from "../../curves/line";
import Utils from "../../Utils/Utils";

export default class AttribSymbols {
    static getSymbol (attribute, scale, pt = null, seg = null, patch = null) {
        
        let symbol = {};
        let time = 'before';
        
        if(attribute.symbol == 'Support'){
            time = 'before';
            if ( pt ) {
               const { lines, triangles, squares, circles } = AttribSymbols.supportPoint(attribute, pt, scale);

               symbol = {
                   symbolLines: lines,
                   symbolTriangles: triangles,
                   symbolSquares: squares,
                   symbolCircles: circles
               }
            }
            else
            {
                const { symbolLines, symbolTriangles, symbolSquares, symbolCircles } = AttribSymbols.supportSegment(attribute, seg, scale);
                
                symbol = {
                    symbolLines,
                    symbolTriangles,
                    symbolSquares,
                    symbolCircles
                }
            }
        }
        else if( attribute.symbol == 'Arrow' ){
            if( attribute.type == 'Concentrated Load' ){
                time = 'after';
                if( pt ){
                    const { lines, triangles, circles } = AttribSymbols.arrowPointCL(attribute, pt, scale);

                    symbol = {
                        symbolLines: lines,
                        symbolTriangles: triangles,
                        symbolCircles: circles
                    }
                }
            }
            else if( attribute.type == 'Uniform Load' )
            {
                time = 'after';
                if( seg ){
                    const { symbolLines, symbolTriangles } = AttribSymbols.arrowSegmentUL(attribute, seg, scale);
                    
                    symbol = {
                        symbolLines,
                        symbolTriangles
                    }
                }
            }
        }
        else if( attribute.symbol == 'Nsbdvs' ){
            time = 'after';
            if( seg ){
                const { symbolPoints } = AttribSymbols.Nsbdvs(attribute, seg);

                symbol = {
                    symbolPoints
                }
            }
        }

        try {
            const color = attribute.properties.Color.map((item)=>item/255);

            symbol = {
                ...symbol,
                color
            }
        } catch (error){
            console.error(error);
        }

        return symbol;
    }

    static rotateCoord(point, angle){
        const pt = {...point};
        const x = (pt.x*(Math.cos(angle))) + (pt.y*(Math.sin(angle)));
        const y = (pt.y*(Math.cos(angle))) + (pt.x*(Math.sin(angle)));

        return {x, y}
    }

    static getAngWithXDirec(v2){
        const v1 = {x: 1, y: 0};
        
        let ang = Math.acos(Utils.dotProd(v1, v2) / (Utils.size(v1) * Utils.size(v2)));

        ang = ang * 180 / PI

        return ang
    }

    static triangleSymbol(pt, scale, angle){
        const ang = angle * PI / 180;

        const pt_x = AttribSymbols.rotateCoord({ x: 1 * scale, y: 0 }, ang);
        const pt_y = AttribSymbols.rotateCoord({ x: 0, y: 1 * scale }, ang);

        const pt_a = Utils.subtractPoints(pt, Utils.multiplyScalar(pt_x, 0.75));
        const pt_b = Utils.addPoints(pt_a, Utils.multiplyScalar(pt_y, 0.5));
        const pt_c = Utils.subtractPoints(pt_a, Utils.multiplyScalar(pt_y, 0.5));

        return [pt, pt_b, pt_c];
    }

    static squareSymbol(pt, scale, angle){
        const ang = angle * PI / 180;
        
        const pt_x = AttribSymbols.rotateCoord({ x: 1 * scale, y: 0 }, ang);
        const pt_y = AttribSymbols.rotateCoord({ x: 0, y: 1 * scale }, ang);

        const pt_a = Utils.addPoints(Utils.subtractPoints(pt, Utils.divideScalar(pt_x, 4)), Utils.divideScalar(pt_y, 4));
        const pt_b = Utils.addPoints(Utils.addPoints(pt, Utils.divideScalar(pt_x, 4)), Utils.divideScalar(pt_y, 4));
        const pt_c = Utils.subtractPoints(Utils.addPoints(pt, Utils.divideScalar(pt_x, 4)), Utils.divideScalar(pt_y, 4));
        const pt_d = Utils.subtractPoints(Utils.subtractPoints(pt, Utils.divideScalar(pt_x, 4)), Utils.divideScalar(pt_y, 4));

        return [pt_a, pt_b, pt_c, pt_d]
    }

    static circleSymbol(point, radius){
        const steps = 30;

        const { x, y } = point;

        const circlePoints = [...Array(steps).keys()].map((step) => {
            const theta = 2 * PI * step / steps;
            const pt = { x: x - radius * Math.cos(theta), y: y - radius * Math.sin(theta) };
            
            return pt;
        });

        return circlePoints
    }

    static arcCircleSymbol(point, radius){
        const steps = 30;

        const { x, y } = point;

        const arcPoints = [...Array(steps - 14).keys()].map((step) => {
            const theta = 2 * PI * step / steps;
            const pt = { x: x - radius * Math.cos(theta), y: y - radius * Math.sin(theta) };
            
            return pt;
        });

        return arcPoints;
    }

    static arrowSymbol(point, scale, angle){
        const ang = angle * PI / 180;

        const pt_x = AttribSymbols.rotateCoord({ x: 3 * scale, y: 0 }, ang);
        const pt_y = AttribSymbols.rotateCoord({ x: 0, y: 3 * scale }, ang);

        const pt = Utils.addPoints(point, Utils.multiplyScalar(pt_x, 0.1));
        const pt_a = Utils.addPoints(pt, Utils.multiplyScalar(pt_x, 0.1));
        const pt_b = Utils.addPoints(pt_a, Utils.multiplyScalar(pt_y, 0.1));
        const pt_c = Utils.subtractPoints(pt_a, Utils.multiplyScalar(pt_y, 0.1));
        const pt_d = Utils.addPoints(pt_a, pt_x);

        return {line: [pt, pt_d], triangle: [pt, pt_b, pt_c]}
    }

    static arrowPointCL(attribute, pt, scale){
        const lines = [];
        const triangles = [];
        const circles = [];

        const { properties } = attribute;

        if(properties['Fx'] != 0){
            if(properties['Fx'] < 0){
                const { line, triangle } = AttribSymbols.arrowSymbol(pt, scale, 0);
                
                lines.push(line);
                triangles.push(triangle);
            }
            else
            {
                const { line, triangle } = AttribSymbols.arrowSymbol(pt, scale, 180);

                lines.push(line);
                triangles.push(triangle);
            }
        }

        if(properties['Fy'] != 0){
            if(properties['Fy'] < 0){
                const { line, triangle } = AttribSymbols.arrowSymbol(pt, scale, 270);
                
                lines.push(line);
                triangles.push(triangle);
            }
            else
            {
                const { line, triangle } = AttribSymbols.arrowSymbol(pt, scale, 90);
                
                lines.push(line);
                triangles.push(triangle);
            }
        }

        if(properties['Mz'] != 0){
            if(properties['Mz'] < 0){
                const circle = AttribSymbols.arcCircleSymbol(pt, scale);
                const triangle = AttribSymbols.triangleSymbol(circle[0], scale * 0.5, 90);
                
                circles.push(circle);
                triangles.push(triangle);
            }
            else
            {
                const circle = AttribSymbols.arcCircleSymbol(pt, scale);
                const triangle = AttribSymbols.triangleSymbol(circle[circle.length], scale * 0.5, 90);
                
                circles.push(circle);
                triangles.push(triangle);
            }
        }

        return { lines, triangles, circles }
    }

    static arrowSegmentUL(attribute, seg, scale){
        const { properties } = attribute;

        let symbolLines = [];
        let symbolTriangles = [];
        const displac = { x: 0, y: 0 };
        const points = seg.getPoints();

        while(points.length >= 2){
            const auxLine = new line(points[0].x, points[0].y, points[1].x, points[1].y);
            let v, local = false;

            if(properties['Direction'][1] == 1){
                local = true;
                v = Utils.subtractPoints(points[1], points[0]);
            }

            if(properties['Qx'] != 0){
                if(properties['Qx'] > 0){
                    let angle = 180;
                    if(local){
                        angle = AttribSymbols.getAngWithXDirec(v);
                        
                        if(points[1].y < points[0].y){
                            angle += 180;
                        }
                        else
                        {
                            angle = -angle + 180;
                        }
                    }
                    const { lines, triangles } = AttribSymbols.arrowSegment(scale*0.45, displac, 0.2, 0.1, 0.9, auxLine, angle, true);

                    symbolLines.push(lines);
                    symbolTriangles.push(triangles);
                }
                else
                {
                    let angle = 0;
                    if(local){
                        angle = AttribSymbols.getAngWithXDirec(v);
                        if(!(points[1].y < points[0].y)) angle = - angle;
                    }
                    const { lines, triangles } = AttribSymbols.arrowSegment(scale*0.45, displac, 0.2, 0.1, 0.9, auxLine, angle, false);

                    symbolLines.push(lines);
                    symbolTriangles.push(triangles);
                }
            }

            if(properties['Qy'] != 0){
                if(properties['Qy'] > 0){
                    let angle = 270;
                    if(local){
                        angle = AttribSymbols.getAngWithXDirec(v);

                        if(points[1].y < points[0].y){
                            angle += 270;
                        }
                        else
                        {
                            angle = (-1) * angle + 270;
                        }
                    }
                    const { lines, triangles } = AttribSymbols.arrowSegment(scale*0.5, displac, 0.2, 0, 1, auxLine, angle, true);

                    symbolLines.push(lines);
                    symbolTriangles.push(triangles);
                }
                else
                {
                    let angle = 90;
                    if(local){
                        angle = AttribSymbols.getAngWithXDirec(v);
                        if(points[1].y < points[0].y){
                            angle += 90;
                        }
                        else
                        {
                            angle = (-1) * angle + 90;
                        }
                    }
                    const { lines, triangles } = AttribSymbols.arrowSegment(scale*0.5, displac, 0.2, 0, 1, auxLine, angle, false);

                    symbolLines.push(lines);
                    symbolTriangles.push(triangles);
                }
            }
            points.pop();
        }

        return { symbolLines: symbolLines.flat(), symbolTriangles: symbolTriangles.flat() };
    }

    static arrowSegment(scale, disp, step, init, end, seg, angle, orient){
        const lines = [];
        const triangles = [];
        let displac = disp;
        let iterator = init;

        if( !orient ){
            displac = Utils.multiplyScalar(disp, -1);
        }

        while (iterator <= end){
            let pt = seg.getPoint(iterator);
            pt = Utils.subtractPoints(pt, Utils.multiplyScalar(displac, 0.2));

            const { line, triangle } = AttribSymbols.arrowSymbol(pt, scale, angle);

            lines.push(line);
            triangles.push(triangle);

            iterator += step;
        }

        return { lines, triangles }
    }

    static supportPoint(attribute, point, scale){
        const { properties } = attribute;
        const pt_x = { x: 1 * scale, y: 0 };
        const pt_y = { x: 0, y: 1 * scale };

        const lines = [];
        const triangles = [];
        const squares = [];
        const circles = [];

        if(properties['Dx']){
            let pt = { ...point };
            let displac = { ...pt_x };
            let triangle = null;
            let pt_d = null;
            let pt_e = null;

            if(properties['Dx pos'][1] == 0){
                displac = Utils.multiplyScalar(displac, -1);

                if (properties['Rz']){
                    pt = Utils.addPoints(pt, Utils.divideScalar(displac, 4));
                }
                    
                triangle = AttribSymbols.triangleSymbol(pt, scale, 0); 
                pt_d = Utils.subtractPoints(triangle[1], Utils.multiplyScalar(pt_x, 0.1));
                pt_e = Utils.subtractPoints(triangle[2], Utils.multiplyScalar(pt_x, 0.1));

                lines.push([pt_d, pt_e]);
                triangles.push(triangle);
            }
            else
            {
                if(properties['Rz']){
                    pt = Utils.addPoints(pt, Utils.divideScalar(displac, 4));
                }

                triangle = AttribSymbols.triangleSymbol(pt, scale, 180)
                pt_d = Utils.addPoints(triangle[1], Utils.multiplyScalar(pt_x, 0.1));
                pt_e = Utils.addPoints(triangle[2], Utils.multiplyScalar(pt_x, 0.1));

                lines.push([pt_d, pt_e]);
                triangles.push(triangle);
            }

            if(properties['Dx value'] != 0){
                if(properties['Dx value'] < 0){
                    let pt_arrow = null;

                    if(displac.x < 0){
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                    Utils.multiplyScalar(displac, 2));
                    }
                    else
                    {
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                      Utils.divideScalar(displac, 4));
                    }

                    const {triangle: arrowTriangle , line} = AttribSymbols.arrowSymbol(pt_arrow, scale*0.5, 180);
                    
                    triangles.push(arrowTriangle);
                    lines.push(line);
                }
                else
                {
                    let pt_arrow = null;

                    if(displac.x < 0){
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                      Utils.divideScalar(displac, 4));
                    }
                    else
                    {
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                    Utils.multiplyScalar(displac, 2));
                    }

                    const {triangle: arrowTriangle, line} = AttribSymbols.arrowSymbol(pt_arrow, scale*0.5, 180);
                    
                    triangles.push(arrowTriangle);
                    lines.push(line);
                }
            }
        }

        if(properties['Dy']){
            let pt = { ...point };
            let displac = { ...pt_y };
            let triangle = null;
            let pt_d = null;
            let pt_e = null;

            if(properties['Dy pos'][1] == 0){
                displac = Utils.multiplyScalar(displac, -1);

                if(properties['Rz']) {
                    pt = Utils.addPoints(pt, Utils.divideScalar(displac, 4));
                }

                triangle = AttribSymbols.triangleSymbol(pt, scale, 90);
                pt_d = Utils.subtractPoints(triangle[1], Utils.multiplyScalar(pt_y, 0.1));
                pt_e = Utils.subtractPoints(triangle[2], Utils.multiplyScalar(pt_y, 0.1));
            
                lines.push([pt_d, pt_e]);
                triangles.push(triangle);
            }
            else
            {
                if(properties['Rz']) {
                    pt = Utils.addPoints(pt, Utils.divideScalar(displac, 4));
                }

                triangle = AttribSymbols.triangleSymbol(pt, scale, 270);
                pt_d = Utils.addPoints(triangle[1], Utils.multiplyScalar(pt_y, 0.1));
                pt_e = Utils.addPoints(triangle[2], Utils.multiplyScalar(pt_y, 0.1));
            
                lines.push([pt_d, pt_e]);
                triangles.push(triangle);
            }

            if(properties['Dy value'] != 0){
                if(properties['Dy value'] < 0){
                    let pt_arrow = null;

                    if(displac.y < 0){
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                    Utils.multiplyScalar(displac, 2));
                    }
                    else
                    {
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                      Utils.divideScalar(displac, 4));
                    }

                    const {triangle: arrowTriangle, line} = AttribSymbols.arrowSymbol(pt_arrow, scale*0.5, 270);
                    
                    triangles.push(arrowTriangle);
                    lines.push(line);
                }
                else
                {
                    let pt_arrow = null;

                    if(displac.y < 0){
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                    Utils.divideScalar(displac, 4));
                    }
                    else
                    {
                        pt_arrow = Utils.addPoints(Utils.divideScalar(Utils.addPoints(pt_d, pt_e), 2), 
                                                                      Utils.multiplyScalar(displac, 2));
                    }

                    const {triangle: arrowTriangle, line} = AttribSymbols.arrowSymbol(pt_arrow, scale*0.5, 270);
                    
                    triangles.push(arrowTriangle);
                    lines.push(line);
                }
            }
        }

        if(properties['Rz']){
            const square = AttribSymbols.squareSymbol(point, scale, 0);
            squares.push(square);

            if(properties['Rz value'] != 0){
                if(properties['Rz value'] < 0){
                    const circle = AttribSymbols.arcCircleSymbol(point, scale*1.4);
                    const triangle = AttribSymbols.triangleSymbol(circle[0], scale*0.5, 90);

                    circles.push(circle);
                    triangles.push(triangle);
                }
                else
                {
                    const circle = AttribSymbols.arcCircleSymbol(point, scale*1.4);
                    const triangle = AttribSymbols.triangleSymbol(circle[circle.length - 1], scale*0.5, 90);
                    
                    circles.push(circle);
                    triangles.push(triangle);
                }
            }
        }

        return { lines, triangles, squares, circles }
    }

    static supportSegment(attribute, seg, scale){
        let symbolLines = [];
        let symbolTriangles = [];
        let symbolSquares = [];
        let symbolCircles = [];

        let points = seg.getPoints();

        for( const segmentAttribute of seg.attributes ){
            if( segmentAttribute.type == 'Number of Subdivisions'){
                const { symbolPoints } = AttribSymbols.Nsbdvs(segmentAttribute, seg);
                points = symbolPoints;
                
                break;
            }
        }

        for( const point of points){
            const { lines, triangles, squares, circles } = AttribSymbols.supportPoint(attribute, point, scale);

            
            symbolLines = [...symbolLines, ...lines];
            symbolTriangles = [...symbolTriangles, ...triangles];
            symbolSquares = [...symbolSquares, ...squares];
            symbolCircles = [...symbolCircles, ...circles];
        }

        return { symbolLines, symbolTriangles, symbolSquares, symbolCircles }
    }

    static Nsbdvs(attribute, seg){
        const symbolPoints = [];
        const { properties } = attribute;
        const numberOfSubdivisions = properties['Number Subdv'];

        if(numberOfSubdivisions == 0){
            return { symbolPoints };
        }

        for(let pointNumber = 1; pointNumber <= numberOfSubdivisions - 1 ; pointNumber++){
            const point = seg.getPoint(pointNumber / numberOfSubdivisions);

            symbolPoints.push(point);
        }

        return { symbolPoints }
    }
}