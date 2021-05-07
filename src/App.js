import React, { Component, createRef } from 'react';
import Api from './api/Api';
import model from './model/model';
import Home from './pages/Home';

class App extends Component {

    constructor(props){
        super(props)

        this.model = new model();

        this.state = {
            connected: false,
            room: {}
        }

        this.homeRef = createRef();

        // Callback functions bindings
        this.updateConnection = this.updateConnection.bind(this);
        this.handleRoomCreated = this.handleRoomCreated.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount(){
        this.Api = new Api();
        this.Api.connect("localhost:3000");
        this.Api.listen(this.model, this.updateConnection, this.handleRoomCreated, this.updateCanvas);
    }

    updateConnection(){
        this.setState({
            ...this.state,
            connected: true
        })
    }

    handleRoomCreated(token){
        this.setState({
            ...this.state,
            room: {
                hasRoom: true,
                token: token ? token : this.Api.socket.id
            }
        });

    }

    updateCanvas(){
        this.homeRef.current.updateCanvas();
    }

    render() {
        return(
            <Home ref={this.homeRef} room={this.state.room} connected={this.state.connected} Api={this.Api} model={this.model}/>
        );
    }
}

export default App