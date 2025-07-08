! function(t) {
    function e(i) {
        if (n[i]) return n[i].exports;
        var r = n[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(r.exports, r, r.exports, e), r.l = !0, r.exports
    }
    var n = {};
    e.m = t, e.c = n, e.i = function(t) {
        return t
    }, e.d = function(t, n, i) {
        e.o(t, n) || Object.defineProperty(t, n, {
            configurable: !1,
            enumerable: !0,
            get: i
        })
    }, e.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return e.d(n, "a", n), n
    }, e.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, e.p = "", e(e.s = 164)
}({
    0: function(t, e) {
        t.exports = jQuery
    },
    15: function(t, e, n) {
        var i, r, s;
        /*!
         * mustache.js - Logic-less {{mustache}} templates with JavaScript
         * http://github.com/janl/mustache.js
         */
        ! function(n, o) {
            "object" == typeof e && e && "string" != typeof e.nodeName ? o(e) : (r = [e], i = o, void 0 !== (s = "function" == typeof i ? i.apply(e, r) : i) && (t.exports = s))
        }(0, function(t) {
            function e(t) {
                return "function" == typeof t
            }

            function n(t) {
                return g(t) ? "array" : typeof t
            }

            function i(t) {
                return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            }

            function r(t, e) {
                return null != t && "object" == typeof t && e in t
            }

            function s(t, e) {
                return m.call(t, e)
            }

            function o(t) {
                return !s(y, t)
            }

            function a(t) {
                return String(t).replace(/[&<>"'`=\/]/g, function(t) {
                    return v[t]
                })
            }

            function u(e, n) {
                function r(t) {
                    if ("string" == typeof t && (t = t.split(b, 2)), !g(t) || 2 !== t.length) throw new Error("Invalid tags: " + t);
                    s = new RegExp(i(t[0]) + "\\s*"), a = new RegExp("\\s*" + i(t[1])), u = new RegExp("\\s*" + i("}" + t[1]))
                }
                if (!e) return [];
                var s, a, u, f = [],
                    d = [],
                    p = [],
                    m = !1,
                    y = !1;
                r(n || t.tags);
                for (var v, S, T, C, A, $, I = new h(e); !I.eos();) {
                    if (v = I.pos, T = I.scanUntil(s))
                        for (var E = 0, q = T.length; E < q; ++E) C = T.charAt(E), o(C) ? p.push(d.length) : y = !0, d.push(["text", C, v, v + 1]), v += 1, "\n" === C && function() {
                            if (m && !y)
                                for (; p.length;) delete d[p.pop()];
                            else p = [];
                            m = !1, y = !1
                        }();
                    if (!I.scan(s)) break;
                    if (m = !0, S = I.scan(k) || "name", I.scan(_), "=" === S ? (T = I.scanUntil(w), I.scan(w), I.scanUntil(a)) : "{" === S ? (T = I.scanUntil(u), I.scan(x), I.scanUntil(a), S = "&") : T = I.scanUntil(a), !I.scan(a)) throw new Error("Unclosed tag at " + I.pos);
                    if (A = [S, T, v, I.pos], d.push(A), "#" === S || "^" === S) f.push(A);
                    else if ("/" === S) {
                        if (!($ = f.pop())) throw new Error('Unopened section "' + T + '" at ' + v);
                        if ($[1] !== T) throw new Error('Unclosed section "' + $[1] + '" at ' + v)
                    } else "name" === S || "{" === S || "&" === S ? y = !0 : "=" === S && r(T)
                }
                if ($ = f.pop()) throw new Error('Unclosed section "' + $[1] + '" at ' + I.pos);
                return l(c(d))
            }

            function c(t) {
                for (var e, n, i = [], r = 0, s = t.length; r < s; ++r)(e = t[r]) && ("text" === e[0] && n && "text" === n[0] ? (n[1] += e[1], n[3] = e[3]) : (i.push(e), n = e));
                return i
            }

            function l(t) {
                for (var e, n, i = [], r = i, s = [], o = 0, a = t.length; o < a; ++o) switch (e = t[o], e[0]) {
                    case "#":
                    case "^":
                        r.push(e), s.push(e), r = e[4] = [];
                        break;
                    case "/":
                        n = s.pop(), n[5] = e[2], r = s.length > 0 ? s[s.length - 1][4] : i;
                        break;
                    default:
                        r.push(e)
                }
                return i
            }

            function h(t) {
                this.string = t, this.tail = t, this.pos = 0
            }

            function f(t, e) {
                this.view = t, this.cache = {
                    ".": this.view
                }, this.parent = e
            }

            function d() {
                this.cache = {}
            }
            var p = Object.prototype.toString,
                g = Array.isArray || function(t) {
                    return "[object Array]" === p.call(t)
                },
                m = RegExp.prototype.test,
                y = /\S/,
                v = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;",
                    "`": "&#x60;",
                    "=": "&#x3D;"
                },
                _ = /\s*/,
                b = /\s+/,
                w = /\s*=/,
                x = /\s*\}/,
                k = /#|\^|\/|>|\{|&|=|!/;
            h.prototype.eos = function() {
                return "" === this.tail
            }, h.prototype.scan = function(t) {
                var e = this.tail.match(t);
                if (!e || 0 !== e.index) return "";
                var n = e[0];
                return this.tail = this.tail.substring(n.length), this.pos += n.length, n
            }, h.prototype.scanUntil = function(t) {
                var e, n = this.tail.search(t);
                switch (n) {
                    case -1:
                        e = this.tail, this.tail = "";
                        break;
                    case 0:
                        e = "";
                        break;
                    default:
                        e = this.tail.substring(0, n), this.tail = this.tail.substring(n)
                }
                return this.pos += e.length, e
            }, f.prototype.push = function(t) {
                return new f(t, this)
            }, f.prototype.lookup = function(t) {
                var n, i = this.cache;
                if (i.hasOwnProperty(t)) n = i[t];
                else {
                    for (var s, o, a = this, u = !1; a;) {
                        if (t.indexOf(".") > 0)
                            for (n = a.view, s = t.split("."), o = 0; null != n && o < s.length;) o === s.length - 1 && (u = r(n, s[o])), n = n[s[o++]];
                        else n = a.view[t], u = r(a.view, t);
                        if (u) break;
                        a = a.parent
                    }
                    i[t] = n
                }
                return e(n) && (n = n.call(this.view)), n
            }, d.prototype.clearCache = function() {
                this.cache = {}
            }, d.prototype.parse = function(t, e) {
                var n = this.cache,
                    i = n[t];
                return null == i && (i = n[t] = u(t, e)), i
            }, d.prototype.render = function(t, e, n) {
                var i = this.parse(t),
                    r = e instanceof f ? e : new f(e);
                return this.renderTokens(i, r, n, t)
            }, d.prototype.renderTokens = function(t, e, n, i) {
                for (var r, s, o, a = "", u = 0, c = t.length; u < c; ++u) o = void 0, r = t[u], s = r[0], "#" === s ? o = this.renderSection(r, e, n, i) : "^" === s ? o = this.renderInverted(r, e, n, i) : ">" === s ? o = this.renderPartial(r, e, n, i) : "&" === s ? o = this.unescapedValue(r, e) : "name" === s ? o = this.escapedValue(r, e) : "text" === s && (o = this.rawValue(r)), void 0 !== o && (a += o);
                return a
            }, d.prototype.renderSection = function(t, n, i, r) {
                function s(t) {
                    return o.render(t, n, i)
                }
                var o = this,
                    a = "",
                    u = n.lookup(t[1]);
                if (u) {
                    if (g(u))
                        for (var c = 0, l = u.length; c < l; ++c) a += this.renderTokens(t[4], n.push(u[c]), i, r);
                    else if ("object" == typeof u || "string" == typeof u || "number" == typeof u) a += this.renderTokens(t[4], n.push(u), i, r);
                    else if (e(u)) {
                        if ("string" != typeof r) throw new Error("Cannot use higher-order sections without the original template");
                        u = u.call(n.view, r.slice(t[3], t[5]), s), null != u && (a += u)
                    } else a += this.renderTokens(t[4], n, i, r);
                    return a
                }
            }, d.prototype.renderInverted = function(t, e, n, i) {
                var r = e.lookup(t[1]);
                if (!r || g(r) && 0 === r.length) return this.renderTokens(t[4], e, n, i)
            }, d.prototype.renderPartial = function(t, n, i) {
                if (i) {
                    var r = e(i) ? i(t[1]) : i[t[1]];
                    return null != r ? this.renderTokens(this.parse(r), n, i, r) : void 0
                }
            }, d.prototype.unescapedValue = function(t, e) {
                var n = e.lookup(t[1]);
                if (null != n) return n
            }, d.prototype.escapedValue = function(e, n) {
                var i = n.lookup(e[1]);
                if (null != i) return t.escape(i)
            }, d.prototype.rawValue = function(t) {
                return t[1]
            }, t.name = "mustache.js", t.version = "2.3.2", t.tags = ["{{", "}}"];
            var S = new d;
            return t.clearCache = function() {
                return S.clearCache()
            }, t.parse = function(t, e) {
                return S.parse(t, e)
            }, t.render = function(t, e, i) {
                if ("string" != typeof t) throw new TypeError('Invalid template! Template should be a "string" but "' + n(t) + '" was given as the first argument for mustache#render(template, view, partials)');
                return S.render(t, e, i)
            }, t.to_html = function(n, i, r, s) {
                var o = t.render(n, i, r);
                if (!e(s)) return o;
                s(o)
            }, t.escape = a, t.Scanner = h, t.Context = f, t.Writer = d, t
        })
    },
    157: function(t, e, n) {
        "use strict";

        function i() {
            var t, e = a()(".site-search__input"),
                n = a()(".form-search__x"),
                i = a()(".js-site-search"),
                r = a()("#search-button"),
                o = a()("#js-search-close"),
                u = function(e) {
                    return t = a()("<div>", {
                        class: "site-search__overlay"
                    })
                },
                c = function(t) {
                    e.val().length > 0 ? n.addClass("is-active") : n.removeClass("is-active")
                },
                l = function() {
                    n.removeClass("is-active"), a()("#search-input").typeahead("val", "")
                },
                h = function() {
                    i.fadeOut(400, function() {}), t.removeClass("site-search__overlay--active"), a()(".js-site-search").attr("aria-modal", !1), a()(".site-search__results").attr("aria-expanded", !1), l()
                },
                f = function(n) {
                    i.show(), e.focus(), t.addClass("site-search__overlay--active"), s("Search Box")
                },
                d = function() {
                    n.on("click", l), r.on("click", f), o.on("click", h), e.keyup(c), t.on("click", h)
                };
            ! function() {
                u(), d()
            }()
        }

        function r() {
            if (window.rcProps) {
                var t = new c.a({
                        datumTokenizer: c.a.tokenizers.obj.whitespace("productName"),
                        queryTokenizer: c.a.tokenizers.whitespace,
                        remote: {
                            url: "/r/ajax/VisualSearch.jsp?fw=true&q=%QUERY&d=" + rcProps.department,
                            wildcard: "%QUERY"
                        }
                    }),
                    e = new c.a({
                        datumTokenizer: c.a.tokenizers.obj.whitespace("searchTerm"),
                        queryTokenizer: c.a.tokenizers.whitespace,
                        remote: {
                            url: "/r/ajax/TextSuggestions.jsp?fw=true&q=%QUERY&d=" + rcProps.department,
                            wildcard: "%QUERY"
                        }
                    });
                a()("#search-input").typeahead({
                    hint: !1,
                    highlight: !0,
                    minLength: window.rcProps.search.minCharLengthForSearching,
                    classNames: {
                        menu: "site-search__results",
                        dataset: "g n-block-grid--1"
                    }
                }, {
                    name: "textSuggestions",
                    display: function(t) {
                        return t.suggestion
                    },
                    source: e,
                    templates: {
                        suggestion: function(t) {
                            return h.a.render(rcProps.get("search.text.templates.line"), t)
                        }
                    },
                    limit: rcProps.get("search.text.limit")
                }, {
                    name: "recent",
                    display: function(t) {
                        return t.searchText
                    },
                    source: function(t, e) {
                        e(rcProps.get("search.recent.json"))
                    },
                    templates: {
                        suggestion: function(t) {
                            return h.a.render(rcProps.get("search.recent.template"), t)
                        }
                    }
                }, {
                    name: "productSuggestions",
                    display: "productName",
                    source: t,
                    templates: {
                        header: function() {
                            return a()(function() {
                                a()("#js-search-hed-target").parent().before(a()("#js-search-hed-target"))
                            }), a()("#js-search-hed-target").first().remove(), rcProps.get("search.visual.templates.header")
                        },
                        suggestion: function(t) {
                            return a()(".site-search__results .n-block-grid--1-productSuggestions").removeClass("g n-block-grid--1").addClass("horizontal-scroll u-flex"), h.a.render(rcProps.get("search.visual.templates.line"), t)
                        },
                        notFound: function() {
                            a()(".n-block-grid--1-productSuggestions").removeClass("horizontal-scroll"), a()(".product-suggestions__title").remove()
                        }
                    },
                    limit: rcProps.get("search.visual.limit")
                }).on("typeahead:select", function(t, e) {
                    if (s("click_search_suggestion_" + (e.termType || "search")), "productURL" in e) window.location.href = e.productURL;
                    else if ("suggestionUrl" in e) window.location.href = e.suggestionUrl;
                    else if ("href" in e) window.location.href = e.href;
                    else {
                        var n = "/content/s/ct?type=" + e.typeShortCode + "&q=" + e.searchTerm + "&s=" + e.suggestion + "&d=" + rcProps.get("department");
                        window.location.href = n
                    }
                }).on("typeahead:render", function(t) {
                    a()("#search-input").val().length > 0 ? a()(".n-block-grid--1-recent li").slice(3).hide() : a()(".n-block-grid--1-recent li").slice(3).show()
                }), a()(".tt-dropdown-menu").addClass("site-search__predictions").css({
                    left: "",
                    "z-index": "",
                    right: ""
                }), a()(".twitter-typeahead").addClass("site-search__typeahead form-search__input").css({
                    width: "60%"
                }), a()(".tt-dataset-textSuggestions").addClass("site-search__suggestions"), a()(".site-search__results div").first().removeClass("g n-block-grid--2  n-block-grid--2-textSuggestions"), a()(".tt-dataset-products").addClass("g").addClass("n-block-grid--2"), a()(".tt-highlight").addClass("site-search__highlight"), a()(".tt-dataset-products").addClass("predict-related"), a()(".site-search__results").insertAfter(".site-search"), a()(".site-search__results").css({
                    width: "100%"
                }), a()(".site-search__results").css({
                    "padding-bottom": "17px"
                }), a()(".js-site-search").attr("aria-modal", !0), a()(".site-search__results").attr("aria-expanded", !0)
            }
        }

        function s(t) {
            a.a.ajax({
                type: "POST",
                data: a.a.param({
                    url: window.location.href,
                    module: "mobile_search",
                    action: t
                }),
                url: "/r/ajax/LogEngagement.jsp"
            })
        }
        var o = n(0),
            a = n.n(o),
            u = n(175),
            c = n.n(u),
            l = n(15),
            h = n.n(l);
        e.a = {
            init: function() {
                i(), window.rcProps && "function" == typeof window.rcProps.get && r()
            }
        }
    },
    164: function(t, e, n) {
        "use strict";

        function i() {
            o.a.init()
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(0),
            s = n.n(r),
            o = n(157);
        s()(document).ready(function() {
            i()
        })
    },
    17: function(t, e) {
        var n;
        n = function() {
            return this
        }();
        try {
            n = n || Function("return this")() || (0, eval)("this")
        } catch (t) {
            "object" == typeof window && (n = window)
        }
        t.exports = n
    },
    175: function(t, e, n) {
        (function(i) {
            var r, s, r, s;
            "function" == typeof Symbol && Symbol.iterator;
            /*!
             * typeahead.js 0.11.1
             * https://github.com/twitter/typeahead.js
             * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
             */
            ! function(i, o) {
                r = [n(0)], void 0 !== (s = function(t) {
                    return i.Bloodhound = o(t)
                }.apply(e, r)) && (t.exports = s)
            }(this, function(t) {
                var e = function() {
                        "use strict";
                        return {
                            isMsie: function() {
                                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
                            },
                            isBlankString: function(t) {
                                return !t || /^\s*$/.test(t)
                            },
                            escapeRegExChars: function(t) {
                                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                            },
                            isString: function(t) {
                                return "string" == typeof t
                            },
                            isNumber: function(t) {
                                return "number" == typeof t
                            },
                            isArray: t.isArray,
                            isFunction: t.isFunction,
                            isObject: t.isPlainObject,
                            isUndefined: function(t) {
                                return void 0 === t
                            },
                            isElement: function(t) {
                                return !(!t || 1 !== t.nodeType)
                            },
                            isJQuery: function(e) {
                                return e instanceof t
                            },
                            toStr: function(t) {
                                return e.isUndefined(t) || null === t ? "" : t + ""
                            },
                            bind: t.proxy,
                            each: function(e, n) {
                                function i(t, e) {
                                    return n(e, t)
                                }
                                t.each(e, i)
                            },
                            map: t.map,
                            filter: t.grep,
                            every: function(e, n) {
                                var i = !0;
                                return e ? (t.each(e, function(t, r) {
                                    if (!(i = n.call(null, r, t, e))) return !1
                                }), !!i) : i
                            },
                            some: function(e, n) {
                                var i = !1;
                                return e ? (t.each(e, function(t, r) {
                                    if (i = n.call(null, r, t, e)) return !1
                                }), !!i) : i
                            },
                            mixin: t.extend,
                            identity: function(t) {
                                return t
                            },
                            clone: function(e) {
                                return t.extend(!0, {}, e)
                            },
                            getIdGenerator: function() {
                                var t = 0;
                                return function() {
                                    return t++
                                }
                            },
                            templatify: function(e) {
                                function n() {
                                    return String(e)
                                }
                                return t.isFunction(e) ? e : n
                            },
                            defer: function(t) {
                                setTimeout(t, 0)
                            },
                            debounce: function(t, e, n) {
                                var i, r;
                                return function() {
                                    var s, o, a = this,
                                        u = arguments;
                                    return s = function() {
                                        i = null, n || (r = t.apply(a, u))
                                    }, o = n && !i, clearTimeout(i), i = setTimeout(s, e), o && (r = t.apply(a, u)), r
                                }
                            },
                            throttle: function(t, e) {
                                var n, i, r, s, o, a;
                                return o = 0, a = function() {
                                        o = new Date, r = null, s = t.apply(n, i)
                                    },
                                    function() {
                                        var u = new Date,
                                            c = e - (u - o);
                                        return n = this, i = arguments, c <= 0 ? (clearTimeout(r), r = null, o = u, s = t.apply(n, i)) : r || (r = setTimeout(a, c)), s
                                    }
                            },
                            stringify: function(t) {
                                return e.isString(t) ? t : JSON.stringify(t)
                            },
                            noop: function() {}
                        }
                    }(),
                    n = "0.11.1",
                    i = function() {
                        "use strict";

                        function t(t) {
                            return t = e.toStr(t), t ? t.split(/\s+/) : []
                        }

                        function n(t) {
                            return t = e.toStr(t), t ? t.split(/\W+/) : []
                        }

                        function i(t) {
                            return function(n) {
                                return n = e.isArray(n) ? n : [].slice.call(arguments, 0),
                                    function(i) {
                                        var r = [];
                                        return e.each(n, function(n) {
                                            r = r.concat(t(e.toStr(i[n])))
                                        }), r
                                    }
                            }
                        }
                        return {
                            nonword: n,
                            whitespace: t,
                            obj: {
                                nonword: i(n),
                                whitespace: i(t)
                            }
                        }
                    }(),
                    r = function() {
                        "use strict";

                        function n(n) {
                            this.maxSize = e.isNumber(n) ? n : 100, this.reset(), this.maxSize <= 0 && (this.set = this.get = t.noop)
                        }

                        function i() {
                            this.head = this.tail = null
                        }

                        function r(t, e) {
                            this.key = t, this.val = e, this.prev = this.next = null
                        }
                        return e.mixin(n.prototype, {
                            set: function(t, e) {
                                var n, i = this.list.tail;
                                this.size >= this.maxSize && (this.list.remove(i), delete this.hash[i.key], this.size--), (n = this.hash[t]) ? (n.val = e, this.list.moveToFront(n)) : (n = new r(t, e), this.list.add(n), this.hash[t] = n, this.size++)
                            },
                            get: function(t) {
                                var e = this.hash[t];
                                if (e) return this.list.moveToFront(e), e.val
                            },
                            reset: function() {
                                this.size = 0, this.hash = {}, this.list = new i
                            }
                        }), e.mixin(i.prototype, {
                            add: function(t) {
                                this.head && (t.next = this.head, this.head.prev = t), this.head = t, this.tail = this.tail || t
                            },
                            remove: function(t) {
                                t.prev ? t.prev.next = t.next : this.head = t.next, t.next ? t.next.prev = t.prev : this.tail = t.prev
                            },
                            moveToFront: function(t) {
                                this.remove(t), this.add(t)
                            }
                        }), n
                    }(),
                    s = function() {
                        "use strict";

                        function n(t, n) {
                            this.prefix = ["__", t, "__"].join(""), this.ttlKey = "__ttl__", this.keyMatcher = new RegExp("^" + e.escapeRegExChars(this.prefix)), this.ls = n || a, !this.ls && this._noop()
                        }

                        function i() {
                            return (new Date).getTime()
                        }

                        function r(t) {
                            return JSON.stringify(e.isUndefined(t) ? null : t)
                        }

                        function s(e) {
                            return t.parseJSON(e)
                        }

                        function o(t) {
                            var e, n, i = [],
                                r = a.length;
                            for (e = 0; e < r; e++)(n = a.key(e)).match(t) && i.push(n.replace(t, ""));
                            return i
                        }
                        var a;
                        try {
                            a = window.localStorage, a.setItem("~~~", "!"), a.removeItem("~~~")
                        } catch (t) {
                            a = null
                        }
                        return e.mixin(n.prototype, {
                            _prefix: function(t) {
                                return this.prefix + t
                            },
                            _ttlKey: function(t) {
                                return this._prefix(t) + this.ttlKey
                            },
                            _noop: function() {
                                this.get = this.set = this.remove = this.clear = this.isExpired = e.noop
                            },
                            _safeSet: function(t, e) {
                                try {
                                    this.ls.setItem(t, e)
                                } catch (t) {
                                    "QuotaExceededError" === t.name && (this.clear(), this._noop())
                                }
                            },
                            get: function(t) {
                                return this.isExpired(t) && this.remove(t), s(this.ls.getItem(this._prefix(t)))
                            },
                            set: function(t, n, s) {
                                return e.isNumber(s) ? this._safeSet(this._ttlKey(t), r(i() + s)) : this.ls.removeItem(this._ttlKey(t)), this._safeSet(this._prefix(t), r(n))
                            },
                            remove: function(t) {
                                return this.ls.removeItem(this._ttlKey(t)), this.ls.removeItem(this._prefix(t)), this
                            },
                            clear: function() {
                                var t, e = o(this.keyMatcher);
                                for (t = e.length; t--;) this.remove(e[t]);
                                return this
                            },
                            isExpired: function(t) {
                                var n = s(this.ls.getItem(this._ttlKey(t)));
                                return !!(e.isNumber(n) && i() > n)
                            }
                        }), n
                    }(),
                    o = function() {
                        "use strict";

                        function n(t) {
                            t = t || {}, this.cancelled = !1, this.lastReq = null, this._send = t.transport, this._get = t.limiter ? t.limiter(this._get) : this._get, this._cache = !1 === t.cache ? new r(0) : a
                        }
                        var i = 0,
                            s = {},
                            o = 6,
                            a = new r(10);
                        return n.setMaxPendingRequests = function(t) {
                            o = t
                        }, n.resetCache = function() {
                            a.reset()
                        }, e.mixin(n.prototype, {
                            _fingerprint: function(e) {
                                return e = e || {}, e.url + e.type + t.param(e.data || {})
                            },
                            _get: function(t, e) {
                                function n(t) {
                                    e(null, t), l._cache.set(u, t)
                                }

                                function r() {
                                    e(!0)
                                }

                                function a() {
                                    i--, delete s[u], l.onDeckRequestArgs && (l._get.apply(l, l.onDeckRequestArgs), l.onDeckRequestArgs = null)
                                }
                                var u, c, l = this;
                                u = this._fingerprint(t), this.cancelled || u !== this.lastReq || ((c = s[u]) ? c.done(n).fail(r) : i < o ? (i++, s[u] = this._send(t).done(n).fail(r).always(a)) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
                            },
                            get: function(n, i) {
                                var r, s;
                                i = i || t.noop, n = e.isString(n) ? {
                                    url: n
                                } : n || {}, s = this._fingerprint(n), this.cancelled = !1, this.lastReq = s, (r = this._cache.get(s)) ? i(null, r) : this._get(n, i)
                            },
                            cancel: function() {
                                this.cancelled = !0
                            }
                        }), n
                    }(),
                    a = window.SearchIndex = function() {
                        "use strict";

                        function n(n) {
                            n = n || {}, n.datumTokenizer && n.queryTokenizer || t.error("datumTokenizer and queryTokenizer are both required"), this.identify = n.identify || e.stringify, this.datumTokenizer = n.datumTokenizer, this.queryTokenizer = n.queryTokenizer, this.reset()
                        }

                        function i(t) {
                            return t = e.filter(t, function(t) {
                                return !!t
                            }), t = e.map(t, function(t) {
                                return t.toLowerCase()
                            })
                        }

                        function r() {
                            var t = {};
                            return t[u] = [], t[a] = {}, t
                        }

                        function s(t) {
                            for (var e = {}, n = [], i = 0, r = t.length; i < r; i++) e[t[i]] || (e[t[i]] = !0, n.push(t[i]));
                            return n
                        }

                        function o(t, e) {
                            var n = 0,
                                i = 0,
                                r = [];
                            t = t.sort(), e = e.sort();
                            for (var s = t.length, o = e.length; n < s && i < o;) t[n] < e[i] ? n++ : t[n] > e[i] ? i++ : (r.push(t[n]), n++, i++);
                            return r
                        }
                        var a = "c",
                            u = "i";
                        return e.mixin(n.prototype, {
                            bootstrap: function(t) {
                                this.datums = t.datums, this.trie = t.trie
                            },
                            add: function(t) {
                                var n = this;
                                t = e.isArray(t) ? t : [t], e.each(t, function(t) {
                                    var s, o;
                                    n.datums[s = n.identify(t)] = t, o = i(n.datumTokenizer(t)), e.each(o, function(t) {
                                        var e, i, o;
                                        for (e = n.trie, i = t.split(""); o = i.shift();) e = e[a][o] || (e[a][o] = r()), e[u].push(s)
                                    })
                                })
                            },
                            get: function(t) {
                                var n = this;
                                return e.map(t, function(t) {
                                    return n.datums[t]
                                })
                            },
                            search: function(t) {
                                var n, r, c = this;
                                return n = i(this.queryTokenizer(t)), e.each(n, function(t) {
                                    var e, n, i, s;
                                    if (r && 0 === r.length) return !1;
                                    for (e = c.trie, n = t.split(""); e && (i = n.shift());) e = e[a][i];
                                    if (!e || 0 !== n.length) return r = [], !1;
                                    s = e[u].slice(0), r = r ? o(r, s) : s
                                }), r ? e.map(s(r), function(t) {
                                    return c.datums[t]
                                }) : []
                            },
                            all: function() {
                                var t = [];
                                for (var e in this.datums) t.push(this.datums[e]);
                                return t
                            },
                            reset: function() {
                                this.datums = {}, this.trie = r()
                            },
                            serialize: function() {
                                return {
                                    datums: this.datums,
                                    trie: this.trie
                                }
                            }
                        }), n
                    }(),
                    u = function() {
                        "use strict";

                        function t(t) {
                            this.url = t.url, this.ttl = t.ttl, this.cache = t.cache, this.prepare = t.prepare, this.transform = t.transform, this.transport = t.transport, this.thumbprint = t.thumbprint, this.storage = new s(t.cacheKey)
                        }
                        var n;
                        return n = {
                            data: "data",
                            protocol: "protocol",
                            thumbprint: "thumbprint"
                        }, e.mixin(t.prototype, {
                            _settings: function() {
                                return {
                                    url: this.url,
                                    type: "GET",
                                    dataType: "json"
                                }
                            },
                            store: function(t) {
                                this.cache && (this.storage.set(n.data, t, this.ttl), this.storage.set(n.protocol, location.protocol, this.ttl), this.storage.set(n.thumbprint, this.thumbprint, this.ttl))
                            },
                            fromCache: function() {
                                var t, e = {};
                                return this.cache ? (e.data = this.storage.get(n.data), e.protocol = this.storage.get(n.protocol), e.thumbprint = this.storage.get(n.thumbprint), t = e.thumbprint !== this.thumbprint || e.protocol !== location.protocol, e.data && !t ? e.data : null) : null
                            },
                            fromNetwork: function(t) {
                                function e() {
                                    t(!0)
                                }

                                function n(e) {
                                    t(null, r.transform(e))
                                }
                                var i, r = this;
                                t && (i = this.prepare(this._settings()), this.transport(i).fail(e).done(n))
                            },
                            clear: function() {
                                return this.storage.clear(), this
                            }
                        }), t
                    }(),
                    c = function() {
                        "use strict";

                        function t(t) {
                            this.url = t.url, this.prepare = t.prepare, this.transform = t.transform, this.transport = new o({
                                cache: t.cache,
                                limiter: t.limiter,
                                transport: t.transport
                            })
                        }
                        return e.mixin(t.prototype, {
                            _settings: function() {
                                return {
                                    url: this.url,
                                    type: "GET",
                                    dataType: "json"
                                }
                            },
                            get: function(t, e) {
                                function n(t, n) {
                                    e(t ? [] : r.transform(n))
                                }
                                var i, r = this;
                                if (e) return t = t || "", i = this.prepare(t, this._settings()), this.transport.get(i, n)
                            },
                            cancelLastRequest: function() {
                                this.transport.cancel()
                            }
                        }), t
                    }(),
                    l = function() {
                        "use strict";

                        function i(i) {
                            var r;
                            return i ? (r = {
                                url: null,
                                ttl: 864e5,
                                cache: !0,
                                cacheKey: null,
                                thumbprint: "",
                                prepare: e.identity,
                                transform: e.identity,
                                transport: null
                            }, i = e.isString(i) ? {
                                url: i
                            } : i, i = e.mixin(r, i), !i.url && t.error("prefetch requires url to be set"), i.transform = i.filter || i.transform, i.cacheKey = i.cacheKey || i.url, i.thumbprint = n + i.thumbprint, i.transport = i.transport ? a(i.transport) : t.ajax, i) : null
                        }

                        function r(n) {
                            var i;
                            if (n) return i = {
                                url: null,
                                cache: !0,
                                prepare: null,
                                replace: null,
                                wildcard: null,
                                limiter: null,
                                rateLimitBy: "debounce",
                                rateLimitWait: 300,
                                transform: e.identity,
                                transport: null
                            }, n = e.isString(n) ? {
                                url: n
                            } : n, n = e.mixin(i, n), !n.url && t.error("remote requires url to be set"), n.transform = n.filter || n.transform, n.prepare = s(n), n.limiter = o(n), n.transport = n.transport ? a(n.transport) : t.ajax, delete n.replace, delete n.wildcard, delete n.rateLimitBy, delete n.rateLimitWait, n
                        }

                        function s(t) {
                            function e(t, e) {
                                return e.url = s(e.url, t), e
                            }

                            function n(t, e) {
                                return e.url = e.url.replace(o, encodeURIComponent(t)), e
                            }

                            function i(t, e) {
                                return e
                            }
                            var r, s, o;
                            return r = t.prepare, s = t.replace, o = t.wildcard, r || (r = s ? e : t.wildcard ? n : i)
                        }

                        function o(t) {
                            var n, i, r;
                            return n = t.limiter, i = t.rateLimitBy, r = t.rateLimitWait, n || (n = /^throttle$/i.test(i) ? function(t) {
                                return function(n) {
                                    return e.throttle(n, t)
                                }
                            }(r) : function(t) {
                                return function(n) {
                                    return e.debounce(n, t)
                                }
                            }(r)), n
                        }

                        function a(n) {
                            return function(i) {
                                function r(t) {
                                    e.defer(function() {
                                        o.resolve(t)
                                    })
                                }

                                function s(t) {
                                    e.defer(function() {
                                        o.reject(t)
                                    })
                                }
                                var o = t.Deferred();
                                return n(i, r, s), o
                            }
                        }
                        return function(n) {
                            var s, o;
                            return s = {
                                initialize: !0,
                                identify: e.stringify,
                                datumTokenizer: null,
                                queryTokenizer: null,
                                sufficient: 5,
                                sorter: null,
                                local: [],
                                prefetch: null,
                                remote: null
                            }, n = e.mixin(s, n || {}), !n.datumTokenizer && t.error("datumTokenizer is required"), !n.queryTokenizer && t.error("queryTokenizer is required"), o = n.sorter, n.sorter = o ? function(t) {
                                return t.sort(o)
                            } : e.identity, n.local = e.isFunction(n.local) ? n.local() : n.local, n.prefetch = i(n.prefetch), n.remote = r(n.remote), n
                        }
                    }();
                return function() {
                    "use strict";

                    function n(t) {
                        t = l(t), this.sorter = t.sorter, this.identify = t.identify, this.sufficient = t.sufficient, this.local = t.local, this.remote = t.remote ? new c(t.remote) : null, this.prefetch = t.prefetch ? new u(t.prefetch) : null, this.index = new a({
                            identify: this.identify,
                            datumTokenizer: t.datumTokenizer,
                            queryTokenizer: t.queryTokenizer
                        }), !1 !== t.initialize && this.initialize()
                    }
                    var r;
                    return r = window && window.Bloodhound, n.noConflict = function() {
                        return window && (window.Bloodhound = r), n
                    }, n.tokenizers = i, e.mixin(n.prototype, {
                        __ttAdapter: function() {
                            function t(t, e, i) {
                                return n.search(t, e, i)
                            }

                            function e(t, e) {
                                return n.search(t, e)
                            }
                            var n = this;
                            return this.remote ? t : e
                        },
                        _loadPrefetch: function() {
                            function e(t, e) {
                                if (t) return n.reject();
                                r.add(e), r.prefetch.store(r.index.serialize()), n.resolve()
                            }
                            var n, i, r = this;
                            return n = t.Deferred(), this.prefetch ? (i = this.prefetch.fromCache()) ? (this.index.bootstrap(i), n.resolve()) : this.prefetch.fromNetwork(e) : n.resolve(), n.promise()
                        },
                        _initialize: function() {
                            function t() {
                                e.add(e.local)
                            }
                            var e = this;
                            return this.clear(), (this.initPromise = this._loadPrefetch()).done(t), this.initPromise
                        },
                        initialize: function(t) {
                            return !this.initPromise || t ? this._initialize() : this.initPromise
                        },
                        add: function(t) {
                            return this.index.add(t), this
                        },
                        get: function(t) {
                            return t = e.isArray(t) ? t : [].slice.call(arguments), this.index.get(t)
                        },
                        search: function(t, n, i) {
                            function r(t) {
                                var n = [];
                                e.each(t, function(t) {
                                    !e.some(s, function(e) {
                                        return o.identify(t) === o.identify(e)
                                    }) && n.push(t)
                                }), i && i(n)
                            }
                            var s, o = this;
                            return s = this.sorter(this.index.search(t)), n(this.remote ? s.slice() : s), this.remote && s.length < this.sufficient ? this.remote.get(t, r) : this.remote && this.remote.cancelLastRequest(), this
                        },
                        all: function() {
                            return this.index.all()
                        },
                        clear: function() {
                            return this.index.reset(), this
                        },
                        clearPrefetchCache: function() {
                            return this.prefetch && this.prefetch.clear(), this
                        },
                        clearRemoteCache: function() {
                            return o.resetCache(), this
                        },
                        ttAdapter: function() {
                            return this.__ttAdapter()
                        }
                    }), n
                }()
            }),
            function(i, o) {
                r = [n(0)], void 0 !== (s = function(t) {
                    return o(t)
                }.apply(e, r)) && (t.exports = s)
            }(0, function(t) {
                var e = function() {
                        "use strict";
                        return {
                            isMsie: function() {
                                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
                            },
                            isBlankString: function(t) {
                                return !t || /^\s*$/.test(t)
                            },
                            escapeRegExChars: function(t) {
                                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                            },
                            isString: function(t) {
                                return "string" == typeof t
                            },
                            isNumber: function(t) {
                                return "number" == typeof t
                            },
                            isArray: t.isArray,
                            isFunction: t.isFunction,
                            isObject: t.isPlainObject,
                            isUndefined: function(t) {
                                return void 0 === t
                            },
                            isElement: function(t) {
                                return !(!t || 1 !== t.nodeType)
                            },
                            isJQuery: function(e) {
                                return e instanceof t
                            },
                            toStr: function(t) {
                                return e.isUndefined(t) || null === t ? "" : t + ""
                            },
                            bind: t.proxy,
                            each: function(e, n) {
                                function i(t, e) {
                                    return n(e, t)
                                }
                                t.each(e, i)
                            },
                            map: t.map,
                            filter: t.grep,
                            every: function(e, n) {
                                var i = !0;
                                return e ? (t.each(e, function(t, r) {
                                    if (!(i = n.call(null, r, t, e))) return !1
                                }), !!i) : i
                            },
                            some: function(e, n) {
                                var i = !1;
                                return e ? (t.each(e, function(t, r) {
                                    if (i = n.call(null, r, t, e)) return !1
                                }), !!i) : i
                            },
                            mixin: t.extend,
                            identity: function(t) {
                                return t
                            },
                            clone: function(e) {
                                return t.extend(!0, {}, e)
                            },
                            getIdGenerator: function() {
                                var t = 0;
                                return function() {
                                    return t++
                                }
                            },
                            templatify: function(e) {
                                function n() {
                                    return String(e)
                                }
                                return t.isFunction(e) ? e : n
                            },
                            defer: function(t) {
                                setTimeout(t, 0)
                            },
                            debounce: function(t, e, n) {
                                var i, r;
                                return function() {
                                    var s, o, a = this,
                                        u = arguments;
                                    return s = function() {
                                        i = null, n || (r = t.apply(a, u))
                                    }, o = n && !i, clearTimeout(i), i = setTimeout(s, e), o && (r = t.apply(a, u)), r
                                }
                            },
                            throttle: function(t, e) {
                                var n, i, r, s, o, a;
                                return o = 0, a = function() {
                                        o = new Date, r = null, s = t.apply(n, i)
                                    },
                                    function() {
                                        var u = new Date,
                                            c = e - (u - o);
                                        return n = this, i = arguments, c <= 0 ? (clearTimeout(r), r = null, o = u, s = t.apply(n, i)) : r || (r = setTimeout(a, c)), s
                                    }
                            },
                            stringify: function(t) {
                                return e.isString(t) ? t : JSON.stringify(t)
                            },
                            noop: function() {}
                        }
                    }(),
                    n = function() {
                        "use strict";

                        function t(t) {
                            var o, a;
                            return a = e.mixin({}, s, t), o = {
                                css: r(),
                                classes: a,
                                html: n(a),
                                selectors: i(a)
                            }, {
                                css: o.css,
                                html: o.html,
                                classes: o.classes,
                                selectors: o.selectors,
                                mixin: function(t) {
                                    e.mixin(t, o)
                                }
                            }
                        }

                        function n(t) {
                            return {
                                wrapper: '<span class="' + t.wrapper + '"></span>',
                                menu: '<div class="' + t.menu + '"></div>'
                            }
                        }

                        function i(t) {
                            var n = {};
                            return e.each(t, function(t, e) {
                                n[e] = "." + t
                            }), n
                        }

                        function r() {
                            var t = {
                                wrapper: {
                                    position: "relative",
                                    display: "inline-block"
                                },
                                hint: {
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    borderColor: "transparent",
                                    boxShadow: "none",
                                    opacity: "1"
                                },
                                input: {
                                    position: "relative",
                                    verticalAlign: "top",
                                    backgroundColor: "transparent"
                                },
                                inputWithNoHint: {
                                    position: "relative",
                                    verticalAlign: "top"
                                },
                                menu: {
                                    position: "relative",
                                    top: "100%",
                                    left: "0",
                                    zIndex: "100",
                                    display: "none"
                                },
                                ltr: {
                                    left: "0",
                                    right: "auto"
                                },
                                rtl: {
                                    left: "auto",
                                    right: " 0"
                                }
                            };
                            return e.isMsie() && e.mixin(t.input, {
                                backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                            }), t
                        }
                        var s = {
                            wrapper: "twitter-typeahead",
                            input: "tt-input",
                            hint: "tt-hint",
                            menu: "tt-menu",
                            dataset: "tt-dataset",
                            suggestion: "tt-suggestion",
                            selectable: "tt-selectable",
                            empty: "tt-empty",
                            open: "tt-open",
                            cursor: "tt-cursor",
                            highlight: "tt-highlight"
                        };
                        return t
                    }(),
                    r = function() {
                        "use strict";

                        function n(e) {
                            e && e.el || t.error("EventBus initialized without el"), this.$el = t(e.el)
                        }
                        var i, r;
                        return i = "typeahead:", r = {
                            render: "rendered",
                            cursorchange: "cursorchanged",
                            select: "selected",
                            autocomplete: "autocompleted"
                        }, e.mixin(n.prototype, {
                            _trigger: function(e, n) {
                                var r;
                                return r = t.Event(i + e), (n = n || []).unshift(r), this.$el.trigger.apply(this.$el, n), r
                            },
                            before: function(t) {
                                var e, n;
                                return e = [].slice.call(arguments, 1), n = this._trigger("before" + t, e), n.isDefaultPrevented()
                            },
                            trigger: function(t) {
                                var e;
                                this._trigger(t, [].slice.call(arguments, 1)), (e = r[t]) && this._trigger(e, [].slice.call(arguments, 1))
                            }
                        }), n
                    }(),
                    s = function() {
                        "use strict";

                        function t(t, e, n, i) {
                            var r;
                            if (!n) return this;
                            for (e = e.split(u), n = i ? a(n, i) : n, this._callbacks = this._callbacks || {}; r = e.shift();) this._callbacks[r] = this._callbacks[r] || {
                                sync: [],
                                async: []
                            }, this._callbacks[r][t].push(n);
                            return this
                        }

                        function e(e, n, i) {
                            return t.call(this, "async", e, n, i)
                        }

                        function n(e, n, i) {
                            return t.call(this, "sync", e, n, i)
                        }

                        function r(t) {
                            var e;
                            if (!this._callbacks) return this;
                            for (t = t.split(u); e = t.shift();) delete this._callbacks[e];
                            return this
                        }

                        function s(t) {
                            var e, n, i, r, s;
                            if (!this._callbacks) return this;
                            for (t = t.split(u), i = [].slice.call(arguments, 1);
                                (e = t.shift()) && (n = this._callbacks[e]);) r = o(n.sync, this, [e].concat(i)), s = o(n.async, this, [e].concat(i)), r() && c(s);
                            return this
                        }

                        function o(t, e, n) {
                            function i() {
                                for (var i, r = 0, s = t.length; !i && r < s; r += 1) i = !1 === t[r].apply(e, n);
                                return !i
                            }
                            return i
                        }

                        function a(t, e) {
                            return t.bind ? t.bind(e) : function() {
                                t.apply(e, [].slice.call(arguments, 0))
                            }
                        }
                        var u = /\s+/,
                            c = function() {
                                return window.setImmediate ? function(t) {
                                    i(function() {
                                        t()
                                    })
                                } : function(t) {
                                    setTimeout(function() {
                                        t()
                                    }, 0)
                                }
                            }();
                        return {
                            onSync: n,
                            onAsync: e,
                            off: r,
                            trigger: s
                        }
                    }(),
                    o = function(t) {
                        "use strict";

                        function n(t, n, i) {
                            for (var r, s = [], o = 0, a = t.length; o < a; o++) s.push(e.escapeRegExChars(t[o]));
                            return r = i ? "\\b(" + s.join("|") + ")\\b" : "(" + s.join("|") + ")", n ? new RegExp(r) : new RegExp(r, "i")
                        }
                        var i = {
                            node: null,
                            pattern: null,
                            tagName: "strong",
                            className: null,
                            wordsOnly: !1,
                            caseSensitive: !1
                        };
                        return function(r) {
                            function s(e) {
                                var n, i, s;
                                return (n = a.exec(e.data)) && (s = t.createElement(r.tagName), r.className && (s.className = r.className), i = e.splitText(n.index), i.splitText(n[0].length), s.appendChild(i.cloneNode(!0)), e.parentNode.replaceChild(s, i)), !!n
                            }

                            function o(t, e) {
                                for (var n, i = 0; i < t.childNodes.length; i++) n = t.childNodes[i], 3 === n.nodeType ? i += e(n) ? 1 : 0 : o(n, e)
                            }
                            var a;
                            r = e.mixin({}, i, r), r.node && r.pattern && (r.pattern = e.isArray(r.pattern) ? r.pattern : [r.pattern], a = n(r.pattern, r.caseSensitive, r.wordsOnly), o(r.node, s))
                        }
                    }(window.document),
                    a = function() {
                        "use strict";

                        function n(n, r) {
                            n = n || {}, n.input || t.error("input is missing"), r.mixin(this), this.$hint = t(n.hint), this.$input = t(n.input), this.query = this.$input.val(), this.queryWhenFocused = this.hasFocus() ? this.query : null, this.$overflowHelper = i(this.$input), this._checkLanguageDirection(), 0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = e.noop)
                        }

                        function i(e) {
                            return t('<pre aria-hidden="true"></pre>').css({
                                position: "absolute",
                                visibility: "hidden",
                                whiteSpace: "pre",
                                fontFamily: e.css("font-family"),
                                fontStyle: e.css("font-style"),
                                fontVariant: e.css("font-variant"),
                                fontWeight: e.css("font-weight"),
                                wordSpacing: e.css("word-spacing"),
                                letterSpacing: e.css("letter-spacing"),
                                textIndent: e.css("text-indent"),
                                textRendering: e.css("text-rendering"),
                                textTransform: e.css("text-transform")
                            }).insertAfter(e)
                        }

                        function r(t, e) {
                            return n.normalizeQuery(t) === n.normalizeQuery(e)
                        }

                        function o(t) {
                            return t.altKey || t.ctrlKey || t.metaKey || t.shiftKey
                        }
                        var a;
                        return a = {
                            9: "tab",
                            27: "esc",
                            37: "left",
                            39: "right",
                            13: "enter",
                            38: "up",
                            40: "down"
                        }, n.normalizeQuery = function(t) {
                            return e.toStr(t).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
                        }, e.mixin(n.prototype, s, {
                            _onBlur: function() {
                                this.resetInputValue(), this.trigger("blurred")
                            },
                            _onFocus: function() {
                                this.queryWhenFocused = this.query, this.trigger("focused")
                            },
                            _onKeydown: function(t) {
                                var e = a[t.which || t.keyCode];
                                this._managePreventDefault(e, t), e && this._shouldTrigger(e, t) && this.trigger(e + "Keyed", t)
                            },
                            _onInput: function() {
                                this._setQuery(this.getInputValue()), this.clearHintIfInvalid(), this._checkLanguageDirection()
                            },
                            _managePreventDefault: function(t, e) {
                                var n;
                                switch (t) {
                                    case "up":
                                    case "down":
                                        n = !o(e);
                                        break;
                                    default:
                                        n = !1
                                }
                                n && e.preventDefault()
                            },
                            _shouldTrigger: function(t, e) {
                                var n;
                                switch (t) {
                                    case "tab":
                                        n = !o(e);
                                        break;
                                    default:
                                        n = !0
                                }
                                return n
                            },
                            _checkLanguageDirection: function() {
                                var t = (this.$input.css("direction") || "ltr").toLowerCase();
                                this.dir !== t && (this.dir = t, this.$hint.attr("dir", t), this.trigger("langDirChanged", t))
                            },
                            _setQuery: function(t, e) {
                                var n, i;
                                n = r(t, this.query), i = !!n && this.query.length !== t.length, this.query = t, e || n ? !e && i && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
                            },
                            bind: function() {
                                var t, n, i, r, s = this;
                                return t = e.bind(this._onBlur, this), n = e.bind(this._onFocus, this), i = e.bind(this._onKeydown, this), r = e.bind(this._onInput, this), this.$input.on("blur.tt", t).on("focus.tt", n).on("keydown.tt", i), !e.isMsie() || e.isMsie() > 9 ? this.$input.on("input.tt", r) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function(t) {
                                    a[t.which || t.keyCode] || e.defer(e.bind(s._onInput, s, t))
                                }), this
                            },
                            focus: function() {
                                this.$input.focus()
                            },
                            blur: function() {
                                this.$input.blur()
                            },
                            getLangDir: function() {
                                return this.dir
                            },
                            getQuery: function() {
                                return this.query || ""
                            },
                            setQuery: function(t, e) {
                                this.setInputValue(t), this._setQuery(t, e)
                            },
                            hasQueryChangedSinceLastFocus: function() {
                                return this.query !== this.queryWhenFocused
                            },
                            getInputValue: function() {
                                return this.$input.val()
                            },
                            setInputValue: function(t) {
                                this.$input.val(t), this.clearHintIfInvalid(), this._checkLanguageDirection()
                            },
                            resetInputValue: function() {
                                this.setInputValue(this.query)
                            },
                            getHint: function() {
                                return this.$hint.val()
                            },
                            setHint: function(t) {
                                this.$hint.val(t)
                            },
                            clearHint: function() {
                                this.setHint("")
                            },
                            clearHintIfInvalid: function() {
                                var t, e, n, i;
                                t = this.getInputValue(), e = this.getHint(), n = t !== e && 0 === e.indexOf(t), !(i = "" !== t && n && !this.hasOverflow()) && this.clearHint()
                            },
                            hasFocus: function() {
                                return this.$input.is(":focus")
                            },
                            hasOverflow: function() {
                                var t = this.$input.width() - 2;
                                return this.$overflowHelper.text(this.getInputValue()), this.$overflowHelper.width() >= t
                            },
                            isCursorAtEnd: function() {
                                var t, n, i;
                                return t = this.$input.val().length, n = this.$input[0].selectionStart, e.isNumber(n) ? n === t : !document.selection || (i = document.selection.createRange(), i.moveStart("character", -t), t === i.text.length)
                            },
                            destroy: function() {
                                this.$hint.off(".tt"), this.$input.off(".tt"), this.$overflowHelper.remove(), this.$hint = this.$input = this.$overflowHelper = t("<div>")
                            }
                        }), n
                    }(),
                    u = function() {
                        "use strict";

                        function n(n, s) {
                            n = n || {}, n.templates = n.templates || {}, n.templates.notFound = n.templates.notFound || n.templates.empty, n.source || t.error("missing source"), n.node || t.error("missing node"), n.name && !a(n.name) && t.error("invalid dataset name:" + n.name), s.mixin(this), this.highlight = !!n.highlight, this.name = n.name || c(), this.limit = n.limit || 5, this.displayFn = i(n.display || n.displayKey), this.templates = r(n.templates, this.displayFn), this.source = n.source.__ttAdapter ? n.source.__ttAdapter() : n.source, this.async = e.isUndefined(n.async) ? this.source.length > 2 : !!n.async, this._resetLastSuggestion(), this.$el = t(n.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
                        }

                        function i(t) {
                            function n(e) {
                                return e[t]
                            }
                            return t = t || e.stringify, e.isFunction(t) ? t : n
                        }

                        function r(n, i) {
                            function r(e) {
                                return t("<div>").text(i(e))
                            }
                            return {
                                notFound: n.notFound && e.templatify(n.notFound),
                                pending: n.pending && e.templatify(n.pending),
                                header: n.header && e.templatify(n.header),
                                footer: n.footer && e.templatify(n.footer),
                                suggestion: n.suggestion || r
                            }
                        }

                        function a(t) {
                            return /^[_a-zA-Z0-9-]+$/.test(t)
                        }
                        var u, c;
                        return u = {
                            val: "tt-selectable-display",
                            obj: "tt-selectable-object"
                        }, c = e.getIdGenerator(), n.extractData = function(e) {
                            var n = t(e);
                            return n.data(u.obj) ? {
                                val: n.data(u.val) || "",
                                obj: n.data(u.obj) || null
                            } : null
                        }, e.mixin(n.prototype, s, {
                            _overwrite: function(t, e) {
                                e = e || [], e.length ? this._renderSuggestions(t, e) : this.async && this.templates.pending ? this._renderPending(t) : !this.async && this.templates.notFound ? this._renderNotFound(t) : this._empty(), this.trigger("rendered", this.name, e, !1)
                            },
                            _append: function(t, e) {
                                e = e || [], e.length && this.$lastSuggestion.length ? this._appendSuggestions(t, e) : e.length ? this._renderSuggestions(t, e) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(t), this.trigger("rendered", this.name, e, !0)
                            },
                            _renderSuggestions: function(t, e) {
                                var n;
                                n = this._getSuggestionsFragment(t, e), this.$lastSuggestion = n.children().last(), this.$el.html(n).prepend(this._getHeader(t, e)).append(this._getFooter(t, e))
                            },
                            _appendSuggestions: function(t, e) {
                                var n, i;
                                n = this._getSuggestionsFragment(t, e), i = n.children().last(), this.$lastSuggestion.after(n), this.$lastSuggestion = i
                            },
                            _renderPending: function(t) {
                                var e = this.templates.pending;
                                this._resetLastSuggestion(), e && this.$el.html(e({
                                    query: t,
                                    dataset: this.name
                                }))
                            },
                            _renderNotFound: function(t) {
                                var e = this.templates.notFound;
                                this._resetLastSuggestion(), e && this.$el.html(e({
                                    query: t,
                                    dataset: this.name
                                }))
                            },
                            _empty: function() {
                                this.$el.empty(), this._resetLastSuggestion()
                            },
                            _getSuggestionsFragment: function(n, i) {
                                var r, s = this;
                                return r = document.createDocumentFragment(), e.each(i, function(e) {
                                    var i, o;
                                    o = s._injectQuery(n, e), i = t(s.templates.suggestion(o)).data(u.obj, e).data(u.val, s.displayFn(e)).addClass(s.classes.suggestion + " " + s.classes.selectable), r.appendChild(i[0])
                                }), this.highlight && o({
                                    className: this.classes.highlight,
                                    node: r,
                                    pattern: n
                                }), t(r)
                            },
                            _getFooter: function(t, e) {
                                return this.templates.footer ? this.templates.footer({
                                    query: t,
                                    suggestions: e,
                                    dataset: this.name
                                }) : null
                            },
                            _getHeader: function(t, e) {
                                return this.templates.header ? this.templates.header({
                                    query: t,
                                    suggestions: e,
                                    dataset: this.name
                                }) : null
                            },
                            _resetLastSuggestion: function() {
                                this.$lastSuggestion = t()
                            },
                            _injectQuery: function(t, n) {
                                return e.isObject(n) ? e.mixin({
                                    _query: t
                                }, n) : n
                            },
                            update: function(e) {
                                function n(t) {
                                    o || (o = !0, t = (t || []).slice(0, r.limit), a = t.length, r._overwrite(e, t), a < r.limit && r.async && r.trigger("asyncRequested", e))
                                }

                                function i(n) {
                                    if (n = n || [], !s && a < r.limit) {
                                        r.cancel = t.noop;
                                        var i = Math.max(0, r.limit - a);
                                        i = Math.min(i, n.length), a += n.length, r._append(e, n.slice(0, i)), r.async && r.trigger("asyncReceived", e)
                                    }
                                }
                                var r = this,
                                    s = !1,
                                    o = !1,
                                    a = 0;
                                this.cancel(), this.cancel = function() {
                                    s = !0, r.cancel = t.noop, r.async && r.trigger("asyncCanceled", e)
                                }, this.source(e, n, i), !o && n([])
                            },
                            cancel: t.noop,
                            clear: function() {
                                this._empty(), this.cancel(), this.trigger("cleared")
                            },
                            isEmpty: function() {
                                return this.$el.is(":empty")
                            },
                            destroy: function() {
                                this.$el = t("<div>")
                            }
                        }), n
                    }(),
                    c = function() {
                        "use strict";

                        function n(n, i) {
                            function r(e) {
                                var n = s.$node.find(e.node).first();
                                return e.node = n.length ? n : t('<ul class="ui-list">').appendTo(s.$node), new u(e, i)
                            }
                            var s = this;
                            n = n || {}, n.node || t.error("node is required"), i.mixin(this), this.$node = t(n.node), this.query = null, this.datasets = e.map(n.datasets, r)
                        }
                        return e.mixin(n.prototype, s, {
                            _onSelectableClick: function(e) {
                                this.trigger("selectableClicked", t(e.currentTarget))
                            },
                            _onRendered: function(t, e, n, i) {
                                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetRendered", e, n, i)
                            },
                            _onCleared: function() {
                                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetCleared")
                            },
                            _propagate: function() {
                                this.trigger.apply(this, arguments)
                            },
                            _allDatasetsEmpty: function() {
                                function t(t) {
                                    return t.isEmpty()
                                }
                                return e.every(this.datasets, t)
                            },
                            _getSelectables: function() {
                                return this.$node.find(this.selectors.selectable)
                            },
                            _removeCursor: function() {
                                var t = this.getActiveSelectable();
                                t && t.removeClass(this.classes.cursor)
                            },
                            _ensureVisible: function(t) {
                                var e, n, i, r;
                                e = t.position().top, n = e + t.outerHeight(!0), i = this.$node.scrollTop(), r = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10), e < 0 ? this.$node.scrollTop(i + e) : r < n && this.$node.scrollTop(i + (n - r))
                            },
                            bind: function() {
                                var t, n = this;
                                return t = e.bind(this._onSelectableClick, this), this.$node.on("click.tt", this.selectors.selectable, t), e.each(this.datasets, function(t) {
                                    t.onSync("asyncRequested", n._propagate, n).onSync("asyncCanceled", n._propagate, n).onSync("asyncReceived", n._propagate, n).onSync("rendered", n._onRendered, n).onSync("cleared", n._onCleared, n)
                                }), this
                            },
                            isOpen: function() {
                                return this.$node.hasClass(this.classes.open)
                            },
                            open: function() {
                                this.$node.addClass(this.classes.open)
                            },
                            close: function() {
                                this.$node.removeClass(this.classes.open), this._removeCursor()
                            },
                            setLanguageDirection: function(t) {
                                this.$node.attr("dir", t)
                            },
                            selectableRelativeToCursor: function(t) {
                                var e, n, i, r;
                                return n = this.getActiveSelectable(), e = this._getSelectables(), i = n ? e.index(n) : -1, r = i + t, r = (r + 1) % (e.length + 1) - 1, r = r < -1 ? e.length - 1 : r, -1 === r ? null : e.eq(r)
                            },
                            setCursor: function(t) {
                                this._removeCursor(), (t = t && t.first()) && (t.addClass(this.classes.cursor), this._ensureVisible(t))
                            },
                            getSelectableData: function(t) {
                                return t && t.length ? u.extractData(t) : null
                            },
                            getActiveSelectable: function() {
                                var t = this._getSelectables().filter(this.selectors.cursor).first();
                                return t.length ? t : null
                            },
                            getTopSelectable: function() {
                                var t = this._getSelectables().first();
                                return t.length ? t : null
                            },
                            update: function(t) {
                                function n(e) {
                                    e.update(t)
                                }
                                var i = t !== this.query;
                                return i && (this.query = t, e.each(this.datasets, n)), i
                            },
                            empty: function() {
                                function t(t) {
                                    t.clear()
                                }
                                e.each(this.datasets, t), this.query = null, this.$node.addClass(this.classes.empty)
                            },
                            destroy: function() {
                                function n(t) {
                                    t.destroy()
                                }
                                this.$node.off(".tt"), this.$node = t("<div>"), e.each(this.datasets, n)
                            }
                        }), n
                    }(),
                    l = function() {
                        "use strict";

                        function t() {
                            c.apply(this, [].slice.call(arguments, 0))
                        }
                        var n = c.prototype;
                        return e.mixin(t.prototype, c.prototype, {
                            open: function() {
                                return !this._allDatasetsEmpty() && this._show(), n.open.apply(this, [].slice.call(arguments, 0))
                            },
                            close: function() {
                                return this._hide(), n.close.apply(this, [].slice.call(arguments, 0))
                            },
                            _onRendered: function() {
                                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), n._onRendered.apply(this, [].slice.call(arguments, 0))
                            },
                            _onCleared: function() {
                                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), n._onCleared.apply(this, [].slice.call(arguments, 0))
                            },
                            setLanguageDirection: function(t) {
                                return this.$node.css("ltr" === t ? this.css.ltr : this.css.rtl), n.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
                            },
                            _hide: function() {
                                this.$node.hide()
                            },
                            _show: function() {
                                this.$node.css("display", "inline-block")
                            }
                        }), t
                    }(),
                    h = function() {
                        "use strict";

                        function n(n, r) {
                            var s, o, a, u, c, l, h, f, d, p, g;
                            n = n || {}, n.input || t.error("missing input"), n.menu || t.error("missing menu"), n.eventBus || t.error("missing event bus"), r.mixin(this), this.eventBus = n.eventBus, this.minLength = e.isNumber(n.minLength) ? n.minLength : 1, this.input = n.input, this.menu = n.menu, this.enabled = !0, this.active = !1, this.input.hasFocus() && this.activate(), this.dir = this.input.getLangDir(), this._hacks(), this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this), s = i(this, "activate", "open", "_onFocused"), o = i(this, "deactivate", "_onBlurred"), a = i(this, "isActive", "isOpen", "_onEnterKeyed"), u = i(this, "isActive", "isOpen", "_onTabKeyed"), c = i(this, "isActive", "_onEscKeyed"), l = i(this, "isActive", "open", "_onUpKeyed"), h = i(this, "isActive", "open", "_onDownKeyed"), f = i(this, "isActive", "isOpen", "_onLeftKeyed"), d = i(this, "isActive", "isOpen", "_onRightKeyed"), p = i(this, "_openIfActive", "_onQueryChanged"), g = i(this, "_openIfActive", "_onWhitespaceChanged"), this.input.bind().onSync("focused", s, this).onSync("blurred", o, this).onSync("enterKeyed", a, this).onSync("tabKeyed", u, this).onSync("escKeyed", c, this).onSync("upKeyed", l, this).onSync("downKeyed", h, this).onSync("leftKeyed", f, this).onSync("rightKeyed", d, this).onSync("queryChanged", p, this).onSync("whitespaceChanged", g, this).onSync("langDirChanged", this._onLangDirChanged, this)
                        }

                        function i(t) {
                            var n = [].slice.call(arguments, 1);
                            return function() {
                                var i = [].slice.call(arguments);
                                e.each(n, function(e) {
                                    return t[e].apply(t, i)
                                })
                            }
                        }
                        return e.mixin(n.prototype, {
                            _hacks: function() {
                                var n, i;
                                n = this.input.$input || t("<div>"), i = this.menu.$node || t("<div>"), n.on("blur.tt", function(t) {
                                    var r, s, o;
                                    r = document.activeElement, s = i.is(r), o = i.has(r).length > 0, e.isMsie() && (s || o) && (t.preventDefault(), t.stopImmediatePropagation(), e.defer(function() {
                                        n.focus()
                                    }))
                                }), i.on("mousedown.tt", function(t) {
                                    t.preventDefault()
                                })
                            },
                            _onSelectableClicked: function(t, e) {
                                this.select(e)
                            },
                            _onDatasetCleared: function() {
                                this._updateHint()
                            },
                            _onDatasetRendered: function(t, e, n, i) {
                                this._updateHint(), this.eventBus.trigger("render", n, i, e)
                            },
                            _onAsyncRequested: function(t, e, n) {
                                this.eventBus.trigger("asyncrequest", n, e)
                            },
                            _onAsyncCanceled: function(t, e, n) {
                                this.eventBus.trigger("asynccancel", n, e)
                            },
                            _onAsyncReceived: function(t, e, n) {
                                this.eventBus.trigger("asyncreceive", n, e)
                            },
                            _onFocused: function() {
                                this._minLengthMet() && this.menu.update(this.input.getQuery())
                            },
                            _onBlurred: function() {
                                this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
                            },
                            _onEnterKeyed: function(t, e) {
                                var n;
                                (n = this.menu.getActiveSelectable()) && this.select(n) && e.preventDefault()
                            },
                            _onTabKeyed: function(t, e) {
                                var n;
                                (n = this.menu.getActiveSelectable()) ? this.select(n) && e.preventDefault(): (n = this.menu.getTopSelectable()) && this.autocomplete(n) && e.preventDefault()
                            },
                            _onEscKeyed: function() {
                                this.close()
                            },
                            _onUpKeyed: function() {
                                this.moveCursor(-1)
                            },
                            _onDownKeyed: function() {
                                this.moveCursor(1)
                            },
                            _onLeftKeyed: function() {
                                "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                            },
                            _onRightKeyed: function() {
                                "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                            },
                            _onQueryChanged: function(t, e) {
                                this._minLengthMet(e) ? this.menu.update(e) : this.menu.empty()
                            },
                            _onWhitespaceChanged: function() {
                                this._updateHint()
                            },
                            _onLangDirChanged: function(t, e) {
                                this.dir !== e && (this.dir = e, this.menu.setLanguageDirection(e))
                            },
                            _openIfActive: function() {
                                this.isActive() && this.open()
                            },
                            _minLengthMet: function(t) {
                                return t = e.isString(t) ? t : this.input.getQuery() || "", t.length >= this.minLength
                            },
                            _updateHint: function() {
                                var t, n, i, r, s, o, u;
                                t = this.menu.getTopSelectable(), n = this.menu.getSelectableData(t), i = this.input.getInputValue(), !n || e.isBlankString(i) || this.input.hasOverflow() ? this.input.clearHint() : (r = a.normalizeQuery(i), s = e.escapeRegExChars(r), o = new RegExp("^(?:" + s + ")(.+$)", "i"), (u = o.exec(n.val)) && this.input.setHint(i + u[1]))
                            },
                            isEnabled: function() {
                                return this.enabled
                            },
                            enable: function() {
                                this.enabled = !0
                            },
                            disable: function() {
                                this.enabled = !1
                            },
                            isActive: function() {
                                return this.active
                            },
                            activate: function() {
                                return !!this.isActive() || !(!this.isEnabled() || this.eventBus.before("active")) && (this.active = !0, this.eventBus.trigger("active"), !0)
                            },
                            deactivate: function() {
                                return !this.isActive() || !this.eventBus.before("idle") && (this.active = !1, this.close(), this.eventBus.trigger("idle"), !0)
                            },
                            isOpen: function() {
                                return this.menu.isOpen()
                            },
                            open: function() {
                                return this.isOpen() || this.eventBus.before("open") || (this.menu.open(), this._updateHint(), this.eventBus.trigger("open")), this.isOpen()
                            },
                            close: function() {
                                return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(), this.input.clearHint(), this.input.resetInputValue(), this.eventBus.trigger("close")), !this.isOpen()
                            },
                            setVal: function(t) {
                                this.input.setQuery(e.toStr(t))
                            },
                            getVal: function() {
                                return this.input.getQuery()
                            },
                            select: function(t) {
                                var e = this.menu.getSelectableData(t);
                                return !(!e || this.eventBus.before("select", e.obj)) && (this.input.setQuery(e.val, !0), this.eventBus.trigger("select", e.obj), this.close(), !0)
                            },
                            autocomplete: function(t) {
                                var e, n;
                                return e = this.input.getQuery(), n = this.menu.getSelectableData(t), !(!(n && e !== n.val) || this.eventBus.before("autocomplete", n.obj)) && (this.input.setQuery(n.val), this.eventBus.trigger("autocomplete", n.obj), !0)
                            },
                            moveCursor: function(t) {
                                var e, n, i, r;
                                return e = this.input.getQuery(), n = this.menu.selectableRelativeToCursor(t), i = this.menu.getSelectableData(n), r = i ? i.obj : null, !(this._minLengthMet() && this.menu.update(e)) && !this.eventBus.before("cursorchange", r) && (this.menu.setCursor(n), i ? this.input.setInputValue(i.val) : (this.input.resetInputValue(), this._updateHint()), this.eventBus.trigger("cursorchange", r), !0)
                            },
                            destroy: function() {
                                this.input.destroy(), this.menu.destroy()
                            }
                        }), n
                    }();
                ! function() {
                    "use strict";

                    function i(e, n) {
                        e.each(function() {
                            var e, i = t(this);
                            (e = i.data(g.typeahead)) && n(e, i)
                        })
                    }

                    function s(t, e) {
                        return t.clone().addClass(e.classes.hint).removeData().css(e.css.hint).css(u(t)).prop("readonly", !0).removeAttr("id name placeholder required").attr({
                            autocomplete: "off",
                            spellcheck: "false",
                            tabindex: -1
                        })
                    }

                    function o(t, e) {
                        t.data(g.attrs, {
                            dir: t.attr("dir"),
                            autocomplete: t.attr("autocomplete"),
                            spellcheck: t.attr("spellcheck"),
                            style: t.attr("style")
                        }), t.addClass(e.classes.input).attr({
                            autocomplete: "off",
                            spellcheck: !1
                        });
                        try {
                            !t.attr("dir") && t.attr("dir", "auto")
                        } catch (t) {}
                        return t
                    }

                    function u(t) {
                        return {
                            backgroundAttachment: t.css("background-attachment"),
                            backgroundClip: t.css("background-clip"),
                            backgroundColor: t.css("background-color"),
                            backgroundImage: t.css("background-image"),
                            backgroundOrigin: t.css("background-origin"),
                            backgroundPosition: t.css("background-position"),
                            backgroundRepeat: t.css("background-repeat"),
                            backgroundSize: t.css("background-size")
                        }
                    }

                    function f(t) {
                        var n, i;
                        n = t.data(g.www), i = t.parent().filter(n.selectors.wrapper), e.each(t.data(g.attrs), function(n, i) {
                            e.isUndefined(n) ? t.removeAttr(i) : t.attr(i, n)
                        }), t.removeData(g.typeahead).removeData(g.www).removeData(g.attr).removeClass(n.classes.input), i.length && (t.detach().insertAfter(i), i.remove())
                    }

                    function d(n) {
                        var i, r;
                        return i = e.isJQuery(n) || e.isElement(n), r = i ? t(n).first() : [], r.length ? r : null
                    }
                    var p, g, m;
                    p = t.fn.typeahead, g = {
                        www: "tt-www",
                        attrs: "tt-attrs",
                        typeahead: "tt-typeahead"
                    }, m = {
                        initialize: function(i, u) {
                            function f() {
                                var n, f, m, y, v, _, b, w, x, k, S;
                                e.each(u, function(t) {
                                    t.highlight = !!i.highlight
                                }), n = t(this), f = t(p.html.wrapper), m = d(i.hint), y = d(i.menu), v = !1 !== i.hint && !m, _ = !1 !== i.menu && !y, v && (m = s(n, p)), _ && (y = t(p.html.menu).css(p.css.menu)), m && m.val(""), n = o(n, p), (v || _) && (f.css(p.css.wrapper), n.css(v ? p.css.input : p.css.inputWithNoHint), n.wrap(f).parent().prepend(v ? m : null).append(_ ? y : null)), S = _ ? l : c, b = new r({
                                    el: n
                                }), w = new a({
                                    hint: m,
                                    input: n
                                }, p), x = new S({
                                    node: y,
                                    datasets: u
                                }, p), k = new h({
                                    input: w,
                                    menu: x,
                                    eventBus: b,
                                    minLength: i.minLength
                                }, p), n.data(g.www, p), n.data(g.typeahead, k)
                            }
                            var p;
                            return u = e.isArray(u) ? u : [].slice.call(arguments, 1), i = i || {}, p = n(i.classNames), this.each(f)
                        },
                        isEnabled: function() {
                            var t;
                            return i(this.first(), function(e) {
                                t = e.isEnabled()
                            }), t
                        },
                        enable: function() {
                            return i(this, function(t) {
                                t.enable()
                            }), this
                        },
                        disable: function() {
                            return i(this, function(t) {
                                t.disable()
                            }), this
                        },
                        isActive: function() {
                            var t;
                            return i(this.first(), function(e) {
                                t = e.isActive()
                            }), t
                        },
                        activate: function() {
                            return i(this, function(t) {
                                t.activate()
                            }), this
                        },
                        deactivate: function() {
                            return i(this, function(t) {
                                t.deactivate()
                            }), this
                        },
                        isOpen: function() {
                            var t;
                            return i(this.first(), function(e) {
                                t = e.isOpen()
                            }), t
                        },
                        open: function() {
                            return i(this, function(t) {
                                t.open()
                            }), this
                        },
                        close: function() {
                            return i(this, function(t) {
                                t.close()
                            }), this
                        },
                        select: function(e) {
                            var n = !1,
                                r = t(e);
                            return i(this.first(), function(t) {
                                n = t.select(r)
                            }), n
                        },
                        autocomplete: function(e) {
                            var n = !1,
                                r = t(e);
                            return i(this.first(), function(t) {
                                n = t.autocomplete(r)
                            }), n
                        },
                        moveCursor: function(t) {
                            var e = !1;
                            return i(this.first(), function(n) {
                                e = n.moveCursor(t)
                            }), e
                        },
                        val: function(t) {
                            var e;
                            return arguments.length ? (i(this, function(e) {
                                e.setVal(t)
                            }), this) : (i(this.first(), function(t) {
                                e = t.getVal()
                            }), e)
                        },
                        destroy: function() {
                            return i(this, function(t, e) {
                                f(e), t.destroy()
                            }), this
                        }
                    }, t.fn.typeahead = function(t) {
                        return m[t] ? m[t].apply(this, [].slice.call(arguments, 1)) : m.initialize.apply(this, arguments)
                    }, t.fn.typeahead.noConflict = function() {
                        return t.fn.typeahead = p, this
                    }
                }()
            })
        }).call(e, n(400).setImmediate)
    },
    398: function(t, e) {
        function n() {
            throw new Error("setTimeout has not been defined")
        }

        function i() {
            throw new Error("clearTimeout has not been defined")
        }

        function r(t) {
            if (l === setTimeout) return setTimeout(t, 0);
            if ((l === n || !l) && setTimeout) return l = setTimeout, setTimeout(t, 0);
            try {
                return l(t, 0)
            } catch (e) {
                try {
                    return l.call(null, t, 0)
                } catch (e) {
                    return l.call(this, t, 0)
                }
            }
        }

        function s(t) {
            if (h === clearTimeout) return clearTimeout(t);
            if ((h === i || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
            try {
                return h(t)
            } catch (e) {
                try {
                    return h.call(null, t)
                } catch (e) {
                    return h.call(this, t)
                }
            }
        }

        function o() {
            g && d && (g = !1, d.length ? p = d.concat(p) : m = -1, p.length && a())
        }

        function a() {
            if (!g) {
                var t = r(o);
                g = !0;
                for (var e = p.length; e;) {
                    for (d = p, p = []; ++m < e;) d && d[m].run();
                    m = -1, e = p.length
                }
                d = null, g = !1, s(t)
            }
        }

        function u(t, e) {
            this.fun = t, this.array = e
        }

        function c() {}
        var l, h, f = t.exports = {};
        ! function() {
            try {
                l = "function" == typeof setTimeout ? setTimeout : n
            } catch (t) {
                l = n
            }
            try {
                h = "function" == typeof clearTimeout ? clearTimeout : i
            } catch (t) {
                h = i
            }
        }();
        var d, p = [],
            g = !1,
            m = -1;
        f.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            p.push(new u(t, e)), 1 !== p.length || g || r(a)
        }, u.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = c, f.addListener = c, f.once = c, f.off = c, f.removeListener = c, f.removeAllListeners = c, f.emit = c, f.prependListener = c, f.prependOnceListener = c, f.listeners = function(t) {
            return []
        }, f.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, f.cwd = function() {
            return "/"
        }, f.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }, f.umask = function() {
            return 0
        }
    },
    399: function(t, e, n) {
        (function(t, e) {
            ! function(t, n) {
                "use strict";

                function i(t) {
                    "function" != typeof t && (t = new Function("" + t));
                    for (var e = new Array(arguments.length - 1), n = 0; n < e.length; n++) e[n] = arguments[n + 1];
                    var i = {
                        callback: t,
                        args: e
                    };
                    return c[u] = i, a(u), u++
                }

                function r(t) {
                    delete c[t]
                }

                function s(t) {
                    var e = t.callback,
                        i = t.args;
                    switch (i.length) {
                        case 0:
                            e();
                            break;
                        case 1:
                            e(i[0]);
                            break;
                        case 2:
                            e(i[0], i[1]);
                            break;
                        case 3:
                            e(i[0], i[1], i[2]);
                            break;
                        default:
                            e.apply(n, i)
                    }
                }

                function o(t) {
                    if (l) setTimeout(o, 0, t);
                    else {
                        var e = c[t];
                        if (e) {
                            l = !0;
                            try {
                                s(e)
                            } finally {
                                r(t), l = !1
                            }
                        }
                    }
                }
                if (!t.setImmediate) {
                    var a, u = 1,
                        c = {},
                        l = !1,
                        h = t.document,
                        f = Object.getPrototypeOf && Object.getPrototypeOf(t);
                    f = f && f.setTimeout ? f : t, "[object process]" === {}.toString.call(t.process) ? function() {
                        a = function(t) {
                            e.nextTick(function() {
                                o(t)
                            })
                        }
                    }() : function() {
                        if (t.postMessage && !t.importScripts) {
                            var e = !0,
                                n = t.onmessage;
                            return t.onmessage = function() {
                                e = !1
                            }, t.postMessage("", "*"), t.onmessage = n, e
                        }
                    }() ? function() {
                        var e = "setImmediate$" + Math.random() + "$",
                            n = function(n) {
                                n.source === t && "string" == typeof n.data && 0 === n.data.indexOf(e) && o(+n.data.slice(e.length))
                            };
                        t.addEventListener ? t.addEventListener("message", n, !1) : t.attachEvent("onmessage", n), a = function(n) {
                            t.postMessage(e + n, "*")
                        }
                    }() : t.MessageChannel ? function() {
                        var t = new MessageChannel;
                        t.port1.onmessage = function(t) {
                            o(t.data)
                        }, a = function(e) {
                            t.port2.postMessage(e)
                        }
                    }() : h && "onreadystatechange" in h.createElement("script") ? function() {
                        var t = h.documentElement;
                        a = function(e) {
                            var n = h.createElement("script");
                            n.onreadystatechange = function() {
                                o(e), n.onreadystatechange = null, t.removeChild(n), n = null
                            }, t.appendChild(n)
                        }
                    }() : function() {
                        a = function(t) {
                            setTimeout(o, 0, t)
                        }
                    }(), f.setImmediate = i, f.clearImmediate = r
                }
            }("undefined" == typeof self ? void 0 === t ? this : t : self)
        }).call(e, n(17), n(398))
    },
    400: function(t, e, n) {
        (function(t) {
            function i(t, e) {
                this._id = t, this._clearFn = e
            }
            var r = void 0 !== t && t || "undefined" != typeof self && self || window,
                s = Function.prototype.apply;
            e.setTimeout = function() {
                return new i(s.call(setTimeout, r, arguments), clearTimeout)
            }, e.setInterval = function() {
                return new i(s.call(setInterval, r, arguments), clearInterval)
            }, e.clearTimeout = e.clearInterval = function(t) {
                t && t.close()
            }, i.prototype.unref = i.prototype.ref = function() {}, i.prototype.close = function() {
                this._clearFn.call(r, this._id)
            }, e.enroll = function(t, e) {
                clearTimeout(t._idleTimeoutId), t._idleTimeout = e
            }, e.unenroll = function(t) {
                clearTimeout(t._idleTimeoutId), t._idleTimeout = -1
            }, e._unrefActive = e.active = function(t) {
                clearTimeout(t._idleTimeoutId);
                var e = t._idleTimeout;
                e >= 0 && (t._idleTimeoutId = setTimeout(function() {
                    t._onTimeout && t._onTimeout()
                }, e))
            }, n(399), e.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || this && this.setImmediate, e.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || this && this.clearImmediate
        }).call(e, n(17))
    }
});
//# sourceMappingURL=header.js.map