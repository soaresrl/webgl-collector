import React, { Component } from 'react'
import {LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined, ScissorOutlined} from '@ant-design/icons'
import './Menu.css'

export default class SideMenu extends Component {

    changeMouse(mouseAction){
        this.props.changeMouseAction(mouseAction);
    }

    deleteCurves(){
        this.props.model.delSelectedCurves();
        this.props.canvasRef.current.paint();
    }

    toggleGrid(){
        this.props.canvasRef.current.setState({
            ...this.props.canvasRef.current.state,
            viewGrid: !this.props.canvasRef.current.state.viewGrid
        })
    }

    handleIntersection(){
        this.props.model.intersectTwoCurves();
        this.props.canvasRef.current.paint();
    }

    handleCreateRoom(){
        this.props.Api.createRoom();
    }

    handleJoinRoom(){
        this.props.roomModalRef.current.setState({
            ...this.props.roomModalRef.current.state,
            isModalVisible: true
        })
    }

    render() {
        return (
           <div className='navigation'>
               <ul>
                   <li onClick={()=>{this.changeMouse('COLLECTION')}}>
                       <p>
                           <LineOutlined className='icon'/>
                           <span>Line</span>
                       </p>
                   </li>
                   <li onClick={()=>{this.changeMouse('SELECTION')}}>
                       <p>
                            <SelectOutlined  className='icon'/>
                           <span>Select</span>
                       </p>
                   </li>
                   <li onClick={this.handleIntersection.bind(this)}>
                       <p>
                            <ScissorOutlined className='icon'/>
                           <span>Intersect</span>
                       </p>
                   </li>
                   <li onClick={this.toggleGrid.bind(this)}>
                       <p>
                            <TableOutlined className='icon'/>
                           <span>Grid</span>
                       </p>
                   </li>
                   <li onClick={this.deleteCurves.bind(this)}>
                       <p>
                            <DeleteOutlined className='icon'/>
                           <span>Delete</span>
                       </p>
                   </li>
                   <hr className="solid"/>
                   <li onClick={this.handleCreateRoom.bind(this)}>
                       <p>
                            <PlusSquareOutlined className='icon'/>
                           <span>Create Room</span>
                       </p>
                   </li>
                   <li onClick={this.handleJoinRoom.bind(this)}>
                       <p>
                            <ApiOutlined className='icon' />
                           <span>Join Room</span>
                       </p>
                   </li>
                   <hr className="solid"/>
               </ul>
           </div>
           
        );
    }
}