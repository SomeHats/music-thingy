(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
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
      return require(absolute);
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

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"app": function(exports, require, module) {
  var App,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = (function(_super) {

    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.error = function(error) {
      return alert("Error: " + error);
    };

    return App;

  })(Backbone.View);

  module.exports = new App;
  
}});

window.require.define({"application": function(exports, require, module) {
  var App, Application, Loader, LoaderView, OptionsView, Router, Search, SearchView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  Router = require('routes');

  OptionsView = require('views/options');

  LoaderView = require('views/loader');

  Loader = require('models/loader');

  Search = require('models/search');

  SearchView = require('views/search');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.tagName = 'div';

    Application.prototype.initialize = function() {
      var loader_view, options, search_view;
      Backbone.sync = function(method, model, success, error) {
        return success();
      };
      App.loader = new Loader({
        show: false
      });
      loader_view = new LoaderView({
        el: $('#loader'),
        model: App.loader
      });
      options = new OptionsView({
        el: $('.options')
      });
      App.speed = options.addOption({
        label: 'Speed',
        options: [[4, 'slow'], [2, 'normal'], [1, 'fast']],
        active: 1
      });
      App.search = new Search;
      search_view = new SearchView({
        el: $('#search'),
        model: App.search
      });
      App.router = new Router;
      return Backbone.history.start({
        pushState: true,
        root: '/'
      });
    };

    return Application;

  })(Backbone.View);
  
}});

window.require.define({"collections/options": function(exports, require, module) {
  var Option,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Option = require('models/option');

  module.exports = Option = (function(_super) {

    __extends(Option, _super);

    function Option() {
      return Option.__super__.constructor.apply(this, arguments);
    }

    Option.prototype.model = Option;

    return Option;

  })(Backbone.Collection);
  
}});

window.require.define({"collections/results": function(exports, require, module) {
  

  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(document).on('ready', function() {
    var app;
    app = new Application;
    $('#cont').attr('id', 'container');
    return $('#container').append(app.el);
  });
  
}});

window.require.define({"models/loader": function(exports, require, module) {
  var Loader, Progress,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Progress = (function(_super) {

    __extends(Progress, _super);

    function Progress() {
      return Progress.__super__.constructor.apply(this, arguments);
    }

    Progress.prototype.defaults = {
      show: false,
      meter: 0.5
    };

    return Progress;

  })(Backbone.Model);

  module.exports = Loader = (function(_super) {

    __extends(Loader, _super);

    function Loader() {
      return Loader.__super__.constructor.apply(this, arguments);
    }

    Loader.prototype.defaults = {
      show: true,
      progress: new Progress
    };

    Loader.prototype.show = function(loader) {
      if (loader == null) {
        loader = false;
      }
      this.set('show', true);
      return this.get('progress').set('show', loader);
    };

    Loader.prototype.hide = function() {
      this.set('show', false);
      return this.get('progress').set('show', false);
    };

    Loader.prototype.progress = function(x) {
      return this.get('progress').set('meter', x);
    };

    return Loader;

  })(Backbone.Model);
  
}});

window.require.define({"models/option": function(exports, require, module) {
  var Option,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Option = (function(_super) {

    __extends(Option, _super);

    function Option() {
      return Option.__super__.constructor.apply(this, arguments);
    }

    Option.prototype.defaults = {
      label: 'button',
      options: [[1, 'One'], [2, 'Two'], [3, 'Three']],
      active: 0
    };

    Option.prototype.update = function() {
      return this.value = this.get('options')[this.get('active')][0];
    };

    Option.prototype.initialize = function() {
      this.update();
      return this.on('change', this.update);
    };

    return Option;

  })(Backbone.Model);
  
}});

window.require.define({"models/result": function(exports, require, module) {
  var Result,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Result = (function(_super) {

    __extends(Result, _super);

    function Result() {
      return Result.__super__.constructor.apply(this, arguments);
    }

    Result.prototype.tagName = 'li';

    Result.prototype.initialize = function() {
      var raw;
      _.bindAll(this);
      raw = this.get('raw');
      this.set({
        title: raw.title.$t,
        author: raw.author[0].name.$t,
        id: raw.id.$t.split(':')[3],
        thumb: raw.thumb
      });
      return this.unset('raw');
    };

    return Result;

  })(Backbone.Model);
  
}});

