import React, { Component } from 'react'
import curveCollector from '../../curves/curveCollector';
import Grid from '../../grid/grid';
import GLUtils from '../../Utils/GLUtils';
import {COLORS} from '../../Constants/Constants'
import './Canvas.css'
import AttribSymbols from '../../business/attributes/attribsymbols';
import Utils from '../../Utils/Utils';

export default class Canvas extends Component {
   
    constructor(props){

        super(props);

        // Set react component initial state
        this.state = {
            viewGrid: false,
            is_SnapOn: false
        }

        // Set app data structure
        //this.model = new model();
        this.collector = new curveCollector();
        this.grid = new Grid();

        this.triangs = [];

        // Set viewport dimensions for orthographic projection
        this.left = -5.0;
        this.right = 5.0;
        this.top = 5.0;
        this.bottom = -5.0;

        this.mouseMoveTol = 1;
        this.pickTolFac = 0.01;

    }

    componentDidMount(){

        const canvas = document.getElementById("canvas");
        
        this.width = canvas.clientWidth;
        this.height =  canvas.clientHeight;

        // Get A WebGL context
        this.gl = canvas.getContext("webgl");
        if (!this.gl) {
            console.log('no WebGl for you');
            return; 
        }

        // Setup GLSL program
        this.program = GLUtils.createProgram(this.gl);
        this.gl.useProgram(this.program);

        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
        this.projectionLocation = this.gl.getUniformLocation(this.program, 'u_projection');
        this.pointSizeLocation = this.gl.getUniformLocation(this.program, 'u_pointSize');

        this.resizeGL();

        this.paint();

        window.addEventListener('resize', this.resizeGL.bind(this));
        canvas.addEventListener('contextmenu', (e)=>{e.preventDefault()});
    }

    componentDidUpdate(){
        this.paint()
    }

    glOrtho(left, right, bottom, top, near, far){
        
        let matrix =[
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,
       
            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
          ];

        // Set the matrix.
        this.gl.uniformMatrix4fv(this.projectionLocation, false, new Float32Array(matrix));
    }
    
    getPosition (e) {
        if(e.touches){
            const dx = this.right - this.left;
            const dy = this.top - this.bottom;

            const mX = (e.touches[0].clientX - e.target.offsetLeft) *dx/this.width;  
            const mY = (this.height - (e.touches[0].clientY - e.target.offsetTop)) *dy/this.height;

            const x = this.left + mX;
            const y = this.bottom + mY;

            return {x, y}
        }

        const dx = this.right - this.left; 
        const dy = this.top - this.bottom; 

        const mX = (e.clientX - e.target.offsetLeft) *dx/this.width;  
        const mY = (this.height - (e.clientY - e.target.offsetTop)) *dy/this.height;

        const x = this.left + mX;
        const y = this.bottom + mY;

        return {x, y}
    }

    delSelectedEntities(){
        if (this.props.model !== null && !this.props.model.isEmpty()) {
            this.props.model.delSelectedCurves();
            this.paint();
        }
    }

