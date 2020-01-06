qKit.init({
  width: 320,
  height: 480,
  color: "#EEE",
  border: { width: 10, color: "#222", radius: 10 }
});

const PAD_WIDTH = 10;
const PAD_HEIGHT = 60;
const QUAD_SIZE = 15;
let leftPadScore = 0;
let rightPadScore = 0;

const leftPad = qKit.draw.quad({
  x: 0,
  y: qKit.screen.height / 2 - PAD_HEIGHT / 2,
  width: PAD_WIDTH,
  height: PAD_HEIGHT,
  color: 'orange',
  extension: { vel: { x: 0, y: 4 } }
});

const rightPad = qKit.draw.quad({
  x: qKit.screen.width - PAD_WIDTH,
  y: qKit.screen.height / 2 - 30,
  width: PAD_WIDTH,
  height: PAD_HEIGHT,
  color: '#4488FF',
  extension: { vel: { x: 0, y: 4 }}
});

const ground = qKit.draw.quad({
  x: 0,
  y: qKit.screen.height - 20,
  width:  qKit.screen.width,
  height: 20,
  color: '#111',
});

const roof = qKit.draw.quad({
  x: 0,
  y: 0,
  width:  qKit.screen.width,
  height: 20,
  color: '#111',
});

// pong object
const quad = qKit.draw.quad({
  x: qKit.screen.width / 2,
  y: qKit.screen.height / 2,
  width: QUAD_SIZE,
  height: QUAD_SIZE,
  color: 'teal',
  extension: {
    dir: {
      x: [-1, 1][qKit.util.randomInt(0, 2)],
      y: [-1, 1][qKit.util.randomInt(0, 2)]
    },
    vel: {
      x: qKit.util.randomInt(3, 5),
      y: qKit.util.randomInt(3, 5)
    }
  }
});

const scoresText = qKit.draw.text({
  text: '0:0',
  x: qKit.screen.width / 2 - 25,
  y: 30,
  color: '#555',
  size: 30,
  family: 'Courier New'
});

// left-pad controller
qKit.input.click(() => {
  leftPad.extension.vel.y *= -1;
});

// right-pad controller
qKit.input.keyUp(() => {
  rightPad.extension.vel.y *= -1;
});

qKit.update(() => {
  quad.x += quad.extension.vel.x * quad.extension.dir.x;
  quad.y += quad.extension.vel.y * quad.extension.dir.y;
  leftPad.y += leftPad.extension.vel.y;
  rightPad.y += rightPad.extension.vel.y;

  const isCollideWithPad =
    qKit.collision.test(quad, leftPad) ||
    qKit.collision.test(quad, rightPad);

  if (isCollideWithPad)
    quad.extension.vel.x *= -1;

  if (quad.x < leftPad.getLeft().x) {
    rightPadScore ++;
    scoresText.text = `${leftPadScore}:${rightPadScore}`;
    resetQuad();
  } else
  if (quad.x > rightPad.getLeft().x) {
    leftPadScore ++;
    scoresText.text = `${leftPadScore}:${rightPadScore}`;
    resetQuad();
  }

  bouncePad(leftPad);
  bouncePad(rightPad);
  bouncePad(quad);
});

// bounce back the passed pad once it hits top/bottom borders
const bouncePad = function(entity) {
  const isCollideBorders =
    qKit.collision.test(entity, ground) ||
    qKit.collision.test(entity, roof);

  if (isCollideBorders)
    entity.extension.vel.y *= -1;
};

const resetQuad = function() {
  quad.center();
  quad.extension.dir.x = [-1, 1][qKit.util.randomInt(0, 2)];
  quad.extension.dir.y = [-1, 1][qKit.util.randomInt(0, 2)];
  quad.extension.vel.x = qKit.util.randomInt(3, 5);
  quad.extension.vel.y = qKit.util.randomInt(3, 5);
};
