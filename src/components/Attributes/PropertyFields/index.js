import React, {Component} from 'react'
import {Radio} from 'antd'
import {SketchPicker} from 'react-color'

export default class PropertyField extends Component {
    constructor(props){
        super(props);
    }

    renderPropertyField( property, type){
        switch (type) {
            case "float":
                return (<input 
                            value={this.props.attribute.properties[property]}
                            type='number' 
                            step="0.01"
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></input>)
            
            case "int":
                return (<input 
                            value={this.props.attribute.properties[property]}
                            type='number' 
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></input>)
            
            case "bool":
                return (<input 
                            value={this.props.attribute.properties[property]}
                            type='checkbox'    
                            onChange={(e)=>{this.props.handleChangeProperty(e, property, type)}}
                        ></input>)

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
                return( <input type='text' value={this.props.attribute.properties[property]}></input>)
        
            default:
                break;
        }
    }

    render(){
        const component = this.renderPropertyField(this.props.property, this.props.type);

        return component;
    }
}