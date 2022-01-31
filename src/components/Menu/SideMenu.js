import React, { Component } from 'react';
import { LineOutlined, SelectOutlined, ApiOutlined, PlusSquareOutlined, TableOutlined,
        DeleteOutlined/* , ScissorOutlined */, ToolOutlined} from '@ant-design/icons';
import { GiCobweb } from 'react-icons/gi'
import { notification } from 'antd';
import PropertyField from "../Attributes/PropertyFields"

import './Menu.css';

export default class SideMenu extends Component {

    constructor(props){
        super(props);

        this.state = {
            line: false,
            select: false,
            selectedAttribute: null
        }

        this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
        this.handleChangeProperty = this.handleChangeProperty.bind(this);
        this.handleSetAttribute = this.handleSetAttribute.bind(this);
        this.handleRemoveAttribute = this.handleRemoveAttribute.bind(this);
        this.handleSaveAttribute = this.handleSaveAttribute.bind(this);
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

    handleSelectAttribute(name){
        const selectedAttribute = this.props.attributes.find((att) => att.name === name);

        if(selectedAttribute){
            this.setState({
                ...this.state,
                selectedAttribute: {
                    ...selectedAttribute,
                    properties: {
                        ...selectedAttribute.properties,
                        'Color': {r: selectedAttribute.properties.Color[0] || 0, g: selectedAttribute.properties.Color[1] || 0, b: selectedAttribute.properties.Color[2] || 0}
                    }
                }
            });
        } else {
            this.setState({
                ...this.state,
                selectedAttribute: null
            }); 
        }
        
    }

    handleChangeProperty(e, property, type){
        if(property == 'Color'){
            this.setState({
                ...this.state,
                selectedAttribute: {
                    ...this.state.selectedAttribute,
                    properties: {
                        ...this.state.selectedAttribute.properties,
                        [property]: e.rgb
                    }
                }
            })
        }
        else
        {
            if(type == 'int' || type == 'float'){
                this.setState({
                    ...this.state,
                    selectedAttribute: {
                        ...this.state.selectedAttribute,
                        properties: {
                            ...this.state.selectedAttribute.properties,
                            [property]: e ? parseFloat(e) : 0
                        }
                    }
                })
            }
            else if(type == 'bool')
            {
                this.setState({
                    ...this.state,
                    selectedAttribute: {
                        ...this.state.selectedAttribute,
                        properties: {
                            ...this.state.selectedAttribute.properties,
                            [property]: e.target.checked
                        }
                    }
                })
            }
            else {
                this.setState({
                    ...this.state,
                    selectedAttribute: {
                        ...this.state.selectedAttribute,
                        properties: {
                            ...this.state.selectedAttribute.properties,
                            [property]: e.target.value
                        }
                    }
                })
            }
            
        }
    }

    handleSetAttribute(){
        let attribute = this.state.selectedAttribute;
        
        const changedAttribute = {
            ...attribute,
            properties: {
                ...attribute.properties,
                Color: [attribute.properties.Color.r, attribute.properties.Color.g, attribute.properties.Color.b]
            }
        }

        this.props.Api.applyAttribute(changedAttribute);
    }

    handleSaveAttribute(){
        let attribute = this.state.selectedAttribute;
        
        const changedAttribute = {
            ...attribute,
            properties: {
                ...attribute.properties,
                Color: [attribute.properties.Color.r, attribute.properties.Color.g, attribute.properties.Color.b]
            }
        }

        this.props.updateAttribute(changedAttribute);
        this.props.Api.updateAttribute(changedAttribute);
    }

    handleRemoveAttribute(){
        let attribute = this.state.selectedAttribute;

        this.props.Api.removeAttribute(attribute.name);
        this.props.removeAttribute(attribute.name);
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
               {/* <div className='toolbox'>
                    <p className='title'>Attributes</p> 
                    <div className='items'>
                        <span className='item' title="attribute manager" onClick={this.handleAttributes.bind(this)}>
                            <ToolOutlined /> Attribute manager
                        </span>
                    </div>
               </div> */}
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
               <div className='created-attributes'>
                    <p className='title'>Attributes  <PlusSquareOutlined title='Create new attribute' onClick={this.handleAttributes.bind(this)}/></p>
                    <div className='attributes'>
                        <select value={this.state.selectedAttribute?.name} 
                                onChange={e => this.handleSelectAttribute(e.target.value)}>
                            {this.props.attributes?.map((attribute)=>{
                                return(<option key={attribute.name}>{attribute.name}</option>)
                        })}</select>
                    </div>
                    <div className='items'>
                        {this.state.selectedAttribute && 
                        Object.keys(this.state.selectedAttribute?.properties).map((property, index) => 
                        (<div key={`att-${property}-${index}`} className='properties'>
                            <p>{property}</p>
                            <PropertyField 
                            key={`${property}-${index}-field`}
                            attribute={this.state.selectedAttribute} 
                            handleChangeProperty={this.handleChangeProperty} 
                            property={property}
                            type={this.state.selectedAttribute['properties-type'][index]}
                        />
                        </div>))}
                    </div>
                    <div className='action-buttons'>
                        <button onClick={this.handleSetAttribute}>Set</button>
                        <button onClick={this.handleRemoveAttribute}>Delete</button>
                        <button onClick={this.handleSaveAttribute}>Save</button>
                    </div>
               </div>
           </div>
           
        );
    }
}