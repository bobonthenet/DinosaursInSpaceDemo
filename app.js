(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _boot = require('scenes/boot');

var _boot2 = _interopRequireDefault(_boot);

var _default = require('scenes/default');

var _default2 = _interopRequireDefault(_default);

var _menu = require('scenes/menu');

var _menu2 = _interopRequireDefault(_menu);

var _DiSScene = require('scenes/DiSScene');

var _DiSScene2 = _interopRequireDefault(_DiSScene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = new Phaser.Game({

  // See <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>

  width: 800,
  height: 600,
  // zoom: 1,
  // resolution: 1,
  type: Phaser.AUTO,
  // parent: null,
  // canvas: null,
  // canvasStyle: null,
  // seed: null,
  title: '☕️ Brunch with Phaser', // 'My Phaser 3 Game'
  url: 'https://github.com/samme/brunch-phaser-es6',
  version: '0.0.1',
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: true,
  //   gamepad: false
  // },
  // disableContextMenu: false,
  // banner: false
  banner: {
    // hidePhaser: false,
    // text: 'white',
    background: ['#e54661', '#ffa644', '#998a2f', '#2c594f', '#002d40']
  },
  // fps: {
  //   min: 10,
  //   target: 60,
  //   forceSetTimeout: false,
  // },
  // pixelArt: false,
  // transparent: false,
  // clearBeforeRender: true,
  // backgroundColor: 0x000000, // black
  loader: {
    // baseURL: '',
    path: 'assets/',
    maxParallelDownloads: 6
    // crossOrigin: 'anonymous',
    // timeout: 0
  },
  physics: {
    default: 'matter',
    matter: {
      enableSleep: true
    }
  },
  scene: [_boot2.default, _default2.default, _menu2.default, _DiSScene2.default]

});
});

require.register("scenes/DiSScene.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player = require('../sprites/Player');

var _Player2 = _interopRequireDefault(_Player);

var _Troodon = require('../sprites/Troodon');

var _Troodon2 = _interopRequireDefault(_Troodon);

var _BadRex = require('../sprites/BadRex');

var _BadRex2 = _interopRequireDefault(_BadRex);

var _Tanky = require('../sprites/Tanky');

var _Tanky2 = _interopRequireDefault(_Tanky);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DiSScene = function (_Phaser$Scene) {
  _inherits(DiSScene, _Phaser$Scene);

  function DiSScene() {
    _classCallCheck(this, DiSScene);

    return _possibleConstructorReturn(this, (DiSScene.__proto__ || Object.getPrototypeOf(DiSScene)).call(this, 'DiSScene'));
  }

  _createClass(DiSScene, [{
    key: 'preload',
    value: function preload() {
      this.load.image('tiles', 'tiles_spritesheet.png');
      this.load.tilemapTiledJSON('map', 'level.json');
      this.load.image('spark', 'blue.png');
      this.load.spritesheet('rex', 'rex.png', { frameWidth: 528, frameHeight: 294 });
      this.load.image('troodon', 'troodon.png');
      this.load.image('tanky', 'tanky.png');
      this.load.image('badrex', 'badrex.png');
      this.load.image('bullet', 'bullet.png');
    }
  }, {
    key: 'create',
    value: function create() {
      var _this2 = this;

      this.map = this.make.tilemap({ key: 'map' });
      this.tileset = this.map.addTilesetImage('tiles_spritesheet', 'tiles');
      this.collisionLayer = this.map.createDynamicLayer(0, this.tileset, 0, 0);

      this.collisionLayer.setCollisionByProperty({ collides: true });

      this.matter.world.convertTilemapLayer(this.collisionLayer);
      this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);

      this.enemyGroup = this.add.group();

      this.map.getObjectLayer('enemies').objects.forEach(function (enemy) {
        var enemyObject = void 0;
        switch (enemy.name) {
          case 'troodon':
            enemyObject = new _Troodon2.default({
              scene: _this2,
              key: 'troodon',
              x: enemy.x,
              y: enemy.y
            });
            break;
          case 'badrex':
            enemyObject = new _BadRex2.default({
              scene: _this2,
              key: 'badrex',
              x: enemy.x,
              y: enemy.y
            });
            break;
          case 'tanky':
            enemyObject = new _Tanky2.default({
              scene: _this2,
              key: 'tanky',
              x: enemy.x,
              y: enemy.y
            });
            break;
          default:
            console.error('Unknown:', _this2.tileset.tileProperties[enemy.gid - 1]);
            break;
        }
        _this2.enemyGroup.add(enemyObject);
      });

      this.player = new _Player2.default({
        scene: this,
        key: 'rex',
        x: 300,
        y: 300
      });

      this.anims.create({
        key: 'rexFly',
        frames: this.anims.generateFrameNumbers('rex', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
      });

      this.player.anims.play('rexFly', true);

      this.cameras.main.setBounds();

      //TODO: I think I'm going to need a group of emitters for multiple explosions. Might be a bug with that though.
      var particles = this.add.particles('spark');
      this.emitter = particles.createEmitter();
      this.emitter.setSpeed(200);
      this.emitter.setBlendMode(Phaser.BlendModes.ADD);
      this.emitter.on = false;

      //TODO: I think this strategy needs to be completely rethought.
      this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        if (bodyA.gameObject.constructor.name !== 'MatterTileBody' && bodyB.gameObject.constructor.name !== 'MatterTileBody') {
          if (bodyA.gameObject.active) {
            bodyA.gameObject.death(bodyB.gameObject);
          }
          if (bodyB.gameObject.active) {
            bodyB.gameObject.death(bodyA.gameObject);
          }
        }
      }, this);

      this.keys = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      };
    }
  }, {
    key: 'update',
    value: function update() {
      this.player.update();
      this.enemyGroup.children.entries.forEach(function (sprite) {
        sprite.update();
      });
      this.cameras.main.scrollX += 2;
    }
  }, {
    key: 'explosion',
    value: function explosion(x, y) {
      this.emitter.setPosition(x, y);
      this.emitter.on = true;
      this.time.delayedCall(1500, function () {
        this.emitter.on = false;
      }, [], this);
    }
  }]);

  return DiSScene;
}(Phaser.Scene);

