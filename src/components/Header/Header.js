import React, { Component } from 'react';
import './Header.css'
import brasao from '../../assets/images/puc.png';

export default class Header extends Component {
    render(){
        return(
            <div className='header-content'>
                <div>
                    <img src={brasao} className='header-logo'/>
                    <span className='header-title' >Web Curve Collector - PUC-Rio</span>
                </div>
                
                <span className='header-project-name'> Project 1 </span>
            </div>
        )
    }
}