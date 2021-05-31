import TextArea from 'antd/lib/input/TextArea';
import React, { Component } from 'react'
import CommandLine from '../../business/CommandLine';
import './styles.css'

export default class Messages extends Component {
    constructor(props){
        super(props);
        this.state = {
            actualMessage: '',
            messages: [],
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.actualMessage !== ''){
            const element = document.getElementById('messages-area');
            element.scrollTop = element.scrollHeight;
        }
    }

    handleInput(e){
        this.setState({
            ...this.state,
            actualMessage: e.target.value
        })
    }

    handleFinishEdit(e){
        if (e.keyCode == 13) {
            
            const message = {
                user: this.props.username,
                type: 'sent',
                message: this.state.actualMessage
            }
            //#insert_curve(0.0,0.0,12.0,12.0)
            const command = message.message.match(/#(.*?)[(]/)[1];
            let parameters = message.message.match(/[+-]?([0-9]+([.][0-9]*)?|[+-]?[.][0-9]+)/g);
            parameters = parameters.map(num => parseFloat(num));
            console.log(parameters);
            CommandLine.run(command, parameters, this.props.model, this.props.Api);

            this.props.canvasRef.current.paint();

            this.props.Api.sendMessage(message);

            this.setState({
                ...this.state,
                messages: [...this.state.messages, message],
                actualMessage: ''
            })
        }
    }

    render(){
        return (
            <div className='messages-container'>
                <h3> Room Messages </h3>

                <div id='messages-area' className = 'messages-area'> 
                    {this.state.messages.map((message, index)=>(
                        <div key={`message-${index}`} className={`message-${message.type}`}>
                            <strong>{message.user}</strong>
                            <p>{message.message}</p>
                        </div>
                    ))}
                </div>

                <TextArea value={this.state.actualMessage} onKeyUp={this.handleFinishEdit.bind(this)} onChange={this.handleInput.bind(this)} className='input-message' type='text' placeholder='Digite uma mensagem: ' />
            </div>
        )
    }
}