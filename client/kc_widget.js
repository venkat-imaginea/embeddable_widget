// Base
(function(exports) {
	// Server endpoint
	// This is passed in as a data attribute from the embed
	// script and is generated dynamically.
	var script = document.querySelector('#knowncircle-jswidget');
	var root = exports.root = script.getAttribute('data-server') || 'https://knowncircle.com';
	// Environment
	exports.env = window.location.hostname.match(/localhost|\.dev$/)
		? 'local' : 'external';
	// Get a relative url
	exports.api_url = function(path) {
		path = path[0] !== '/' ? ('/' + path) : path;
		return root + path;
	};
}(this.kcApp = this.kcApp || {}));

// Utilities
(function(exports) {
	/////////////////////////////////////////////////////////////////
	// Minimal DOM Create/Configure/Injection Wrapper
	////////////////////////////////////////////////////////////////

	exports.createDOM = function(node) {
		node.tag = (!node.tag) ? 'div' : node.tag; // creates 'div' by default
		var elem = document.createElement(node.tag),
			d = document;

		this.manipulateDOM = function (dom) { // Manipulates the DOM
			try {
				if (dom && typeof dom === 'string') {
					return document.querySelector(dom);
				}
				else if (dom && typeof dom === 'object'){
					return dom;
				}
			}
			catch (e) {
				console.log(e.stack);
			}
		}

		elem.innerHTML = (node.text) ? node.text : ''; // Tag text content


		if(node.attrs) { // Tag attributes set
			var list = Object.keys(node.attrs);
			list.forEach(function(d, i) {
				elem.setAttribute(d, node.attrs[d]);
			});
		}

		// Tag injection
		if(node.append && node.append.hasOwnProperty('before')) {
			var dom = node.append.before,
				base = this.manipulateDOM(node.append.before);
			base.parentNode.insertBefore(elem, base);
		}
		else if(node.append && node.append.hasOwnProperty('after')) {
			var dom = node.append.after,
				base = this.manipulateDOM(node.append.after);
			base.parentNode.insertBefore(elem, base.nextSibling);
		}
		else if(node.append && node.append.hasOwnProperty('to')) {
			var dom = node.append.to,
				base = this.manipulateDOM(node.append.to);
			base.appendChild(elem);
		}
		return elem;
	}

	/////////////////////////////////////////////////////////////////
	// Minimal XHR wrapper
	////////////////////////////////////////////////////////////////
	function XHR(type, url, data) {
		var self = this;
		// Callbacks
		this.success = [];
		this.error = [];
		this.done = false;
		this.kc_refer_widget = document.querySelector('.kc-refer-widget');
		//
		var r = this.r = new XMLHttpRequest();
		r.withCredentials = true;
		r.open(type, url, true);
		r.setRequestHeader('Content-Type', 'application/json');
		r.onreadystatechange = function() {
			if(r.readyState === 4) {
				self.response = self.parse();
				self.done = true;

				if(r.status === 200) {
					self.resolve('success');
				} else {
					self.resolve('error');
				}
			}
		};
		this.kc_refer_widget.className += " loading"; // setting loader ON
		r.send(data);
		return this;
	}

	XHR.prototype.parse = function() {
		var contentType = this.r.getResponseHeader('Content-Type');
		return contentType.toLowerCase().match(/^application\/json/)
			? JSON.parse(this.r.responseText)
			: this.r.responseText;
	};

	XHR.prototype.resolve = function(type) {
		var self = this;
		this[type].forEach(function(fn) {
			self.callback(fn);
		});
		this.kc_refer_widget.className = "kc-refer-widget";
	};

	XHR.prototype.callback = function(fn) {
		fn.call(this, this.response, this.r);
	};

	XHR.prototype.then = function(fn) {
		if (this.done && this.r.status === 200) {
			this.callback(fn);
		} else {
			this.success.push(fn);
		}
		return this;
	};

	XHR.prototype.catch = function(fn) {
		if (this.done && this.r.status !== 200) {
			this.callback(fn);
		} else {
			this.error.push(fn);
		}
		this.kc_refer_widget.className = "kc-refer-widget";
		return this;
	};

	exports.xhr = function(type, url, data) {
		return new XHR(type, url, data);
	};
}(this.kcApp.util = this.kcApp.util || {}));

// Button and styling


