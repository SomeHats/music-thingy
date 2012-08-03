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
  var Application, OptionsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OptionsView = require('views/options');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.tagName = 'div';

    Application.prototype.initialize = function() {
      var options, speed;
      Backbone.sync = function(method, model, success, error) {
        return success();
      };
      options = new OptionsView({
        el: $('.options')
      });
      speed = options.addOption({
        label: 'Speed',
        options: [[4, 'slow'], [2, 'normal'], [1, 'fast']],
        active: 1
      });
      return $(document).on('click', function() {
        return console.log(speed.value);
      });
    };

    return Application;

  })(Backbone.View);
  
}});

window.require.define({"collections/list": function(exports, require, module) {
  var Item, List,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Item = require('models/item');

  module.exports = List = (function(_super) {

    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.model = Item;

    return List;

  })(Backbone.Collection);
  
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

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application;
    return $('#container').append(app.el);
  });
  
}});

window.require.define({"models/item": function(exports, require, module) {
  var Item,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.defaults = {
      part1: 'Hello',
      part2: 'Backbone'
    };

    return Item;

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

window.require.define({"views/item": function(exports, require, module) {
  var ItemView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.tagName = 'li';

    ItemView.prototype.initialize = function() {
      _.bindAll(this);
      this.model.on('change', this.render);
      return this.model.on('remove', this.remove);
    };

    ItemView.prototype.render = function() {
      $(this.el).html("<span>" + (this.model.get('part1')) + " " + (this.model.get('part2')) + "!</span>\n<span class=\"swap\">swap</span>\n<span class=\"delete\">delete</span>");
      return this;
    };

    ItemView.prototype.unrender = function() {
      return $(this.el).remove();
    };

    ItemView.prototype.swap = function() {
      return this.model.set({
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      });
    };

    ItemView.prototype.remove = function() {
      return this.model.destroy();
    };

    ItemView.prototype.events = {
      'click .swap': 'swap',
      'click .delete': 'remove'
    };

    return ItemView;

  })(Backbone.View);
  
}});

window.require.define({"views/list": function(exports, require, module) {
  var Item, ItemView, List, ListView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  List = require('collections/list');

  Item = require('models/item');

  ItemView = require('views/item');

  module.exports = ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.tagName = 'div';

    ListView.prototype.initialize = function() {
      _.bindAll(this);
      this.collection = new List;
      this.collection.bind('add', this.appendItem);
      this.counter = 0;
      return this.render();
    };

    ListView.prototype.render = function() {
      $(this.el).append('<button>Add List Item</button>');
      $(this.el).append('<ul></ul>');
      return this.appendTo = $(this.el).find('ul');
    };

    ListView.prototype.addItem = function() {
      var item;
      this.counter++;
      item = new Item;
      item.set({
        part2: "" + (item.get('part2')) + " " + this.counter
      });
      return this.collection.add(item);
    };

    ListView.prototype.appendItem = function(item) {
      var item_view;
      item_view = new ItemView({
        model: item
      });
      return this.appendTo.append(item_view.render().el);
    };

    ListView.prototype.events = {
      'click button': 'addItem'
    };

    return ListView;

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

    OptionView.prototype.tagName = 'button';

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
  var OpionsView, Option, OptionView, Options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Options = require('collections/options');

  Option = require('models/option');

  OptionView = require('views/option');

  module.exports = OpionsView = (function(_super) {

    __extends(OpionsView, _super);

    function OpionsView() {
      return OpionsView.__super__.constructor.apply(this, arguments);
    }

    OpionsView.prototype.tagName = 'div';

    OpionsView.prototype.className = 'options';

    OpionsView.prototype.initialize = function() {
      _.bindAll(this);
      this.collection = new Options;
      this.collection.on('add', this.appendOption);
      return this.render();
    };

    OpionsView.prototype.render = function() {};

    OpionsView.prototype.addOption = function(options) {
      var option;
      option = new Option(options);
      this.collection.add(option);
      return option;
    };

    OpionsView.prototype.appendOption = function(option) {
      var option_view;
      option_view = new OptionView({
        model: option
      });
      return this.$el.append(option_view.render().el);
    };

    return OpionsView;

  })(Backbone.View);
  
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

