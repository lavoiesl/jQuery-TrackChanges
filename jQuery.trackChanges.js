(function($){
  var plugin = {
    name: 'trackChanges'
  };

  var default_settings = {
    trackingClass: 'track-changes',
    changedClass: 'changed',
    events: 'change blur'
  };

  var methods = {
    init: function(options) {
      var settings = $.extend({}, default_settings, options);
      var data = {
        settings: settings,
        original: methods.value.call(this),
        changed: false
      };

      this.data(plugin.name, data);
      methods.bind.call(this);
      methods.trigger.call(this, 'init');
    },

    bind: function() {
      // In case init is called multiple times
      methods.unbind.call(this);

      var settings = this.data(plugin.name).settings;
      this
        .addClass(settings.trackingClass)
        .on(settings.events, methods.interaction);
    },

    unbind: function() {
      var data = this.data(plugin.name);
      var settings = data.settings;
      
      this
        .removeClass(settings.trackingClass)
        .off(settings.events, methods.changed);
    },

    destroy: function() {
      methods.unbind.call(this);
      this
        .removeData(plugin.name)
        .off(plugin.name);
    },

    revert: function() {
      if (methods.isChanged.call(this)) {
        methods.value.call(this, methods.original.call(this));
        methods.reverted.call(this, 'api');
      }
    },

    interaction: function(e) {
      var $this = $(this);
      var data = $this.data(plugin.name);
      var wasChanged = data.changed;

      if (methods.isChanged.call($this)) {
        if (!wasChanged) {
          methods.changed.call($this, 'interaction');
        }
      } else if (wasChanged) {
        methods.reverted.call($this, 'interaction');
      }
    },

    changed: function(mode) {
      var data = this.data(plugin.name);
      data.changed = true;
      methods.trigger.call(this, 'changed', {mode:mode, original:data.original});
      this.addClass(data.settings.changedClass);
    },

    reverted: function(mode) {
      var data = this.data(plugin.name);
      data.changed = false;
      methods.trigger.call(this, 'reverted', {mode:mode});
      this.removeClass(data.settings.changedClass);
    },

    isChanged: function() {
      return methods.value.call(this) != methods.original.call(this);
    },

    trigger: function(event, options) {
      this.trigger(plugin.name + '.' + event, options);
    },

    value: function(value) {
      return value === undefined ? this.val() : this.val(value);
    },

    original: function(value) {
      var data = this.data(plugin.name);
      if (value !== undefined) {
        data.original = value;
      }
      return data.original;
    }
  };

  $.fn[plugin.name] = function(method) {

    var args = false;
    if ( typeof method === 'object' || ! method ) {
      // Constructor, method will hold its options
      args = [method];
      method = 'init';
    } else if ( methods[method] ) {
      // Method, shift method name to get its arguments
      args = Array.prototype.slice.call(arguments, 1);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.' + plugin.name );
      return this;
    }
    return this.each(function(){
      methods[method].apply($(this), args);
    });
  };
})(jQuery);