// FB login button
(function(d, c) {
	if (kcApp.session && kcApp.session.status !== 'unknown')
		return;
	var style = ".kc-fb-login-button {"
		+ "display: inline-block; background-color: #3b5998; color: #fff; line-height: 33px;text-decoration:none; text-align: center; width: 90px; height: 33px;"
		+ "background: url('https://cdn.knowncircle.com/app/images/widget/fb_login.png') 0 0 no-repeat;"
		+ "margin-left: 30px;"
		+ "vertical-align: middle;"
		+ "background-size: 100%; border-radius: 4px;"
		+ "}"
		+ ".kc-refer-widget {"
		+ "position: relative;"
		+ "text-align: center;"
		+ "}"
		+ ".kc-refer-widget.loading {"
		+ "opacity: 0.2;"
		+ "text-align: center;"
		+ "z-index: 0;"
		+ "}"
		+ ".kcloader {"
		+ "display: none;"
		+ "position: absolute;"
		+ "background: url('https://cdn.knowncircle.com/app/images/widget/loading31.gif') center center no-repeat;"
		+ "background-size: 100%;"
		+ "top: 0;"
		+ "left: 25%;"
		+ "width: 50%;"
		+ "height: 100%;"
		+ "}"
		+ ".kc-refer-widget.loading .kcloader{"
		+ "display: block;"
		+ "z-index: 1;"
		+ "}"
		+ ".hide {"
		+ "display: none;"
		+ "}"
		+ "#widget_status {"
		+ "margin: 0;"
		+ "color: #154995;"
		+ "font-size: 22px;"
		+ "}"
		+ "#more {"
		+ "vertical-align: middle;"
		+ "margin-left: 6px;"
		+ "width: 24px;"
		+ "cursor: pointer;"
		+ "}"
		+ "#kc_before_login {"
		+ "margin: 20px 0 30px;"
		+ "}"
		+ "#kc_after_login {"
		+ "list-style-type: none;"
		+ "display: inline-block;"
		+ "margin: 20px 0 30px;"
		+ "padding: 0;"
		+ "}"
		+ "#kc_after_login li  {"
		+ "display: inline-block;"
		+ "width: 34px;"
		+ "height: 34px;"
		+ "margin: 0 6px 6px 0;"
		+ "border-radius: 34px;"
		+ "border: 1px solid blue;"
		+ "}"
		+ "#kc_after_login li.no_friends {"
		+ "color: #ccc;"
		+ "width: auto;"
		+ "height: auto;"
		+ "margin: 0;"
		+ "font-size: 13px;"
		+ "border: none;"
		+ "}"
		+ "#kc_after_login img  {"
		+ "width: 34px;"
		+ "height: 34px;"
		+ "border-radius: 34px;"
		+ "}"
		+ ".known_to  {"
		+ "color: #333;"
		+ "font-size: 13px;"
		+ "margin: 15px 0 6px 0;"
		+ "}"
		+ ".hide  {"
		+ "display: none !important;"
		+ "}";
	var e = d.querySelector(c),
		createDOM = kcApp.util.createDOM;
	if (!e) {
		return;
	}

	var 
		styleEl = createDOM({
						tag: "style",
						text: style,
						append: {
							to: d.head
						}
					}),
		kc_before_login = createDOM({
							tag: "img",
							attrs: {
								"src": "https://cdn.knowncircle.com/app/images/widget/blur_1.jpg",
								"id": "kc_before_login",
								"title": "Please log in Facebook to view your friend connections"
							},
							append: {
								to: e
							}
						}),
		widget_status = createDOM({
							tag: "p",
							attrs: {
								"id": "widget_status"
							},
							text: "See if your friends know ",
							append: {
								before: kc_before_login
							}
						}),
		fbLink = createDOM({
						tag: "a",
						attrs: {
							"href": "javascript:void(0);",
							"class": "kc-fb-login-button",
							"data-bizid": e.getAttribute('data-bizid'),
							"title": "Log in using Facebook"
						},
						append: {
							to: e
						}
					});

}(document, ".kc-refer-widget"));

