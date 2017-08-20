(function(){
    "use strict";

    var canvas = document.getElementById('canvas'),
        c = canvas.getContext('2d'),
        colors = ['#fff', '#ff9170', "#6b8bff", "#ffba26"],     // colors for stars
        num = (window.innerWidth + window.innerHeight) / 2,     // number of stars
        speed = 0.005,      // speed
        hx = canvas.width/2,
        hy = canvas.height/2;


    window.addEventListener('resize', init);

    function init(){
        c = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        num = (window.innerWidth + window.innerHeight) / 2;
        hx = canvas.width/2,
        hy = canvas.height/2;

        createPoints();
    }

    // random values from range [min, max] (inclusive)
    function rand(min, max){
        return Math.random() * (max - min + 1) + min;
    }

    function Star(){
        this.x = rand(0, canvas.width);
        this.y = rand(0, canvas.height);
        this.radius = rand(0, 1);
        this.color = colors[Math.floor(rand(0, colors.length - 1))];

        this.draw = function(){
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            c.fillStyle = this.color;
            c.fill();
        }
        this.update = function(){
            this.x += (this.x - hx) * this.radius * speed;
            this.y += (this.y - hy) * this.radius * speed;
            this.radius += speed * 3;

            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0){
                this.x = rand(0, canvas.width);
                this.y = rand(0, canvas.height);
                this.radius = 0;
            }
        }
    }

    var stars = [];

    function createPoints(){
        stars = [];
        for(var i = 0; i < num; i++){
            stars.push(new Star());
        }
    }

    init();

    function show(){
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for(var i = 0; i < stars.length; i++){
            stars[i].draw();
            stars[i].update();
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        show();
    }

    animate();
}());
