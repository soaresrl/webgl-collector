import React, { Component } from "react"
import { Input, Modal } from 'antd'
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
        this.setState({
            ...this.state,
            isModalVisible: false
        })
    }
    
    handleInputChange(e){
        this.setState({
            ...this.state,
            username: e.target.value
        })
    }

    render(){
        return(
            <Modal 
            title="Create Room" 
            visible={this.state.isModalVisible}
            onOk={this.handleCreateRoom.bind(this)}
            onCancel={this.handleCancel.bind(this)}>
                    <span>Username:</span>
                    <Input value={this.state.username} onChange={this.handleInputChange.bind(this)} placeholder="Type an username..."/>
            </Modal>
        );
    }
}