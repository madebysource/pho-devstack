var Cache = function() {
  this._data = {};
};

Cache.prototype.isDirty = function(name) {
  return !this._data[name];
};

Cache.prototype.isClean = function(name) {
  return this._data[name];
};

Cache.prototype.setClean = function(name) {
  this._data[name] = true;
};

Cache.prototype.setDirty = function(name) {
  this._data[name] = false;
};

module.exports = Cache;
