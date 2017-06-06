var $canvas = document.querySelector("canvas");
var context = $canvas.getContext("2d");

var app = {};

app.food = {
  location: {},
  create: function(){
    this.location.x = parseInt( Math.random() * 290 );
    this.location.y = parseInt( Math.random() * 290 );
    app.movement.render( this.location, "red" );
  }
}; // End food

app.snake = {
  body: {
    direction: "up",
    size: 10,
    segments: [{ x: 150, y: 150 },{ x: 150, y: 160 },{ x: 150, y: 170 }],
    alive: true
  },

  grow: function(){
    var head = JSON.parse(JSON.stringify( app.snake.body.segments[0] ));
    app.snake.body.segments.unshift( app.movement.directionStep( head ) );
  }
}; // End snake

app.movement = {

    directionStep: function( segment ){
      if( app.snake.body.direction === "up" ){
        segment.y -= 10;
      } else if ( app.snake.body.direction === "down" ){
        segment.y += 10;
      } else if ( app.snake.body.direction === "left" ){
        segment.x -= 10;
      } else {
        segment.x += 10;
      }
      return segment;
    },

    render: function( segment, color ){
        context.fillStyle = color;
        context.fillRect( segment.x, segment.y, app.snake.body.size, app.snake.body.size );
    },

    intersection: function( head, item ) {
      return !(item.x > head.x + 9 ||
               item.x + 9 < head.x ||
               item.y > head.y + 9 ||
               item.y + 9 < head.y);
    },

    checkBounds: function(){
      var head = app.snake.body.segments[0];

      if( head.x < 0 || head.x > 290 || head.y < 0 || head.y > 290 ){
        app.snake.body.alive = false;
        return;
      }

      for( var i = 1; i < app.snake.body.segments.length; i++ ){
        if( this.intersection( head, app.snake.body.segments[i] ) ){
          app.snake.body.alive = false;
          return;
        }
      }

        if( this.intersection( head, app.food.location ) ){
          app.snake.grow();
          app.food.create();
        }
    },

    step: function(){
      context.clearRect( 0, 0, 300, 300 );
      app.movement.render( app.food.location, "red" );
      app.snake.grow();
      app.snake.body.segments.pop();
      app.snake.body.segments.forEach( function( segment ){
        app.movement.render( segment, "green" );
      });
    }
}; // End movement

app.init = function(){
  app.food.create();
  app.snake.body.alive = true;
  app.snake.body.segments = [{ x: 150, y: 150 },{ x: 150, y: 160 },{ x: 150, y: 170 }];
  app.startMovement();
};

app.startMovement = function(){
  app.counter = window.setInterval( function(){
    if( app.snake.body.alive ){
        app.movement.step();
        app.movement.checkBounds();
      } else {
      clearInterval( app.counter );
    }
  }, 150 );
}


window.onload = function(){
  app.init();
}
