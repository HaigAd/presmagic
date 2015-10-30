define(['app/listable/MediaListItem'], function () {


    //Singleton
    //TODO: Implement this better. Shouldn't need to be accessing prototype all the time
    //TODO: Make new instances impossible, not just return in the constructor.
    var MediaDatabase = function(){};    
	
	MediaDatabase._database = new Dexie('presmagic_media_database');
	MediaDatabase._database.version(1).stores({
	    media: "++ID,Name,Type,Thumbnail,Location"
	});
	MediaDatabase._database.open();

    
    MediaDatabase.getStoredMedia = function(maxListSize) {
	var deferred = Q.defer();
	
	MediaDatabase._database.media.toArray(function(media) {
	    deferred.resolve(media);
	}).catch(function(error) {
	    deferred.reject(error);
	});
	return deferred.promise;
    }
    
    MediaDatabase.storeMedia = function(mediaentry) {
	var deferred = Q.defer();
	var db = MediaDatabase._database;
	
	console.log(db);
	db.transaction('rw', db.media, function() {
	    var dbmedia = MediaDatabase._listItemToDatabaseFormat(mediaentry),
	    	existingEntry;
	    
	    if(dbmedia.ID) {
		existingEntry = db.media.where("ID").equals(dbmedia.ID);
	    }
	    
	    if(existingEntry) {
		existingEntry.modify(dbmedia);
	    } else {
		db.media.add(dbmedia);
	    }	    
	}).then(function(item) {
	    deferred.resolve(item);
	}).catch(function(error) {
	    deferred.reject(error)
	});
	return deferred.promise;
    };
    
    //TODO: Is this nescessary? Can I just pass the database a MediaListItem since it has the properties that the db stores anyway??
    MediaDatabase._listItemToDatabaseFormat = function(listItem) {
	
	var item = {
	    Name: listItem.Name,
	    Type: listItem.Type,
	    Location: listItem.Location,
	    Thumbnail: listItem.Thumbnail
	};
	if(listItem.ID) {
	    item.ID = listItem.ID;
	}
	return item;
	
    };
    
    return MediaDatabase;

});