exports.default = DiSScene;
});

;require.register("scenes/boot.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Boot = function (_Phaser$Scene) {
  _inherits(Boot, _Phaser$Scene);

  function Boot() {
    _classCallCheck(this, Boot);

    var _this = _possibleConstructorReturn(this, (Boot.__proto__ || Object.getPrototypeOf(Boot)).call(this, 'boot'));

    _this.progressBar = null;
    _this.progressBarRectangle = null;
    return _this;
  }

  _createClass(Boot, [{
    key: 'preload',
    value: function preload() {
      this.load.image('sky', 'space3.png');
      this.load.image('logo', 'phaser3-logo.png');
      this.load.image('red', 'red.png');
      this.load.on('progress', this.onLoadProgress, this);
      this.load.on('complete', this.onLoadComplete, this);
      this.createProgressBar();
    }
  }, {
    key: 'create',
    value: function create() {
      this.scene.start('menu');
    }

    // extend:

  }, {
    key: 'createProgressBar',
    value: function createProgressBar() {
      var main = this.cameras.main;
      this.progressBarRectangle = new Phaser.Geom.Rectangle(0, 0, 0.5 * main.width, 50);
      Phaser.Geom.Rectangle.CenterOn(this.progressBarRectangle, 0.5 * main.width, 0.5 * main.height);
      this.progressBar = this.add.graphics();
    }
  }, {
    key: 'onLoadComplete',
    value: function onLoadComplete(loader) {
      console.log('onLoadComplete', loader);
      this.progressBar.destroy();
    }
  }, {
    key: 'onLoadProgress',
    value: function onLoadProgress(progress) {
      var rect = this.progressBarRectangle;
      var color = this.load.failed.size > 0 ? 0xff2200 : 0xffffff;
      this.progressBar.clear().fillStyle(0x222222).fillRect(rect.x, rect.y, rect.width, rect.height).fillStyle(color).fillRect(rect.x, rect.y, progress * rect.width, rect.height);
      console.log('progress', progress);
    }
  }]);

  return Boot;
}(Phaser.Scene);

