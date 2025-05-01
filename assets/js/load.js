(function (global, undefined) {
  "use strict";

  // No-operation function
  function noop() {}

  // Iterate over an array-like structure
  function each(collection, callback) {
    if (!collection) return;
    if (typeof collection === "object") {
      collection = [].slice.call(collection);
    }
    for (let i = 0, len = collection.length; i < len; i++) {
      callback.call(collection, collection[i], i);
    }
  }

  // Type checking utility
  function isType(type, obj) {
    return obj !== undefined && obj !== null &&
           Object.prototype.toString.call(obj).slice(8, -1) === type;
  }

  function isFunction(obj) {
    return isType("Function", obj);
  }

  function isArray(obj) {
    return isType("Array", obj);
  }

  // Extracts file name from URL
  function getFileName(url) {
    let parts = url.split("/");
    let last = parts[parts.length - 1];
    let queryIndex = last.indexOf("?");
    return queryIndex !== -1 ? last.substring(0, queryIndex) : last;
  }

  function done(callback) {
    if (callback._done) return;
    callback();
    callback._done = true;
  }

  // Conditional loader
  function test(condition, success, failure, callback) {
    const obj = typeof condition === "object" ? condition : {
      test: condition,
      success: success ? (isArray(success) ? success : [success]) : false,
      failure: failure ? (isArray(failure) ? failure : [failure]) : false,
      callback: callback || noop,
    };

    const result = !!obj.test;

    if (result && obj.success) {
      obj.success.push(obj.callback);
      loader.load.apply(null, obj.success);
    } else if (!result && obj.failure) {
      obj.failure.push(obj.callback);
      loader.load.apply(null, obj.failure);
    } else {
      obj.callback();
    }

    return loader;
  }

  // Normalize resource definition
  function normalizeResource(resource) {
    let result = {};
    if (typeof resource === "object") {
      for (let name in resource) {
        if (resource[name]) {
          result = { name, url: resource[name] };
        }
      }
    } else {
      result = { name: getFileName(resource), url: resource };
    }

    if (resources[result.name] && resources[result.name].url === result.url) {
      return resources[result.name];
    }

    resources[result.name] = result;
    return result;
  }

  function allLoaded(scope = resources) {
    for (let key in scope) {
      if (scope.hasOwnProperty(key) && scope[key].state !== STATE.LOADED) {
        return false;
      }
    }
    return true;
  }

  function preloadDone(resource) {
    resource.state = STATE.PRELOADED;
    each(resource.onpreload, (fn) => fn());
  }

  function preload(resource) {
    if (resource.state === undefined) {
      resource.state = STATE.PRELOADING;
      resource.onpreload = [];
      loadResource({ url: resource.url, type: "cache" }, () => preloadDone(resource));
    }
  }

  // Load sequence logic
  function load() {
    const args = arguments;
    const rest = [].slice.call(args, 1);
    const first = args[0];

    if (!initialized) {
      preloadQueue.push(() => loader.load.apply(null, args));
      return loader;
    }

    if (rest.length) {
      each(rest, (res) => {
        if (!isFunction(res) && res) {
          preload(normalizeResource(res));
        }
      });

      loadResourceWithCallback(
        normalizeResource(first),
        isFunction(rest[0])
          ? rest[0]
          : () => loader.load.apply(null, rest)
      );
    } else {
      loadResourceWithCallback(normalizeResource(first));
    }

    return loader;
  }

  // Load multiple resources in parallel
  function loadMultiple() {
    const args = arguments;
    const lastArg = args[args.length - 1];
    let callback = isFunction(lastArg) ? lastArg : null;
    const resourceMap = {};

    each(args, (res, idx) => {
      if (res !== callback) {
        res = normalizeResource(res);
        resourceMap[res.name] = res;
        loadResourceWithCallback(res, callback && idx === args.length - 2 ? () => {
          if (allLoaded(resourceMap)) done(callback);
        } : null);
      }
    });

    return loader;
  }

  function loadResourceWithCallback(resource, callback = noop) {
    if (resource.state === STATE.LOADED) {
      callback();
      return;
    }

    if (resource.state === STATE.LOADING) {
      loader.ready(resource.name, callback);
      return;
    }

    if (resource.state === STATE.PRELOADING) {
      resource.onpreload.push(() => loadResourceWithCallback(resource, callback));
      return;
    }

    resource.state = STATE.LOADING;

    loadResource(resource, () => {
      resource.state = STATE.LOADED;
      callback();
      each(readyCallbacks[resource.name], done);
      if (domReady && allLoaded()) {
        each(readyCallbacks.ALL, done);
      }
    });
  }

  function loadResource(resource, callback = noop) {
    let element;
    const isCSS = /\.css[^.]*$/.test(resource.url);

    if (isCSS) {
      element = document.createElement("link");
      element.type = "text/css";
      element.rel = "stylesheet";
      element.href = resource.url;
    } else {
      element = document.createElement("script");
      element.type = "text/javascript";
      element.src = resource.url;
    }

    element.onload = element.onreadystatechange = function (event) {
      if (
        event.type === "load" ||
        (/loaded|complete/.test(element.readyState) && (!document.documentMode || document.documentMode < 9))
      ) {
        element.onload = element.onreadystatechange = element.onerror = null;
        callback();
      }
    };

    element.onerror = () => {
      element.onload = element.onreadystatechange = element.onerror = null;
      callback();
    };

    element.async = false;
    element.defer = false;

    const head = document.head || document.getElementsByTagName("head")[0];
    head.insertBefore(element, head.lastChild);
  }

  function checkAutoload() {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const dataLoad = scripts[i].getAttribute("data-headjs-load");
      if (dataLoad) {
        loader.load(dataLoad);
        return;
      }
    }
  }

  function onReady(resourceName, callback) {
    if (resourceName === document) {
      if (domReady) {
        done(callback);
      } else {
        domReadyCallbacks.push(callback);
      }
      return loader;
    }

    if (isFunction(resourceName)) {
      callback = resourceName;
      resourceName = "ALL";
    }

    if (typeof resourceName !== "string" || !isFunction(callback)) {
      return loader;
    }

    const res = resources[resourceName];

    if ((res && res.state === STATE.LOADED) || (resourceName === "ALL" && allLoaded() && domReady)) {
      done(callback);
    } else {
      readyCallbacks[resourceName] = readyCallbacks[resourceName] || [];
      readyCallbacks[resourceName].push(callback);
    }

    return loader;
  }

  function onDomReady() {
    if (!document.body) {
      clearTimeout(loader.readyTimeout);
      loader.readyTimeout = setTimeout(onDomReady, 50);
      return;
    }

    if (!domReady) {
      domReady = true;
      checkAutoload();
      each(domReadyCallbacks, done);
    }
  }

  function handleDOMContentLoaded() {
    if (document.addEventListener) {
      document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
      onDomReady();
    } else if (document.readyState === "complete") {
      document.detachEvent("onreadystatechange", handleDOMContentLoaded);
      onDomReady();
    }
  }

  const document = global.document;
  const domReadyCallbacks = [];
  const preloadQueue = [];
  const readyCallbacks = {};
  const resources = {};

  const supportsAsync =
    "async" in document.createElement("script") ||
    "MozAppearance" in document.documentElement.style ||
    global.opera;

  let initialized = false;
  let domReady = false;

  const STATE = {
    PRELOADING: 1,
    PRELOADED: 2,
    LOADING: 3,
    LOADED: 4,
  };

  const headVar = (global.head_conf && global.head_conf.head) || "head";
  const loader = (global[headVar] = global[headVar] || function () {
    loader.ready.apply(null, arguments);
  });

  // Setup load strategies
  loader.load = loader.js = supportsAsync ? loadMultiple : load;
  loader.test = test;
  loader.ready = onReady;

  loader.ready(document, function () {
    if (allLoaded()) {
      each(readyCallbacks.ALL, done);
    }
    if (loader.feature) {
      loader.feature("domloaded", true);
    }
  });

  // DOM ready detection
  if (document.readyState === "complete") {
    onDomReady();
  } else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
    global.addEventListener("load", onDomReady);
  } else {
    document.attachEvent("onreadystatechange", handleDOMContentLoaded);
    global.attachEvent("onload", onDomReady);

    let top = false;
    try {
      top = !global.frameElement && document.documentElement;
    } catch (err) {}

    if (top && top.doScroll) {
      (function check() {
        if (!domReady) {
          try {
            top.doScroll("left");
          } catch (err) {
            clearTimeout(loader.readyTimeout);
            loader.readyTimeout = setTimeout(check, 50);
            return;
          }
          onDomReady();
        }
      })();
    }
  }

  // Deferred execution
  setTimeout(() => {
    initialized = true;
    each(preloadQueue, (fn) => fn());
  }, 300);

})(window);