window.require.define({"models/search": function(exports, require, module) {
  var App, Search,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  module.exports = Search = (function(_super) {

    __extends(Search, _super);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.defaults = {
      term: '',
      results: false
    };

    Search.prototype.validate = function(attrs) {
      var str;
      if (attrs.term.trim) {
        str = attrs.term.trim();
      } else {
        str = attrs.term;
      }
      if (str.length > 0) {

      } else {
        return 'error';
      }
    };

    Search.prototype.cancel = function() {
      this.set({
        results: false,
        term: ''
      }, {
        silent: true
      });
      this.trigger('change:term');
      this.trigger('change:results');
      return App.router.navigate('');
    };

    Search.prototype.go = function() {
      if (this.isValid()) {
        this.set({
          results: true
        });
        return App.router.navigate(encodeURIComponent(this.get('term')));
      }
    };

    return Search;

  })(Backbone.Model);
  
}});

window.require.define({"routes": function(exports, require, module) {
  var App, Router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "": "reset",
      ":search": "search"
    };

    Router.prototype.search = function(term) {
      App.search.set('term', decodeURIComponent(term));
      return App.search.go();
    };

    Router.prototype.reset = function() {
      if (App.search.get('results')) {
        return App.search.cancel();
      }
    };

    return Router;

  })(Backbone.Router);
  
}});

window.require.define({"views/loader": function(exports, require, module) {
  var LoaderView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/loader');

  module.exports = LoaderView = (function(_super) {

    __extends(LoaderView, _super);

    function LoaderView() {
      return LoaderView.__super__.constructor.apply(this, arguments);
    }

    LoaderView.prototype.tagName = 'div';

    LoaderView.prototype.initialize = function() {
      _.bindAll(this);
      this.progress = this.model.get('progress');
      this.model.on('change:show', this.visibility);
      this.progress.on('change:show', this.progressVisibility);
      this.progress.on('change:meter', this.progressMeter);
      this.template = template;
      return this.render();
    };

    LoaderView.prototype.render = function() {
      this.$el.html(this.template());
      this.$progressEl = this.$el.find('#progress');
      this.$meterEl = this.$progressEl.find('div');
      this.visibility();
      this.progressVisibility();
      this.progressMeter();
      return this;
    };

    LoaderView.prototype.visibility = function() {
      if (this.model.get('show')) {
        return this.$el.removeClass('off');
      } else {
        return this.$el.addClass('off');
      }
    };

    LoaderView.prototype.progressVisibility = function() {
      if (this.progress.get('show')) {
        return this.$progressEl.removeClass('off');
      } else {
        return this.$progressEl.addClass('off');
      }
    };

    LoaderView.prototype.progressMeter = function() {
      return this.$meterEl.css('width', this.progress.get('meter') * 100 + '%');
    };

    return LoaderView;

  })(Backbone.View);
  
}});

window.require.define({"views/option": function(exports, require, module) {
  var OptionView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/option');

  module.exports = OptionView = (function(_super) {

    __extends(OptionView, _super);

    function OptionView() {
      return OptionView.__super__.constructor.apply(this, arguments);
    }

    OptionView.prototype.tagName = 'span';

    OptionView.prototype.className = 'option';

    OptionView.prototype.initialize = function() {
      _.bindAll(this);
      this.model.on('change', this.render);
      this.model.on('remove', this.remove);
      return this.template = template;
    };

    OptionView.prototype.render = function() {
      var context;
      context = {
        label: this.model.get('label'),
        active: this.model.get('options')[this.model.get('active')][1]
      };
      this.$el.html(this.template(context));
      return this;
    };

    OptionView.prototype.events = {
      "click": "update"
    };

    OptionView.prototype.update = function() {
      var active, options;
      options = this.model.get('options');
      active = this.model.get('active');
      active += 1;
      if (options.length <= active) {
        active = 0;
      }
      return this.model.set('active', active);
    };

    return OptionView;

  })(Backbone.View);
  
}});

window.require.define({"views/options": function(exports, require, module) {
  var Option, OptionView, Options, OptionsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Options = require('collections/options');

  Option = require('models/option');

  OptionView = require('views/option');

  module.exports = OptionsView = (function(_super) {

    __extends(OptionsView, _super);

    function OptionsView() {
      return OptionsView.__super__.constructor.apply(this, arguments);
    }

    OptionsView.prototype.tagName = 'div';

    OptionsView.prototype.className = 'options';

    OptionsView.prototype.initialize = function() {
      _.bindAll(this);
      this.collection = new Options;
      this.collection.on('add', this.appendOption);
      return this.render();
    };

    OptionsView.prototype.render = function() {};

    OptionsView.prototype.addOption = function(options) {
      var option;
      option = new Option(options);
      this.collection.add(option);
      return option;
    };

    OptionsView.prototype.appendOption = function(option) {
      var option_view;
      option_view = new OptionView({
        model: option
      });
      return this.$el.append(option_view.render().el);
    };

    return OptionsView;

  })(Backbone.View);
  
}});

