import React, { Component } from "react"
import Draggable from 'react-draggable'
import {CloseSquareOutlined} from '@ant-design/icons'
import {Button} from 'antd'
import './RoomModal.css'

export default class RoomModal extends Component{

    constructor(props){
        super(props);

        this.state = {
            isModalVisible: false,
            roomToken: ''
        }
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isModalVisible: false
        })
    }

    handleJoinRoom(){
        this.props.Api.joinRoom(this.state.roomToken);
    }
    
    handleInputChange(e){
        this.setState({
            ...this.state,
            roomToken: e.target.value
        })
    }

    render(){
        return(
            this.state.isModalVisible && <Draggable>
                <div className='join-room'>
                    <div className='title'>
                        <h4>Join Room</h4>
                        <CloseSquareOutlined onClick={this.handleCancel.bind(this)} className='icon' />
                    </div>
                    <hr className="solid"/>
                    <div className='content'>
                        <p> Token </p>
                        <input onChange={this.handleInputChange.bind(this)} placeholder="Type the room's token..."/>
                        <Button onClick={this.handleCancel.bind(this)} danger >Cancel</Button>
                        <Button onClick={this.handleJoinRoom.bind(this)} type='primary'>Join</Button>
                    </div>
                </div>
            </Draggable>
        );
    }
}