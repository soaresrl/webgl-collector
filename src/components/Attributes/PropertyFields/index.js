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
                            key={`${property}-input-float`}
                            value={this.props.attribute.properties[property] || 0}
                            step="0.01"
                            size='small'
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></InputNumber>)
            
            case "int":
                return (<InputNumber 
                            key={`${property}-input-int`}
                            size='small'
                            value={this.props.attribute.properties[property] || 0}
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></InputNumber>)
            
            case "bool":
                return (<Checkbox 
                            key={`${property}-checkbox`}
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
                               <Radio key={`${name}-${index}-radio`} value={index}>{name}</Radio>
                            ))}
                        </Radio.Group>)
            
            case "string":
                return( <Input key={`${property}-string`} value={this.props.attribute.properties[property]}
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