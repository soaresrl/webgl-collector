import { ConsoleSqlOutlined, VerifiedOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import curveCollector from '../../curves/curveCollector';
import Grid from '../../grid/grid';
import model from '../../model/model';
import GLUtils from '../../Utils/GLUtils';
import Mouse from '../../Utils/Mouse';
import './Canvas.css'

export default class Canvas extends Component {
   
    constructor(){
        super();
        this.state = {
            curves: [],
            mouseAction: null
        }
        this.model = new model();
        this.collector = new curveCollector();
        this.grid = new Grid();

        this.left = -5;
        this.right = 5;
        this.top = 5;
        this.bottom = -5;

    }

    componentDidMount(){

        // Get A WebGL context
        const canvas = document.getElementById("canvas");
        
        this.width = canvas.clientWidth;
        this.height =  canvas.clientHeight;

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

        this.resizeGL();
        /* 
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT); */

        this.paint();
        //this.makeDisplayGrid();

        /* this.gl.uniform4fv(this.colorLocation, new Float32Array([1,0,0,1]));

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 0.0, 0.5, 0.5, 0.0]), this.gl.STATIC_DRAW);

        this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionLocation);

        this.gl.drawArrays(this.gl.LINES, 0, 2); */
        window.addEventListener('resize', this.resizeGL.bind(this));
    }

    glOrtho(left, right, bottom, top, near, far){
        
        let matrix = [
            2.0 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2.0 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2.0 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1,
        ];

        // Set the matrix.
        this.gl.uniformMatrix4fv(this.projectionLocation, false, new Float32Array(matrix));
    }

    getPosition (e) {
        const dx = this.right - this.left; //12
        const dy = this.top - this.bottom; //12

        const mX = (e.clientX - e.target.offsetLeft) *dx/this.width;  
        const mY = (this.height - (e.clientY - e.target.offsetTop)) *dy/this.height;

        const x = this.left + mX;
        const y = this.bottom + mY;

        return {x, y}
    }

    makeDisplayCurves(){
        const curves = this.model.getCurves();
        curves.forEach(curve => {
            const pts = curve.getPointsToDraw();
            const pCoords = [];

            // If curve is selected draw it in red, else draw it in blue
            if (curve.isSelected()) {
                this.gl.uniform4fv(this.colorLocation, [1,0,0,0]);
            }
            else
            {
                this.gl.uniform4fv(this.colorLocation, [0,0,1,0]);
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
    
            this.gl.uniform4fv(this.colorLocation, [0,0,0,0]);
    
            this.gl.drawArrays(this.gl.LINES, 0, pCoords.length/3)

        });
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
    }

    resizeGL(){
        const canvas = document.getElementById('canvas');
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);

        this.scaleWorldWindow(1.0);
        
        this.glOrtho(this.left, this.right, this.bottom, this.top, -1, 1);

        this.paint();
    }

    onMouseDown(e){
        e.preventDefault();

        this.buttonPressed = true;
        this.mouseButton = e.button;

        this.pt0 = Mouse.getPosition(e);
        this.vertices = [this.pt0.x, this.pt0.y];
        /* switch (this.state.MouseAction) {
            case 'SELECTION':
                
                break;
            case 'COLLECTION':
                if (!this.collector.isActive()) {
                    this.collector.startCurveCollection();
                }
                break;
            case 'PAN':
            
            break;
            default:
                break;
        } */
       this.paint();
    }

    onMouseUp(e){
        e.preventDefault();
        const m_pos = Mouse.getPosition(e);

        this.buttonPressed = false;
        this.pt0 = Mouse.getPosition(e);

        /* switch (this.state.mouseAction) {
            case 'SELECTION':
                if (this.mouseButton === 0) {
                    if (this.model != null && !(this.model.isEmpty())) {
                        if ((Math.abs(this.pt0.x - this.pt1.x) <= this.mouseMoveTol) && 
                        (Math.abs(this.pt0.y - this.pt1.y) <= this.mouseMoveTol)) {

                        }
                        else
                        {
                            var xmin = (this.pt0.x < this.pt1.x) ? this.pt0.x : this.pt1.x;
                            var xmax = (this.pt0.x > this.pt1.x) ? this.pt0.x : this.pt1.x;
                            var ymin = (this.pt0.y < this.pt1.y) ? this.pt0.y : this.pt1.y;
                            var ymax = (this.pt0.y > this.pt1.y) ? this.pt0.y : this.pt1.y;
                            //this.socket.emit('select-fence', xmin, xmax, ymin, ymax);
                            this.model.selectFence(xmin, xmax, ymin, ymax);
                        }
                    }
                    this.render();
                }
                break;
            case 'COLLECTION':
                if (this.mouseButton === 0) {
                    if ((Math.abs(this.pt0.x - this.pt1.x) < this.mouseMoveTol) && 
                    (Math.abs(this.pt0.y - this.pt1.y) < this.mouseMoveTol)) {
                        var max_size = ((this.right-this.left) >= (this.top - this.bottom) ? (this.right-this.left) :
                        (this.top - this.bottom));
                        var tol = max_size*this.pickTolFac;

                        if (this.gridObj.getSnapInfo()) {
                            var pos = {x: this.pt1.x, y: this.pt1.y};
                            this.gridObj.snapTo(pos);
                            this.pt1.x = pos.x;
                            this.pt1.y = pos.y;
                        }

                        if (this.model && !this.model.isEmpty()) {
                            var pos = {x: this.pt1.x, y: this.pt1.y};
                            this.model.snapToCurve(pos, tol);
                            this.pt1.x = pos.x;
                            this.pt1.y = pos.y;
                        }
                        this.collector.insertPoint(this.pt1.x, this.pt1.y, tol);
                    }
                }

                var endCollection = false;
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
                            this.render();
                        }
                    }
                    else
                    {
                        this.collector.reset();
                        this.render();
                    }
                }

                if (endCollection) {
                    var curve = this.collector.getCollectedCurve();
                    this.curves.push(curve);
                    this.model.insertCurve(curve);
                    this.collector.endCurveCollection();
                    this.render();
                    this.socket.emit('insert-curve', curve);
                }
                break;
        
            default:
                break;
        } */
        
    }
    
    onMouseMove(e){
        e.preventDefault();
        
        const m_pos = this.getPosition(e);
        console.log(m_pos);
        //const pos = Mouse.setToUniverse(m_pos, e);
    }

    paint(){    

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.makeDisplayCurves();
        this.makeDisplayGrid();
    }

    render(){
        return <canvas 
                    className='canvas' 
                    id='canvas' 
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                >
                </canvas>
    }
}