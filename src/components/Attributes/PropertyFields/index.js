import React, { Component } from 'react'
import { Checkbox, Input, InputNumber, Radio } from 'antd'
import { SketchPicker } from 'react-color'

export default class PropertyField extends Component {
    constructor(props){
        super(props);
    }

    renderPropertyField( property, type){
        switch (type) {
            case "float":
                return (<InputNumber
                            value={this.props.attribute.properties[property]}
                            step="0.01"
                            size='small'
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></InputNumber>)
            
            case "int":
                return (<InputNumber 
                            size='small'
                            value={this.props.attribute.properties[property]}
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></InputNumber>)
            
            case "bool":
                return (<Checkbox 
                            checked={this.props.attribute.properties[property]}
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></Checkbox>)

            case "color":
                return (<SketchPicker 
                            key={`${property}-picker`}
                            color={this.props.attribute.properties[property]}
                            onChange={(color)=>{this.props.handleChangeProperty(color, property, type)}}
                        />)

            case "list":
                return( <Radio.Group value={this.props.attribute.properties[property][1]}>
                            {this.props.attribute.properties[property][0].map((name, index)=>(
                                <Radio key={`${name}-${index}`} value={index}>{name}</Radio>
                            ))}
                        </Radio.Group>)
            
            case "string":
                return( <Input value={this.props.attribute.properties[property]}
                            size='small' />)
        
            default:
                break;
        }
    }

    render(){
        const component = this.renderPropertyField(this.props.property, this.props.type);

        return component;
    }
}