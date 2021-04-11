import React, { Component } from 'react';
import model from './model/model';
import Home from './pages/Home';

class App extends Component {

    constructor(props){
        super(props)

        this.model = new model();
    }

    render() {
        return(
        <Home model={this.model}/>
        );
    }
}

export default App