// Refer Friends button
(function(d, c) {
	var style = ".kc-refer-button {"
		+ "display: block; width: 128px; height: 34px;"
		+ "background: url('https://cdn.knowncircle.com/app/images/widget/refer_1.png') 0 0 no-repeat;"
		+ "background-size: 100%; border-radius: 4px;"
		+ "margin: 0 auto;"
		+ "}";

	var e = d.querySelector(c),
		createDOM = kcApp.util.createDOM;
	if (!e) {
		return;
	}

	var referLink = createDOM({
						tag: "a",
						attrs: {
							"href": "javascript:void(0);",
							"class": "kc-refer-button",
							"data-bizid": e.getAttribute('data-bizid'),
							"title": "Refer friends"
						},
						append: {
							to: e
						}
					}),
		loader = createDOM({
							tag: "div",
							attrs: {
								"class": "kcloader"
							},
							append: {
								to: e
							}
						}),
		styleEl = createDOM({
						tag: "style",
						text: style,
						append: {
							to: d.head
						}
					});
}(document, ".kc-refer-widget"));

/////////////////////////////////////////////////////////////////
// $script.js - dynamic script loader
////////////////////////////////////////////////////////////////
/*!
* $script.js JS loader & dependency manager
* https://github.com/ded/script.js
* (c) Dustin Diaz 2014 | License MIT
*/

(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
})('$script', function () {
  var doc = document
	, head = doc.getElementsByTagName('head')[0]
	, s = 'string'
	, f = false
	, push = 'push'
	, readyState = 'readyState'
	, onreadystatechange = 'onreadystatechange'
	, list = {}
	, ids = {}
	, delay = {}
	, scripts = {}
	, scriptpath
	, urlArgs

  function every(ar, fn) {
	for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
	return 1
  }
  function each(ar, fn) {
	every(ar, function (el) {
	  return !fn(el)
	})
  }

  function $script(paths, idOrDone, optDone) {
	paths = paths[push] ? paths : [paths]
	var idOrDoneIsDone = idOrDone && idOrDone.call
	  , done = idOrDoneIsDone ? idOrDone : optDone
	  , id = idOrDoneIsDone ? paths.join('') : idOrDone
	  , queue = paths.length
	function loopFn(item) {
	  return item.call ? item() : list[item]
	}
	function callback() {
	  if (!--queue) {
		list[id] = 1
		done && done()
		for (var dset in delay) {
		  every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
		}
	  }
	}
	setTimeout(function () {
	  each(paths, function loading(path, force) {
		if (path === null) return callback()
		path = !force && path.indexOf('.js') === -1 && !/^https?:\/\//.test(path) && scriptpath ? scriptpath + path + '.js' : path
		if (scripts[path]) {
		  if (id) ids[id] = 1
		  return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
		}

		scripts[path] = 1
		if (id) ids[id] = 1
		create(path, callback)
	  })
	}, 0)
	return $script
  }

  function create(path, fn) {
	var el = doc.createElement('script'), loaded
	el.onload = el.onerror = el[onreadystatechange] = function () {
	  if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
	  el.onload = el[onreadystatechange] = null
	  loaded = 1
	  scripts[path] = 2
	  fn()
	}
	el.async = 1
	el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
	head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
	(function callback(s) {
	  s = scripts.shift()
	  !scripts.length ? $script(s, id, done) : $script(s, callback)
	}())
  }

  $script.path = function (p) {
	scriptpath = p
  }
  $script.urlArgs = function (str) {
	urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
	deps = deps[push] ? deps : [deps]
	var missing = [];
	!each(deps, function (dep) {
	  list[dep] || missing[push](dep);
	}) && every(deps, function (dep) {return list[dep]}) ?
	  ready() : !function (key) {
	  delay[key] = delay[key] || []
	  delay[key][push](ready)
	  req && req(missing)
	}(deps.join('|'))
	return $script
  }

  $script.done = function (idOrDone) {
	$script([null], idOrDone)
  }

  return $script
});

// Load dependencies in order
(function() {
	$script('https://cdn.socialtwist.com/2014100658903/script.js', 'SocialTwist');
	$script.ready('SocialTwist', function() {
		$script('https://content.socialtwist.com/IntroPageTemplate/intropage/js/intro-a.js', 'STIntro');
	});
	$script.ready('STIntro', function() {
		$script([
			'https://content.socialtwist.com/themes/2014100658903/1000853/js/params.js',
		], 'STAll');
	});
}());

