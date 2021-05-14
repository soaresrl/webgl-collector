import React, { Component } from "react"
import Draggable from 'react-draggable'
import {CloseSquareOutlined} from '@ant-design/icons'
import './styles.css'
import {default_attributes} from '../../Constants/Constants'

export default class Attributes extends Component{

    constructor(props){
        super(props);

        this.state = {
            isVisible: false,
            attributes: default_attributes
        }
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isVisible: false
        })
    }

    render(){
        return(
            this.state.isVisible && <Draggable>
                <div className='attributes-content'>
                    <div className='title'>
                        <h4>Attributes</h4>
                        <CloseSquareOutlined onClick={this.handleCancel.bind(this)} className='icon' />
                    </div>
                    <hr className="solid"/>
                    <div className='content'>
                        {this.state.attributes.map((attribute, index)=>(
                            <>
                            <p key={index}>{attribute.type}</p>
                            <p key={index}>{attribute.name}</p>
                            </>
                        ))}
                    </div>
                </div>
            </Draggable>
        );
    }
}