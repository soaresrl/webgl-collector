import React, { Component } from 'react';
import {CheckCircleOutlined, CloseCircleOutlined, CloudOutlined} from '@ant-design/icons'
import './Header.css'
import brasao from '../../assets/images/puc.png';

export default class Header extends Component {
    render(){
        return(
            <div className='header-content'>
                <div>
                    <img src={brasao} className='header-logo'/>
                    <span className='header-title' >Web Mesh Generator - PUC-Rio</span>
                </div>
                
                <div> 
                    <span className='header-project-name'> Project Name </span>
                    <div className='icon-container'>
                        {this.props.room.token && <p>{this.props.room.token}</p>}
                        <CloudOutlined className='cloud-item'/>
                        {this.props.connected && <CheckCircleOutlined className='connected cloud-item' title='Connected'/>}
                        {!this.props.connected && <CloseCircleOutlined className='disconnected cloud-item' title='Not connected'/>}
                    </div>
                </div>
            </div>
        )
    }
}