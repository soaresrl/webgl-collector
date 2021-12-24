import React, { Component } from "react"
import Draggable from 'react-draggable'
import {CloseSquareOutlined} from '@ant-design/icons'
import {Button, Input, Modal} from 'antd'
import './RoomModal.css'

export default class RoomModal extends Component{

    constructor(props){
        super(props);

        this.state = {
            isModalVisible: false,
            roomToken: '',
            username: ''
        }
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isModalVisible: false
        });
    }

    handleJoinRoom(){
        this.props.setUsername(this.state.username);
        this.props.Api.joinRoom(this.state.roomToken);
        
        this.setState({
            ...this.state,
            isModalVisible: false
        });
    }
    
    handleInputChange(e){
        this.setState({
            ...this.state,
            roomToken: e.target.value
        })
    }

    handleUsernameChange(e){
        this.setState({
            ...this.state,
            username: e.target.value
        })
    }

    render(){
        return(
            <Modal visible={this.state.isModalVisible} title='Join room' onCancel={this.handleCancel.bind(this)} onOk={this.handleJoinRoom.bind(this)}>
                <span> Username </span>
                <Input onChange={this.handleUsernameChange.bind(this)} placeholder="Type an username..."/>
                <span> Token </span>
                <Input onChange={this.handleInputChange.bind(this)} placeholder="Type the room's token..."/>
            </Modal>
        );
    }
}