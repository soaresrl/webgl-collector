import {io} from 'socket.io-client';
import Line from '../curves/line';

export default class Api {
    constructor(){

    }

    connect(url){
        this.socket = io(url);
    }

    listen(model, updateConnection, handleRoomCreated, updateCanvas){
        this.socket.on('connect', ()=>{
            updateConnection();
        })

        this.socket.on("disconnect", (reason) => {
            alert(`Disconnected from server, reason: ${reason}`);
        });

        this.socket.on("error", (reason) => {
            alert(`Disconnected from server, reason: ${reason}`);
        });

        this.socket.on('room-created', (data)=>{
            handleRoomCreated(data.room_id);
        })

        this.socket.on('room-joined', (room_id)=>{
            handleRoomCreated(room_id);
        })

        this.socket.on("insert-curve", (curve) => {
            let line = new Line(curve.x1, curve.y1, curve.x2, curve.y2);
            line.selected = curve.selected;
            model.curves.push(line);

            updateCanvas();
        });

        this.socket.on("update-model", (_model) => {
            const edges = []

            _model.edges.forEach(edge => {
                let new_line = new Line(edge.points[0][0], edge.points[0][1], edge.points[1][0], edge.points[1][1]);
                new_line.selected = edge.selected;
                edges.push(new_line);
            });
            model.curves = [];
            model.curves = edges;
            
            this.getTriangs();
        });

        this.socket.on('tesselation', (data) => {
            model.patches = data;
            updateCanvas();
        })
    }

    insertCurve(curve){
        this.socket.emit('insert-curve', curve);
    }

    createRoom(){
        this.socket.emit('create-room');
    }

    joinRoom(token){
        this.socket.emit('join-room', token);
    }

    selectFence(xmin, xmax, ymin, ymax){
        this.socket.emit('select-fence', xmin, xmax, ymin, ymax);
    }

    selectPick(x, y, tol){
        this.socket.emit('select-pick', x, y, tol);
    }

    delSelectedCurves(){
        this.socket.emit('delete-selected-entities');
    }

    intersect(){
        this.socket.emit('intersect')
    }

    getTriangs(){
        this.socket.emit('tesselation')
    }
}