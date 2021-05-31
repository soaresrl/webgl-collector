import line from "../curves/line";

const COMMANDS = {
    insert_curve: function (parameters, Api){
        const curve = new line(parameters[0], parameters[1], parameters[2], parameters[3]);
        Api.insertCurve(curve);
    }
}

export default class CommandLine {

    static getCommands () {
        return COMMANDS
    }

    static run(command, parameters, model, Api){
        for( let [key, value] of Object.entries(COMMANDS)){
            if (key == command) {
                value(parameters, Api);
            }
        }
    }
}