import React, { Component } from 'react';
import { LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined/* , ScissorOutlined */, ToolOutlined} from '@ant-design/icons';
import { GiCobweb } from 'react-icons/gi'
import { notification } from 'antd';
import './Menu.css';

export default class SideMenu extends Component {

    constructor(props){
        super(props);

        this.state = {
            line: false,
            select: false
        }
    }

    changeMouse(mouseAction){
        if(!this.props.connected){
            notification.error({
                message: 'Not connected to Server interface.',
                description: 'Wait for connection with server, otherwise reload window.',
                placement: 'topRight',
            });

            return;
        }
        if(mouseAction == 'COLLECTION'){
            this.setState({
                ...this.state,
                line: true,
                select: false
            })
        }
        else if(mouseAction == 'SELECTION'){
            this.setState({
                ...this.state,
                line: false,
                select: true
            })
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

    handleGenerateMesh(){
        //this.props.Api.generateMesh();
        this.props.meshModalRef.current.setState({
            ...this.props.meshModalRef.current.state,
            isModalVisible: true
        });
    }

    render() {
        return (
           <div className='navigation'>
               <div className='toolbox'>
                    <p className='title'>Modeling</p> 
                    <div className='items'>
                        <span className={this.state.line ? 'item-selected' : 'item'} title="Insert line" onClick={()=>{this.changeMouse('COLLECTION')}}>
                            <LineOutlined/> Line
                        </span>
                        <span className={this.state.select ? 'item-selected' : 'item'} title="Select entity" onClick={()=>{this.changeMouse('SELECTION')}}>
                            <SelectOutlined/> Select
                        </span>
                        <span className='item' title="Delete entity" onClick={this.deleteCurves.bind(this)}>
                            <DeleteOutlined /> Delete
                        </span>
                    </div>
               </div>
               <div className='toolbox'>
                    <p className='title'>Canvas</p> 
                    <div className='items'>
                        <span className='item' title="toggle grid" onClick={this.toggleGrid.bind(this)}>
                            <TableOutlined/> Toggle grid
                        </span>
                    </div>
               </div>
               <div className='toolbox'>
                    <p className='title'>Attributes</p> 
                    <div className='items'>
                        <span className='item' title="attribute manager" onClick={this.handleAttributes.bind(this)}>
                            <ToolOutlined /> Attribute manager
                        </span>
                    </div>
               </div>
               <div className='toolbox'>
                    <p className='title'>Collaboration</p> 
                    <div className='items'>
                        <span className='item' title="create room" onClick={this.handleCreateRoom.bind(this)}>
                            <PlusSquareOutlined /> Create room
                        </span>
                        <span className='item' title="join room" onClick={this.handleJoinRoom.bind(this)}>
                            <ApiOutlined  /> Join room
                        </span>
                    </div>
               </div>
               <div className='toolbox'>
                    <p className='title'>Mesh generation</p> 
                    <div className='items'>
                        <span className='item' title="create room" onClick={this.handleGenerateMesh.bind(this)}>
                            <GiCobweb /> Mesh
                        </span>
                    </div>
               </div>
               {/* <div className='created-attributes'>
                    <p className='title'>Attributes</p>
                    <div className='attributes'>
                        <select>{this.props.attributes?.map((attribute)=>{
                            return(<option key={attribute.name}>{attribute.name}</option>)
                        })}</select>
                    </div>
                    <div className='items'>
                        
                    </div>
               </div> */}
           </div>
           
        );
    }
}