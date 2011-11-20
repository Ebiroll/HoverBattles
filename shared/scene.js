var vec3 = require('./glmatrix').vec3;
var mat4 = require('./glmatrix').mat4;
var Camera = require('./camera').Camera;
var CollisionManager = require('./collisionmanager').CollisionManager;
var TypedEventContainer = require('./typedeventcontainer').TypedEventContainer;

var Scene = function(app){
  this._entities = {};
  this.app = app;
  this.camera = new Camera();
  this.collisionManager = new CollisionManager();
  this.entityAddedListeners = [];
  this.entityRemovedListeners = [];

  this.eventContainer = new TypedEventContainer();

  this.completedEventCount = 0;
  this.pendingEvents = [];
};

Scene.prototype.onEntityAdded = function(callback) {
  this.entityAddedListeners.push(callback);
};

Scene.prototype.onEntityRemoved = function(callback) {
  this.entityRemovedListeners.push(callback);
};

Scene.prototype.raiseEntityAdded = function(entity) {
  if(!(entity instanceof Entity)) return; // Hack to get around non-entity based entities (legacy)
  for(var i = 0; i < this.entityAddedListeners.length ; i++){ 
    var listener = this.entityAddedListeners[i];
    listener(entity);
  }
};

Scene.prototype.raiseEntityRemoved = function(entity) {
  if(!(entity instanceof Entity)) return; // Hack to get around non-entity based entities (legacy)
  for(var i = 0; i < this.entityRemovedListeners.length ; i++){ 
    var listener = this.entityRemovedListeners[i];
    listener(entity);
  }
};

Scene.prototype.withEntity = function(id, callback) {
  var entity = this.getEntity(id);
  if(entity) {
    callback(entity);
  } else { console.log('Failed to find entity ' + id); console.trace() }
};

Scene.prototype.getEntity = function(id) {
  return this._entities[id];  
};

Scene.prototype.addEntity = function(entity){
  this._entities[entity.getId()] = entity;
  entity.setScene(this);
  this.raiseEntityAdded(entity);
};

Scene.prototype.removeEntity = function(entity) {
  this.raiseEntityRemoved(entity);
	entity.setScene(undefined);
	delete this._entities[entity.getId()];
};

Scene.prototype.doLogic = function() {
    for(i in this._entities){ 
      this._entities[i].doLogic();
    }
    
    for(i in this._entities){ 
      for(j in this._entities){ 
        if(i === j) continue;
        
        // Note: I know this is sub-optimal
        // When it becomes an issue I'll go all DoD on its ass
        // But not until then
        var entityOne = this._entities[i];
        var entityTwo = this._entities[j];
        this.collisionManager.processPair(entityOne, entityTwo);            
      }
    }
};

Scene.prototype.forEachEntity = function(callback) {
  for(var i in this._entities)
      callback(this._entities[i]);
};

Scene.prototype.broadcastEvent = function(source, eventName, data) {
  this.eventContainer.raise(source, eventName, data);

/*
  this.pendingEvents.push({
    source: source,
    eventName: eventName,
    data: data
  }); */
};

Scene.prototype.endEvent = function() {
/*
  this.completedEventCount++;

  if(this.completedEventCount === this.pendingEvents.length) {
    var events = this.pendingEvents;
    this.completedEventCount = 0;
    this.pendingEvents = [];
    this.raiseAllEvents(events);
  }*/
};

Scene.prototype.raiseAllEvents = function(events) {
  for(var i = 0 ; i < events.length; i++) {
    var ev = events[i];

  }
};

Scene.prototype.on = function(eventName, type, callback) {
  this.eventContainer.add(eventName, type, callback);
};

Scene.prototype.off = function(eventName, type, callback) {
  this.eventContainer.remove(eventName, type, callback);
};

Scene.prototype.render = function(context){
  var gl = context.gl;
  
  this.camera.width = context.canvasWidth();
  this.camera.height = context.canvasHeight();
  this.camera.updateMatrices();

  for(var i in this._entities) {
	  var entity = this._entities[i];
        
    if(entity.getSphere){
      if(!this.camera.frustum.intersectSphere(entity.getSphere())){
        continue;
      }
    }      
	  entity.render(context);
  }       
};

exports.Scene = Scene;
