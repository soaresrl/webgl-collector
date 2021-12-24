import { Input } from "antd";
import React, { Component } from "react";
import Command from '../../business/CommandLine'
import  './styles.css'

export default class CommandLine extends Component{

    constructor(props){
        super(props);

        this.state = {
            actualCommand: ''
        }
    }

    handleInput(e){
        this.setState({
            ...this.state,
            actualCommand: e.target.value
        })
    }

    handleFinishEdit(e){
        if (e.keyCode == 13) {
            
            //#insert_curve(0.0,0.0,12.0,12.0)
            const command = this.state.actualCommand.match(/#(.*?)[(]/)[1];
            if (command) {
                let parameters = this.state.actualCommand.match(/[+-]?([0-9]+([.][0-9]*)?|[+-]?[.][0-9]+)/g);
                parameters = parameters.map(num => parseFloat(num));
                Command.run(command, parameters, this.props.model, this.props.Api);

                this.props.canvasRef.current.paint();
            }

            this.setState({
                ...this.state,
                actualCommand: ''
            })
        }
    }

    render(){
        return(
            <div className='command-content'> 
                <Input 
                    placeholder='Type a command...' 
                    value={this.state.actualCommand}
                    onKeyUp={this.handleFinishEdit.bind(this)}
                    onChange={this.handleInput.bind(this)}
                />
            </div>
        )
    }
}