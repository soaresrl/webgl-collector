import React, { Component } from 'react'
import {LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined} from '@ant-design/icons'
import './Menu.css'

export default class SideMenu extends Component {
    render() {
        return (
           <div className='navigation'>
               <ul>
                   <li>
                       <a href='#'>
                           <LineOutlined className='icon' />
                           <span className='title'>Line</span>
                       </a>
                   </li>
                   <li>
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
                   <li>
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