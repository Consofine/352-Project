var bpm = 120;
var seconds = 194;
var count = bpm * seconds / 60;
var length = (count / 4);
var width = (380 / length);
console.log(length);

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
      ctx.quadraticCurveTo(250, 250, obj2.x, obj2.y);
      // ctx.bezierCurverTo(250, 250, obj1.x, obj2.)
    } else if (obj1.x == obj2.x) {
      ctx.quadraticCurveTo(250, obj2.y, obj2.x, obj2.y);
    } else if (obj1.y == obj2.y) {
      ctx.quadraticCurveTo(obj1.x, 250, obj2.x, obj2.y);
    }
    ctx.stroke();
  }
}


function updateSquare(beat1s, beat2s, audio) {
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
        ctx.fillRect(60 + (width * (j % length)) - 2, 40, width + 3, 10);
      } else if (side == 1) {
        ctx.fillRect(450, 60 + (width * (j % length)) - 2, 10, width + 3);
      } else if (side == 2) {
        ctx.fillRect(440 - (width * ((j % length) + 1)) - 2, 450, width + 3, 10);
      } else if (side == 3) {
        ctx.fillRect(40, 440 - (width * ((j % length) + 1)) - 2, 10, width + 3);
      }
      if (beat1s.includes(i % count)) {
        if (beat1s[beat1s.length - 1] == (i % count)) {
          i = beat2s[beat1s.indexOf(i % count)];
          audio.currentTime = (i % count) * 60 / bpm;
        } else {
          var random = Math.floor(Math.random() * 2);
          if (random == 1 && beat1s.indexOf(i % count) != beat1s.length - 1) {
            i = beat2s[beat1s.indexOf(i % count)];
            audio.currentTime = (i % count) * 60 / bpm;
          }
        }
      } else if (beat2s.includes(i % count)) {
        if (beat2s[beat2s.length - 1] == (i % count)) {
          i = beat1s[beat2s.indexOf(i % count)];
          audio.currentTime = (i % count) * 60 / bpm;
        } else {
          var random = Math.floor(Math.random() * 2);
          if (random == 1 && beat2s.indexOf(i % count) != beat2s.length - 1) {
            i = beat1s[beat2s.indexOf(i % count)];
            audio.currentTime = (i % count) * 60 / bpm;
          }
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
  }, (1000 / (bpm / 60)));
}


draw();



var beats = [
[45, 164],
[56, 175],
[57, 176],
[58, 177],
[59, 178],
[60, 195],
[61, 180],
[62, 181],
[63, 182],
[64, 183],
[65, 200],
[67, 186], 68: 187, 69: 188, 70: 189, 71: 190, 72: 191, 73: 192, 74: 193, 75: 194, 76: 195, 77: 196, 78: 197, 79: 198, 80: 199, 82: 201, 83: 202, 85: 204, 86: 205, 87: 206, 88: 302, 89: 303, 90: 304, 91: 210, 92: 211, 93: 307, 94: 308, 95: 214, 96: 215, 97: 216, 98: 312, 99: 218, 101: 220, 102: 316, 103: 317, 104: 223, 105: 224, 106: 320, 164: 45, 175: 56, 176: 57, 177: 58, 178: 59, 180: 61, 181: 62, 182: 63, 183: 64, 184: 65, 186: 67, 187: 68, 188: 69, 189: 70, 190: 71, 191: 72, 192: 73, 193: 74, 194: 75, 195: 76, 196: 77, 197: 78, 198: 79, 199: 80, 200: 65, 201: 82, 202: 83, 204: 85, 205: 86, 206: 87, 207: 88, 208: 89, 209: 90, 210: 91, 211: 92, 212: 307, 213: 308, 214: 95, 215: 96, 216: 311, 217: 312, 218: 99, 220: 101, 221: 316, 222: 317, 223: 104, 224: 105, 225: 320, 226: 321, 237: 332, 238: 333, 242: 337, 246: 341, 254: 349, 257: 352, 260: 355, 265: 360, 302: 88, 303: 89, 304: 90, 307: 212, 308: 213, 311: 216, 312: 217, 316: 221, 317: 222, 320: 225, 321: 226, 332: 237, 333: 238, 337: 242, 341: 246, 349: 254, 352: 257, 355: 260, 360: 265
}
];
var beat1s = [];
var beat2s = [];
for (var i = 0; i < beats.length; i++) {
  showPaths(beats[i][0], beats[i][1]);
  beat1s.push(beats[i][0]);
  beat2s.push(beats[i][1]);
}


var audio = new Audio('./songs/call-me-maybe.mp3');
// audio.play();
// updateSquare(beat1s, beat2s, audio);