window.require.define({"views/result": function(exports, require, module) {
  var ResultView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/result');

  module.exports = ResultView = (function(_super) {

    __extends(ResultView, _super);

    function ResultView() {
      return ResultView.__super__.constructor.apply(this, arguments);
    }

    ResultView.prototype.tagName = 'li';

    ResultView.prototype.initialize = function() {
      _.bindAll(this);
      this.template = template;
      return this.render();
    };

    ResultView.prototype.render = function() {
      return this.$el.html(this.template(this.model.toJSON()));
    };

    return ResultView;

  })(Backbone.View);
  
}});

window.require.define({"views/results": function(exports, require, module) {
  var App, Result, ResultView, Results, ResultsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  Results = Backbone.Collection;

  Result = require('models/result');

  ResultView = require('views/result');

  module.exports = ResultsView = (function(_super) {

    __extends(ResultsView, _super);

    function ResultsView() {
      return ResultsView.__super__.constructor.apply(this, arguments);
    }

    ResultsView.prototype.tagName = 'ul';

    ResultsView.prototype.id = 'results';

    ResultsView.prototype.initialize = function() {
      _.bindAll(this);
      this.term = this.options.term;
      this.ready = true;
      this.searchYoutube();
      return this.collection = new Results({
        model: Result
      });
    };

    ResultsView.prototype.destroy = function() {
      if (this.req.done !== true) {
        this.req.req.abort();
      }
      return this.remove();
    };

    ResultsView.prototype.perPage = 10;

    ResultsView.prototype.page = 0;

    ResultsView.prototype.req = {
      done: false
    };

    ResultsView.prototype.toLoad = 0;

    ResultsView.prototype.loaded = 0;

    ResultsView.prototype.ready = false;

    ResultsView.prototype.searchYoutube = function() {
      if (this.ready) {
        App.loader.progress(0);
        App.loader.show(false);
        this.ready = false;
        return this.req.req = jQuery.ajax({
          url: 'https://gdata.youtube.com/feeds/api/videos',
          dataType: 'jsonp',
          context: this,
          data: {
            alt: 'json-in-script',
            v: 2,
            'start-index': 1 + (this.page * this.perPage),
            'max-results': this.perPage,
            q: this.term,
            category: 'Music'
          },
          success: this.youtubeResults,
          error: this.youtubeError
        });
      }
    };

    ResultsView.prototype.youtubeError = function() {
      App.error('could not get Youtube results.');
      return this.trigger('fail');
    };

    ResultsView.prototype.youtubeResults = function(data) {
      var $thumb, thumb, video, videos, _i, _len, _results;
      if (data && data.feed) {
        if (data.feed.entry) {
          videos = data.feed.entry;
          App.loader.show(true);
          _results = [];
          for (_i = 0, _len = videos.length; _i < _len; _i++) {
            video = videos[_i];
            _results.push((function() {
              var _j, _len1, _ref, _results1;
              _ref = video.media$group.media$thumbnail;
              _results1 = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                thumb = _ref[_j];
                if (!(thumb.yt$name === 'mqdefault')) {
                  continue;
                }
                $thumb = $('<img>');
                $thumb.attr({
                  alt: "Thumbnail: " + video.title.$t,
                  width: thumb.width,
                  height: thumb.height,
                  src: thumb.url
                });
                video.thumb = thumb.url;
                this.toLoad += 1;
                _results1.push($thumb.on('load', null, video, this.addResult));
              }
              return _results1;
            }).call(this));
          }
          return _results;
        } else {
          App.error('no more video results');
          return App.loader.hide();
        }
      } else {
        return this.youtubeError();
      }
    };

    ResultsView.prototype.addResult = function(e) {
      var result, result_view;
      this.loaded += 1;
      App.loader.progress(this.toLoad / this.loaded);
      if (this.loaded === this.toLoad) {
        this.toLoad = this.loaded = 0;
        this.ready = true;
        App.loader.hide();
      }
      result = new Result({
        raw: e.data
      });
      result_view = new ResultView({
        model: result
      });
      return this.$el.append(result_view.el);
    };

    return ResultsView;

  })(Backbone.View);
  
}});

