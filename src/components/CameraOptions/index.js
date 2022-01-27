import React, { Component } from "react";
import {FullscreenOutlined, PlusOutlined, 
        MinusOutlined, DownOutlined, 
        UpOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons'
import './style.css'

export default class CameraOptions extends Component{
    
    handlePanLeft(){
        this.props.canvasRef.current.panWorldWindow(0.95, 1.0);
        this.props.canvasRef.current.paint();
    }

    handlePanRight(){
        this.props.canvasRef.current.panWorldWindow(1.05, 1.0);
        this.props.canvasRef.current.paint();
    }

    handlePanDown(){
        this.props.canvasRef.current.panWorldWindow(1.0, 0.95);
        this.props.canvasRef.current.paint();
    }

    handlePanUp(){
        this.props.canvasRef.current.panWorldWindow(1.0, 1.05);
        this.props.canvasRef.current.paint();
    }

    handleZoomIn(){
        this.props.canvasRef.current.scaleWorldWindow(1.0/1.05);
        this.props.canvasRef.current.paint();
    }

    handleZoomOut(){
        this.props.canvasRef.current.scaleWorldWindow(1.05);
        this.props.canvasRef.current.paint();
    }

    handleFitToView(){
        this.props.canvasRef.current.fitWorldToViewport();
    }

    render(){
        return(
            <div className={`options-container-${this.props.room.hasRoom}`}>
                <div title="Zoom in" onClick={this.handleZoomIn.bind(this)} className='option'>
                    <PlusOutlined className='icon'/>
                </div>
                <div title="Zoom out" onClick={this.handleZoomOut.bind(this)} className='option'>
                    <MinusOutlined className='icon'/>
                </div>
                <div title="Pan up" onClick={this.handlePanUp.bind(this)} className='option'>
                    <UpOutlined className='icon'/>
                </div>
                <div title="Pan down" onClick={this.handlePanDown.bind(this)} className='option'>
                    <DownOutlined className='icon'/>
                </div>
                <div title="Pan left" onClick={this.handlePanLeft.bind(this)} className='option'>
                    <LeftOutlined className='icon'/>
                </div>
                <div title="Pan right" onClick={this.handlePanRight.bind(this)} className='option'>
                    <RightOutlined className='icon'/>
                </div>
                <div title="Fit to view" onClick={this.handleFitToView.bind(this)} className='option'>
                    <FullscreenOutlined className='icon'/>
                </div>
            </div>
        );
    }
}