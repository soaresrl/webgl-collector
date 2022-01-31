import React, { Component, createRef } from "react"
import Draggable from 'react-draggable'
import { CloseSquareOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'

import { Prototype } from './Prototype'
import './styles.css'

export default class Attributes extends Component{

    constructor(props){
        super(props);

        this.state = {
            attributes: [],
            prototypes: [],
            disabled: true,
            selectedPrototype: null,
            currentAttribute: null
        }

        this.handleReceivePrototypes = this.handleReceivePrototypes.bind(this);
        this.handleChangeProperty = this.handleChangeProperty.bind(this);
        this.handleChangeAttributeName = this.handleChangeAttributeName.bind(this);
        this.handleSelectedPrototype = this.handleSelectedPrototype.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);

    }

    componentDidMount(){
        this.props.Api.getPrototypes(this.handleReceivePrototypes);
    }

    componentWillUnmount(){
        this.props.Api.unsubscribe(this.handleReceivePrototypes);
    }
    
    handleCancel(){
        this.props.setAttibuteNotVisible();
    }
    
    handleReceivePrototypes(prototypes){
        this.setState({
            ...this.state,
            prototypes
        })

        this.handleSelectedPrototype(this.state.prototypes[0].type)
    }

    handleSelectedPrototype(type){
        const prototype = this.state.prototypes.find(p => p.type === type);
        this.setState({
            ...this.state,
            selectedPrototype: type,
            currentAttribute: {
                ...prototype,
                name: '',
                properties: {
                    ...prototype.properties,
                    'Color': {r: prototype.properties.Color[0] || 0, g: prototype.properties.Color[1] || 0, b: prototype.properties.Color[2] || 0}
                }
            }
        });
    }

    handleChangeProperty(e, property, type){
        if(property == 'Color'){
            this.setState({
                ...this.state,
                currentAttribute: {
                    ...this.state.currentAttribute,
                    properties: {
                        ...this.state.currentAttribute.properties,
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
                    currentAttribute: {
                        ...this.state.currentAttribute,
                        properties: {
                            ...this.state.currentAttribute.properties,
                            [property]: e ? parseFloat(e) : 0
                        }
                    }
                })
            }
            else if(type == 'bool')
            {
                this.setState({
                    ...this.state,
                    currentAttribute: {
                        ...this.state.currentAttribute,
                        properties: {
                            ...this.state.currentAttribute.properties,
                            [property]: e.target.checked
                        }
                    }
                })
            }
            else {
                this.setState({
                    ...this.state,
                    currentAttribute: {
                        ...this.state.currentAttribute,
                        properties: {
                            ...this.state.currentAttribute.properties,
                            [property]: e.target.value
                        }
                    }
                })
            }
            
        }
    }

    handleChangeAttributeName(name){
        this.setState({
            ...this.state,
            currentAttribute: {
                ...this.state.currentAttribute,
                name
            }
        })
    }

    applyChanges(){
        const attribute = this.state.currentAttribute;
        
        if(attribute.name == ''){
            alert('Attribute must have a name');
            return;
        }
        
        const changedAttribute = {
            ...attribute,
            properties: {
                ...attribute.properties,
                Color: [attribute.properties.Color.r, attribute.properties.Color.g, attribute.properties.Color.b]
            }
        }

        this.props.addAttribute(changedAttribute);

        this.props.Api.createAttribute(changedAttribute);

        this.setState({
            ...this.state,
            currentAttribute: null
        }, ()=>{this.handleSelectedPrototype(attribute.type)});
        //this.props.Api.getAttributeSymbols();
    }

    handleMouseOver(){
        this.setState({
            ...this.state,
            disabled: false
        });
    }

    handleMouseLeave(){
        this.setState({
            ...this.state,
            disabled: true
        });
    }

    render(){
        return(
            <Draggable disabled={this.state.disabled}>
                <div className='attributes-content'>
                    <div className='title' onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
                        <h4>Create Attribute</h4>
                        <CloseSquareOutlined onClick={this.handleCancel.bind(this)} className='icon' />
                    </div>
                    <hr className="solid"/>
                    <div className='content'>
                        <select onChange={(e)=>{this.handleSelectedPrototype(e.target.value)}}>
                            {this.state.prototypes.map((attribute, index)=>(
                                <option value={attribute.type} key={`${index}-type`}> {attribute.type} </option>
                            ))}
                        </select>
                        {this.state.currentAttribute && 
                            <div className='prototypes'>
                                <div className="att-name">
                                    <p> Name: </p>
                                    <Input 
                                        placeholder="type attribute's name..." 
                                        onChange={(e)=>{this.handleChangeAttributeName(e.target.value)}}
                                        value={this.state.currentAttribute?.name}
                                    />
                                </div>
                                <Prototype
                                    currentAttribute={this.state.currentAttribute}
                                    handleChangeProperty={this.handleChangeProperty}
                                />
                            </div>
                        }
                    </div>
                    <div className="action-buttons">
                        <Button onClick={this.handleCancel.bind(this)} danger >Cancel</Button>
                        <Button onClick={this.applyChanges.bind(this)} type='primary'>Create</Button>
                    </div>
                </div>
            </Draggable>
        );
    }
}