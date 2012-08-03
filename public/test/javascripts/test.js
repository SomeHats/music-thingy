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

window.require.define({"test/models/item_test": function(exports, require, module) {
  var Item;

  Item = require('models/item');

  describe('Item [model]', function() {
    beforeEach(function() {
      return this.model = new Item();
    });
    afterEach(function() {
      return this.model.destroy();
    });
    return it('should have 2 attributes', function() {
      return expect(Object.keys(this.model.attributes)).to.have.length(2);
    });
  });
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    expect: require('chai').expect,
    sinon: require('sinon')
  };
  
}});

window.require.define({"test/views/item_test": function(exports, require, module) {
  var ItemView;

  ItemView = require('views/item');

  describe('ItemView [view]', function() {
    beforeEach(function() {
      return this.view = new HeaderViewTest({
        model: this.model
      });
    });
    afterEach(function() {
      this.view.dispose();
      return this.model.dispose();
    });
    it('should display 3 links', function() {
      return expect(this.view.$el.find('a')).to.have.length(3);
    });
    return it('should re-render on login event', function() {
      expect(this.view.renderTimes).to.equal(1);
      mediator.publish('loginStatus');
      return expect(this.view.renderTimes).to.equal(2);
    });
  });
  
}});

window.require.define({"test/views/list_test": function(exports, require, module) {
  var ListView;

  ListView = require('views/list');

  describe('ListView [view]', function() {
    beforeEach(function() {
      return this.view = new ListView;
    });
    afterEach(function() {
      return this.view.remove();
    });
    it('should auto-render', function() {
      expect(this.view.$el.find('button')).to.have.length(1);
      return expect(this.view.$el.find('ul')).to.have.length(1);
    });
    return it('should addItem on click', function() {
      var countBefore;
      countBefore = this.view.counter;
      this.view.$el.find('button').trigger('click').trigger('click');
      expect(this.view.counter).to.equal(countBefore + 2);
      return expect(this.view.$el.find('li')).to.have.length(2);
    });
  });
  
}});

window.require('test/models/item_test');
window.require('test/views/item_test');
window.require('test/views/list_test');
