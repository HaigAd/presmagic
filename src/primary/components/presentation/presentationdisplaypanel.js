define(['style!components/presentation/presentation'], function () {

    /**
     * Allows multiple different panels to be loaded in the same area, with one visible at a time
     * This could be extended to make a tabbed viewing area if needed
     * At present, allows the main display area to switch between different content (e.g. could allow slide template
     * editing panel to be displayed where the presentation frames panel is
     * If a panel is set here, this will check to see if there is already a loaded instance
     * If there is, it will make this instance visible
     * If there is not, it will load a new instance and hide whatever was previously in position
     * 
     * 
     */

    var parentClass = app.Panel;
    var parent = parentClass.prototype;

    var c = function ($container, options, parentPanel) {
	parent.constructor.call(this, $container, {
	    Layout: 'Standard'
	}, parentPanel);
    };

    c.prototype = new parentClass();

    //Contains the currently loaded Panels which have occupied the MainPanel space.
    c.prototype._loadedPresentationPanels = [];
    c.prototype._currentMain = null;


    c.prototype._prepare = function () {
	parent._prepare.call(this);
	app.PresentationDisplayPanel = this;
    };

    //TODO: Needs work. If one child is hidden, all will be set to that as they are added??
    c.prototype.setMainPanel = function(panelClassName, options) {   
	var self = this;
	this._getPanelInstance(panelClassName, options).then(function(loadedClass) {	 
	    if(self._currentMain) {
		self._currentMain.hide();
	    }
	    if(loadedClass.hidden()) {
		loadedClass.show();
	    }
	    self._currentMain = loadedClass;		
	    return;
	});
    };

    //TODO: Manage errors
    c.prototype._getPanelInstance = function(panelClassName, options) {	    
	var self = this,
	deferred = Q.defer();
	requireOneDeferred(panelClassName).then(function(panelClass) {
	    var i = 0,
	    length = self._loadedPresentationPanels.length;
	    for(i; i < length; i++) {
		if(self._loadedPresentationPanels[i] instanceof panelClass) {
		    deferred.resolve(self._loadedPresentationPanels[i]);
		    return;
		}
	    }
	    //No existing copy of this class, instantiate a new one
	    app.loadPanel(panelClassName, self._getNewContainer(), self, options).then(function(panelClass) {
		self._loadedPresentationPanels.push(panelClass);
		panelClass.run();
		deferred.resolve(panelClass);
	    });
	});

	return deferred.promise;
    };

    c.prototype._getNewContainer = function() {
	var $div = $("<div></div>");
	$div.attr("data-index", this._loadedPresentationPanels.length);
	this.getContainer().append($div);
	return $div;
    }

    c.prototype.getMainPanel = function() {
	return this._currentMain;
    };



    return c;
});
