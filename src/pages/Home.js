import React, { Component, createRef } from 'react';
import Canvas from '../components/Canvas/Canvas';
import Header from '../components/Header/Header';
import SideMenu from '../components/Menu/SideMenu';
import { Checkbox } from 'antd';
import './Home.css';
import RoomModal from '../components/RoomModal';
import CameraOptions from '../components/CameraOptions';
import Attributes from '../components/Attributes';
import Messages from '../components/Messages';
import CreateRoom from '../components/CreateRoom';

export default class Home extends Component {
    constructor(props){

        super(props);

        this.state = {
            mouseAction: null,
        }
        this.canvasRef = createRef();
        this.roomModalRef = createRef();
        this.attributesRef = createRef();
        this.messagesRef = createRef();
        this.createRoomRef = createRef();
        // Bind handle functions
        this.changeMouseAction = this.changeMouseAction.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        // Resize canvas because of canvas component is rendered
        if(this.props.room.hasRoom){
            this.canvasRef.current.resizeGL();
        }
    }

    changeMouseAction(mouseAction){
        this.setState({
                mouseAction: mouseAction
            });
    }

    updateCanvas(){
        this.canvasRef.current.paint();
    }

    updateMessages(message){
        this.messagesRef.current.setState({
            ...this.messagesRef.current.state,
            messages: [...this.messagesRef.current.state.messages, message]
        })
    }

    toggleSnap(){
        this.canvasRef.current.setState({
            ...this.canvasRef.state,
            is_SnapOn: !this.canvasRef.current.state.is_SnapOn
        })
    }

    changeSnapDataX(e){
        const {gridY} = this.canvasRef.current.grid.getGridSpace();
        this.canvasRef.current.grid.setSnapData(parseFloat(e.target.value), 
                                                parseFloat(gridY), 
                                                this.canvasRef.current.state.is_SnapOn);
        this.canvasRef.current.paint();
    }

    changeSnapDataY(e){
        const {gridX} = this.canvasRef.current.grid.getGridSpace();
        this.canvasRef.current.grid.setSnapData(parseFloat(gridX), 
                                                parseFloat(e.target.value), 
                                                this.canvasRef.current.state.is_SnapOn);
        this.canvasRef.current.paint();
    }

    render(){
        return(
            <>
                <div className='container'>
                    <Header room={this.props.room} connected={this.props.connected}/>
                    <div className={`content-${this.props.room.hasRoom}`}> 
                        <SideMenu 
                            connected = {this.props.connected}
                            attributesRef = {this.attributesRef} 
                            roomModalRef = {this.roomModalRef} 
                            createRoomRef = {this.createRoomRef}
                            Api = {this.props.Api} 
                            canvasRef = {this.canvasRef}
                            model = {this.props.model} 
                            changeMouseAction={this.changeMouseAction}
                        />
                        <Canvas 
                            ref={this.canvasRef} 
                            Api={this.props.Api} 
                            model={this.props.model} 
                            mouseAction={this.state.mouseAction}
                        />
                        {this.props.room.hasRoom && <Messages 
                                                        ref={this.messagesRef} 
                                                        Api={this.props.Api} 
                                                        model={this.props.model}
                                                        username={this.props.username}
                                                        canvasRef={this.canvasRef}
                                                    />}
                        <CameraOptions 
                            room = {this.props.room} 
                            canvasRef= {this.canvasRef} 
                            model={this.props.model}
                        />
                        <div className={`grid-options-${this.props.room.hasRoom}`}>
                            <Checkbox onChange={this.toggleSnap.bind(this)} className='grid-snap'>Snap</Checkbox>
                            <input 
                                onChange={this.changeSnapDataX.bind(this)} 
                                placeholder='1.0' 
                                className='grid-input-x'
                            />
                            <input 
                                onChange={this.changeSnapDataY.bind(this)} 
                                placeholder='1.0' 
                                className='grid-input-y'
                            />
                        </div>
                    </div>
                </div>

                <RoomModal 
                    Api={this.props.Api} 
                    ref={this.roomModalRef} 
                    setUsername={this.props.setUsername}
                />

                <CreateRoom 
                    Api={this.props.Api} 
                    ref={this.createRoomRef} 
                    setUsername={this.props.setUsername} 
                />

                <Attributes 
                    Api={this.props.Api} 
                    ref={this.attributesRef} 
                />
            </>
        );
    }
}