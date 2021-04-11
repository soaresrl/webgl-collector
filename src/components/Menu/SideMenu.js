import React, { Component } from 'react'
import {LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined} from '@ant-design/icons'
import './Menu.css'

export default class SideMenu extends Component {

    changeMouse(mouseAction){
        this.props.changeMouseAction(mouseAction);
    }

    deleteCurves(){
        this.props.model.delSelectedCurves();
        this.props.canvasRef.current.paint();
    }

    render() {
        return (
           <div className='navigation'>
               <ul>
                   <li onClick={()=>{this.changeMouse('COLLECTION')}}>
                       <a href='#'>
                           <LineOutlined className='icon'/>
                           <span className='title'>Line</span>
                       </a>
                   </li>
                   <li onClick={()=>{this.changeMouse('SELECTION')}}>
                       <a href='#'>
                            <SelectOutlined  className='icon'/>
                           <span className='title'>Select</span>
                       </a>
                   </li>
                   <li>
                       <a href='#'>
                            <TableOutlined className='icon'/>
                           <span className='title'>Grid</span>
                       </a>
                   </li>
                   <li onClick={this.deleteCurves.bind(this)}>
                       <a href='#'>
                            <DeleteOutlined className='icon'/>
                           <span className='title'>Delete</span>
                       </a>
                   </li>
                   <hr className="solid"/>
                   <li>
                       <a href='#'>
                            <PlusSquareOutlined className='icon'/>
                           <span className='title'>Create Room</span>
                       </a>
                   </li>
                   <li>
                       <a href='#'>
                            <ApiOutlined className='icon' />
                           <span className='title'>Join Room</span>
                       </a>
                   </li>
                   <hr className="solid"/>
               </ul>
           </div>
           
        );
    }
}