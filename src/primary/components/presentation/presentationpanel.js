define(['style!components/presentation/presentation'], function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	app.EVENT_PRESENTATION_CHANGED = 'Presentation:Changed';

	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	var splitViewFrames;
	
	c.prototype._prepare = function () {
		parent._prepare.call(this);
		app.PresentationPanel = this;
		var splitView = new app.SplitView.Vertical(this, 300, 'Fixed');
		splitView.loadPanelOne('components/presentation/presentationlistpanel', {});
		console.log('loaded list');
		//splitView.loadPanelTwo('app/panel', {});
		console.log('loaded panel');
		splitViewFrames = splitView.splitHorizontalTwo(30, 'Percent', false, 'Two');
		console.log('split');
		splitViewFrames.loadPanelTwo('components/presentation/multimedia/mediapanel', {});
		console.log('loaded media');
		splitViewFrames.loadPanelOne('components/presentation/presentationdisplaypanel');

	};
	
	return c;
});
