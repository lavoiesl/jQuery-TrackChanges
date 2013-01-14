(function($){
  var plugin = {
    name: 'trackChanges'
  };

  var default_settings = {
    trackingClass: 'track-changes', // Class added on watched fields
    changedClass: 'changed', // Class added when field is changed
    events: 'change blur' // Events to bind for watching changes
  };

  var methods = {
    /**
     * Initialize plugin with default options and binds data to elements
     */
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

    /**
     * Add classes and bind event listeners
     */
    bind: function() {
      // In case init is called multiple times
      methods.unbind.call(this);

      var settings = this.data(plugin.name).settings;
      this
        .addClass(settings.trackingClass)
        .on(settings.events, methods.interaction);
    },

    /**
     * Remove classes and unbind event listeners
     */
    unbind: function() {
      var data = this.data(plugin.name);
      if (!data) return; // Already unbinded

      var settings = data.settings;

      this
        .removeClass(settings.trackingClass)
        .off(settings.events, methods.changed);
    },

    /**
     * Remove all data and listeners
     * You will need to recreate using the constructor
     */
    destroy: function() {
      methods.unbind.call(this);

      this
        .removeData(plugin.name)
        .off(plugin.name);
    },

    /**
     * Manually revert
     */
    revert: function() {
      if (methods.isChanged.call(this)) {
        methods.value.call(this, methods.original.call(this));
        methods.reverted.call(this, 'api');
      }
    },

    /**
     * One of settings.events was triggered,
     * Call reverted or changed accordingly.
     */
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

    /**
     * Once events have occured and change was detected,
     * Do some bookkeeping to add class, data and trigger custom events
     */
    changed: function(mode) {
      var data = this.data(plugin.name);
      data.changed = true;
      methods.trigger.call(this, 'changed', {mode:mode, original:data.original});
      this.addClass(data.settings.changedClass);
    },

    /**
     * Once the field was reverted, either by API or undo,
     * Do some bookkeeping to remove class, data and trigger custom events
     */
    reverted: function(mode) {
      var data = this.data(plugin.name);
      data.changed = false;
      methods.trigger.call(this, 'reverted', {mode:mode});
      this.removeClass(data.settings.changedClass);
    },

    /**
     * Checks if value has changed
     * @return boolean
     */
    isChanged: function() {
      return methods.value.call(this) != methods.original.call(this);
    },

    /**
     * Custom wrapper for triggering events
     * Mainly useful for additional functionnalities outside this plugin
     */
    trigger: function(event, options) {
      this.trigger(plugin.name + '.' + event, options);
    },

    /**
     * Get or set the current value
     */
    value: function(value) {
      return value === undefined ? this.val() : this.val(value);
    },

    /**
     * Get or set the original value
     */
    original: function(value) {
      var data = this.data(plugin.name);
      if (value !== undefined) {
        data.original = value;
      }
      return data.original;
    }
  };

  /**
   * Standard jQuery initializer
   */
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
