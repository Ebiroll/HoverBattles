$(document).ready(function(){
    module("Resource loader tests");
	
	test("Resource loader can retrieve textures from providers", function() {
        var loader = new blah.ResourceLoader();
        var texture = {};
        var textureProvider = {
            handles: function(name) { return true; },
            load: function(name) {            
                return texture;
            }
        };
        loader.addTextureProvider(textureProvider);        
        var returnedTexture = loader.getTexture("blah.jpg");
        
        ok(texture === returnedTexture);
        
	});	
    
    test("Resource loader caches textures if they have been loaded once", function() {
        var loader = new blah.ResourceLoader();
        var texture = {};
        var callCount = 0;
        var textureProvider = {
            handles: function(name) { return true; },
            load: function(name) {  
                callCount++;
                return texture;
            }
        };
        loader.addTextureProvider(textureProvider);        
        var returnedTexture1 = loader.getTexture("blah.jpg");
        var returnedTexture2 = loader.getTexture("blah.jpg");
        
        ok(returnedTexture1 === returnedTexture2, "Subsequent calls returned the same texture");
        equal(1, callCount, "Load was only called once for duplicate texture");
        
    });
    
    test("Resource loader can tell me how many textures are yet to be loaded", function(){ 
        var loader = new blah.ResourceLoader();
        var loadedCallback = null;
        var textureProvider = {
          handles: function(name) { return true; },
          load: function(name, callback) {
              loadedCallback = callback;
              return {};
          }
        };
        loader.addTextureProvider(textureProvider);   
        var returnedTexture1 = loader.getTexture("blah.jpg");
        
        var numberOfTexturesPending = loader.getPendingTextureCount();
        equal(numberOfTexturesPending, 1, "Textures pending is 1 after a single texture is requested");
        
        loadedCallback();
    
        numberOfTexturesPending = loader.getPendingTextureCount();
        equal(numberOfTexturesPending, 0, "Textures pending is 0 after a single texture is loaded");
        
        
    });

});