    makeDisplayCurves(){
        const curves = this.props.model.getCurves();
        curves.forEach(curve => {
            const pts = curve.getPointsToDraw();
            const { attributes } = curve;
            const pCoords = [];

            // If curve is selected draw it in red, else draw it in blue
            if (curve.isSelected()) {
                this.gl.uniform4fv(this.colorLocation, COLORS.CURVE_COLORS.selected);
            }
            else
            {
                this.gl.uniform4fv(this.colorLocation, COLORS.CURVE_COLORS.default);
            }

            // Stores the vertices of the curve to pass to the buffer
            for (let i = 0; i < pts.length; i++) {
                pCoords.push(pts[i].x);
                pCoords.push(pts[i].y);
                pCoords.push(0.0);
            }

            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pCoords), this.gl.STATIC_DRAW);
    
            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
    
            this.gl.drawArrays(this.gl.LINES, 0, pCoords.length/3);

            attributes?.forEach(attribute => {
                let scale;

                if(this.width > this.height){
                    scale = (this.right - this.left) * 25 / this.width;
                }
                else
                {
                    scale = (this.top - this.bottom) * 25 / this.height;
                }

                this.makeDisplayAttributeSymbol(attribute, scale, 'segment', curve)
            })

        });
    } 

    makeDisplayVertices(){
        const { vertices } = this.props.model

        vertices.forEach((vertex)=>{
            const { points, attributes } = vertex;
            
            if (vertex.selected) {
                this.gl.uniform4fv(this.colorLocation, COLORS.VERTEX_COLORS.selected);
            }
            else
            {
                this.gl.uniform4fv(this.colorLocation, COLORS.VERTEX_COLORS.default);
            }

            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.uniform1f(this.pointSizeLocation, 5.0);

            this.gl.drawArrays(this.gl.POINTS, 0, points.length/2);

            attributes?.forEach(attribute => {
                let scale;

                if(this.width > this.height){
                    scale = (this.right - this.left) * 25 / this.width;
                }
                else
                {
                    scale = (this.top - this.bottom) * 25 / this.height;
                }

                const pt = { x: points[0], y: points[1] };

                this.makeDisplayAttributeSymbol(attribute, scale, 'point', pt);
            })
        });
    }

    makeDisplayPatches(){

        Promise.all(this.props.model.patches.map((patch)=>{
            const pts = patch.pts;
            const triangles = patch.triangles;
            let pCoords = []

            if (patch.selected) {
                this.gl.uniform4fv(this.colorLocation, COLORS.PATCH_COLORS.selected);
            }
            else if(patch.isDeleted){
                this.gl.uniform4fv(this.colorLocation, [0.1, 0.1, 0.1, 1])
            }
            else {
                this.gl.uniform4fv(this.colorLocation, COLORS.PATCH_COLORS.default)
            }

            for (let j = 0; j < triangles.length; j++) {
                pCoords.push(pts[triangles[j][0]].x);
                pCoords.push(pts[triangles[j][0]].y);
                pCoords.push(0.0);
                pCoords.push(pts[triangles[j][1]].x);
                pCoords.push(pts[triangles[j][1]].y);
                pCoords.push(0.0);
                pCoords.push(pts[triangles[j][2]].x);
                pCoords.push(pts[triangles[j][2]].y);
                pCoords.push(0.0);
            }

            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pCoords), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, pCoords.length/3);
        }));

    }

    makeDisplayAttributeSymbol(attribute, scale, type, entity){
        switch (type) {
            case 'point':
                {
                    const { symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color } = AttribSymbols.getSymbol(attribute, scale, entity, null, null);
                    this.drawSymbols(symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color);
                }
                break;
            case 'segment':
                {
                    const { symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color } = AttribSymbols.getSymbol(attribute, scale, null, entity, null);
                    this.drawSymbols(symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color);
                }
                break;

            case 'patch':
                {
                    const { symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color } = AttribSymbols.getSymbol(attribute, scale, null, null, entity);
                    this.drawSymbols(symbolLines, symbolTriangles, symbolSquares, symbolCircles, symbolPoints, color);
                }
            break;
        
            default:
                break;
        }
    }

    drawLines(lines, color){
        let lineCoords = [];
        
        lines.forEach(line => {
            
            lineCoords.push(
                line[0].x,
                line[0].y,
                0.0,
                line[1].x,
                line[1].y,
                0.0
        )});

        this.gl.uniform4fv(this.colorLocation, [...color, 1.0]);

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(lineCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.LINES, 0, lineCoords.length / 3);
    }

    drawTriangles(triangles, color){
        let trianglesCoords = []

        triangles.forEach(triangle => {
            trianglesCoords.push(
                triangle[0].x,
                triangle[0].y,
                0.0,
                triangle[1].x,
                triangle[1].y,
                0.0,
                triangle[2].x,
                triangle[2].y,
                0.0
            )
        })

        this.gl.uniform4fv(this.colorLocation, [...color, 1.0]);

        const trianglesPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglesPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(trianglesCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, trianglesCoords.length / 3);
    }

    drawSquares(squares, color){
        let squaresCoords = []

        squares.forEach(square => {
            squaresCoords.push(
                square[0].x,
                square[0].y,
                0.0,
                square[1].x,
                square[1].y,
                0.0,
                square[2].x,
                square[2].y,
                0.0,
                square[3].x,
                square[3].y,
                0.0,
                square[0].x,
                square[0].y,
                0.0,
                square[2].x,
                square[2].y,
                0.0,
            )
        })

        this.gl.uniform4fv(this.colorLocation, [...color, 1.0]);

        const squaresPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, squaresPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(squaresCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, squaresCoords.length / 2);
    }

    drawCircles(circles, color){
        let circleCoords = [];

        circles.forEach(circle => {
            let circleStrip = circle.map(( point ) => {
                return [point.x, point.y, 0.0]
            }).flat();

            circleCoords.push(circleStrip);

        });
        
        circleCoords = circleCoords.flat();

        this.gl.uniform4fv(this.colorLocation, [...color, 1.0]);

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(circleCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.LINES, 0, circleCoords.length / 3);
    }

    drawPoints(points, color){
        const verticesBuffer = points.map((point) => [point.x, point.y, 0.0]).flat();

        this.gl.uniform4fv(this.colorLocation, [...color, 1.0]);
        
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verticesBuffer), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform1f(this.pointSizeLocation, 2.0);

        this.gl.drawArrays(this.gl.POINTS, 0, verticesBuffer.length / 3);
    }

    drawSymbols(lines, triangles, squares, circles, points, color){
        lines && this.drawLines(lines, color);
        triangles && this.drawTriangles(triangles, color);
        squares && this.drawSquares(squares, color);
        circles && this.drawCircles(circles, color);
        points && this.drawPoints(points, color);
   }

    drawCollectedCurve(){
        if ((!this.collector.isActive()) || (!this.collector.isCollecting())) {
            return;
        }

        const pts = this.collector.getDrawPoints();
        const pCoords = [];

        for (let i = 0; i < pts.length; i++) {
           
            pCoords.push(pts[i].x);
            pCoords.push(pts[i].y);
            pCoords.push(0.0);
            
        }

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(this.colorLocation, [1.0,0.0,0.0,1]);

        this.gl.drawArrays(this.gl.LINES, 0, pCoords.length/3);
    }

    drawSelectionFence(){
        if (!this.buttonPressed) return;
        if(this.props.mouseAction !== 'SELECTION') return;
        if ((this.pt0.x === this.pt1.x) && (this.pt0.y === this.pt1.y) ) return;
        if ((this.props.model === null) || this.props.model.isEmpty() ) return;
        if(this.mouseButton == 1) return;

        const pCoords = [
            this.pt0W.x, this.pt0W.y,
            this.pt1W.x, this.pt0W.y,
            this.pt1W.x, this.pt1W.y,
            this.pt0W.x, this.pt1W.y,
            this.pt0W.x, this.pt0W.y,
        ]

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pCoords), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(this.colorLocation, [0,1,0,1]);

        this.gl.drawArrays(this.gl.LINE_STRIP, 0, 5);

    }

    makeDisplayGrid(){
        let vertices = [];
        const oX = 0.0, oY = 0.0;
        let x = this.left;
        let y = this.bottom;

        const {gridX, gridY} = this.grid.getGridSpace();
        x = oX - (parseInt((oX - this.left)/gridX) * gridX) - gridX;

        while (x <= this.right) {
            y = oY - (parseInt((oY - this.bottom)/gridY) * gridY) - gridY;
            while (y <= this.top ) {
                
                vertices.push(x);
                vertices.push(y);
                vertices.push(0.0)

                y += gridY;
            
            }
            
            x += gridX;
        }

        // Draw grid points
        const ptsPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, ptsPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(this.colorLocation, [0,0,0,0]);
        this.gl.uniform1f(this.pointSizeLocation, 1.0);
        this.gl.drawArrays(this.gl.POINTS, 0, vertices.length/3);

        // Draw grid center lines
        const linePositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, linePositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-0.25, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, -0.25, 0.0, 0.0, 0.25, 0.0]), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(this.colorLocation, [0,0,0,0]);

        this.gl.drawArrays(this.gl.LINES, 0, 4);
    } 

    scaleWorldWindow(scaleFac){
        let vpr, cx, cy, sizex, sizey;

        // Compute canvas viewport ratio
        vpr = this.height / this.width;

        // Get current window center
        cx = (this.left + this.right) / 2;
        cy = (this.bottom + this.top) / 2;

        // Set new window sizes based on scaling factor
        sizex = (this.right - this.left) * scaleFac;
        sizey = (this.top - this.bottom) * scaleFac;

        // Adjust window to keep the same aspect ratio of the viewport.
        if (sizey / sizex > vpr){
            sizex = sizey / vpr;
        }
        else if (sizey / sizex < vpr)
        {
            sizey = sizex*vpr;
        }

        this.right = cx + (sizex / 2);
        this.left = cx - (sizex / 2);
        this.top = cy + (sizey / 2);
        this.bottom = cy - (sizey / 2);

        this.glOrtho(this.left, this.right, this.bottom, this.top, -1, 1);
    }

    resizeGL(){
        const canvas = document.getElementById('canvas');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.width = this.gl.canvas.width;
        this.height = this.gl.canvas.height;
        this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);

        this.scaleWorldWindow(1.0);

        this.paint();
    }

    onMouseDown(e){
        e.preventDefault();

        this.buttonPressed = true;
        this.mouseButton = e.button;

        this.pt0 = {x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop};
        this.pt0W = this.getPosition(e);

        switch (this.props.mouseAction) {
            case 'SELECTION':
                
                break;
            case 'COLLECTION':
                if (!this.collector.isActive()) {
                    
                    // In case of left mouse button click start collecting
                    if(this.mouseButton === 0){    
                        this.collector.startCurveCollection();
                    }
                }
                break;
            default:
                break;
        }
    }

    onMouseUp(e){
        e.preventDefault();
        this.buttonPressed = false;
        this.pt1 = {x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop}
        this.pt1W = this.getPosition(e);

        if(this.mouseButton == 1) return; // Just panning nothing else to do

        switch (this.props.mouseAction) {
            case 'SELECTION':
                if (this.mouseButton === 0) {
                    if (this.props.model != null && !(this.props.model.isEmpty())) {
                        if ((Math.abs(this.pt0.x - this.pt1.x) <= this.mouseMoveTol) && 
                        (Math.abs(this.pt0.y - this.pt1.y) <= this.mouseMoveTol)) {
                            
                            const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                            (this.top - this.bottom));

                            const tol = max_size*this.pickTolFac;
                            
                            this.props.Api.selectPick(this.pt1W.x, this.pt1W.y, tol);
                        }
                        else
                        {
                            const xmin = (this.pt0W.x < this.pt1W.x) ? this.pt0W.x : this.pt1W.x;
                            const xmax = (this.pt0W.x > this.pt1W.x) ? this.pt0W.x : this.pt1W.x;
                            const ymin = (this.pt0W.y < this.pt1W.y) ? this.pt0W.y : this.pt1W.y;
                            const ymax = (this.pt0W.y > this.pt1W.y) ? this.pt0W.y : this.pt1W.y;

                            this.props.model.selectFence(xmin, xmax, ymin, ymax); 
                            this.props.Api.selectFence(xmin, xmax, ymin, ymax); // TODO: FIX
                        }
                    }
                    this.paint();
                }
                break;
            case 'COLLECTION':
                if (this.mouseButton === 0) {
                    if ((Math.abs(this.pt0.x - this.pt1.x) < this.mouseMoveTol) && 
                    (Math.abs(this.pt0.y - this.pt1.y) < this.mouseMoveTol)) {
                        const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                        (this.top - this.bottom));
                        const tol = max_size*this.pickTolFac;

                        if (this.state.is_SnapOn) {
                            let pos = {x: this.pt1W.x, y: this.pt1W.y};
                            this.grid.snapTo(pos);
                            this.pt1W.x = pos.x;
                            this.pt1W.y = pos.y;
                        }

                        if (this.props.model && !this.props.model.isEmpty()) {
                            let pos = {x: this.pt1W.x, y: this.pt1W.y};
                            this.props.model.snapToCurve(pos, tol);
                            this.pt1W.x = pos.x;
                            this.pt1W.y = pos.y;
                        }
                        this.collector.insertPoint(this.pt1W.x, this.pt1W.y, tol);
                    }
                }

                let endCollection = false;
                if (this.mouseButton === 0) {
                    if (!this.collector.isUnlimited()) {
                        if (this.collector.hasFinished()) {
                            endCollection = true;
                        }
                    }
                }
                else if (this.mouseButton === 2) 
                {
                    if (this.collector.isUnlimited()) {
                        if (this.collector.hasFinished()) {
                            endCollection=true;
                        }
                        else
                        {
                            this.collector.reset();
                            this.paint();
                        }
                    }
                    else
                    {
                        this.collector.reset();
                        this.paint();
                    }
                }

                if (endCollection) {
                    const curve = this.collector.getCollectedCurve();
                    this.props.model.insertCurve(curve);
                    this.collector.endCurveCollection();
                    this.paint();
                    this.props.Api.insertCurve(curve);
                }
                break;
        
            default:
                break;
        }
        
    }
    
    onMouseMove(e){
        e.preventDefault();

        this.pt1 = {x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop};
        this.pt1W = this.getPosition(e);

        if(this.buttonPressed && this.mouseButton == 1){
            const {x, y} = Utils.subtractPoints(this.pt1W, this.pt0W);
            const deslocX = (x + this.right -this.left) / (this.right - this.left);
            const deslocY = (y + this.top -this.bottom) / (this.top - this.bottom);
            this.panWorldWindow(deslocX, deslocY);
            this.paint();

            return;
        }

        switch (this.props.mouseAction) {
            case 'SELECTION':
                if (this.mouseButton === 0 && this.buttonPressed) {
                    this.paint();
                }
                break;
            case 'COLLECTION':
               if (this.mouseButton === 0 && (!this.buttonPressed)) {
                   if ((Math.abs(this.pt0.x - this.pt1.x) > this.mouseMoveTol) && 
                   (Math.abs(this.pt0.y - this.pt1.y) > this.mouseMoveTol)) {
                       if (this.collector.isCollecting()) {
                            if (this.state.is_SnapOn) {
                            let pos = {x: this.pt1W.x, y: this.pt1W.y};
                            this.grid.snapTo(pos);
                            this.pt1W.x = pos.x;
                            this.pt1W.y = pos.y;
                           }

                            if (this.props.model && !this.props.model.isEmpty()) {
                                const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                                                    (this.top - this.bottom));
                                const tol = max_size*this.pickTolFac;

                                let pos = {x: this.pt1W.x, y: this.pt1W.y};
                                this.props.model.snapToCurve(pos, tol);
                                this.pt1W.x = pos.x;
                                this.pt1W.y = pos.y;
                            }
                            this.collector.addTempPoint(this.pt1W.x, this.pt1W.y);
                            this.paint();
                       }
                   }
               }
            default:
                break;
        }
    }

    onTouchStart(e){
        this.buttonPressed = true;

        this.pt0 = {x: e.touches[0].clientX - e.target.offsetLeft, y: e.touches[0].clientY - e.target.offsetTop};
        this.pt0W = this.getPosition(e);
        switch (this.props.mouseAction) {
            case 'SELECTION':
                
                break;
            case 'COLLECTION':
                if (!this.collector.isActive()) {
                    this.collector.startCurveCollection();
                }

                const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                                (this.top - this.bottom));
                const tol = max_size*this.pickTolFac;

                if (this.state.is_SnapOn) {
                    let pos = {x: this.pt0W.x, y: this.pt0W.y};
                    this.grid.snapTo(pos);
                    this.pt0W.x = pos.x;
                    this.pt0W.y = pos.y;
                }

                if (this.props.model && !this.props.model.isEmpty()) {
                    let pos = {x: this.pt0W.x, y: this.pt0W.y};
                    this.props.model.snapToCurve(pos, tol);
                    this.pt0W.x = pos.x;
                    this.pt0W.y = pos.y;
                }
                this.collector.insertPoint(this.pt0W.x, this.pt0W.y, tol);
                break;
            case 'PAN':
            
            break;
            default:
                break;
        }
    }

    onTouchEnd(e){
        this.buttonPressed = false;
        switch (this.props.mouseAction) {
            case 'SELECTION':
                if (this.mouseButton === 0) {
                    if (this.props.model != null && !(this.props.model.isEmpty())) {
                        if ((Math.abs(this.pt0.x - this.pt1.x) <= this.mouseMoveTol) && 
                        (Math.abs(this.pt0.y - this.pt1.y) <= this.mouseMoveTol)) {
                            
                            const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                            (this.top - this.bottom));

                            const tol = max_size*this.pickTolFac;
                            this.props.model.selectPick(this.pt1W.x, this.pt1W.y, tol);
                            this.props.Api.selectPick(this.pt1W.x, this.pt1W.y, tol);
                        }
                        else
                        {
                            const xmin = (this.pt0W.x < this.pt1W.x) ? this.pt0W.x : this.pt1W.x;
                            const xmax = (this.pt0W.x > this.pt1W.x) ? this.pt0W.x : this.pt1W.x;
                            const ymin = (this.pt0W.y < this.pt1W.y) ? this.pt0W.y : this.pt1W.y;
                            const ymax = (this.pt0W.y > this.pt1W.y) ? this.pt0W.y : this.pt1W.y;
                            //this.socket.emit('select-fence', xmin, xmax, ymin, ymax);
                            this.props.model.selectFence(xmin, xmax, ymin, ymax);
                            this.props.Api.selectFence(xmin, xmax, ymin, ymax);
                        }
                    }
                    this.paint();
                }
                break;
            case 'COLLECTION':
                const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                (this.top - this.bottom));
                const tol = max_size*this.pickTolFac;

                if (this.state.is_SnapOn) {
                    let pos = {x: this.pt1W.x, y: this.pt1W.y};
                    this.grid.snapTo(pos);
                    this.pt1W.x = pos.x;
                    this.pt1W.y = pos.y;
                }

                if (this.props.model && !this.props.model.isEmpty()) {
                    let pos = {x: this.pt1W.x, y: this.pt1W.y};
                    this.props.model.snapToCurve(pos, tol);
                    this.pt1W.x = pos.x;
                    this.pt1W.y = pos.y;
                }
                this.collector.insertPoint(this.pt1W.x, this.pt1W.y, tol);

                let endCollection = false;
                if (!this.collector.isUnlimited()) {
                    if (this.collector.hasFinished()) {
                        endCollection = true;
                    }
                }

                if (endCollection) {
                    const curve = this.collector.getCollectedCurve();
                    this.props.model.insertCurve(curve);
                    this.collector.endCurveCollection();
                    this.paint();
                    this.props.Api.insertCurve(curve);
                }
                break;
        
            default:
                break;
        }
        
    }
    
    onTouchMove(e){
        this.pt1 = {x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop};
        this.pt1W = this.getPosition(e);
        switch (this.props.mouseAction) {
            case 'SELECTION':
                if (this.mouseButton === 0 && this.buttonPressed) {
                    this.paint();
                }
                break;
            case 'COLLECTION':
                if (this.collector.isCollecting()) {
                    if (this.state.is_SnapOn) {
                        let pos = {x: this.pt1W.x, y: this.pt1W.y};
                        this.grid.snapTo(pos);
                        this.pt1W.x = pos.x;
                        this.pt1W.y = pos.y;
                    }

                    if (this.props.model && !this.props.model.isEmpty()) {
                        const max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                                            (this.top - this.bottom));
                        const tol = max_size*this.pickTolFac;

                        let pos = {x: this.pt1W.x, y: this.pt1W.y};
                        this.props.model.snapToCurve(pos, tol);
                        this.pt1W.x = pos.x;
                        this.pt1W.y = pos.y;
                    }
                    this.collector.addTempPoint(this.pt1W.x, this.pt1W.y);
                    this.paint();
                }
            case 'PAN':
            
            break;
            default:
                break;
        }
    }

    onWheel(event){
        if(event.deltaY > 0){
            this.scaleWorldWindow(event.deltaY / 105);
        }
        else
        {
            this.scaleWorldWindow((-1) * event.deltaY * 1.05 / 100);
        }
        this.paint();
    }

    panWorldWindow(panFacX, panFacY){
        let deslocX, deslocY;
        const panX = (this.right - this.left) * panFacX;
        const panY = (this.top - this.bottom) * panFacY;

        deslocX = panX - (this.right - this.left);
        deslocY = panY - (this.top - this.bottom);

        this.right = this.right - deslocX;
        this.left = this.left - deslocX;

        this.top = this.top - deslocY;
        this.bottom = this.bottom - deslocY;

        this.glOrtho(this.left, this.right, this.bottom, this.top, -1, 1);
    }

    fitWorldToViewport(){
        if (!this.props.model.isEmpty()) {
            let bbox = {};
            this.props.model.getBoundingBox(bbox);

            this.left = bbox.xmin;
            this.right = bbox.xmax;
            this.top = bbox.ymax;
            this.bottom = bbox.ymin;

            this.scaleWorldWindow(1.1);

            this.paint();
        }
    }

    paint(){    

        this.gl.clearColor(0.1, 0.1, 0.1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.makeDisplayPatches();
        this.makeDisplayCurves();
        this.makeDisplayVertices();
        /* this.makeDisplayAttributes(); */
        this.state.viewGrid && this.makeDisplayGrid();
        this.drawCollectedCurve();
        this.drawSelectionFence();
    }

    render(){
        return <canvas 
                    className='canvas' 
                    id='canvas' 
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    onWheel={this.onWheel.bind(this)}
                >
                </canvas>
    }
}