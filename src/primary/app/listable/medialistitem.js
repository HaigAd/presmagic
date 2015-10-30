define(['app/listable/listable'], function(Listable) {
    
    var parent = Listable.prototype;
    
    /**
     * @param {integer} ID Database ID of the item
     * @param {String} Name Name of the media item
     * @param {String} Type Type of media (video/image)
     * @param {String} Location the location of the media on the local filesystem
     * @param {Blob} Thumbnail blob representing the thumbnail image for the given media 
     */
    var MediaListItem = function(Name, Type, Location, Thumbnail, ID) {
	parent.constructor.call(this);
	this.ID = ID;
	this.Name = Name;
	this.Type = Type;
	this.Location = Location;
	this.Thumbnail = Thumbnail;
    };
    
    MediaListItem.prototype = new Listable();
   
    return MediaListItem;
    
});