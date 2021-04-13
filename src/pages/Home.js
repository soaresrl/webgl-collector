import React, { Component, createRef } from 'react';
import Canvas from '../components/Canvas/Canvas';
import Header from '../components/Header/Header';
import SideMenu from '../components/Menu/SideMenu';
import { Checkbox } from 'antd';
import './Home.css';
import RoomModal from '../components/RoomModal';

export default class Home extends Component {
    constructor(props){

        super(props);

        this.state = {
            mouseAction: null,
        }
        this.canvasRef = createRef();
        this.roomModalRef = createRef();
        // Bind handle functions
        this.changeMouseAction = this.changeMouseAction.bind(this);
    }

    changeMouseAction(mouseAction){
        this.setState({
                mouseAction: mouseAction
            });
    }

    toggleSnap(){
        this.canvasRef.current.setState({
            ...this.canvasRef.state,
            is_SnapOn: !this.canvasRef.current.state.is_SnapOn
        })
    }

    render(){
        return(
            <>
                <div className='container'>
                    <Header/>
                    <div className='content'> 
                        <SideMenu roomModalRef = {this.roomModalRef} canvasRef= {this.canvasRef} model={this.props.model} changeMouseAction={this.changeMouseAction}/>
                        <Canvas ref={this.canvasRef} model={this.props.model} mouseAction={this.state.mouseAction}/>
                        <div className='grid-options'>
                            <Checkbox onChange={this.toggleSnap.bind(this)} className='grid-snap'>Snap</Checkbox>
                            <input placeholder='1.0' className='grid-input-x'/>
                            <input placeholder='1.0' className='grid-input-y'/>
                        </div>
                    </div>
                </div>

                <RoomModal ref={this.roomModalRef} />
            </>
        );
    }
}