exports.default = Boot;
});

;require.register("scenes/default.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Default = function (_Phaser$Scene) {
  _inherits(Default, _Phaser$Scene);

  function Default() {
    _classCallCheck(this, Default);

    var _this = _possibleConstructorReturn(this, (Default.__proto__ || Object.getPrototypeOf(Default)).call(this, 'default'));

    _this.score = null;
    return _this;
  }

  _createClass(Default, [{
    key: 'init',
    value: function init(data) {
      console.log('init', this.scene.key, data, this);
      this.score = 0;
    }
  }, {
    key: 'create',
    value: function create() {
      var sky = this.add.image(400, 300, 'sky');
      sky.alpha = 0.5;
      var particles = this.add.particles('red');
      var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });
      var logo = this.physics.add.image(400, 100, 'logo');
      logo.setVelocity(100, 200);
      logo.setBounce(1, 1);
      logo.setCollideWorldBounds(true);
      emitter.startFollow(logo);
      this.input.keyboard.once('keydown_Q', this.quit, this);
    }
  }, {
    key: 'update',
    value: function update() {
      this.score += 1;
    }

    // extend:

  }, {
    key: 'quit',
    value: function quit() {
      this.scene.start('menu', { score: this.score });
    }
  }]);

  return Default;
}(Phaser.Scene);

exports.default = Default;
});

;require.register("scenes/menu.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FONT = 'Futura,system-ui,sans-serif';

var Menu = function (_Phaser$Scene) {
  _inherits(Menu, _Phaser$Scene);

  function Menu() {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, 'menu'));

    _this.highScore = null;
    return _this;
  }

  _createClass(Menu, [{
    key: 'init',
    value: function init(data) {
      console.log('init', this.scene.key, data, this);
      this.highScore = data.score || 0;
    }
  }, {
    key: 'create',
    value: function create() {
      var sky = this.add.image(400, 300, 'sky');
      sky.alpha = 0.25;
      this.add.text(400, 300, 'START', {
        fill: 'white',
        fontFamily: FONT,
        fontSize: 48
      }).setOrigin(0.5).setShadow(0, 1, '#62F6FF', 10);
      this.add.text(400, 450, 'High Score: ' + this.highScore, {
        fill: '#FED141',
        fontFamily: FONT,
        fontSize: 24
      }).setOrigin(0.5).setShadow(0, 1, 'black', 5);
      this.input.on('pointerup', this.start, this);
    }

    // extend:

  }, {
    key: 'start',
    value: function start() {
      this.scene.start('DiSScene');
    }
  }]);

  return Menu;
}(Phaser.Scene);

exports.default = Menu;
});

;require.register("sprites/BadRex.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Enemy2 = require('./Enemy');

var _Enemy3 = _interopRequireDefault(_Enemy2);

var _Bullet = require('./Bullet');

var _Bullet2 = _interopRequireDefault(_Bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BadRex = function (_Enemy) {
  _inherits(BadRex, _Enemy);

  function BadRex(config) {
    _classCallCheck(this, BadRex);

    var _this = _possibleConstructorReturn(this, (BadRex.__proto__ || Object.getPrototypeOf(BadRex)).call(this, config));

    _this.lastFired = 0;
    _this.setIgnoreGravity(true);
    _this.bullets = _this.scene.add.group();
    var bullet = void 0;
    for (var i = 0; i < 10; i++) {
      bullet = new _Bullet2.default({
        scene: _this.scene,
        key: 'bullet',
        x: 0,
        y: 0
      });
      _this.bullets.add(bullet);
    }
    return _this;
  }

  _createClass(BadRex, [{
    key: 'update',
    value: function update() {
      if (!this.activated()) {
        return;
      }
      var time = this.scene.time.now;

      this.bullets.children.entries.forEach(function (bullet) {
        bullet.update();
      });

      if (time > this.lastFired) {
        var _bullet = this.bullets.get();

        if (_bullet) {
          _bullet.fire(this.x, this.y, -25, 0, -90, 0);
          this.lastFired = time + 2000;
        }
      }

      //rudimentary AI
      if (this.scene.player.alive) {
        if (this.scene.player.y > this.y) {
          this.setVelocityY(1);
        } else {
          this.setVelocityY(-1);
        }
      }

      this.setVelocityX(-2);
    }
  }]);

  return BadRex;
}(_Enemy3.default);

exports.default = BadRex;
});

