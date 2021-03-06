define(function () {

	return function () {
		return app.init().then(function () {
			return Q()
				.then(app.components.Q('init'))
				.then(onDOMLoaded)
				.then(initSplashLoader)
				.then(app.components.Q('register'))
				.then(app.components.Q('start'))
				.then(app.start)
				.then(onLoadComplete)
				.then(removeSplashLoader);
		}).done();
	};

	function onDOMLoaded () {
		var defer = Q.defer();

		$(function () {
			defer.resolve();
		});

		return defer.promise;
	}

	function initSplashLoader() {
		var appLoadComplete = app.loader.add();
		app.event.bind(app.EVENT_APPLICATION_START, appLoadComplete);

		var $progressProgress = $('#SplashScreen .LoadingProgress');
		app.loader.onUpdate(function (progress, total) {
			$progressProgress.width((total ? Math.floor(progress / total * 100) : 100)+'%');
		});

		app.loader.start();
	}

	function onLoadComplete() {
		var defer = Q.defer();

		defer.promise
			.timeout(1000 * 30) // 30s
			.fail(function (err) {
				console.log('Failed to finish loading.');
				clearInterval(interval);
				defer.resolve();
			});

		var interval = setInterval(function () {
			if (app.loader.isComplete()) {
				clearInterval(interval);
				defer.resolve();
			}
		}, 500);

		return defer.promise;
	}

	function removeSplashLoader() {
		app.loader.destroy();
		app.loader = null;

		$('#SplashScreen').fadeOut(100, function () {
			$(this).remove();
		});
	}

});
