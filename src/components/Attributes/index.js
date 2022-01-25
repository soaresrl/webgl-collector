import React, { Component } from "react"
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
            selectedPrototype: null,
            currentAttribute: null
        }

        this.handleReceivePrototypes = this.handleReceivePrototypes.bind(this);
        this.handleChangeProperty = this.handleChangeProperty.bind(this);
        this.handleChangeAttributeName = this.handleChangeAttributeName.bind(this);
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
    }

    handleSelectedPrototype(e){
        const prototype = this.state.prototypes.find(p => p.type === e.target.value);
        this.setState({
            ...this.state,
            selectedPrototype: e.target.value,
            currentAttribute: {
                ...prototype,
                properties: {
                    ...prototype.properties,
                    'Color': {r: prototype.properties.Color[0] || 0, g: prototype.properties.Color[1] || 0, b: prototype.properties.Color[2] || 0}
                }
            }
        })
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

    handleChangeAttributeName(e){
        this.setState({
            ...this.state,
            currentAttribute: {
                ...this.state.currentAttribute,
                name: e.target.value
            }
        })
    }

    applyChanges(){
        let attribute = this.state.currentAttribute;
        const changedAttribute = {
            ...attribute,
            properties: {
                ...attribute.properties,
                Color: [attribute.properties.Color.r, attribute.properties.Color.g, attribute.properties.Color.b]
            }
        }

        this.props.Api.applyAttribute(changedAttribute);
        this.props.Api.getAttributeSymbols();
    }

    render(){
        return(
            <Draggable disabled={true}>
                <div className='attributes-content'>
                    <div className='title'>
                        <h4>Attributes</h4>
                        <CloseSquareOutlined onClick={this.handleCancel.bind(this)} className='icon' />
                    </div>
                    <hr className="solid"/>
                    <div className='content'>
                        <select onChange={this.handleSelectedPrototype.bind(this)}>
                            {this.state.prototypes.map((attribute, index)=>(
                                <option value={attribute.type} key={`${index}-type`}> {attribute.type} </option>
                            ))}
                        </select>
                        {this.state.currentAttribute && 
                            <div className='prototypes'>
                                <p> Name: </p>
                                <Input 
                                    placeholder="type attribute's name..." 
                                    onChange={this.handleChangeAttributeName}
                                />
                                <Prototype
                                    currentAttribute={this.state.currentAttribute}
                                    handleChangeProperty={this.handleChangeProperty}
                                />
                            </div>
                        }
                    </div>
                    <div className="action-buttons">
                        <Button onClick={this.handleCancel.bind(this)} danger >Cancel</Button>
                        <Button onClick={this.applyChanges.bind(this)} type='primary'>Apply</Button>
                    </div>
                </div>
            </Draggable>
        );
    }
}