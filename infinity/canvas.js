(function (){
    "use strict";

    var canvas = document.getElementById('canvas'),
    div = document.getElementById('loader'),
    c = canvas.getContext('2d'),
    width = div.offsetWidth,
    height = div.offsetHeight,
    radius = 2,         // radius of each point
    fraction = 125,     // num of points in each section
    size = 249,         // num of points shown during animation (each frame)
    grd = c.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width/2);
    grd.addColorStop(0, "#1CB5E0");
    grd.addColorStop(1, "#000046");

    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas(){
        c = canvas.getContext('2d');
        width = div.offsetWidth;
        height = div.offsetHeight;
        grd = c.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width/2);
        grd.addColorStop(0, "#1CB5E0");
        grd.addColorStop(1, "#000046");
        canvas.width = width;
        canvas.height = height;
        createPoints();
        createLines();
    }

    function Point(x, y){
        this.x = x;
        this.y = y;

        this.draw = function(){
            c.beginPath();
            c.arc(this.x, this.y, radius, 0, Math.PI*2, false);
            c.fillStyle = grd;
            c.fill();
            c.closePath();
        }
    }

    /*
    Quadratic Bézier Curve
    https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves
    */
    function findPoints(p0, p1, p2){
        var dx, dy, points = [];
        for(var t = 0; t < 1; t += 1/fraction){
            dx = Math.pow((1 - t), 2) * p0.x + 2*(1 - t) * t * p1.x + t * t * p2.x;
            dy = Math.pow((1 - t), 2) * p0.y + 2*(1 - t) * t * p1.y + t * t * p2.y;
            points.push(new Point(dx, dy));
        }
        return points;
    }


    var left, middle, right, c1, c2, c3, c4;

    function createPoints(){
        // points for bézier curves
        left = new Point(width*0.05, 0.5*height, 0);
        middle = new Point(0.5*width, 0.5*height, 0);
        right = new Point(width*0.95, 0.5*height, 0);

        // control points for bézier curves
        c1 = new Point(left.x, left.y*1.5, 0);
        c2 = new Point(right.x, right.y*0.5, 0);
        c3 = new Point(right.x, right.y*1.5, 0);
        c4 = new Point(left.x, left.y*0.5, 0);
    }

    var infinity;

    function createLines(){
        infinity = [];
        // gets 'fraction' points in each section
        var section1 = findPoints(left, c1, middle),  // bottom left section
        section2 = findPoints(middle, c2, right), // top right section
        section3 = findPoints(right, c3, middle), // bottom right section
        section4 = findPoints(middle, c4, left);  // top left section

        // push all points to array "infinity" in order (to help on animation later)
        Array.prototype.push.apply(infinity, section1);
        Array.prototype.push.apply(infinity, section2);
        Array.prototype.push.apply(infinity, section3);
        Array.prototype.push.apply(infinity, section4);
    }

    resizeCanvas();

    var l = 0,      // leftmost point in animation
    r = size;   // rightmost point in animation

    function animate() {
        requestAnimationFrame(animate);
        //c.clearRect(0, 0, width, height); // clear canvas
        canvas.width = canvas.width;

        c.moveTo(left.x, left.y); // start animation on left point

        // draw 'size' points each animation frame
        for(var i = l; i < r; i++){
            infinity[i].draw();
        }
        // if 'r' already reached the end of the array we need to start over without stopping the animation for the remaining points
        for (var i = 0; i < size - (infinity.length - l) && r == infinity.length; i++){
            infinity[i].draw();
        }
        if (l < infinity.length){
            l++;
        }
        if (r < infinity.length){
            r++;
        }
        else if (l >= infinity.length && r >= infinity.length){
            l = 0;
            r = size;
        }
    }

    animate();
    
}());