// FaceBook iFrame
// Since we require the FB user ID to generate the tracker,
// we have to load up the FB js library in an iFrame so that
// it is served up from the KnownCircle domain. We then detect
// the Facebook user ID, and broadcast it to the parent window
// using postMessage.
(function(d, c, exports) {
	var e = d.querySelector(c),
		i = d.createElement('iframe'),
		bizid = e.getAttribute('data-bizid');

	var attrs = { id: "kc-fb-frame", class: "hide", width: 0, height: 0, frameborder: 0, hspace: 0,
		marginheight: 0, marginwidth: 0, scrolling: "no", tabindex: 0, vspace: 0 };
	i.src = kcApp.api_url('/widgets/iframe.html?bizid=' + bizid);
	for (var a in attrs) {
		i.setAttribute(a, attrs[a]);
	}
	e.appendChild(i);

	// Save reference to the window so that we can use that
	// to check the FB login status of the user when the widget is clicked
	exports.iframe = i;

	// Listen to the FB status from the iframe
	function listenToLogin(e) {
		if (e.data) {
			var data = JSON.parse(e.data);
			if (data.type && data.type === 'FB') {
				var session = data;
				session.bizid = bizid;
				if (data.user) {
					session.fbid = data.authResponse.userID;
					session.user = data.user;
				}
				kcApp.session = session;
				// If action, process
				if(session.bizid) {
					if (data.action && data.action === 'refer') {
							kcApp.widget.refer(session.fbid, session.bizid);
						}
						if(session.fbid) {
							kcApp.widget.getFriends(session.fbid, session.bizid);
						}
				}
				else { // when there's no data-bizid
					//var profile_uri = 'https://dl.dropboxusercontent.com/u/38077118/geico/insurance-agents/california/san-francisco/marlon-zarate.html';
					var profile_uri = window.location.href;
					var url = kcApp.api_url('/get-biz-id?profile_uri=' + profile_uri + '&fb_id=' + session.fbid);

					var promise = kcApp.util.xhr('get', url);

					promise.then(function(response) {
						if (response.status === "success") {
							kcApp.session.bizid = response.biz.bizid;
							kcApp.session.bizname = response.biz.biz_name;
							d.querySelector('#widget_status').innerHTML = "See if your friends know " + kcApp.session.bizname.split(' ')[0];
							if (data.action && data.action === 'refer') {
								kcApp.widget.refer(session.fbid, response.biz.bizid); // passing the received biz_id
							}
							if(session.fbid) {
								kcApp.widget.getFriends(session.fbid, response.biz.bizid);
							}
						}
						else {
							d.querySelector('.kc-refer-widget').parentNode.parentNode.className = "hide"; // hiding the widget wrapper if there's no biz_id
						}
					});
				}

			}
		}
	}
	if (window.addEventListener) {
		window.addEventListener("message", listenToLogin);
	} else {
		window.attachEvent("message", listenToLogin);
	}
}(document, ".kc-refer-widget", this.kcApp.widget = this.kcApp.widget || {}));



// Refer widget
(function(exports) {
	var self = kcApp.widget;

	exports.refer = function(callback) {
		var session = kcApp.session,
			bizid = session.bizid,
			fbid = session.fbid;

		if (!fbid) {
			return false;
		}

		// Get the tracker and business information
		//var url = kcApp.api_url('/business/widget/' + bizid + '?fbid=' + fbid);

		if(bizid) {
			url = kcApp.api_url('/business/widget/' + bizid + '?fbid=' + fbid);
		}else{
			//var profile_uri = 'https://dl.dropboxusercontent.com/u/38077118/geico/insurance-agents/california/san-francisco/marlon-zarate.html';
			var profile_uri = window.location.href;
			var url = kcApp.api_url('/business/widget?profile_uri=' + profile_uri + '&fb_id=' + fbid);
		}

		var promise = kcApp.util.xhr('get', url);

		promise.then(function(response) {
			setSTVariables(response);
			STTAFINTRO.openWidget();
		});

		promise.catch(function(error, response) {
			alert(error.message);
		});
	};

	function setSTVariables(info) {
		var user = kcApp.session.user;
		STTAFINTRO.emailId = user.email;
		STTAFINTRO.fName = user.first_name + ' ' + user.last_name;
		STTAFINTRO.referralLink = info.referralLink + '#kc_' + info.tracker;
		// Custom variables
		STTAFINTRO.customVariables._yourName = user.name;
		STTAFINTRO.customVariables._yourEmail = user.email;
		STTAFINTRO.customVariables.avatar = info.avatar;
		STTAFINTRO.customVariables.profession = info.profession;
		STTAFINTRO.customVariables.bizname = info.name;
		STTAFINTRO.customVariables.bizid = kcApp.session.bizid;
	}

	function referAction(e) {
		e.preventDefault();
		if (!kcApp.session || kcApp.session.status === 'unknown') {
			var message = JSON.stringify({ type: "fbLogin", action: "refer" });
			var iframe = kcApp.widget.iframe.contentWindow;
			iframe.postMessage(message, "*");
		}
		else if (kcApp.session.user) {
			kcApp.widget.refer();
		}
	}

	var button = document.querySelector(".kc-refer-button");

	if (button.addEventListener) {
		button.addEventListener("click", referAction);
	} else {
		button.attachEvent("click", referAction);
	}

}(this.kcApp.widget = this.kcApp.widget || {}));