;require.register("sprites/Bullet.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_Phaser$GameObjects$S) {
  _inherits(Bullet, _Phaser$GameObjects$S);

  function Bullet(config) {
    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, config.scene, config.x, config.y, config.key));

    config.scene.add.existing(_this);
    _this.setActive(false);
    _this.setVisible(false);
    return _this;
  }

  _createClass(Bullet, [{
    key: "fire",
    value: function fire(x, y, velocityX, velocityY, offsetX, offsetY) {
      this.scene.matter.add.gameObject(this);
      this.setIgnoreGravity(true);
      this.setPosition(x + offsetX, y + offsetY);
      this.setVelocityX(velocityX);
      this.setVelocityY(velocityY);
      this.setActive(true);
      this.setVisible(true);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.active) {
        if (this.x > this.scene.cameras.main.scrollX + this.scene.cameras.main.width) {
          this.death();
        }
      }
    }
  }, {
    key: "death",
    value: function death() {
      this.scene.matter.world.remove(this);
      this.setPosition(0, 0);
      this.setVelocityX(0);
      this.setActive(false);
      this.setVisible(false);
    }
  }]);

  return Bullet;
}(Phaser.GameObjects.Sprite);

exports.default = Bullet;
});

;require.register("sprites/Enemy.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Generic enemy class that extends Phaser sprites.
Classes for enemy types extend this class.
*/

var Enemy = function (_Phaser$GameObjects$S) {
  _inherits(Enemy, _Phaser$GameObjects$S);

  function Enemy(config) {
    _classCallCheck(this, Enemy);

    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, config.scene, config.x, config.y, config.key));

    config.scene.matter.add.gameObject(_this);
    config.scene.add.existing(_this);
    _this.enemy = true;
    _this.alive = true;
    // start still and wait until needed
    _this.setVelocity(0, 0);
    _this.beenSeen = false;
    // know about Player
    _this.player = _this.scene.player;
    // Base horizontal velocity / direction.
    _this.direction = -50;
    _this.setFixedRotation(true);
    _this.setScale(.25);
    _this.setFrictionAir(0.05);
    _this.setMass(30);
    return _this;
  }

  _createClass(Enemy, [{
    key: "activated",
    value: function activated() {
      // Method to check if an enemy is activated, the enemy will stay put
      // until activated so that starting positions is correct
      if (!this.alive) {
        if (this.y > 240) {
          this.kill();
        }
        return false;
      }
      if (!this.beenSeen) {
        // check if it's being seen now and if so, activate it
        if (this.x < this.scene.cameras.main.scrollX + this.scene.sys.game.canvas.width + 80) {
          this.beenSeen = true;
          return true;
        }
        return false;
      }
      return true;
    }
  }, {
    key: "death",
    value: function death() {
      this.scene.matter.world.remove(this);
      this.scene.explosion(this.x, this.y);
      this.destroy();
    }
  }]);

  return Enemy;
}(Phaser.GameObjects.Sprite);

exports.default = Enemy;
});

