(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
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
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, Chaplin, routes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  routes = require('routes');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.title = 'PS1 Expo';

    Application.prototype.mainSlug = "skate-video-parts-worth-watching";

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initRouter(routes);
      this.initDispatcher({
        controllerSuffix: '-controller'
      });
      this.initLayout();
      this.initComposer();
      this.initMediator();
      this.startRouting();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initMediator = function() {
      this.mediator = Chaplin.mediator;
      Chaplin.mediator.mainSlug = this.mainSlug;
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
});
window.require.register("config", function(exports, require, module) {
  var config, environment, environments, production, pusher_keys, staging;

  config = {
    api: {},
    pusher: {},
    errbit: {}
  };

  production = true;

  staging = false;

  environment = production ? 'production' : staging ? 'staging' : 'development';

  environments = {
    production: 'http://api.are.na/',
    staging: 'http://staging.are.na/',
    development: 'http://localhost:3000/'
  };

  pusher_keys = {
    production: '19beda1f7e2ca403abab',
    staging: '1f4ef2d9292c6ac10cdc',
    development: '944c5f601f3a394785f0'
  };

  config.env = environment;

  config.api.root = environments[environment];

  config.api.versionRoot = "" + config.api.root + "v2";

  config.pusher.key = pusher_keys[environment];

  module.exports = config;
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, HeaderView, SiteView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  SiteView = require('views/site-view');

  HeaderView = require('views/header-view');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Controller.prototype.beforeAction = function() {
      return this.compose('site', SiteView);
    };

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home-controller", function(exports, require, module) {
  var Channel, Chaplin, Controller, HomeController, PlayerView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Channel = require('models/channel');

  Chaplin = require('chaplin');

  PlayerView = require('views/player-view');

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.prototype.index = function() {
      var _this = this;

      this.model = new Channel({
        id: Chaplin.mediator.mainSlug
      });
      return this.model.fetch({
        success: function() {
          _this.model.afterSuccess();
          return _this.view = new PlayerView({
            collection: _this.model.get('contents')
          });
        }
      });
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    return (new Application).initialize();
  });
  
});
window.require.register("lib/support", function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
});
window.require.register("lib/utils", function(exports, require, module) {
  var Chaplin, utils;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  module.exports = utils;
  
});
window.require.register("lib/view-helper", function(exports, require, module) {
  var Chaplin,
    __slice = [].slice;

  Chaplin = require('chaplin');

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;

    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('url', function() {
    var options, params, routeName, _i;

    routeName = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
    return Chaplin.helpers.reverse(routeName, params);
  });

  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      return console.log(optionalValue);
    }
  });

  Handlebars.registerHelper('if_equals', function(thing, other_thing, options) {
    if (thing === other_thing) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  
});
window.require.register("models/base/collection", function(exports, require, module) {
  var Chaplin, Collection, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
});
window.require.register("models/base/model", function(exports, require, module) {
  var Chaplin, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Model;

  })(Chaplin.Model);
  
});
window.require.register("models/block", function(exports, require, module) {
  var Block, Chaplin, Model, config, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  Chaplin = require('chaplin');

  config = require('config');

  module.exports = Block = (function(_super) {
    __extends(Block, _super);

    function Block() {
      _ref = Block.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Block.prototype.isVimeo = function() {
      return this.get('embed').html.indexOf('vimeo') !== -1;
    };

    Block.prototype.isYouTube = function() {
      return this.get('embed').html.indexOf('youtube') !== -1;
    };

    Block.prototype.youtubeVideoId = function() {
      var reg;

      reg = new RegExp('(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})', 'g');
      return reg.exec(this.get('embed').html)[1];
    };

    Block.prototype.vimeoEmbed = function() {
      var html, regEx;

      html = this.get('embed').html;
      regEx = /(src)=["']([^"']*)["']/gi;
      return html.replace(regEx, function(all, type, value) {
        return "src=\"" + value + "?api=1\"";
      });
    };

    return Block;

  })(Model);
  
});
window.require.register("models/blocks", function(exports, require, module) {
  var Block, Blocks, Chaplin, Collection, config, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Block = require('models/block');

  Chaplin = require('chaplin');

  config = require('config');

  module.exports = Blocks = (function(_super) {
    __extends(Blocks, _super);

    function Blocks() {
      _ref = Blocks.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Blocks.prototype.model = Block;

    Blocks.prototype.comparator = function(model) {
      return model.get('position');
    };

    return Blocks;

  })(Collection);
  
});
window.require.register("models/channel", function(exports, require, module) {
  var Blocks, Channel, Chaplin, Model, config, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  Blocks = require('models/blocks');

  Chaplin = require('chaplin');

  config = require('config');

  module.exports = Channel = (function(_super) {
    __extends(Channel, _super);

    function Channel() {
      _ref = Channel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Channel.prototype.collection = Blocks;

    Channel.prototype.collectionAttr = "contents";

    Channel.prototype.initialize = function(attributes, options) {
      Channel.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('channel:loaded', this.setUpPusher);
      return this.set('id', attributes.id);
    };

    Channel.prototype.urlRoot = "" + config.api.versionRoot + "/channels";

    Channel.prototype.url = function(method) {
      var url;

      url = "" + this.urlRoot + "/";
      return url += this.idOrSlug();
    };

    Channel.prototype.idOrSlug = function() {
      if (this.has('slug')) {
        return this.get('slug');
      } else {
        return this.id;
      }
    };

    Channel.prototype.sync = function(method, model, options) {
      options.url = this.url(method);
      return Channel.__super__.sync.apply(this, arguments);
    };

    Channel.prototype.afterSuccess = function() {
      return this.set('contents', new Blocks(this.get('contents')));
    };

    Channel.prototype.setUpPusher = function() {
      var channel;

      channel = this;
      this.pusher = Chaplin.mediator.pusher.subscribe("channel-" + config.env + "-" + channel.id);
      this.listener = new Backpusher(this.pusher, channel.get('contents'));
      this.listener.bind('remote_update', function(model) {
        return model.trigger('remote:update');
      });
      return this.listener.bind('remote_destroy', function(model) {
        return channel.get('contents').remove(model);
      });
    };

    Channel.prototype.dispose = function() {
      var _ref1, _ref2;

      if ((_ref1 = this.listener) != null) {
        _ref1.dispose();
      }
      this.listener = null;
      Chaplin.mediator.pusher.unsubscribe("channel-" + config.env + "-" + this.id);
      if ((_ref2 = this.pusher) != null) {
        _ref2.unbind('new_comment', null);
      }
      return Channel.__super__.dispose.apply(this, arguments);
    };

    return Channel;

  })(Model);
  
});
window.require.register("routes", function(exports, require, module) {
  module.exports = function(match) {
    return match('', 'home#index');
  };
  
});
window.require.register("views/base/collection-view", function(exports, require, module) {
  var Chaplin, CollectionView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      _ref = CollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
});
window.require.register("views/base/view", function(exports, require, module) {
  var Chaplin, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view-helper');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
});
window.require.register("views/header-view", function(exports, require, module) {
  var HeaderView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.region = 'header';

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.template = template;

    return HeaderView;

  })(View);
  
});
window.require.register("views/info-view", function(exports, require, module) {
  var Chaplin, CollectionView, InfoView, ItemInfoView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/info');

  CollectionView = require('views/base/collection-view');

  ItemInfoView = require('views/item-info-view');

  Chaplin = require('chaplin');

  module.exports = InfoView = (function(_super) {
    __extends(InfoView, _super);

    function InfoView() {
      _ref = InfoView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    InfoView.prototype.autoRender = true;

    InfoView.prototype.className = 'info';

    InfoView.prototype.region = 'info';

    InfoView.prototype.listSelector = '.current-video-container';

    InfoView.prototype.template = template;

    InfoView.prototype.currentIndex = 0;

    InfoView.prototype.itemView = ItemInfoView;

    InfoView.prototype.initialize = function() {
      InfoView.__super__.initialize.apply(this, arguments);
      this.delegate('click', '.prev', this.prevVideo);
      return this.delegate('click', '.next', this.nextVideo);
    };

    InfoView.prototype.prevVideo = function() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.collection.length;
      } else {
        this.currentIndex--;
      }
      Chaplin.mediator.publish('video:prev');
      return this.renderAllItems();
    };

    InfoView.prototype.nextVideo = function() {
      if (this.currentIndex === (this.collection.length - 1)) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      Chaplin.mediator.publish('video:next');
      return this.renderAllItems();
    };

    InfoView.prototype.filterer = function(item, index) {
      return index === this.currentIndex;
    };

    return InfoView;

  })(CollectionView);
  
});
window.require.register("views/item-info-view", function(exports, require, module) {
  var ItemInfoView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/item-info');

  View = require('views/base/view');

  module.exports = ItemInfoView = (function(_super) {
    __extends(ItemInfoView, _super);

    function ItemInfoView() {
      _ref = ItemInfoView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ItemInfoView.prototype.autoRender = true;

    ItemInfoView.prototype.className = 'item-info';

    ItemInfoView.prototype.template = template;

    return ItemInfoView;

  })(View);
  
});
window.require.register("views/player-item-view", function(exports, require, module) {
  var PlayerItemView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/player-item');

  View = require('views/base/view');

  module.exports = PlayerItemView = (function(_super) {
    __extends(PlayerItemView, _super);

    function PlayerItemView() {
      _ref = PlayerItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PlayerItemView.prototype.className = 'player-item';

    PlayerItemView.prototype.template = template;

    PlayerItemView.prototype.initialize = function() {
      PlayerItemView.__super__.initialize.apply(this, arguments);
      return this.listenTo(this.model, 'show:video', this.displayVideo);
    };

    PlayerItemView.prototype.displayVideo = function() {
      if (this.model.isYouTube()) {
        return this.displayYouTube();
      }
    };

    PlayerItemView.prototype.displayYouTube = function() {
      return console.log('displayYouTube');
    };

    return PlayerItemView;

  })(View);
  
});
window.require.register("views/player-view", function(exports, require, module) {
  var InfoView, PlayerView, View, template, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/player');

  View = require('views/base/view');

  InfoView = require('views/info-view');

  module.exports = PlayerView = (function(_super) {
    __extends(PlayerView, _super);

    function PlayerView() {
      this.onYouTubeStateChange = __bind(this.onYouTubeStateChange, this);    _ref = PlayerView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PlayerView.prototype.autoRender = true;

    PlayerView.prototype.className = 'player';

    PlayerView.prototype.region = 'player';

    PlayerView.prototype.template = template;

    PlayerView.prototype.currentIndex = 0;

    PlayerView.prototype.initialize = function() {
      var _this = this;

      PlayerView.__super__.initialize.apply(this, arguments);
      window.onYouTubeIframeAPIReady = function() {
        return _this.loadPlayer();
      };
      this.subscribeEvent('video:prev', this.prevVideo);
      return this.subscribeEvent('video:next', this.nextVideo);
    };

    PlayerView.prototype.attach = function() {
      PlayerView.__super__.attach.apply(this, arguments);
      this.loadVideoScripts();
      return this.renderSubViews();
    };

    PlayerView.prototype.loadVideoScripts = function() {
      return $.getScript('//www.youtube.com/iframe_api');
    };

    PlayerView.prototype.renderSubViews = function() {
      return this.subview('info', new InfoView({
        collection: this.collection
      }));
    };

    PlayerView.prototype.loadPlayer = function() {
      var block;

      block = this.collection.at(this.currentIndex);
      if (block.isYouTube()) {
        this.displayYoutubePlayer(block);
        return true;
      }
      if (block.isVimeo()) {
        this.displayVimeoPlayer(block);
        return true;
      }
    };

    PlayerView.prototype.displayYoutubePlayer = function(block) {
      return this.yt_player = new YT.Player('video-player', {
        height: '390',
        width: '640',
        videoId: block.youtubeVideoId(),
        events: {
          onReady: this.playYoutube,
          onStateChange: this.onYouTubeStateChange
        }
      });
    };

    PlayerView.prototype.playYoutube = function(e) {
      return e.target.playVideo();
    };

    PlayerView.prototype.onYouTubeStateChange = function(e) {
      if (e.data === YT.PlayerState.ENDED) {
        this.yt_player.destroy();
        return this.nextVideo();
      }
    };

    PlayerView.prototype.displayVimeoPlayer = function(block) {
      var html, iframe;

      html = block.vimeoEmbed();
      this.$('#video-player').html(html);
      iframe = this.$('#video-player iframe')[0];
      this.v_player = $f(iframe);
      this.v_player.addEvent('finish', this.onVimeoFinish);
      return this.playVimeo();
    };

    PlayerView.prototype.playVimeo = function() {
      return this.v_player.api('play');
    };

    PlayerView.prototype.onVimeoFinish = function() {
      this.v_player = null;
      this.$('#video-player').html('');
      return this.nextVideo();
    };

    PlayerView.prototype.destroyPlayers = function() {
      var _ref1;

      this.v_player = null;
      if ((_ref1 = this.yt_player) != null) {
        _ref1.destroy();
      }
      return this.$('#video-player').html('');
    };

    PlayerView.prototype.nextVideo = function() {
      this.destroyPlayers();
      if (this.currentIndex === (this.collection.length - 1)) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      return this.loadPlayer();
    };

    PlayerView.prototype.prevVideo = function() {
      this.destroyPlayers();
      if (this.currentIndex === 0) {
        this.currentIndex = this.collection.length;
      } else {
        this.currentIndex++;
      }
      return this.loadPlayer();
    };

    return PlayerView;

  })(View);
  
});
window.require.register("views/site-view", function(exports, require, module) {
  var SiteView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/site');

  module.exports = SiteView = (function(_super) {
    __extends(SiteView, _super);

    function SiteView() {
      _ref = SiteView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SiteView.prototype.container = 'body';

    SiteView.prototype.id = 'site-container';

    SiteView.prototype.regions = {
      '#player-container': 'player',
      '#info-container': 'info'
    };

    SiteView.prototype.template = template;

    return SiteView;

  })(View);
  
});
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "HEADER";
    });
});
window.require.register("views/templates/info", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<a class=\"prev\"> prev </a>\n<div class=\"current-video-container\"></div>\n<a class=\"next\"> next </a>";
    });
});
window.require.register("views/templates/item-info", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var stack1, functionType="function", escapeExpression=this.escapeExpression;


    if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    return escapeExpression(stack1);
    });
});
window.require.register("views/templates/player-item", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n  <div id=\"played_";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" class=\"video\">\n  \n  </div>\n";
    return buffer;
    }

    options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
    stack2 = ((stack1 = helpers.if_equals),stack1 ? stack1.call(depth0, depth0['class'], "Media", options) : helperMissing.call(depth0, "if_equals", depth0['class'], "Media", options));
    if(stack2 || stack2 === 0) { return stack2; }
    else { return ''; }
    });
});
window.require.register("views/templates/player", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div id=\"video-player\"></div>";
    });
});
window.require.register("views/templates/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div id=\"player-container\"></div>\n<div id=\"info-container\"></div>";
    });
});