// KC widget
(function(d, c, exports) {
	var self = kcApp.widget;


	exports.getFriends = function(fb_id, biz_id) {
		var session = kcApp.session,
			bizid = biz_id || session.bizid,
			url = '',
			fbid = fb_id || session.fbid;

		if(!fbid) {
			return false;
		}

		if(bizid) {
			url = kcApp.api_url('/friend-connections?bizid=' + bizid + '&fb_id=' + fbid);
		}else{
			//var profile_uri = 'https://dl.dropboxusercontent.com/u/38077118/geico/insurance-agents/california/san-francisco/marlon-zarate.html';
			var profile_uri = window.location.href;
			var url = kcApp.api_url('/friend-connections?profile_uri=' + profile_uri + '&fb_id=' + fbid);
		}

		var promise = kcApp.util.xhr('get', url),
			e = d.querySelector(c); // widget placeholder

		promise.then(function(response){
			if (response.status === "success") {
				var ul = d.createElement('ul'),
					p = d.getElementById('widget_status'),
					referBtn = d.querySelector('.kc-refer-button'),
					kc_before_login = d.getElementById('kc_before_login') || {};
				ul.id = "kc_after_login";
				p.innerHTML = "Friend connections";
				if (kc_before_login) {
					kc_before_login.className = " hide";
				}

				var friends_list = Object.keys(response.connections.friends);
				if (friends_list.length) {
					friends_list.forEach(function(fbid, i) {

						var li = d.createElement('li'),
							img = kcApp.util.createDOM({
								tag: "img",
								attrs: {
									"src": "https://graph.facebook.com/" + fbid + "/picture",
									"title": response.connections.friends[fbid].name
								},
								append: {
									to: li
								}
							});

						if (i > 4) { // showing only 5 friends initially
							li.className = 'hide';
						}

						ul.appendChild(li);

					});
				}
				else { // when Friends count is 0
					kcApp.util.createDOM({
						tag: "li",
						attrs: {
							"class": "no_friends"
						},
						text: "No friends in " + session.bizname + "'s KnownCircle",
						append: {
							to: ul
						}
					});
				}
				//e.parentNode.insertBefore(ul, e);
				referBtn.parentNode.insertBefore(ul, referBtn);
				
				if (friends_list.length > 4) { // More button
					kcApp.util.createDOM({
						tag: "img",
						attrs: {
							"src": "https://cdn.knowncircle.com/app/images/widget/more.png",
							"title": "More",
							"id": "more"
						},
						append: {
							before: referBtn
						}
					});
					d.getElementById('more').addEventListener('click', function(event){
						var hideEls = d.querySelectorAll('#kc_after_login .hide');
						for (var elem in hideEls) {
							hideEls[elem].className = "show";
						}
						event.target.className = "hide";
					}, false);
				}
				// Switching off 'Known To' temporarily
				// var known_to = kcApp.util.createDOM({
				// 	tag: "p",
				// 	attrs: {
				// 		"class": "known_to"
				// 	},
				// 	text: "Known to <strong>" + response.connections.kc_count + "</strong> friends",
				// 	append: {
				// 		before: ul
				// 	}
				// });
				// e.parentNode.insertBefore(p, known_to);
				d.querySelector('.kc-fb-login-button').className += " hide";
			}
			else {
				console.error('Facebook login failed.');
			}
		});

		promise.catch(function(error, response){
			alert(error.message);
		});
	}

	function loginAction(e) {
		e.preventDefault();
		var message = JSON.stringify({ type: 'fbLogin', action:'login'});
		var iframe = kcApp.widget.iframe.contentWindow;
		iframe.postMessage(message, '*');
	}

	var button = document.querySelector(".kc-fb-login-button");

	if (button.addEventListener) {
		button.addEventListener("click", loginAction);
	} else {
		button.attachEvent("click", loginAction);
	}
}(document, '.kc-refer-widget', this.kcApp.widget = this.kcApp.widget || {}));
