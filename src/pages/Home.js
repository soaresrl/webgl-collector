import React, { Component } from 'react';
import Canvas from '../components/Canvas/Canvas';
import Header from '../components/Header/Header';
import SideMenu from '../components/Menu/SideMenu';
import { SCENE_CONFIG } from '../Constants/Constants';
import './Home.css';

export default class Home extends Component {
    constructor(props){

        super(props);

        this.state = {
            canvasW: SCENE_CONFIG.width,
            canvasH: SCENE_CONFIG.height
        }

    }

    setSize(w, h){
        const initialState = this.state;
        const newState = {width: w, height: h};

        this.setState({...initialState, newState });
    }

    render(){
        return(
            <div className='container'>
                <Header/>
                <div className='content'> 
                    <SideMenu />
                    <Canvas/>
                </div>
            </div>
            

        );
    }
}