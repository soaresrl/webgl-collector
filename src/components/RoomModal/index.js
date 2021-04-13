import React, { Component } from "react"
import Draggable from 'react-draggable'
import {CloseSquareOutlined} from '@ant-design/icons'
import './RoomModal.css'

export default class RoomModal extends Component{

    constructor(props){
        super(props);

        this.state = {
            isModalVisible: false,
        }
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isModalVisible: false
        })
    }

    handleOk(){

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
                        <input placeholder="Type the room's token..."/>
                        <button>Join</button>
                        <button onClick={this.handleCancel.bind(this)}>Cancel</button>
                    </div>
                </div>
            </Draggable>
        );
    }
}