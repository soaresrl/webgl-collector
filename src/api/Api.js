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

        this.socket.on('room-created', ()=>{
            handleRoomCreated();
        })

        this.socket.on('room-joined', (token)=>{
            handleRoomCreated(token);
        })

        this.socket.on("insert-curve", (curve) => {
            let line = new Line(curve.x1, curve.y1, curve.x2, curve.y2);
            line.selected = curve.selected;
            model.curves.push(line);

            updateCanvas();
        });

        this.socket.on("update-model", (curves) => {
            for(curve of curves){
                let new_line = new Line(curve.x1, curve.y1, curve.x2, curve.y2);
                new_line.selected = curve.selected;
                model.curves.push(new_line);
            }

            updateCanvas();
        });
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
}