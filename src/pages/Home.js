import React, { Component, createRef } from 'react';
import Canvas from '../components/Canvas/Canvas';
import Header from '../components/Header/Header';
import SideMenu from '../components/Menu/SideMenu';
import './Home.css';

export default class Home extends Component {
    constructor(props){

        super(props);

        this.state = {
            mouseAction: null,
        }
        this.canvasRef = createRef();
        // Bind handle functions
        this.changeMouseAction = this.changeMouseAction.bind(this);
    }

    changeMouseAction(mouseAction){
        this.setState({
                mouseAction: mouseAction
            });
    }

    render(){
        return(
            <div className='container'>
                <Header/>
                <div className='content'> 
                    <SideMenu canvasRef= {this.canvasRef} model={this.props.model} changeMouseAction={this.changeMouseAction}/>
                    <Canvas ref={this.canvasRef} model={this.props.model} mouseAction={this.state.mouseAction}/>
                </div>
            </div>
        );
    }
}