;require.register("sprites/Player.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bullet = require('../sprites/Bullet');

var _Bullet2 = _interopRequireDefault(_Bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_Phaser$GameObjects$S) {
  _inherits(Player, _Phaser$GameObjects$S);

  function Player(config) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, config.scene, config.x, config.y, config.key));

    config.scene.matter.add.gameObject(_this);
    config.scene.add.existing(_this);
    _this.setIgnoreGravity(true);
    _this.setFixedRotation(true);
    _this.setScale(.25);
    _this.setFrictionAir(0.05);
    _this.setMass(30);
    _this.lastFired = 0;

    _this.bullets = _this.scene.add.group();
    var bullet = void 0;
    for (var i = 0; i < 20; i++) {
      bullet = new _Bullet2.default({
        scene: _this.scene,
        key: 'bullet',
        x: 0,
        y: 0
      });
      _this.bullets.add(bullet);
    }
    return _this;
  }

  _createClass(Player, [{
    key: 'update',
    value: function update() {
      if (!this.active) {
        return;
      }
      this.bullets.children.entries.forEach(function (bullet) {
        bullet.update();
      });

      //I feel like there must be a better way to do this.
      if (this.angle !== 0) {
        this.setAngle(0);
      }

      var time = this.scene.time.now;
      var keys = this.scene.keys;
      var input = {
        left: keys.left.isDown,
        right: keys.right.isDown,
        down: keys.down.isDown,
        up: keys.up.isDown,
        space: keys.space.isDown
      };

      if (this.active) {
        if (input.left) {
          this.thrustBack(0.1);
        } else if (input.right) {
          this.thrust(0.1);
        }
        if (input.up) {
          this.thrustLeft(0.1);
        } else if (input.down) {
          this.thrustRight(0.1);
        }

        if (input.space && time > this.lastFired) {
          var _bullet = this.bullets.get();
          if (_bullet) {
            _bullet.fire(this.x, this.y, 25, 0, 90, 0);
            this.lastFired = time + 500;
          }
        }
      }
    }
  }, {
    key: 'death',
    value: function death(whoKilledMe) {
      console.log(whoKilledMe);
      this.scene.matter.world.remove(this);
      this.scene.explosion(this.x, this.y);

      this.scene.time.delayedCall(3000, function () {
        this.scene.start('menu');
      }, [], this.scene);
      this.destroy();
    }
  }]);

  return Player;
}(Phaser.GameObjects.Sprite);

exports.default = Player;
});

;require.register("sprites/Tanky.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Enemy2 = require('./Enemy');

var _Enemy3 = _interopRequireDefault(_Enemy2);

var _Bullet = require('./Bullet');

var _Bullet2 = _interopRequireDefault(_Bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tanky = function (_Enemy) {
  _inherits(Tanky, _Enemy);

  function Tanky(config) {
    _classCallCheck(this, Tanky);

    var _this = _possibleConstructorReturn(this, (Tanky.__proto__ || Object.getPrototypeOf(Tanky)).call(this, config));

    _this.bullets = _this.scene.add.group();
    _this.lastFired = 0;
    var bullet = void 0;
    for (var i = 0; i < 10; i++) {
      bullet = new _Bullet2.default({
        scene: _this.scene,
        key: 'bullet',
        x: 0,
        y: 0
      });
      _this.bullets.add(bullet);
    }
    return _this;
  }

  _createClass(Tanky, [{
    key: 'update',
    value: function update() {
      if (!this.activated()) {
        return;
      }
      var time = this.scene.time.now;

      this.bullets.children.entries.forEach(function (bullet) {
        bullet.update();
      });

      if (time > this.lastFired) {
        var _bullet = this.bullets.get();

        if (_bullet) {
          _bullet.fire(this.x, this.y, -10, -5, -60, -70);
          _bullet.setIgnoreGravity(false);
          this.lastFired = time + 2000;
        }
      }
      this.setVelocityX(-1);
    }
  }]);

  return Tanky;
}(_Enemy3.default);

exports.default = Tanky;
});

;require.register("sprites/Troodon.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Enemy2 = require('./Enemy');

var _Enemy3 = _interopRequireDefault(_Enemy2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Troodon = function (_Enemy) {
  _inherits(Troodon, _Enemy);

  function Troodon(config) {
    _classCallCheck(this, Troodon);

    var _this = _possibleConstructorReturn(this, (Troodon.__proto__ || Object.getPrototypeOf(Troodon)).call(this, config));

    _this.setIgnoreGravity(true);
    return _this;
  }

  _createClass(Troodon, [{
    key: 'update',
    value: function update() {
      if (!this.activated()) {
        return;
      }
      this.setVelocityX(-2);
    }
  }]);

  return Troodon;
}(_Enemy3.default);

exports.default = Troodon;
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');
//# sourceMappingURL=app.js.map