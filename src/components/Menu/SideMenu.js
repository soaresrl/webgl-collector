import React, { Component } from 'react';
import {LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined/* , ScissorOutlined */, ToolOutlined} from '@ant-design/icons';
import {notification} from 'antd';
import './Menu.css';

export default class SideMenu extends Component {

    changeMouse(mouseAction){
        if(!this.props.connected){
            notification.error({
                message: 'Not connected to Server interface.',
                description: 'Wait for connection with server, otherwise reload window.',
                placement: 'topRight',
            });

            return;
        }
        this.props.changeMouseAction(mouseAction);
    }

    deleteCurves(){
        if(!this.props.connected){
            notification.error({
                message: 'Not connected to Server interface.',
                description: 'Wait for connection with server, otherwise reload window.',
                placement: 'topRight',
            });

            return;
        }

        //this.props.model.delSelectedCurves();
        this.props.Api.delSelectedEntities();
        this.props.canvasRef.current.paint();
    }

    toggleGrid(){
        this.props.canvasRef.current.setState({
            ...this.props.canvasRef.current.state,
            viewGrid: !this.props.canvasRef.current.state.viewGrid
        });
    }

    /* handleIntersection(){
        this.props.model.intersectTwoCurves();
        this.props.canvasRef.current.paint();
        this.props.Api.intersect();
    } */

    handleCreateRoom(){
        if(!this.props.connected){
            notification.error({
                message: 'Not connected to Server interface.',
                description: 'Wait for connection with server, otherwise reload window.',
                placement: 'topRight',
            });

            return;
        }

        this.props.createRoomRef.current.setState({
            ...this.props.createRoomRef.current.state,
            isModalVisible: true
        });
    }

    handleJoinRoom(){
        if(!this.props.connected){
            notification.error({
                message: 'Not connected to Server interface.',
                description: 'Wait for connection with server, otherwise reload window.',
                placement: 'topRight',
            });

            return;
        }

        this.props.roomModalRef.current.setState({
            ...this.props.roomModalRef.current.state,
            isModalVisible: true
        });
    }

    handleAttributes(){
        
        this.props.setAttibuteVisible();
        /* this.props.attributesRef.current.setState({
            ...this.props.attributesRef.current.state,
            isVisible: true
        }); */
    }

    render() {
        return (
           <div className='navigation'>
               <ul>
                   <li title="Insert line" onClick={()=>{this.changeMouse('COLLECTION')}}>
                       <p>
                           <LineOutlined className='icon'/>
                           {/* <span>Line</span> */}
                       </p>
                   </li>
                   <li title="Select entity" onClick={()=>{this.changeMouse('SELECTION')}}>
                       <p>
                            <SelectOutlined  className='icon'/>
                           {/* <span>Select</span> */}
                       </p>
                   </li>
                   {/* <li onClick={this.handleIntersection.bind(this)}>
                       <p>
                            <ScissorOutlined className='icon'/>
                           <span>Intersect</span>
                       </p>
                   </li> */}
                   <li title="Grid" onClick={this.toggleGrid.bind(this)}>
                       <p>
                            <TableOutlined className='icon'/>
                           {/* <span>Grid</span> */}
                       </p>
                   </li>
                   <li title="Delete entity" onClick={this.deleteCurves.bind(this)}>
                       <p>
                            <DeleteOutlined className='icon'/>
                           {/* <span>Delete</span> */}
                       </p>
                   </li>
                   <hr className="solid"/>
                   <li title="Attributes manager" onClick={this.handleAttributes.bind(this)}>
                       <p>
                            <ToolOutlined className='icon' />
                           {/* <span>Attributes</span> */}
                       </p>
                   </li>
                   <hr className="solid"/>
                   <li title="Create room" onClick={this.handleCreateRoom.bind(this)}>
                       <p>
                            <PlusSquareOutlined className='icon'/>
                           {/* <span>Create Room</span> */}
                       </p>
                   </li>
                   <li title="Join room" onClick={this.handleJoinRoom.bind(this)}>
                       <p>
                            <ApiOutlined className='icon' />
                           {/* <span>Join Room</span> */}
                       </p>
                   </li>
                   <hr className="solid"/>
               </ul>
           </div>
           
        );
    }
}