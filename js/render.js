var bpm = 60;
var min = 4;
var count = bpm * min;
var length = (count / 4);
var width = (380 / length);

function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var styles = ['green', 'orange', 'red', 'purple', 'blue', 'grey', 'pink', 'turquoise', 'yellow']
    for (var i = 0; i < count; i++) {
      ctx.fillStyle = styles[(i % (styles.length - 1))];
      var side = Math.floor(i / length);
      if (side == 0) {
        ctx.fillRect(60 + (width * (i % length)), 50, width, 10);
      } else if (side == 1) {
        ctx.fillRect(440, 60 + (width * (i % length)), 10, width);
      } else if (side == 2) {
        ctx.fillRect(440 - width - (width * (i % length)), 440, width, 10);
      } else if (side == 3) {
        ctx.fillRect(50, 440 - width - (width * (i % length)), 10, width);
      }
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 50, 10, 10);
    ctx.fillRect(440, 50, 10, 10);
    ctx.fillRect(50, 440, 10, 10);
    ctx.fillRect(440, 440, 10, 10);
  }
}

function getCoordinates(beat) {
  side = Math.floor(beat / length);
  position = (beat % length);
  if (side % 2 == 0) {
    var x_length = 5;
    var y_length = 10;
  } else {
    var x_length = 10;
    var y_length = 5;
  }
  if (side == 0) {
    var x = 60 + (width * position) + (width / 2);
    var y = 60;
  } else if (side == 1) {
    var x = 440;
    var y = 60 + (width * position) + (width / 2);
  } else if (side == 2) {
    var x = 435 - (width * position) + (width / 2);
    var y = 440;
  } else if (side == 3) {
    var x = 60;
    var y = 435 - (width * position) + (width / 2);
  }
  return {
    'x': x,
    'y': y,
    'x_length': x_length,
    'y_length': y_length,
    'side': side
  }
}

function showPaths(beat1, beat2) {
  obj1 = getCoordinates(beat1);
  obj2 = getCoordinates(beat2);
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(obj1.x, obj1.y);
    if (obj1.x != obj2.x && obj1.y != obj2.y) {
      ctx.quadraticCurveTo(obj1.x, obj2.y, obj2.x, obj2.y);
    } else if (obj1.x == obj2.x) {
      ctx.quadraticCurveTo(250, obj2.y, obj2.x, obj2.y);
    } else if (obj1.y == obj2.y) {
      ctx.quadraticCurveTo(obj1.x, 250, obj2.x, obj2.y);
    }
    ctx.stroke();
  }
}


function updateSquare(beat1s, beat2s) {
  var i = 0;
  window.setInterval(function() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var styles = ['green', 'orange', 'red', 'purple', 'blue', 'grey', 'pink', 'turquoise', 'yellow']
      var j = i - 1;
      if (j == -1) {
        j = count - 1;
      }
      ctx.fillStyle = 'white';
      var side = Math.floor((j % count) / length);
      if (side == 0) {
        ctx.fillRect(60 + (width * (j % length)) - 2, 40, width + 2.5, 10);
      } else if (side == 1) {
        ctx.fillRect(450, 60 + (width * (j % length)) - 2, 10, width + 2.5);
      } else if (side == 2) {
        ctx.fillRect(440 - (width * ((j % length) + 1)) - 2, 450, width + 2.5, 10);
      } else if (side == 3) {
        ctx.fillRect(40, 440 - (width * ((j % length) + 1)) - 2, 10, width + 2.5);
      }
      if (beat1s.includes(i % count)) {
        var random = Math.floor(Math.random() * 2);
        if (random == 1) {
          i = beat2s[beat1s.indexOf(i % count)];
        }
      } else if (beat2s.includes(i % count)) {
        var random = Math.floor(Math.random() * 2);
        if (random == 1) {
          i = beat1s[beat2s.indexOf(i % count)];
        }
      }
      ctx.fillStyle = styles[(i % (styles.length - 1))];
      var side = Math.floor((i % count) / length);
      if (side == 0) {
        ctx.fillRect(60 + (width * (i % length)), 40, width, 10);
      } else if (side == 1) {
        ctx.fillRect(450, 60 + (width * (i % length)), 10, width);
      } else if (side == 2) {
        ctx.fillRect(440 - (width * ((i % length) + 1)), 450, width, 10);
      } else if (side == 3) {
        ctx.fillRect(40, 440 - (width * ((i % length) + 1)), 10, width);
      }
    }
    i++;
  }, 200);
}


draw();


// test
function test() {
  var beats = [
    [20, 40],
    [70, 130],
    [180, 220],
    [50, 200],
    [180, 100],
    [130, 40]
  ];
  var beat1s = [];
  var beat2s = [];
  for (var i = 0; i < beats.length; i++) {
    showPaths(beats[i][0], beats[i][1]);
    beat1s.push(beats[i][0]);
    beat2s.push(beats[i][1]);
  }
  updateSquare(beat1s, beat2s);
}
test();