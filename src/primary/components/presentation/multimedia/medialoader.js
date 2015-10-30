define(['components/presentation/multimedia/mediadatabase', 'app/listable/MediaListItem'], function(MediaDatabase, MediaListItem) {
    
    "use strict";
        
    const THUMBNAIL_WIDTH = 160,
          THUMBNAIL_HEIGHT = 100;
          
    var MediaLoader = function() {
	
    };
    
    //function called to add video/image to library
    //if save locally, will also create a copy of the media in the presmagic local directory 
    //TODO: Implement local save
    MediaLoader.addToLibrary = function(url, createLocalCopy) {
	var 	deferred = Q.defer(),
		thumbnail = null,
		mediatype = "unsupported",
		promise = null,
		filename = ""
	
	filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")) || "blank";
	mediatype = MediaLoader._getMediaType(url);
	
	switch(mediatype) {
	case 'image':
	    console.log("Image");
	    promise = MediaLoader._generateImageThumbnail(url, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
	    break;

	case 'video':
	    console.log("Video");
	    promise = MediaLoader._generateVideoThumbnail(url, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
	    break;

	case 'unsupported':
	    deferred.reject('unsupported');
	    return deferred.promise; //TODO: check this works if the promise is already rejected.
	}
	
	promise.then(function(thumbnail) {
	    var item = new MediaListItem(filename, mediatype, url, thumbnail);
	    
	    MediaDatabase.storeMedia(item).then(function(itemre) {
		deferred.resolve(itemre);
	    }, function(error) {
		console.log(error);
	    });
	}, function (error) {
	    console.log(error);
	    deferred.reject(error);
	});
	
	return deferred.promise;
    };
    
    //TODO: Implement
    MediaLoader.removeFromLibrary = function(medialistitem) {
	
    };
    
    //returns a listable array of library items from the database
    MediaLoader.getLibrary = function() {
	var deferred = Q.defer();
	MediaDatabase.getStoredMedia().then(function(medias) {
	    var rez = [],
	        i = 0,
	        length = medias.length;
	    for(i; i < length; i++) {
		rez[i] = new MediaListItem(
			medias[i].Name,
			medias[i].Type,
			medias[i].Location,
			medias[i].Thumbnail,
			medias[i].ID
		);
	    }

	    deferred.resolve(rez);
	}).catch(function (error) {
	    deferred.reject(error);
	})
	return deferred.promise;
    }

    MediaLoader._getMediaType = function(url) {
	var extension = url.substring(url.lastIndexOf(".") + 1, url.length);
	extension = extension.toLowerCase();

	switch (extension) {
	
	case "mp4":
	    return "video";
	case "ogg":
	    return "video";
	case "webm":
	    return "video";
	case "png":
	     return "image";
	case "gif":
	     return "image";
	case "bmp":
	     return "image";
	case "jpg":
	     return "image";
	case "jpeg":
	     return "image";
	default:
	    return "unsupported";
	
	}
    };
    
    MediaLoader._generateVideoThumbnail = function(videoURL, width, height) {
	var 	deferred = Q.defer(),
		self = MediaLoader,
		$video,
		videlem, 
		$element = $("<div style='display:none'>" +
				"<video src='" + videoURL + 
					"' width = " + width + 
					"' height = '" + height +		
				"'</video>" +
			     "</div>");	    
	
	$element.appendTo($('body'));
	$video = $element.find("video");
	$video.attr("mute", true);
	videlem = $video.get()[0];

	$video.on("canplaythrough", function() {
	    var time, 
	    	$canvas,
	    	context;
	    
		if(videlem.currentTime === 0) {	    	
		    time = Math.floor(videlem.duration);
		    videlem.currentTime = time; //will fire another 'canplaythrough'
		    return; 
		}

		$video.off(); 
		$canvas = $("<canvas width ='" + width + "' height = '" + height + "'></canvas>");
		$canvas.attr("display", "none");
		$canvas.appendTo($element);		
		context = $canvas.get()[0].getContext('2d');
		drawScreen();

		function drawScreen() {
		    var imageURI;		    
		    context.drawImage(videlem, 0, 0, videlem.width, videlem.height);		
		    imageURI = $canvas.get()[0].toDataURL();		   
		    deferred.resolve(imageURI);
		    $canvas.remove();
		    $element.remove();
		}
	});
	
	return deferred.promise;
    };
    
    MediaLoader._generateImageThumbnail = function(imageURL, width, height) {
	var 	deferred = Q.defer(),	
		$img, 
		imgelem, 
		$element = $("<div style='display:none'>" +			
				"<img src='" + imageURL + "'" +
					"width = '" + width + "'" +
					"height = '" + height + "'" +
				"'</img>" +
			"</div>");	 
	
	
	$element.appendTo($('body'));
	$img = $element.find("img");
	imgelem = $img.get()[0];

	$img.on("load", function() {
	    var $canvas,
	    	context;
	    
	    $img.off(); 
	    $canvas = $("<canvas width ='" + width + "' height = '" + height + "'></canvas>");
	    $canvas.attr("display", "none");
	    $canvas.appendTo($element);		
	    context = $canvas.get()[0].getContext('2d');
	    drawScreen();
	    
	    function drawScreen() {		
		var imageURI;
		context.drawImage(imgelem, 0, 0, imgelem.width, imgelem.height);		
		imageURI = $canvas.get()[0].toDataURL();		   
		deferred.resolve(imageURI);
		$canvas.remove();
		$element.remove();
	    }
	    
	});
	
	return deferred.promise;
    };

    return MediaLoader;

});