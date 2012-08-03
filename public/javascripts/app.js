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

window.require.define({"application": function(exports, require, module) {
  var Application, Loader, LoaderView, OptionsView, Search,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OptionsView = require('views/options');

  LoaderView = require('views/loader');

  Loader = require('models/loader');

  Search = require('views/search');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.tagName = 'div';

    Application.prototype.initialize = function() {
      var loader_view, options;
      Backbone.sync = function(method, model, success, error) {
        return success();
      };
      this.loader = new Loader({
        show: false
      });
      loader_view = new LoaderView({
        el: $('#loader'),
        model: this.loader
      });
      options = new OptionsView({
        el: $('.options')
      });
      this.speed = options.addOption({
        label: 'Speed',
        options: [[4, 'slow'], [2, 'normal'], [1, 'fast']],
        active: 1
      });
      $('#search').html('hello');
      return this.search = new Search({
        el: $('#search')
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
    var App;
    App = new Application;
    $('#container').append(App.el);
    return window.App = App;
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
  

  
}});

window.require.define({"views/search": function(exports, require, module) {
  var Result, ResultView, Results, Search, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Results = require('collections/results');

  Result = require('models/result');

  ResultView = require('views/result');

  template = require('views/templates/search');

  module.exports = Search = (function(_super) {

    __extends(Search, _super);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.tagName = 'div';

    Search.prototype.id = 'search';

    Search.prototype.initialize = function() {
      _.bindAll(this);
      this.template = template;
      return this.render();
    };

    Search.prototype.render = function() {
      return this.$el.html(this.template);
    };

    return Search;

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
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/search": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1>MusicThingy</h1>\n<span>Play some</span><input autocomplete=\"off\"><a class=\"cancel\">&times;</a>\n<p>Who's your favourite band or musician?</p>\n<a class=\"go\">Go &rarr;</a>\n<ul id=\"results\"></ul>\n";});
}});

