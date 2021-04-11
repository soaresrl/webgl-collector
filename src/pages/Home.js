import React, { Component } from 'react';
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
                    <SideMenu changeMouseAction={this.changeMouseAction}/>
                    <Canvas mouseAction={this.state.mouseAction}/>
                </div>
            </div>
        );
    }
}