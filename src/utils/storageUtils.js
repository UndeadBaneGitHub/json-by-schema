const TEST_KEY = '__test';

function hasStorage(...args) {
  const name =
    arguments.length > 0 && args[0] !== undefined ? args[0] : 'localStorage';

  try {
    const storage = window[name];
    storage.setItem(TEST_KEY, '1');
    storage.removeItem(TEST_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

function MemoryStorage() {
  this.data = {};

  this.getItem = function getItem(key) {
    return {}.hasOwnProperty.call(this.data, key) ? this.data[key] : undefined;
  };
  this.setItem = function setItem(key, value) {
    this.data[key] = String(value);
    return this.data[key];
  };
  this.removeItem = function removeItem(key) {
    return delete this.data[key];
  };
  this.clear = function clear() {
    this.data = {};
    return this.data;
  };
}

const storage = hasStorage('localStorage') ? localStorage : new MemoryStorage();

function getStorage() {
  return storage;
}

export { getStorage };
