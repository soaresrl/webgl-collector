export default class Mouse {


    static getPosition (e) {
        
        const canvas = document.getElementById('canvas');
        let x = e.clientX; // The x coordinate of the mouse click
        let y = e.clientY; // the y coordinate of the mouse click
     
        //Get the coordinates of the canvas in the client area of ​​the browser
        const rect = e.target.getBoundingClientRect() ;
        //This is mainly to convert the coordinates of the client area to the coordinates of the canvas, and then to the coordinates of the webgl
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
      

        return {x, y}
    }
}