import React, { Component } from "react"
import Draggable from 'react-draggable'
import {CloseSquareOutlined} from '@ant-design/icons'
import {Button} from 'antd'
import './styles.css'

export default class CreateRoom extends Component{

    constructor(props){
        super(props);

        this.state = {
            isModalVisible: false,
            username: ''
        }
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isModalVisible: false
        })
    }

    handleCreateRoom(){
        this.props.setUsername(this.state.username);
        this.props.Api.createRoom();
    }
    
    handleInputChange(e){
        this.setState({
            ...this.state,
            username: e.target.value
        })
    }

    render(){
        return(
            this.state.isModalVisible && <Draggable>
                <div className='create-room'>
                    <div className='title'>
                        <h4>Create Room</h4>
                        <CloseSquareOutlined onClick={this.handleCancel.bind(this)} className='icon' />
                    </div>
                    <hr className="solid"/>
                    <div className='content'>
                        <p> Username </p>
                        <input value={this.state.username} onChange={this.handleInputChange.bind(this)} placeholder="Type an username..."/>
                        <Button onClick={this.handleCancel.bind(this)} danger >Cancel</Button>
                        <Button onClick={this.handleCreateRoom.bind(this)} type='primary'>Create</Button>
                    </div>
                </div>
            </Draggable>
        );
    }
}