import {io} from 'socket.io-client';
import Line from '../curves/line';

export default class Api {
    constructor(){
        this.subFunctions = [];
    }

    connect(url){
        this.socket = io(url, {transports: ['websocket']});
    }

    subscribe(func){
        this.subFunctions = [
            ...this.subFunctions,
            func
        ]
    }

    unsubscribe(func){
        const index = this.subFunctions.findIndex(f => f.name == func.name);
        this.subFunctions.splice(index);
    }

    listen(model, updateConnection, handleRoomCreated, updateCanvas, updateMessages){
        this.socket.on('connect', ()=>{
            updateConnection();
        });

        this.socket.on("disconnect", (reason) => {
            alert(`Disconnected from server, reason: ${reason}`);
        });

        this.socket.on("error", (reason) => {
            alert(`Disconnected from server, reason: ${reason}`);
        });

        this.socket.on('room-created', (data)=>{
            handleRoomCreated(data.room_id);
        });

        this.socket.on('room-joined', (room_id)=>{
            handleRoomCreated(room_id);
        });

        this.socket.on("update-model", (_model) => {
            const edges = [];
            const vertices = [
                ..._model.vertices
            ];

            _model.edges.forEach(edge => {
                let new_line = new Line(edge.points[0][0], edge.points[0][1], edge.points[1][0], edge.points[1][1], edge.attributes);
                new_line.selected = edge.selected;
                edges.push(new_line);
            });
            
            model.curves = [];
            model.curves = edges;
            model.vertices = vertices;
            
            this.getTriangs();
            this.getAttributeSymbols();
        });

        this.socket.on('tesselation', (data) => {
            model.patches = data;
        });

        this.socket.on('message', (message)=>{
            updateMessages(message);
        });

        this.socket.on('receive-prototypes', (prototypes)=>{
            this.subFunctions[0](prototypes);
        })

        this.socket.on('receive-symbols', (symbols)=>{
            model.attributes_symbols = symbols;
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

    delSelectedEntities(){
        this.socket.emit('delete-selected-entities');
    }

    intersect(){
        this.socket.emit('intersect');
    }

    getTriangs(){
        this.socket.emit('tesselation');
    }

    sendMessage(message){
        this.socket.emit('message', message);
    }

    getPrototypes(handle_prototypes){
        this.socket.emit('get-prototypes');
        this.subscribe(handle_prototypes);
    }

    applyAttribute(attribute){
        this.socket.emit('apply-attribute', attribute);
    }

    getAttributeSymbols(){
        this.socket.emit('get-attribute-symbols');
    }
}