window.require.define({"views/search": function(exports, require, module) {
  var App, ResultsView, SearchView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  ResultsView = require('views/results');

  template = require('views/templates/search');

  module.exports = SearchView = (function(_super) {

    __extends(SearchView, _super);

    function SearchView() {
      return SearchView.__super__.constructor.apply(this, arguments);
    }

    SearchView.prototype.tagName = 'div';

    SearchView.prototype.id = 'search';

    SearchView.prototype.initialize = function() {
      _.bindAll(this);
      this.template = template;
      return this.render();
    };

    SearchView.prototype.render = function() {
      this.$el.html(this.template);
      this.$input = this.$el.find('input');
      this.input = this.$input[0];
      this.$input.attr('placeholder', this.randomPlaceholder());
      this.input.focus();
      this.termChange();
      this.model.on('change:results', this.renderResults);
      this.model.on('change:term', this.termChange);
      return this;
    };

    SearchView.prototype.events = {
      'change input': 'changeInput',
      'keyup input': 'changeInput',
      'click .cancel': 'clickCancel',
      'click .go': 'clickGo'
    };

    SearchView.prototype.changeInput = function(e) {
      this.model.set({
        term: this.input.value
      }, {
        silent: true
      });
      this.model.trigger('change:term');
      if (this.model.isValid() && e && e.which && e.which === 13) {
        return this.model.go();
      }
    };

    SearchView.prototype.lockInput = function(lock) {
      if (lock) {
        this.$input.attr('readonly', 'readonly');
        this.input.blur();
        return this.$input.on('focus', function() {
          return this.input.focus();
        });
      } else {
        this.$input.removeAttr('readonly');
        return this.$input.off('focus');
      }
    };

    SearchView.prototype.clickCancel = function(e) {
      return this.model.cancel();
    };

    SearchView.prototype.clickGo = function(e) {
      return this.model.go();
    };

    SearchView.prototype.renderResults = function() {
      var _this;
      if (this.model.get('results')) {
        this.$el.addClass('results');
        this.lockInput(true);
        App.loader.show(false);
        this.results = new ResultsView({
          term: this.model.get('term')
        });
        this.$el.append(this.results.el);
        _this = this;
        return this.results.on('fail', function() {
          return _this.model.cancel();
        });
      } else {
        this.$el.removeClass('results');
        this.lockInput(false);
        this.results.destroy();
        return App.loader.hide();
      }
    };

    SearchView.prototype.termChange = function() {
      this.input.value = this.model.get('term');
      if (this.model.isValid()) {
        return this.$el.addClass('valid');
      } else {
        return this.$el.removeClass('valid');
      }
    };

    SearchView.prototype.randomPlaceholder = function() {
      return this.placeholders[Math.floor(Math.random() * this.placeholders.length)];
    };

    SearchView.prototype.placeholders = ['The Antlers', 'Black Kids', 'Blood Red Shoes', 'Bright Eyes', 'Darwin Deez', 'Delphic', 'Dutch Uncles', 'Empire of the Sun', 'Everything Everything', 'Fenech Soler', 'Foals', 'Friendly Fires', 'J\u00F3nsi', 'Justice', 'La Roux', 'Miike Snow', 'The Naked and Famous', 'Passion Pit', 'Phoenix', 'Sigur R\u00F3s', 'Surfer Blood', 'Tokyo Police Club', 'Two Door Cinema Club'];

    return SearchView;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/loader": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>\n  Loading<span>.</span><span>.</span><span>.</span>\n</h2>\n<div id=\"progress\">\n  <div></div>\n</div>\n";});
}});

window.require.define({"views/templates/option": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    foundHelper = helpers.label;
    stack1 = foundHelper || depth0.label;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "label", { hash: {} }); }
    buffer += escapeExpression(stack1) + ": ";
    foundHelper = helpers.active;
    stack1 = foundHelper || depth0.active;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "active", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n";
    return buffer;});
}});

window.require.define({"views/templates/result": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<img alt=\"Thumbnail: ";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" src=\"";
    foundHelper = helpers.thumb;
    stack1 = foundHelper || depth0.thumb;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumb", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n<div>\n  <h2>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n  <p>\n    Uploaded by <a href=\"https://youtube.com/user/";
    foundHelper = helpers.author;
    stack1 = foundHelper || depth0.author;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "author", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.author;
    stack1 = foundHelper || depth0.author;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "author", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n  </p>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/search": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<header>\n  <h1>MusicThingy</h1>\n  <span><span>Play some</span></span> <input autocomplete=\"off\"><a class=\"cancel\">&times;</a>\n  <p>Who's your favourite band or musician?</p>\n  <a class=\"go\">Go &gt;</a>\n</header>\n<ul id=\"results\"></ul>\n";});
}});

