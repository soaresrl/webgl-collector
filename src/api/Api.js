import {io} from 'socket.io-client';
import Line from '../curves/line';

export default class Api {
    constructor(){

    }

    connect(url){
        this.socket = io(url);
    }

    listen(model){
        this.socket.on('connect', ()=>{
            alert('Connected to server.');
        })

        this.socket.on("disconnect", (reason) => {
            alert(`Disconnected from server, reason: ${reason}`);
        });

        this.socket.on("insert-curve", (curve) => {
            let line = new Line(curve.x1, curve.y1, curve.x2, curve.y2);
            line.selected = curve.selected;
            model.curves.push(line);
        });
    }
}