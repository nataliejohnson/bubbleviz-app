$(function(){
      	
    
  /**
   * We have to wrap evrything that will use the processing API around the sketch function so 
   * we can access the processing.* namespace.
   */ 
   var createSketch  = function(data){
    return function (processing) {

      /**
       * The Particle Object is responsible for movement and display of a particle.
       */
      var Particle = function(options){ 
        this.velMax = options.maxVel;
        this.pos = options.pos;
        this.colour = options.colour;
        this.accFunction = options.accFunction;
        
        this.oldPos = null;
        this.radius = 2;
        this.mass = 1;
        this.vel = new processing.PVector(0,0);
        this.acc = new processing.PVector(0,0);
      };
      
      Particle.prototype.updateVelocity = function(VMousePosition){
      
        this.vel.add( this.accFunction(VMousePosition, this.pos) );
        this.vel.limit(this.velMax);
      }
      
      Particle.prototype.updatePosition = function(VMousePosition){
        this.pos.add(this.vel);
        if(this.pos.x > processing.width || this.pos.x <0 ){
          this.vel.x *= -1;
        }
        if(this.pos.y > processing.height || this.pos.y <0 ){
          this.vel.y *= -1;
        }
      };
      
      Particle.prototype.update = function(VMousePosition){
        this.updateVelocity(VMousePosition);
        this.oldPos = new processing.PVector(this.pos.x, this.pos.y);
        this.updatePosition(VMousePosition);
      };
      
      Particle.prototype.draw = function(){
        //processing.fill(this.colour[0],this.colour[1],this.colour[2]);
        processing.stroke(this.colour[0],this.colour[1],this.colour[2]);
        processing.line(this.oldPos.x, this.oldPos.y, this.pos.x, this.pos.y);
        //processing.ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
        //processing.point(this.pos.x, this.pos.y);
      };



      var getNoise = function(amplitude){
        var noise = new processing.PVector(Math.random()*((Math.random()>0.5)?-1:1), Math.random()*((Math.random()>0.5)?-1:1));
        noise.normalize(); 
        noise.mult(amplitude);
        return noise;
      };


      /*
       * We define several potential field for our particles.
       * See the functions plotted at http://fooplot.com/plot/lqvbmcfj5g
       */
      var personalAccelerationFunction = function(VMousePosition, VParticlePosition){ 
        var accel = processing.PVector.sub(VMousePosition, VParticlePosition);
        var dist = accel.mag();
        
        var a = 0.01;
        accel.normalize();
        accel.mult(a*dist); // f = ax
        
        accel.add(getNoise(1));
        return accel;
      };
      
      var bothAccelerationFunction = function(VMousePosition, VParticlePosition){ 
        var mass = 1;
        var accel = processing.PVector.sub(VMousePosition, VParticlePosition);
        var dist = accel.mag();
        accel.normalize();

        var n = 100;
        
        var force;
        if( dist < n){
          // Sinusoid force = -sin(PI*dist/n) negative cause it's repulsive
          var theta = Math.PI * dist/n;
          var k = 10;
          force = -(Math.cos(theta)+1) * k; 
        }else{
          // Quadratic force = a(dist - n)^2 
          var a = 0.00005;
          force = Math.pow( (dist-n), 2) * a;
        }
        // f=ma
        accel.mult(force/mass);
        
        accel.add(getNoise(1));

        return accel;
      };

      var anonymousAccelerationFunction = function(VMousePosition, VParticlePosition){ 
        var mass = 1;
        var accel = processing.PVector.sub(VMousePosition, VParticlePosition);
        var dist = accel.mag();
        accel.normalize();

        var n = 100;
        
        // reciprocal repulsive force = -a/(dist-n)
        var a = 100;
        var force = -a/(dist)
        
        //weak quadratic attractive force = b(dist)^2
        var b = 0.000005;
        force += b*dist*dist;

        // f = ma
        accel.mult(force/mass);
        
        accel.add(getNoise(1));

        return accel;
      };
      







      var options = {
        "personal": {
          pos: new processing.PVector(0,0),
          maxVel: 10,
          accFunction: personalAccelerationFunction,
          colour: [255,0,0]
        },
        "both": {
          pos: new processing.PVector(0,0),
          maxVel: 10,
          accFunction: bothAccelerationFunction,
          colour: [0,255,0]
        },
        "anonymous": {
          pos: new processing.PVector(0,0),
          maxVel: 10,
          accFunction: anonymousAccelerationFunction,
          colour: [100,100,255]
        },
      };    
      
      
      var particles = [];

      var update = function(){
        var mouse = new processing.PVector(processing.mouseX, processing.mouseY);
        particles.forEach(function(particle){
          particle.update(mouse);
        });
      };

      var decayRate = 30;
      var tintLayer = null;
      var tintX,tintY;
      var decayAll = function(){
        processing.noStroke();
        processing.fill(0,decayRate);
        processing.rect(0,0,processing.width,processing.height);
      };

      processing.draw = function() {
        decayAll();
        update();
        
       	particles.forEach(function(particle){
          particle.draw();
        });
      };
      
      processing.setup = function(){
        for(var si = 0; si < data.length; si++){
          for(var ri = 0; ri<data[si].length; ri++){
            var result = data[si][ri];
            var particle = new Particle(
                $.extend({}, 
                  options[result.category], 
                  {pos: new processing.PVector(Math.random()*600,Math.random()*600)}
                )
              );
            particles.push(particle);
          }
        }

        processing.fill(255);
        processing.background(60);
        processing.noStroke();
      }
      processing.mousePressed = function() { processing.noLoop(); };
      processing.mouseReleased = function() { processing.loop(); };
    }
  };

  var canvas = document.getElementById("canvas");


  chrome.storage.local.get("searches", function(store){

    var data = store.searches.map(results_to_scores);
    var processing = new Processing(canvas, createSketch(data));
    
    $(window).on('resize', function(){
      processing.size($(window).width(),$(window).height());
    });
    
    processing.size($(window).width(),$(window).height());

  });
  
});

