(function() {
    var n, aa;

    function da(a) {
        var b = 0;
        return function() {
            return b < a.length ? {
                done: !1,
                value: a[b++]
            } : {
                done: !0
            }
        }
    }
    var ea = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a
    };

    function fa(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math) return c
        }
        throw Error("Cannot find global object");
    }
    var ha = fa(this),
        ia = typeof Symbol === "function" && typeof Symbol("x") === "symbol",
        p = {},
        ja = {};

    function q(a, b, c) {
        if (!c || a != null) {
            c = ja[b];
            if (c == null) return a[b];
            c = a[c];
            return c !== void 0 ? c : a[b]
        }
    }

    function t(a, b, c) {
        if (b) a: {
            var d = a.split(".");a = d.length === 1;
            var e = d[0],
                f;!a && e in p ? f = p : f = ha;
            for (e = 0; e < d.length - 1; e++) {
                var g = d[e];
                if (!(g in f)) break a;
                f = f[g]
            }
            d = d[d.length - 1];c = ia && c === "es6" ? f[d] : null;b = b(c);b != null && (a ? ea(p, d, {
                configurable: !0,
                writable: !0,
                value: b
            }) : b !== c && (ja[d] === void 0 && (a = Math.random() * 1E9 >>> 0, ja[d] = ia ? ha.Symbol(d) : "$jscp$" + a + "$" + d), ea(f, ja[d], {
                configurable: !0,
                writable: !0,
                value: b
            })))
        }
    }
    t("Symbol", function(a) {
        function b(f) {
            if (this instanceof b) throw new TypeError("Symbol is not a constructor");
            return new c(d + (f || "") + "_" + e++, f)
        }

        function c(f, g) {
            this.v = f;
            ea(this, "description", {
                configurable: !0,
                writable: !0,
                value: g
            })
        }
        if (a) return a;
        c.prototype.toString = function() {
            return this.v
        };
        var d = "jscomp_symbol_" + (Math.random() * 1E9 >>> 0) + "_",
            e = 0;
        return b
    }, "es6");
    t("Symbol.iterator", function(a) {
        if (a) return a;
        a = (0, p.Symbol)("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = ha[b[c]];
            typeof d === "function" && typeof d.prototype[a] != "function" && ea(d.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return ka(da(this))
                }
            })
        }
        return a
    }, "es6");

    function ka(a) {
        a = {
            next: a
        };
        a[q(p.Symbol, "iterator")] = function() {
            return this
        };
        return a
    }

    function u(a) {
        var b = typeof p.Symbol != "undefined" && q(p.Symbol, "iterator") && a[q(p.Symbol, "iterator")];
        if (b) return b.call(a);
        if (typeof a.length == "number") return {
            next: da(a)
        };
        throw Error(String(a) + " is not an iterable or ArrayLike");
    }

    function la(a) {
        return ma(a, a)
    }

    function ma(a, b) {
        a.raw = b;
        Object.freeze && (Object.freeze(a), Object.freeze(b));
        return a
    }

    function v(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }
    var oa = ia && typeof q(Object, "assign") == "function" ? q(Object, "assign") : function(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (d)
                for (var e in d) v(d, e) && (a[e] = d[e])
        }
        return a
    };
    t("Object.assign", function(a) {
        return a || oa
    }, "es6");

    function sa() {
        for (var a = Number(this), b = [], c = a; c < arguments.length; c++) b[c - a] = arguments[c];
        return b
    }
    t("globalThis", function(a) {
        return a || ha
    }, "es_2020");
    t("WeakMap", function(a) {
        function b(g) {
            this.v = (f += Math.random() + 1).toString();
            if (g) {
                g = u(g);
                for (var h; !(h = g.next()).done;) h = h.value, this.set(h[0], h[1])
            }
        }

        function c() {}

        function d(g) {
            var h = typeof g;
            return h === "object" && g !== null || h === "function"
        }
        if (function() {
                if (!a || !Object.seal) return !1;
                try {
                    var g = Object.seal({}),
                        h = Object.seal({}),
                        k = new a([
                            [g, 2],
                            [h, 3]
                        ]);
                    if (k.get(g) != 2 || k.get(h) != 3) return !1;
                    k.delete(g);
                    k.set(h, 4);
                    return !k.has(g) && k.get(h) == 4
                } catch (l) {
                    return !1
                }
            }()) return a;
        var e = "$jscomp_hidden_" + Math.random(),
            f = 0;
        b.prototype.set = function(g, h) {
            if (!d(g)) throw Error("Invalid WeakMap key");
            if (!v(g, e)) {
                var k = new c;
                ea(g, e, {
                    value: k
                })
            }
            if (!v(g, e)) throw Error("WeakMap key fail: " + g);
            g[e][this.v] = h;
            return this
        };
        b.prototype.get = function(g) {
            return d(g) && v(g, e) ? g[e][this.v] : void 0
        };
        b.prototype.has = function(g) {
            return d(g) && v(g, e) && v(g[e], this.v)
        };
        b.prototype.delete = function(g) {
            return d(g) && v(g, e) && v(g[e], this.v) ? delete g[e][this.v] : !1
        };
        return b
    }, "es6");
    t("Map", function(a) {
        function b() {
            var h = {};
            return h.F = h.next = h.head = h
        }

        function c(h, k) {
            var l = h[1];
            return ka(function() {
                if (l) {
                    for (; l.head != h[1];) l = l.F;
                    for (; l.next != l.head;) return l = l.next, {
                        done: !1,
                        value: k(l)
                    };
                    l = null
                }
                return {
                    done: !0,
                    value: void 0
                }
            })
        }

        function d(h, k) {
            var l = k && typeof k;
            l == "object" || l == "function" ? f.has(k) ? l = f.get(k) : (l = "" + ++g, f.set(k, l)) : l = "p_" + k;
            var m = h[0][l];
            if (m && v(h[0], l))
                for (h = 0; h < m.length; h++) {
                    var r = m[h];
                    if (k !== k && r.key !== r.key || k === r.key) return {
                        id: l,
                        list: m,
                        index: h,
                        entry: r
                    }
                }
            return {
                id: l,
                list: m,
                index: -1,
                entry: void 0
            }
        }

        function e(h) {
            this[0] = {};
            this[1] = b();
            this.size = 0;
            if (h) {
                h = u(h);
                for (var k; !(k = h.next()).done;) k = k.value, this.set(k[0], k[1])
            }
        }
        if (function() {
                if (!a || typeof a != "function" || !q(a.prototype, "entries") || typeof Object.seal != "function") return !1;
                try {
                    var h = Object.seal({
                            x: 4
                        }),
                        k = new a(u([
                            [h, "s"]
                        ]));
                    if (k.get(h) != "s" || k.size != 1 || k.get({
                            x: 4
                        }) || k.set({
                            x: 4
                        }, "t") != k || k.size != 2) return !1;
                    var l = q(k, "entries").call(k),
                        m = l.next();
                    if (m.done || m.value[0] != h || m.value[1] != "s") return !1;
                    m = l.next();
                    return m.done ||
                        m.value[0].x != 4 || m.value[1] != "t" || !l.next().done ? !1 : !0
                } catch (r) {
                    return !1
                }
            }()) return a;
        var f = new p.WeakMap;
        e.prototype.set = function(h, k) {
            h = h === 0 ? 0 : h;
            var l = d(this, h);
            l.list || (l.list = this[0][l.id] = []);
            l.entry ? l.entry.value = k : (l.entry = {
                next: this[1],
                F: this[1].F,
                head: this[1],
                key: h,
                value: k
            }, l.list.push(l.entry), this[1].F.next = l.entry, this[1].F = l.entry, this.size++);
            return this
        };
        e.prototype.delete = function(h) {
            h = d(this, h);
            return h.entry && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id],
                h.entry.F.next = h.entry.next, h.entry.next.F = h.entry.F, h.entry.head = null, this.size--, !0) : !1
        };
        e.prototype.clear = function() {
            this[0] = {};
            this[1] = this[1].F = b();
            this.size = 0
        };
        e.prototype.has = function(h) {
            return !!d(this, h).entry
        };
        e.prototype.get = function(h) {
            return (h = d(this, h).entry) && h.value
        };
        e.prototype.entries = function() {
            return c(this, function(h) {
                return [h.key, h.value]
            })
        };
        e.prototype.keys = function() {
            return c(this, function(h) {
                return h.key
            })
        };
        e.prototype.values = function() {
            return c(this, function(h) {
                return h.value
            })
        };
        e.prototype.forEach = function(h, k) {
            for (var l = q(this, "entries").call(this), m; !(m = l.next()).done;) m = m.value, h.call(k, m[1], m[0], this)
        };
        e.prototype[q(p.Symbol, "iterator")] = q(e.prototype, "entries");
        var g = 0;
        return e
    }, "es6");
    t("Array.from", function(a) {
        return a ? a : function(b, c, d) {
            c = c != null ? c : function(h) {
                return h
            };
            var e = [],
                f = typeof p.Symbol != "undefined" && q(p.Symbol, "iterator") && b[q(p.Symbol, "iterator")];
            if (typeof f == "function") {
                b = f.call(b);
                for (var g = 0; !(f = b.next()).done;) e.push(c.call(d, f.value, g++))
            } else
                for (f = b.length, g = 0; g < f; g++) e.push(c.call(d, b[g], g));
            return e
        }
    }, "es6");
    t("Object.entries", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) v(b, d) && c.push([d, b[d]]);
            return c
        }
    }, "es8");

    function ta(a, b, c) {
        if (a == null) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
        if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
        return a + ""
    }
    t("String.prototype.endsWith", function(a) {
        return a ? a : function(b, c) {
            var d = ta(this, b, "endsWith");
            c === void 0 && (c = d.length);
            c = Math.max(0, Math.min(c | 0, d.length));
            for (var e = b.length; e > 0 && c > 0;)
                if (d[--c] != b[--e]) return !1;
            return e <= 0
        }
    }, "es6");
    t("Object.is", function(a) {
        return a ? a : function(b, c) {
            return b === c ? b !== 0 || 1 / b === 1 / c : b !== b && c !== c
        }
    }, "es6");
    t("Array.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
                var f = d[c];
                if (f === b || q(Object, "is").call(Object, f, b)) return !0
            }
            return !1
        }
    }, "es7");
    t("String.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            return ta(this, b, "includes").indexOf(b, c || 0) !== -1
        }
    }, "es6");

    function ua(a, b) {
        a instanceof String && (a += "");
        var c = 0,
            d = !1,
            e = {
                next: function() {
                    if (!d && c < a.length) {
                        var f = c++;
                        return {
                            value: b(f, a[f]),
                            done: !1
                        }
                    }
                    d = !0;
                    return {
                        done: !0,
                        value: void 0
                    }
                }
            };
        e[q(p.Symbol, "iterator")] = function() {
            return e
        };
        return e
    }
    t("Array.prototype.entries", function(a) {
        return a ? a : function() {
            return ua(this, function(b, c) {
                return [b, c]
            })
        }
    }, "es6");
    t("Array.prototype.keys", function(a) {
        return a ? a : function() {
            return ua(this, function(b) {
                return b
            })
        }
    }, "es6");
    t("Object.values", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) v(b, d) && c.push(b[d]);
            return c
        }
    }, "es8");
    t("Array.prototype.values", function(a) {
        return a ? a : function() {
            return ua(this, function(b, c) {
                return c
            })
        }
    }, "es8");
    t("Number.isNaN", function(a) {
        return a ? a : function(b) {
            return typeof b === "number" && isNaN(b)
        }
    }, "es6");
    /* 
     
     Copyright The Closure Library Authors. 
     SPDX-License-Identifier: Apache-2.0 
    */
    var w = this || self;

    function va(a) {
        a = parseFloat(a);
        return isNaN(a) || a > 1 || a < 0 ? 0 : a
    };
    var wa = Array.prototype.indexOf ? function(a, b) {
            return Array.prototype.indexOf.call(a, b, void 0)
        } : function(a, b) {
            if (typeof a === "string") return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
            for (var c = 0; c < a.length; c++)
                if (c in a && a[c] === b) return c;
            return -1
        },
        xa = Array.prototype.some ? function(a, b) {
            return Array.prototype.some.call(a, b, void 0)
        } : function(a, b) {
            for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++)
                if (e in d && b.call(void 0, d[e], e, a)) return !0;
            return !1
        };

    function ya(a) {
        var b = !1,
            c;
        return function() {
            b || (c = a(), b = !0);
            return c
        }
    };

    function za() {
        var a = w.navigator;
        return a && (a = a.userAgent) ? a : ""
    };

    function Aa(a) {
        Aa[" "](a);
        return a
    }
    Aa[" "] = function() {};
    /* 
     
     Copyright Google LLC 
     SPDX-License-Identifier: Apache-2.0 
    */
    var Ba = p.globalThis.trustedTypes,
        Ga;

    function Ha() {
        var a = null;
        if (!Ba) return a;
        try {
            var b = function(c) {
                return c
            };
            a = Ba.createPolicy("goog#html", {
                createHTML: b,
                createScript: b,
                createScriptURL: b
            })
        } catch (c) {}
        return a
    };

    function Ia(a) {
        this.v = a
    }
    Ia.prototype.toString = function() {
        return this.v + ""
    };

    function Ja(a) {
        var b;
        Ga === void 0 && (Ga = Ha());
        a = (b = Ga) ? b.createScriptURL(a) : a;
        return new Ia(a)
    }

    function Ka(a) {
        if (a instanceof Ia) return a.v;
        throw Error("");
    };

    function La(a, b) {
        a.src = Ka(b);
        var c;
        b = a.ownerDocument;
        b = b === void 0 ? document : b;
        var d;
        b = (d = (c = b).querySelector) == null ? void 0 : d.call(c, "script[nonce]");
        (c = b == null ? "" : b.nonce || b.getAttribute("nonce") || "") && a.setAttribute("nonce", c)
    };

    function Ma(a) {
        var b = sa.apply(1, arguments);
        if (b.length === 0) return Ja(a[0]);
        for (var c = a[0], d = 0; d < b.length; d++) c += encodeURIComponent(b[d]) + a[d + 1];
        return Ja(c)
    }

    function Na(a, b, c, d) {
        function e(g, h) {
            g != null && (Array.isArray(g) ? g.forEach(function(k) {
                return e(k, h)
            }) : (b += f + encodeURIComponent(h) + "=" + encodeURIComponent(g), f = "&"))
        }
        var f = b.length ? "&" : "?";
        d.constructor === Object && (d = q(Object, "entries").call(Object, d));
        Array.isArray(d) ? d.forEach(function(g) {
            return e(g[1], g[0])
        }) : d.forEach(e);
        return Ja(a + b + c)
    };

    function Oa(a) {
        try {
            var b;
            if (b = !!a && a.location.href != null) a: {
                try {
                    Aa(a.foo);
                    b = !0;
                    break a
                } catch (c) {}
                b = !1
            }
            return b
        } catch (c) {
            return !1
        }
    }

    function Pa() {
        if (!p.globalThis.crypto) return Math.random();
        try {
            var a = new Uint32Array(1);
            p.globalThis.crypto.getRandomValues(a);
            return a[0] / 65536 / 65536
        } catch (b) {
            return Math.random()
        }
    }

    function Qa(a, b) {
        if (a)
            for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a)
    }
    var Sa = ya(function() {
            return xa(["Google Web Preview", "Mediapartners-Google", "Google-Read-Aloud", "Google-Adwords"], Ra) || Math.random() < 1E-4
        }),
        Ta = ya(function() {
            return za().indexOf("MSIE") != -1
        });

    function Ra(a) {
        return za().indexOf(a) != -1
    }

    function A(a) {
        return /^true$/.test(a)
    }

    function Ua(a, b) {
        if (!a || !b.head) return null;
        var c = Va("META");
        b.head.appendChild(c);
        c.httpEquiv = "origin-trial";
        c.content = a;
        return c
    }

    function Va(a, b) {
        b = b === void 0 ? document : b;
        return b.createElement(String(a).toLowerCase())
    };
    var Ya = va("0.20"),
        ab = va("0.002"),
        bb = va("1.0"),
        cb = va("1.0"),
        db = va("0.00"),
        eb = va("0.00"),
        fb = A("true"),
        gb = A("true"),
        hb = A("true"),
        ib = A("true"),
        jb = A("true"),
        kb = A("false");
    var lb = null;

    function mb(a) {
        a = a === void 0 ? window : a;
        if (lb === null) {
            lb = "";
            try {
                var b = "";
                try {
                    b = a.top.location.hash
                } catch (d) {
                    b = a.location.hash
                }
                if (b) {
                    var c = b.match(/\bdeid=([\d,]+)/);
                    lb = c ? c[1] : ""
                }
            } catch (d) {}
        }
        return lb
    }

    function B(a, b, c) {
        var d = C;
        if (c ? d.v.hasOwnProperty(c) && d.v[c] === "" : 1) {
            var e = e === void 0 ? w : e;
            e = (e = mb(e)) ? (e = e.match(new RegExp("\\b(" + a.join("|") + ")\\b"))) ? e[0] : null : null;
            if (e) a = e;
            else a: {
                if (!Ta() && !Sa() && (e = Math.random(), e < b)) {
                    e = Pa();
                    a = a[Math.floor(e * a.length)];
                    break a
                }
                a = null
            }
            a && a !== "" && (c ? d.v.hasOwnProperty(c) && (d.v[c] = a) : d.ca[a] = !0)
        }
    }

    function F(a) {
        var b = C;
        return b.v.hasOwnProperty(a) ? b.v[a] : ""
    }

    function nb() {
        var a = C,
            b = [];
        Qa(a.ca, function(c, d) {
            b.push(d)
        });
        Qa(a.v, function(c) {
            c !== "" && b.push(c)
        });
        return b
    };
    var ob = {
            Oa: 2,
            Va: 13,
            Ua: 14,
            Ra: 16,
            Qa: 17,
            Pa: 18,
            Na: 19,
            Xa: 20,
            Wa: 21,
            Ma: 22,
            Ia: 23
        },
        C = null;

    function pb() {
        return !!C && (F(20) == "466465926" || F(20) == "466465925")
    }

    function qb() {
        return !!C && F(16) == "592230571"
    }

    function rb() {
        return !!C && (F(22) == "512247839" || F(22) == "512247838")
    };

    function sb(a) {
        var b = b === void 0 ? w : b;
        var c, d;
        return ((c = b.performance) == null ? void 0 : (d = c.timing) == null ? void 0 : d[a]) || 0
    };

    function tb() {
        var a = ub,
            b = "P";
        if (a.P && a.hasOwnProperty(b)) return a.P;
        b = new a;
        return a.P = b
    };
    var vb = {
        Sa: 0,
        Ja: 1,
        Ta: 2,
        La: 3,
        Ka: 4
    };

    function ub() {
        this.v = {}
    }

    function wb(a, b, c) {
        typeof c === "number" && c > 0 && (a.v[b] = Math.round(c))
    }

    function xb(a) {
        var b = tb();
        var c = c === void 0 ? w : c;
        c = c.performance;
        wb(b, a, c && c.now ? c.now() : null)
    }

    function yb() {
        function a() {
            return wb(b, 0, sb("loadEventStart") - sb("navigationStart"))
        }
        var b = tb();
        sb("loadEventStart") != 0 ? a() : window.addEventListener("load", a)
    }

    function zb(a, b) {
        b.google_tag_manager && b.google_tag_manager._li && (b = b.google_tag_manager._li, wb(a, 4, b.cbt), wb(a, 3, b.cst))
    }

    function Ab() {
        var a = tb();
        return q(Object, "values").call(Object, vb).map(function(b) {
            return [b, a.v[b] || 0]
        })
    };
    var Bb = A("false");
    var Cb = {};

    function G(a) {
        Cb.TAGGING = Cb.TAGGING || [];
        Cb.TAGGING[a] = !0
    };

    function Db(a) {
        return typeof a === "function"
    }

    function Eb(a) {
        return typeof a === "string"
    }

    function Fb(a, b) {
        if (a && Array.isArray(a))
            for (var c = 0; c < a.length; c++)
                if (a[c] && b(a[c])) return a[c]
    }

    function Gb(a, b) {
        for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c])
    }

    function H() {
        return (new Date(Date.now())).getTime()
    }

    function Hb(a) {
        for (var b = 0; b < 3; ++b) try {
            var c = decodeURIComponent(a).replace(/\+/g, " ");
            if (c === a) break;
            a = c
        } catch (d) {
            return ""
        }
        return a
    };
    var I = window,
        J = document,
        Ib = navigator,
        Jb = {
            async: 1,
            nonce: 1,
            onerror: 1,
            onload: 1,
            src: 1,
            type: 1
        },
        Kb = {
            onload: 1,
            src: 1,
            width: 1,
            height: 1,
            style: 1
        };

    function Zb(a, b, c) {
        b && Gb(b, function(d, e) {
            d = d.toLowerCase();
            c.hasOwnProperty(d) || a.setAttribute(d, e)
        })
    }

    function $b(a, b, c, d, e) {
        var f = J.createElement("script");
        Zb(f, d, Jb);
        f.type = "text/javascript";
        f.async = d && d.async === !1 ? !1 : !0;
        a = Ja(a === null ? "null" : a === void 0 ? "undefined" : a);
        La(f, a);
        b && (f.onload = b);
        c && (f.onerror = c);
        e ? e.appendChild(f) : (b = J.getElementsByTagName("script")[0] || J.body || J.head, b.parentNode.insertBefore(f, b))
    }

    function ac(a, b, c, d, e, f) {
        f = f === void 0 ? !0 : f;
        var g = e;
        e = !1;
        g || (g = J.createElement("iframe"), e = !0);
        Zb(g, c, Kb);
        d && Gb(d, function(h, k) {
            g.dataset[h] = k
        });
        f && (g.height = "0", g.width = "0", g.style.display = "none", g.style.visibility = "hidden");
        a !== void 0 && (g.src = a);
        e && (a = J.body && J.body.lastChild || J.body || J.head, a.parentNode.insertBefore(g, a));
        b && (g.onload = b)
    }
    var bc = {
        cache: "no-store",
        credentials: "include",
        keepalive: !0,
        method: "POST",
        mode: "no-cors",
        redirect: "follow"
    };

    function cc(a) {
        if (typeof I.fetch === "function") {
            var b = q(Object, "assign").call(Object, {}, bc);
            try {
                var c = I.fetch(a, b);
                if (c) return c.then(function() {}).catch(function() {}), !0
            } catch (d) {}
        }
        dc(a);
        return !0
    }

    function ec() {
        var a = I.performance;
        if (a && a.getEntriesByType) try {
            var b = a.getEntriesByType("navigation");
            if (b && b.length > 0) var c = b[0].type
        } catch (d) {
            return "e"
        }
        if (!c) return "u";
        switch (c) {
            case "navigate":
                return "n";
            case "back_forward":
                return "h";
            case "reload":
                return "r";
            case "prerender":
                return "p";
            default:
                return "x"
        }
    }

    function fc(a) {
        var b = new Image(1, 1);
        Zb(b, void 0, {});
        b.onload = function() {
            b.onload = null
        };
        b.onerror = function() {
            b.onerror = null
        };
        b.src = a
    }

    function dc(a) {
        try {
            var b = Ib.sendBeacon && Ib.sendBeacon(a)
        } catch (c) {
            G(15)
        }
        b || fc(a)
    };
    var hc = [],
        ic = {};

    function L(a) {
        return hc[a] === void 0 ? !1 : hc[a]
    };

    function jc() {
        var a = a === void 0 ? document : a;
        var b;
        return !((b = a.featurePolicy) == null || !(aa = b.allowedFeatures(), q(aa, "includes")).call(aa, "attribution-reporting"))
    };

    function kc(a) {
        try {
            a.parentNode.removeChild(a)
        } catch (b) {}
    };

    function lc() {
        var a = {};
        var b = I.google_tag_data;
        I.google_tag_data = b === void 0 ? a : b;
        a = I.google_tag_data;
        return a.ics = a.ics || new mc
    }

    function mc() {
        this.entries = {};
        this.waitPeriodTimedOut = this.wasSetLate = this.accessedAny = this.accessedDefault = this.usedImplicit = this.usedUpdate = this.usedDefault = this.usedDeclare = this.active = !1;
        this.v = []
    }
    n = mc.prototype;
    n.default = function(a, b, c, d, e, f, g) {
        this.usedDefault || this.usedDeclare || !this.accessedDefault && !this.accessedAny || (this.wasSetLate = !0);
        this.usedDefault = this.active = !0;
        G(19);
        b == null ? G(18) : nc(this, a, b === "granted", c, d, e, f, g)
    };
    n.waitForUpdate = function(a, b, c) {
        for (var d = 0; d < a.length; d++) nc(this, a[d], void 0, void 0, "", "", b, c)
    };

    function nc(a, b, c, d, e, f, g, h) {
        var k = q(a, "entries"),
            l = k[b] || {},
            m = l.region;
        d = d && Eb(d) ? d.toUpperCase() : void 0;
        e = e.toUpperCase();
        f = f.toUpperCase();
        if (e === "" || d === f || (d === e ? m !== f : !d && !m)) {
            f = !!(g && g > 0 && l.update === void 0);
            var r = {
                region: d,
                declare_region: l.declare_region,
                implicit: l.implicit,
                default: c !== void 0 ? c : l.default,
                declare: l.declare,
                update: l.update,
                quiet: f
            };
            if (e !== "" || l.default !== !1) k[b] = r;
            f && I.setTimeout(function() {
                    k[b] === r && r.quiet && (G(2), a.waitPeriodTimedOut = !0, a.clearTimeout(b, void 0, h), a.notifyListeners())
                },
                g)
        }
    }
    n.clearTimeout = function(a, b, c) {
        var d = [a],
            e = c.delegatedConsentTypes,
            f;
        for (f in e) e.hasOwnProperty(f) && e[f] === a && d.push(f);
        e = q(this, "entries")[a] || {};
        a = this.getConsentState(a, c);
        if (e.quiet)
            for (e.quiet = !1, b = u(d), d = b.next(); !d.done; d = b.next()) oc(this, d.value);
        else if (b !== void 0 && a !== b)
            for (b = u(d), d = b.next(); !d.done; d = b.next()) oc(this, d.value)
    };
    n.update = function(a, b, c) {
        this.usedDefault || this.usedDeclare || this.usedUpdate || !this.accessedAny || (this.wasSetLate = !0);
        this.usedUpdate = this.active = !0;
        if (b != null) {
            var d = this.getConsentState(a, c),
                e = q(this, "entries");
            (e[a] = e[a] || {}).update = b === "granted";
            this.clearTimeout(a, d, c)
        }
    };
    n.declare = function(a, b, c, d, e) {
        this.usedDeclare = this.active = !0;
        var f = q(this, "entries"),
            g = f[a] || {},
            h = g.declare_region;
        c = c && Eb(c) ? c.toUpperCase() : void 0;
        d = d.toUpperCase();
        e = e.toUpperCase();
        if (d === "" || c === e || (c === d ? h !== e : !c && !h))
            if (b = {
                    region: g.region,
                    declare_region: c,
                    declare: b === "granted",
                    implicit: g.implicit,
                    default: g.default,
                    update: g.update,
                    quiet: g.quiet
                }, d !== "" || g.declare !== !1) f[a] = b
    };
    n.implicit = function(a, b) {
        this.usedImplicit = !0;
        var c = q(this, "entries");
        a = c[a] = c[a] || {};
        a.implicit !== !1 && (a.implicit = b === "granted")
    };
    n.getConsentState = function(a, b) {
        var c = q(this, "entries"),
            d = c[a] || {},
            e = d.update;
        if (e !== void 0) return e ? 1 : 2;
        if (b.usedContainerScopedDefaults) {
            e = b.containerScopedDefaults[a];
            if (e === 3) return 1;
            if (e === 2) return 2
        } else if (e = d.default, e !== void 0) return e ? 1 : 2;
        if (b == null ? 0 : b.delegatedConsentTypes.hasOwnProperty(a)) {
            a = b.delegatedConsentTypes[a];
            c = c[a] || {};
            e = c.update;
            if (e !== void 0) return e ? 1 : 2;
            if (b.usedContainerScopedDefaults) {
                b = b.containerScopedDefaults[a];
                if (b === 3) return 1;
                if (b === 2) return 2
            } else if (e = c.default,
                e !== void 0) return e ? 1 : 2
        }
        e = d.declare;
        if (e !== void 0) return e ? 1 : 2;
        e = d.implicit;
        return e !== void 0 ? e ? 3 : 4 : 0
    };
    n.addListener = function(a, b) {
        this.v.push({
            consentTypes: a,
            Da: b
        })
    };

    function oc(a, b) {
        for (var c = 0; c < a.v.length; ++c) {
            var d = a.v[c];
            Array.isArray(d.consentTypes) && d.consentTypes.indexOf(b) !== -1 && (d.aa = !0)
        }
    }
    n.notifyListeners = function(a, b) {
        for (var c = 0; c < this.v.length; ++c) {
            var d = this.v[c];
            if (d.aa) {
                d.aa = !1;
                try {
                    d.Da({
                        consentEventId: a,
                        consentPriorityId: b
                    })
                } catch (e) {}
            }
        }
    };
    var pc = {},
        qc = {
            delegatedConsentTypes: {},
            corePlatformServices: {},
            usedCorePlatformServices: !1,
            selectedAllCorePlatformServices: !1,
            containerScopedDefaults: (pc.ad_storage = 1, pc.analytics_storage = 1, pc.ad_user_data = 1, pc.ad_personalization = 1, pc),
            usedContainerScopedDefaults: !1
        };

    function rc(a) {
        var b = lc();
        b.accessedAny = !0;
        return (Eb(a) ? [a] : a).every(function(c) {
            switch (b.getConsentState(c, qc)) {
                case 1:
                case 3:
                    return !0;
                case 2:
                case 4:
                    return !1;
                default:
                    return !0
            }
        })
    }

    function sc(a) {
        var b = lc();
        b.accessedAny = !0;
        return !(q(b, "entries")[a] || {}).quiet
    }

    function tc(a, b) {
        lc().addListener(a, b)
    }

    function uc(a, b) {
        function c() {
            for (var e = 0; e < b.length; e++)
                if (!sc(b[e])) return !0;
            return !1
        }
        if (c()) {
            var d = !1;
            tc(b, function(e) {
                d || c() || (d = !0, a(e))
            })
        } else a({})
    }

    function vc(a, b) {
        function c() {
            for (var g = [], h = 0; h < e.length; h++) {
                var k = e[h];
                rc(k) && !f[k] && g.push(k)
            }
            return g
        }

        function d(g) {
            for (var h = 0; h < g.length; h++) f[g[h]] = !0
        }
        var e = Eb(b) ? [b] : b,
            f = {};
        b = c();
        b.length !== e.length && (d(b), tc(e, function(g) {
            function h(m) {
                m.length !== 0 && (d(m), g.consentTypes = m, a(g))
            }
            var k = c();
            if (k.length !== 0) {
                var l = q(Object, "keys").call(Object, f).length;
                k.length + l >= e.length ? h(k) : I.setTimeout(function() {
                    h(c())
                }, 500)
            }
        }))
    };
    var wc = /:[0-9]+$/,
        xc = /^\d+\.fls\.doubleclick\.net$/;

    function yc(a, b) {
        var c = {};
        a = u(a.split("&"));
        for (var d = a.next(); !d.done; d = a.next()) {
            var e = u(d.value.split("="));
            d = e.next().value;
            for (var f, g = []; !(f = e.next()).done;) g.push(f.value);
            e = g;
            d = decodeURIComponent(d.replace(/\+/g, " "));
            if (b === void 0 || d === b) e = e.join("="), c[d] || (c[d] = []), c[d].push(decodeURIComponent(e.replace(/\+/g, " ")))
        }
        var h;
        return (h = c[b]) == null ? void 0 : h[0]
    }

    function M(a, b, c, d, e) {
        b && (b = String(b).toLowerCase());
        if (b === "protocol" || b === "port") a.protocol = zc(a.protocol) || zc(I.location.protocol);
        b === "port" ? a.port = String(Number(a.hostname ? a.port : I.location.port) || (a.protocol === "http" ? 80 : a.protocol === "https" ? 443 : "")) : b === "host" && (a.hostname = (a.hostname || I.location.hostname).replace(wc, "").toLowerCase());
        var f = zc(a.protocol);
        b && (b = String(b).toLowerCase());
        switch (b) {
            case "url_no_fragment":
                d = "";
                a && a.href && (d = a.href.indexOf("#"), d = d < 0 ? a.href : a.href.substring(0, d));
                a = d;
                break;
            case "protocol":
                a = f;
                break;
            case "host":
                a = a.hostname.replace(wc, "").toLowerCase();
                c && (d = /^www\d*\./.exec(a)) && d[0] && (a = a.substring(d[0].length));
                break;
            case "port":
                a = String(Number(a.port) || (f === "http" ? 80 : f === "https" ? 443 : ""));
                break;
            case "path":
                a.pathname || a.hostname || G(1);
                a = a.pathname.charAt(0) === "/" ? a.pathname : "/" + a.pathname;
                a = a.split("/");
                (d || []).indexOf(a[a.length - 1]) >= 0 && (a[a.length - 1] = "");
                a = a.join("/");
                break;
            case "query":
                a = a.search.replace("?", "");
                e && (a = yc(a, e));
                break;
            case "extension":
                a =
                    a.pathname.split(".");
                a = a.length > 1 ? a[a.length - 1] : "";
                a = a.split("/")[0];
                break;
            case "fragment":
                a = a.hash.replace("#", "");
                break;
            default:
                a = a && a.href
        }
        return a
    }

    function zc(a) {
        return a ? a.replace(":", "").toLowerCase() : ""
    }
    var Ac = {},
        Bc = 0;

    function Cc(a) {
        var b = Ac[a];
        if (!b) {
            b = J.createElement("a");
            a && (b.href = a);
            var c = b.pathname;
            c[0] !== "/" && (a || G(1), c = "/" + c);
            var d = b.hostname.replace(wc, "");
            b = {
                href: b.href,
                protocol: b.protocol,
                host: b.host,
                hostname: d,
                pathname: c,
                search: b.search,
                hash: b.hash,
                port: b.port
            };
            Bc < 5 && (Ac[a] = b, Bc++)
        }
        return b
    };

    function Dc(a, b, c, d) {
        var e, f = Number(a.U != null ? a.U : void 0);
        f !== 0 && (e = new Date((b || H()) + 1E3 * (f || 7776E3)));
        return {
            path: a.path,
            domain: a.domain,
            flags: a.flags,
            encode: !!c,
            expires: e,
            J: d
        }
    };
    var Ec = ["ad_storage", "ad_user_data"];

    function Fc(a) {
        if (!a) return G(27), {
            error: 10
        };
        var b = Gc();
        if (b.error !== 0) return G(29), b;
        if (!b.value) return G(30), {
            error: 2
        };
        if (!(a in b.value)) return G(31), {
            value: void 0,
            error: 15
        };
        a = b.value[a];
        return a === null || a === void 0 || a === "" ? (G(28), {
            value: void 0,
            error: 11
        }) : {
            value: a,
            error: 0
        }
    }

    function Gc(a) {
        a = a === void 0 ? !0 : a;
        if (!rc(Ec)) return G(43), {
            error: 3
        };
        try {
            if (!I.localStorage) return G(44), {
                error: 1
            }
        } catch (f) {
            return G(45), {
                error: 14
            }
        }
        var b = {
                schema: "gcl",
                version: 1
            },
            c = void 0;
        try {
            c = I.localStorage.getItem("_gcl_ls")
        } catch (f) {
            return G(46), {
                error: 13
            }
        }
        try {
            if (c) {
                var d = JSON.parse(c);
                if (d && typeof d === "object") b = d;
                else return G(47), {
                    error: 12
                }
            }
        } catch (f) {
            return G(48), {
                error: 8
            }
        }
        if (b.schema !== "gcl") return G(49), {
            error: 4
        };
        if (b.version !== 1) return G(50), {
            error: 5
        };
        try {
            var e = Hc(b);
            a && e && Ic({
                value: b,
                error: 0
            })
        } catch (f) {
            return G(48), {
                error: 8
            }
        }
        return {
            value: b,
            error: 0
        }
    }

    function Hc(a) {
        if (!a || typeof a !== "object") return !1;
        if ("expires" in a && "value" in a) {
            var b;
            typeof a.expires === "number" ? b = a.expires : b = typeof a.expires === "string" ? Number(a.expires) : NaN;
            if (isNaN(b) || !(Date.now() <= b)) return a.value = null, a.error = 9, G(54), !0
        } else {
            b = !1;
            for (var c = u(q(Object, "keys").call(Object, a)), d = c.next(); !d.done; d = c.next()) b = Hc(a[d.value]) || b;
            return b
        }
        return !1
    }

    function Ic(a) {
        if (a.error) return a.error;
        if (!a.value) return G(42), 2;
        a = a.value;
        try {
            var b = JSON.stringify(a)
        } catch (c) {
            return G(52), 6
        }
        try {
            I.localStorage.setItem("_gcl_ls", b)
        } catch (c) {
            return G(53), 7
        }
        return 0
    };
    var N = {
            T: "value",
            G: "conversionCount"
        },
        Jc = [N, {
            Z: 10,
            ba: 11,
            T: "timeouts",
            G: "timeouts"
        }];

    function Kc(a) {
        return rc(["ad_storage", "ad_user_data"]) ? !a.ba || L(a.ba) : !1
    }

    function Lc(a) {
        return rc(["ad_storage", "ad_user_data"]) ? !a.Z || L(a.Z) : !1
    };
    var P = {
        m: {
            ua: 0,
            da: 1,
            ga: 2,
            ia: 3,
            ja: 4,
            ea: 5,
            fa: 6,
            ka: 7,
            la: 8,
            oa: 9,
            ma: 10,
            na: 11,
            pa: 12,
            qa: 13,
            ra: 14,
            ta: 15,
            sa: 16,
            va: 17,
            wa: 18,
            xa: 19,
            ya: 20,
            za: 21,
            Aa: 22,
            O: 23,
            Y: 24
        }
    };
    P.m[P.m.ua] = "RESERVED_ZERO";
    P.m[P.m.da] = "ADS_CONVERSION_HIT";
    P.m[P.m.ga] = "CONTAINER_EXECUTE_START";
    P.m[P.m.ia] = "CONTAINER_SETUP_END";
    P.m[P.m.ja] = "CONTAINER_SETUP_START";
    P.m[P.m.ea] = "CONTAINER_BLOCKING_END";
    P.m[P.m.fa] = "CONTAINER_EXECUTE_END";
    P.m[P.m.ka] = "CONTAINER_YIELD_END";
    P.m[P.m.la] = "CONTAINER_YIELD_START";
    P.m[P.m.oa] = "EVENT_EXECUTE_END";
    P.m[P.m.ma] = "EVENT_EVALUATION_END";
    P.m[P.m.na] = "EVENT_EVALUATION_START";
    P.m[P.m.pa] = "EVENT_SETUP_END";
    P.m[P.m.qa] = "EVENT_SETUP_START";
    P.m[P.m.ra] = "GA4_CONVERSION_HIT";
    P.m[P.m.ta] = "PAGE_LOAD";
    P.m[P.m.sa] = "PAGEVIEW";
    P.m[P.m.va] = "SNIPPET_LOAD";
    P.m[P.m.wa] = "TAG_CALLBACK_ERROR";
    P.m[P.m.xa] = "TAG_CALLBACK_FAILURE";
    P.m[P.m.ya] = "TAG_CALLBACK_SUCCESS";
    P.m[P.m.za] = "TAG_EXECUTE_END";
    P.m[P.m.Aa] = "TAG_EXECUTE_START";
    P.m[P.m.O] = "CUSTOM_PERFORMANCE_START";
    P.m[P.m.Y] = "CUSTOM_PERFORMANCE_END";
    var Mc = [],
        Nc = {};

    function Oc(a, b, c) {
        function d(k) {
            return L(12) ? k.trim() : k.replace(/^\s*|\s*$/g, "")
        }
        var e = [];
        b = b.split(";");
        for (var f = 0; f < b.length; f++) {
            var g = b[f].split("="),
                h = d(g[0]);
            h && h === a && ((g = d(g.slice(1).join("="))) && c && (g = decodeURIComponent(g)), e.push(g))
        }
        return e
    };

    function Pc(a, b, c, d) {
        if (!Qc(d)) return [];
        if (q(Mc, "includes").call(Mc, "1")) {
            var e;
            (e = I.performance || void 0) == null || e.mark("1-" + P.m.O + "-" + (Nc["1"] || 0))
        }
        a = Oc(a, String(b || Rc()), c);
        if (q(Mc, "includes").call(Mc, "1")) {
            b = "1-" + P.m.Y + "-" + (Nc["1"] || 0);
            c = {
                start: "1-" + P.m.O + "-" + (Nc["1"] || 0),
                end: b
            };
            var f;
            (f = I.performance || void 0) == null || f.mark(b);
            var g, h;
            ((h = (g = I.performance || void 0) == null ? void 0 : g.measure(b, c)) == null ? void 0 : h.duration) !== void 0 && (Nc["1"] = (Nc["1"] || 0) + 1)
        }
        return a
    }

    function Sc(a, b, c) {
        var d = Tc,
            e = ["ad_storage", "ad_user_data"];
        if (Qc(e)) {
            a = Uc(a, d, e);
            if (a.length === 1) return a[0];
            if (a.length !== 0) {
                a = Vc(a, function(f) {
                    return f.Ca
                }, b);
                if (a.length === 1) return a[0];
                a = Vc(a, function(f) {
                    return f.Ha
                }, c);
                return a[0]
            }
        }
    }

    function Wc(a, b, c, d) {
        var e = Rc(),
            f = window;
        f.origin !== "null" && (f.document.cookie = a);
        a = Rc();
        return e !== a || c !== void 0 && Pc(b, a, !1, d).indexOf(c) >= 0
    }

    function Xc(a, b, c) {
        function d(r, x, y) {
            if (y == null) return delete g[x], r;
            g[x] = y;
            return r + "; " + x + "=" + y
        }

        function e(r, x) {
            if (x == null) return r;
            g[x] = !0;
            return r + "; " + x
        }
        if (Qc(c.J)) {
            if (b == null) var f = a + "=deleted; expires=" + (new Date(0)).toUTCString();
            else c.encode && (b = encodeURIComponent(b)), b = Yc(b), f = a + "=" + b;
            var g = {};
            f = d(f, "path", c.path);
            if (c.expires instanceof Date) var h = c.expires.toUTCString();
            else c.expires != null && (h = c.expires);
            f = d(f, "expires", h);
            f = d(f, "max-age", c.Za);
            f = d(f, "samesite", c.ab);
            c.bb && (f = e(f, "secure"));
            if ((h = c.domain) && h.toLowerCase() === "auto") {
                h = Zc();
                for (var k = 0; k < h.length; ++k) {
                    var l = h[k] !== "none" ? h[k] : void 0,
                        m = d(f, "domain", l);
                    m = e(m, c.flags);
                    if (!$c(l, c.path) && Wc(m, a, b, c.J)) break
                }
            } else h && h.toLowerCase() !== "none" && (f = d(f, "domain", h)), f = e(f, c.flags), $c(h, c.path) || Wc(f, a, b, c.J)
        }
    }

    function ad(a, b, c) {
        c.path == null && (c.path = "/");
        c.domain || (c.domain = "auto");
        Xc(a, b, c)
    }

    function Vc(a, b, c) {
        for (var d = [], e = [], f, g = 0; g < a.length; g++) {
            var h = a[g],
                k = b(h);
            k === c ? d.push(h) : f === void 0 || k < f ? (e = [h], f = k) : k === f && e.push(h)
        }
        return d.length > 0 ? d : e
    }

    function Uc(a, b, c) {
        var d = [];
        a = Pc(a, void 0, void 0, c);
        for (c = 0; c < a.length; c++) {
            var e = a[c].split("."),
                f = e.shift();
            if (!b || !f || b.indexOf(f) !== -1)
                if (f = e.shift()) f = f.split("-"), d.push({
                    Ya: a[c],
                    Ba: e.join("."),
                    Ca: Number(f[0]) || 1,
                    Ha: Number(f[1]) || 1
                })
        }
        return d
    }

    function Yc(a) {
        a && a.length > 1200 && (a = a.substring(0, 1200));
        return a
    }
    var bd = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/,
        cd = /(^|\.)doubleclick\.net$/i;

    function $c(a, b) {
        return a !== void 0 && (cd.test(window.document.location.hostname) || b === "/" && bd.test(a))
    }

    function dd(a) {
        if (!a) return 1;
        var b = a;
        L(7) && a === "none" && (b = window.document.location.hostname);
        b = b.indexOf(".") === 0 ? b.substring(1) : b;
        return b.split(".").length
    }

    function ed(a) {
        if (!a || a === "/") return 1;
        a[0] !== "/" && (a = "/" + a);
        a[a.length - 1] !== "/" && (a += "/");
        return a.split("/").length - 1
    }

    function fd(a, b) {
        a = "" + dd(a);
        b = ed(b);
        b > 1 && (a += "-" + b);
        return a
    }

    function Rc() {
        return window.origin !== "null" ? window.document.cookie : ""
    }

    function Qc(a) {
        return a && L(8) ? (Array.isArray(a) ? a : [a]).every(function(b) {
            return sc(b) && rc(b)
        }) : !0
    }

    function Zc() {
        var a = [],
            b = window.document.location.hostname.split(".");
        if (b.length === 4) {
            var c = b[b.length - 1];
            if (Number(c).toString() === c) return ["none"]
        }
        for (c = b.length - 2; c >= 0; c--) a.push(b.slice(c).join("."));
        b = window.document.location.hostname;
        cd.test(b) || bd.test(b) || a.push("none");
        return a
    };
    var Tc = ["1"],
        gd = {},
        hd = {};

    function id(a, b) {
        (b === void 0 ? 0 : b) && Kc(N) && (b = Gc(!1), b.error !== 0 ? G(38) : b.value ? "gcl_ctr" in b.value ? (delete b.value.gcl_ctr, Ic(b) !== 0 && G(41)) : G(40) : G(39));
        if (b = Lc(N)) {
            var c = [N];
            b: {
                b = Fc("gcl_ctr");
                if (b.error === 0 && b.value && typeof b.value === "object") {
                    b = b.value;
                    try {
                        var d = "value" in b && typeof b.value === "object" ? b.value : void 0;
                        break b
                    } catch (h) {}
                }
                d = void 0
            }
            b = {};
            c = u(c);
            for (var e = c.next(); !e.done; e = c.next())
                if (e = e.value, d && Kc(e)) {
                    var f = d[e.T];
                    f === void 0 || q(Number, "isNaN").call(Number, f) ? b[e.G] = -1 : b[e.G] = Number(f)
                } else b[e.G] = -1;
            b = b[N.G] === -1
        }
        if (b) {
            d = {};
            d = (d[N.G] = 0, d);
            b = u(Jc);
            for (c = b.next(); !c.done; c = b.next()) c = c.value, c !== N && Lc(c) && (d[c.G] = 0);
            b = H();
            a = Dc(a || {}, b, !0);
            c = {};
            e = u(Jc);
            for (f = e.next(); !f.done; f = e.next()) {
                f = f.value;
                var g = d[f.G];
                g !== void 0 && g !== -1 && (c[f.T] = g)
            }
            c.creationTimeMs = b;
            a = {
                value: c,
                expires: Number(a.expires)
            };
            a === null || a === void 0 || a === "" ? G(33) : (d = Gc(!1), d.error !== 0 ? G(34) : d.value ? (d.value.gcl_ctr = a, Ic(d) !== 0 && G(36)) : G(35))
        }
    }

    function jd(a, b, c, d) {
        b = ["1", fd(c.domain, c.path), b].join(".");
        c = Dc(c, d);
        c.J = ["ad_storage", "ad_user_data"];
        ad(a, b, c)
    }

    function kd(a, b, c) {
        var d;
        b = (d = Sc(a, dd(b), ed(c))) == null ? void 0 : d.Ba;
        if (!b) return !1;
        d = b.split(".");
        d.length === 5 ? (gd[a] = d.slice(0, 2).join("."), hd[a] = {
            id: d.slice(2, 4).join("."),
            R: Number(d[4]) || 0
        }) : d.length === 3 ? hd[a] = {
            id: d.slice(0, 2).join("."),
            R: Number(d[2]) || 0
        } : gd[a] = b;
        return !0
    }

    function ld(a) {
        return (a || "_gcl") + "_au"
    };

    function md(a, b, c) {
        a = nd(a, !0);
        if (a[b]) return !1;
        a[b] = [];
        a[b][0] = c;
        return !0
    }

    function nd(a, b) {
        var c = a.GooglebQhCsO;
        c || (c = {}, b && (a.GooglebQhCsO = c));
        return c
    };
    var od = {},
        pd = null;

    function qd(a) {
        for (var b = [], c = 0, d = 0; d < a.length; d++) {
            var e = a.charCodeAt(d);
            e > 255 && (b[c++] = e & 255, e >>= 8);
            b[c++] = e
        }
        a = 4;
        a === void 0 && (a = 0);
        if (!pd)
            for (pd = {}, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), d = ["+/=", "+/", "-_=", "-_.", "-_"], e = 0; e < 5; e++) {
                var f = c.concat(d[e].split(""));
                od[e] = f;
                for (var g = 0; g < f.length; g++) {
                    var h = f[g];
                    pd[h] === void 0 && (pd[h] = g)
                }
            }
        a = od[a];
        c = Array(Math.floor(b.length / 3));
        d = a[64] || "";
        for (e = f = 0; f < b.length - 2; f += 3) {
            var k = b[f],
                l = b[f + 1];
            h = b[f + 2];
            g = a[k >> 2];
            k = a[(k &
                3) << 4 | l >> 4];
            l = a[(l & 15) << 2 | h >> 6];
            h = a[h & 63];
            c[e++] = g + k + l + h
        }
        g = 0;
        h = d;
        switch (b.length - f) {
            case 2:
                g = b[f + 1], h = a[(g & 15) << 2] || d;
            case 1:
                b = b[f], c[e] = a[b >> 2] + a[(b & 3) << 4 | g >> 4] + h + d
        }
        return c.join("")
    };
    var rd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");

    function sd(a) {
        var b = a.match(rd);
        a = b[5];
        var c = b[6];
        b = b[7];
        var d = "";
        a && (d += a);
        c && (d += "?" + c);
        b && (d += "#" + b);
        return d
    }

    function Vd(a, b, c, d) {
        for (var e = c.length;
            (b = a.indexOf(c, b)) >= 0 && b < d;) {
            var f = a.charCodeAt(b - 1);
            if (f == 38 || f == 63)
                if (f = a.charCodeAt(b + e), !f || f == 61 || f == 38 || f == 35) return b;
            b += e + 1
        }
        return -1
    }
    var $d = /#|$/;

    function ae(a, b) {
        var c = a.search($d),
            d = Vd(a, 0, b, c);
        if (d < 0) return null;
        var e = a.indexOf("&", d);
        if (e < 0 || e > c) e = c;
        d += b.length + 1;
        return decodeURIComponent(a.slice(d, e !== -1 ? e : 0).replace(/\+/g, " "))
    }
    var be = /[?&]($|#)/;

    function ce(a, b, c) {
        for (var d = a.search($d), e = 0, f, g = [];
            (f = Vd(a, e, b, d)) >= 0;) g.push(a.substring(e, f)), e = Math.min(a.indexOf("&", f) + 1 || d, d);
        g.push(a.slice(e));
        a = g.join("").replace(be, "$1");
        c = c != null ? "=" + encodeURIComponent(String(c)) : "";
        (b += c) ? (c = a.indexOf("#"), c < 0 && (c = a.length), d = a.indexOf("?"), d < 0 || d > c ? (d = c, e = "") : e = a.substring(d + 1, c), c = [a.slice(0, d), e, a.slice(c)], a = c[1], c[1] = b ? a ? a + "&" + b : b : a, b = c[0] + (c[1] ? "?" + c[1] : "") + c[2]) : b = a;
        return b
    };

    function de(a, b, c, d, e, f) {
        var g = ae(c, "fmt");
        if (d) {
            var h = ae(c, "random"),
                k = ae(c, "label") || "";
            if (!h) return !1;
            h = qd(decodeURIComponent(k.replace(/\+/g, " ")) + ":" + decodeURIComponent(h.replace(/\+/g, " ")));
            if (!md(a, h, d)) return !1
        }
        g && Number(g) !== 4 && (c = ce(c, "rfmt", g));
        c = ce(c, "fmt", 4);
        $b(c, function() {
            a.google_noFurtherRedirects && d && (a.google_noFurtherRedirects = null, d())
        }, e, f, b.getElementsByTagName("script")[0].parentElement || void 0);
        return !0
    };
    var Q = {},
        ee = (Q.k = {
            B: /^[\w-]+$/
        }, Q.b = {
            B: /^[\w-]+$/,
            V: !0
        }, Q.i = {
            B: /^[1-9]\d*$/
        }, Q.h = {
            B: /^\d+$/
        }, Q.t = {
            B: /^[1-9]\d*$/
        }, Q.d = {
            B: /^[A-Za-z0-9_-]+$/
        }, Q.j = {
            B: /^\d+$/
        }, Q.u = {
            B: /^[1-9]\d*$/
        }, Q.l = {
            B: /^[01]$/
        }, Q.o = {
            B: /^[1-9]\d*$/
        }, Q.g = {
            B: /^[01]$/
        }, Q.s = {
            B: /^.+$/
        }, Q);
    var fe = {},
        je = (fe[5] = {
            X: {
                2: ge
            },
            S: "2",
            L: ["k", "i", "b", "u"]
        }, fe[4] = {
            X: {
                2: ge,
                GCL: he
            },
            S: "2",
            L: ["k", "i", "b"]
        }, fe[2] = {
            X: {
                GS2: ge,
                GS1: ie
            },
            S: "GS2",
            L: "sogtjlhd".split("")
        }, fe);

    function ge(a, b) {
        a = a.split(".");
        if (a.length === 3) {
            var c = a[2];
            if (c.indexOf("$") === -1 && c.indexOf("%24") !== -1) try {
                c = decodeURIComponent(c)
            } catch (h) {}
            a = {};
            if (b = je[b]) {
                b = b.L;
                c = u(c.split("$"));
                for (var d = c.next(); !d.done; d = c.next()) {
                    d = d.value;
                    var e = d[0];
                    if (b.indexOf(e) !== -1) try {
                        var f = decodeURIComponent(d.substring(1)),
                            g = ee[e];
                        g && (g.V ? (a[e] = a[e] || [], a[e].push(f)) : a[e] = f)
                    } catch (h) {}
                }
                return a
            }
        }
    }

    function he(a) {
        a = a.split(".");
        a.shift();
        var b = a.shift(),
            c = a.shift(),
            d = {};
        return d.k = c, d.i = b, d.b = a, d
    }

    function ie(a) {
        a = a.split(".").slice(2);
        if (!(a.length < 5 || a.length > 7)) {
            var b = {};
            return b.s = a[0], b.o = a[1], b.g = a[2], b.t = a[3], b.j = a[4], b.l = a[5], b.h = a[6], b
        }
    };

    function R() {
        this.value = 0
    }
    R.prototype.set = function(a) {
        return this.value |= 1 << a
    };

    function ke(a, b) {
        b <= 0 || (a.value |= 1 << b - 1)
    }
    R.prototype.get = function() {
        return this.value
    };

    function le(a) {
        var b = [],
            c = J.cookie.split(";");
        a = new RegExp("^\\s*" + (a || "_gac") + "_(UA-\\d+-\\d+)=\\s*(.+?)\\s*$");
        for (var d = 0; d < c.length; d++) {
            var e = c[d].match(a);
            e && b.push({
                W: e[1],
                value: e[2],
                timestamp: Number(e[2].split(".")[1]) || 0
            })
        }
        b.sort(function(f, g) {
            return g.timestamp - f.timestamp
        });
        return b
    }

    function me(a, b) {
        a = le(a);
        var c = {};
        if (!a || !a.length) return c;
        for (var d = 0; d < a.length; d++) {
            var e = a[d].value.split(".");
            if (!(e[0] !== "1" || b && e.length < 3 || !b && e.length !== 3) && Number(e[1])) {
                c[a[d].W] || (c[a[d].W] = []);
                var f = {
                    version: e[0],
                    timestamp: Number(e[1]) * 1E3,
                    A: e[2]
                };
                b && e.length > 3 && (f.labels = e.slice(3));
                c[a[d].W].push(f)
            }
        }
        return c
    };
    var ne = new p.Map([
        [5, "ad_storage"],
        [4, ["ad_storage", "ad_user_data"]],
        [2, "analytics_storage"]
    ]);

    function oe(a) {
        if (je[5]) {
            var b = [];
            a = Pc(a, void 0, void 0, ne.get(5));
            a = u(a);
            for (var c = a.next(); !c.done; c = a.next()) {
                a: {
                    c = c.value;
                    var d = je[5];
                    if (d) {
                        var e = c.split(".")[0];
                        if (e && (d = d.X[e])) {
                            c = d(c, 5);
                            break a
                        }
                    }
                    c = void 0
                }
                c && b.push(pe(c))
            }
            return b
        }
    }

    function qe(a, b, c, d) {
        c = c || {};
        var e = je[5];
        if (e) {
            e = e.S;
            var f = fd(c.domain, c.path) || "1";
            var g = je[5];
            if (g) {
                var h = [];
                g = u(g.L);
                for (var k = g.next(); !k.done; k = g.next()) {
                    k = k.value;
                    var l = ee[k];
                    if (l) {
                        var m = b[k];
                        if (m !== void 0)
                            if (l.V && Array.isArray(m))
                                for (l = u(m), m = l.next(); !m.done; m = l.next()) h.push(encodeURIComponent(k + m.value));
                            else h.push(encodeURIComponent(k + m))
                    }
                }
                b = h.join("$")
            } else b = void 0;
            b = [e, f, b].join(".")
        } else b = void 0;
        b && (c = Dc(c, d, void 0, ne.get(5)), ad(a, b, c))
    }

    function re(a, b) {
        b = b.B;
        return typeof b === "function" ? b(a) : b.test(a)
    }

    function pe(a) {
        for (var b = u(q(Object, "keys").call(Object, a)), c = b.next(), d = {}; !c.done; d = {
                K: void 0
            }, c = b.next()) {
            c = c.value;
            var e = a[c];
            d.K = ee[c];
            d.K ? d.K.V ? a[c] = Array.isArray(e) ? e.filter(function(f) {
                return function(g) {
                    return re(g, f.K)
                }
            }(d)) : void 0 : typeof e === "string" && re(e, d.K) || (a[c] = void 0) : a[c] = void 0
        }
        return a
    };
    var se = /^\w+$/,
        S = /^[\w-]+$/,
        V = {},
        te = (V.aw = "_aw", V.dc = "_dc", V.gf = "_gf", V.gp = "_gp", V.gs = "_gs", V.ha = "_ha", V.ag = "_ag", V.gb = "_gb", V);

    function W() {
        return ["ad_storage", "ad_user_data"]
    }

    function X(a) {
        return !L(8) || rc(a)
    }

    function ue(a) {
        function b() {
            var d = X(c);
            d && a();
            return d
        }
        var c = W();
        uc(function() {
            b() || vc(b, c)
        }, c)
    }

    function ve(a) {
        return Y(a).map(function(b) {
            return b.A
        })
    }

    function we(a) {
        function b(d) {
            return function(e) {
                e.type = d;
                return e
            }
        }
        var c = xe(a.prefix);
        a = ye("gb", c);
        c = ye("ag", c);
        if (!c || !a) return [];
        a = Y(a).map(b("gb"));
        c = ze(c).map(b("ag"));
        return a.concat(c).sort(function(d, e) {
            return e.timestamp - d.timestamp
        })
    }

    function Ae(a, b, c, d, e, f) {
        var g = Fb(a, function(h) {
            return h.A === c
        });
        g ? (g.timestamp < d && (g.timestamp = d, g.I = f), g.labels = Be(g.labels || [], e || [])) : a.push({
            version: b,
            A: c,
            timestamp: d,
            labels: e,
            I: f
        })
    }

    function ze(a) {
        var b = oe(a) || [];
        a = [];
        b = u(b);
        for (var c = b.next(); !c.done; c = b.next()) {
            var d = c = c.value,
                e = c ? (Number(c.i) || 0) * 1E3 : 0;
            e && Ae(a, "2", d.k, e, d.b || [], c.u)
        }
        return a.sort(function(f, g) {
            return g.timestamp - f.timestamp
        })
    }

    function Y(a) {
        var b = [];
        a = Pc(a, J.cookie, void 0, W());
        a = u(a);
        for (var c = a.next(); !c.done; c = a.next()) c = Ce(c.value), c != null && Ae(b, c.version, c.A, c.timestamp, c.labels);
        b.sort(function(d, e) {
            return e.timestamp - d.timestamp
        });
        return De(b)
    }

    function Ee(a, b) {
        var c = [];
        a = u(a);
        for (var d = a.next(); !d.done; d = a.next()) d = d.value, q(c, "includes").call(c, d) || c.push(d);
        b = u(b);
        for (a = b.next(); !a.done; a = b.next()) a = a.value, q(c, "includes").call(c, a) || c.push(a);
        return c
    }

    function Fe(a, b) {
        var c = c === void 0 ? !1 : c;
        for (var d, e, f = u(a), g = f.next(); !g.done; g = f.next()) {
            g = g.value;
            if (g.A === b.A) {
                d = g;
                break
            }
            g.C && b.C && g.C.value === b.C.value && (e = g)
        }
        if (d) {
            var h, k;
            a = (h = d.C) != null ? h : new R;
            h = (k = b.C) != null ? k : new R;
            a.value |= h.value;
            d.C = a;
            d.timestamp < b.timestamp && (d.timestamp = b.timestamp, d.I = b.I);
            d.labels = Ee(d.labels || [], b.labels || []);
            d.D = Ee(d.D || [], b.D || [])
        } else c && e ? q(Object, "assign").call(Object, e, b) : a.push(b)
    }

    function Ge() {
        var a = Fc("gclid");
        if (!a || a.error || !a.value || typeof a.value !== "object") return null;
        a = a.value;
        try {
            if (!("value" in a && a.value) || typeof a.value !== "object") return null;
            var b = a.value,
                c = b.value;
            if (!c || !c.match(S)) return null;
            var d = b.linkDecorationSource,
                e = b.linkDecorationSources,
                f = new R;
            if (typeof d === "number")
                if (d) {
                    var g = new R;
                    d === 1 ? (ke(g, 2), ke(g, 3)) : ke(g, d);
                    f = g
                } else f = new R;
            else typeof e === "number" && (f.value = e);
            return {
                version: "",
                A: c,
                timestamp: Number(b.creationTimeMs) || 0,
                labels: [],
                C: f,
                D: [2]
            }
        } catch (h) {
            return null
        }
    }

    function He() {
        var a = Fc("gcl_aw");
        if (a.error !== 0) return null;
        try {
            return a.value.reduce(function(b, c) {
                if (!c.value || typeof c.value !== "object") return b;
                var d = c.value,
                    e = d.value;
                if (!e || !e.match(S)) return b;
                var f = new R,
                    g = d.linkDecorationSources;
                typeof g === "number" && (f.value = g);
                b.push({
                    version: "",
                    A: e,
                    timestamp: Number(d.creationTimeMs) || 0,
                    expires: Number(c.expires) || 0,
                    labels: [],
                    C: f,
                    D: [2]
                });
                return b
            }, [])
        } catch (b) {
            return null
        }
    }

    function Ie(a) {
        var b = [];
        a = Pc(a, J.cookie, void 0, W());
        a = u(a);
        for (var c = a.next(); !c.done; c = a.next()) c = Ce(c.value), c != null && (c.I = void 0, c.C = new R, c.D = [1], Fe(b, c));
        if (a = Ge()) a.I = void 0, a.D = a.D || [2], Fe(b, a);
        if (L(14) && (a = He()))
            for (a = u(a), c = a.next(); !c.done; c = a.next()) c = c.value, c.I = void 0, c.D = c.D || [2], Fe(b, c);
        b.sort(function(d, e) {
            return e.timestamp - d.timestamp
        });
        return De(b)
    }

    function Be(a, b) {
        if (!a.length) return b;
        if (!b.length) return a;
        var c = {};
        return a.concat(b).filter(function(d) {
            return c.hasOwnProperty(d) ? !1 : c[d] = !0
        })
    }

    function xe(a) {
        return a && typeof a === "string" && a.match(se) ? a : "_gcl"
    }

    function Je(a, b) {
        var c = Cc(a);
        a = M(c, "query", !1, void 0, "gclid");
        var d = M(c, "query", !1, void 0, "gclsrc"),
            e = M(c, "query", !1, void 0, "wbraid");
        if (e) {
            var f = e;
            try {
                f = decodeURIComponent(e)
            } catch (k) {}
            f = f.split(",");
            e = f.length === 2 && f[0] === f[1] ? f[0] : e
        }
        f = M(c, "query", !1, void 0, "gbraid");
        var g = M(c, "query", !1, void 0, "gad_source"),
            h = M(c, "query", !1, void 0, "dclid");
        !b || a && d && e && f || (b = c.hash.replace("#", ""), a = a || yc(b, "gclid"), d = d || yc(b, "gclsrc"), e = e || yc(b, "wbraid"), f = f || yc(b, "gbraid"), g = g || yc(b, "gad_source"));
        return Ke(a,
            d, h, e, f, g)
    }

    function Ke(a, b, c, d, e, f) {
        function g(k, l) {
            h[l] || (h[l] = []);
            h[l].push(k)
        }
        var h = {};
        h.gclid = a;
        h.gclsrc = b;
        h.dclid = c;
        if (a !== void 0 && a.match(S)) switch (b) {
            case void 0:
                g(a, "aw");
                break;
            case "aw.ds":
                g(a, "aw");
                g(a, "dc");
                break;
            case "ds":
                g(a, "dc");
                break;
            case "3p.ds":
                g(a, "dc");
                break;
            case "gf":
                g(a, "gf");
                break;
            case "ha":
                g(a, "ha")
        }
        c && g(c, "dc");
        d !== void 0 && S.test(d) && (h.wbraid = d, g(d, "gb"));
        e !== void 0 && S.test(e) && (h.gbraid = e, g(e, "ag"));
        f !== void 0 && S.test(f) && (h.gad_source = f, g(f, "gs"));
        return h
    }

    function Le(a, b, c, d, e) {
        function f() {
            if (X(l)) {
                var x = Dc(c, h, !0);
                x.J = l;
                for (var y = function(D, na) {
                        var Wa = ye(D, g);
                        Wa && (ad(Wa, na, x), D !== "gb" && (m = !0))
                    }, E = function(D) {
                        D = ["GCL", k, D];
                        e.length > 0 && D.push(e.join("."));
                        return D.join(".")
                    }, ba = u(["aw", "dc", "gf", "ha", "gp"]), O = ba.next(); !O.done; O = ba.next()) O = O.value, a[O] && y(O, E(a[O][0]));
                if (!m && a.gb) {
                    var Xa = a.gb[0];
                    ba = ye("gb", g);
                    !b && Y(ba).some(function(D) {
                        return D.A === Xa && D.labels && D.labels.length > 0
                    }) || y("gb", E(Xa))
                }
            }
            if (!r && a.gbraid && X("ad_storage") && (r = !0, !m)) {
                var ca =
                    a.gbraid;
                y = ye("ag", g);
                if (b || !ze(y).some(function(D) {
                        return D.A === ca && D.labels && D.labels.length > 0
                    })) E = {}, E = (E.k = ca, E.i = "" + k, E.b = e, E), qe(y, E, c, h)
            }
            Me(a, g, h, c)
        }
        c = c || {};
        e = e || [];
        var g = xe(c.prefix),
            h = d || H(),
            k = Math.round(h / 1E3),
            l = W(),
            m = !1,
            r = !1;
        uc(function() {
            f();
            X(l) || vc(f, l)
        }, l)
    }

    function Me(a, b, c, d) {
        if (a.gad_source !== void 0 && X("ad_storage")) {
            if (L(4)) {
                var e = ec();
                if (e === "r" || e === "h") return
            }
            if (b = ye("gs", b)) {
                e = (e = I.performance) && Db(e.now) ? e.now() : void 0;
                e = Math.floor((H() - (e || 0)) / 1E3);
                var f = I.location.hostname;
                var g = I.location.pathname;
                f = Hb(f);
                f.split(".").length > 2 && (f = f.replace(/^(www[0-9]*|web|ftp|wap|home|m|w|amp|mobile)\./, ""));
                g = Hb(g);
                g = g.split(";")[0];
                g = g.replace(/\/(ar|slp|web|index)?\/?$/, "");
                g = (f + g).toLowerCase();
                f = 1;
                var h;
                if (g)
                    for (f = 0, h = g.length - 1; h >= 0; h--) {
                        var k = g.charCodeAt(h);
                        f = (f << 6 & 268435455) + k + (k << 14);
                        k = f & 266338304;
                        f = k !== 0 ? f ^ k >> 21 : f
                    }
                g = String(f);
                f = {};
                a = (f.k = a.gad_source, f.i = "" + e, f.u = g, f);
                qe(b, a, d, c)
            }
        }
    }

    function ye(a, b) {
        a = te[a];
        if (a !== void 0) return b + a
    }

    function Ne(a) {
        return Oe(a.split(".")).length !== 0 ? (Number(a.split(".")[1]) || 0) * 1E3 : 0
    }

    function Ce(a) {
        a = Oe(a.split("."));
        return a.length === 0 ? null : {
            version: a[0],
            A: a[2],
            timestamp: (Number(a[1]) || 0) * 1E3,
            labels: a.slice(3)
        }
    }

    function Oe(a) {
        return a.length < 3 || a[0] !== "GCL" && a[0] !== "1" || !/^\d+$/.test(a[1]) || !S.test(a[2]) ? [] : a
    }

    function De(a) {
        return a.filter(function(b) {
            return S.test(b.A)
        })
    }

    function Pe() {
        var a = ["aw"],
            b = {};
        if (I.origin !== "null") {
            for (var c = xe(b.prefix), d = {}, e = 0; e < a.length; e++) te[a[e]] && (d[a[e]] = te[a[e]]);
            ue(function() {
                Gb(d, function(f, g) {
                    g = Pc(c + g, J.cookie, void 0, W());
                    g.sort(function(m, r) {
                        return Ne(r) - Ne(m)
                    });
                    if (g.length) {
                        var h = g[0];
                        g = Ne(h);
                        var k = Oe(h.split(".")).length !== 0 ? h.split(".").slice(3) : [],
                            l = {};
                        h = Oe(h.split(".")).length !== 0 ? h.split(".")[2] : void 0;
                        l[f] = [h];
                        Le(l, !0, b, g, k)
                    }
                })
            })
        }
    }

    function Qe(a, b, c, d) {
        var e = [];
        c = c || {};
        if (!X(W())) return e;
        var f = Y(a);
        var g = [];
        if (f.length !== 0)
            for (var h = {}, k = 0; k < f.length; k++) {
                var l = f[k],
                    m = l.type ? l.type : "gcl";
                (l.labels || []).indexOf(b) === -1 ? (e.push(0), h[m] || g.push(l)) : e.push(1);
                h[m] = !0
            }
        if (g.length && !d)
            for (d = u(g), f = d.next(); !f.done; f = d.next()) g = f.value, f = g.timestamp, g = [g.version, Math.round(f / 1E3), g.A].concat(g.labels || [], [b]).join("."), f = Dc(c, f, !0), f.J = W(), ad(a, g, f);
        return e
    }

    function Re(a, b) {
        b = xe(b);
        b = ye(a, b);
        if (!b) return 0;
        a = a === "ag" ? ze(b) : Y(b);
        for (var c = b = 0; c < a.length; c++) b = Math.max(b, a[c].timestamp);
        return b
    }

    function Se(a) {
        for (var b = 0, c = u(q(Object, "keys").call(Object, a)), d = c.next(); !d.done; d = c.next()) {
            d = a[d.value];
            for (var e = 0; e < d.length; e++) b = Math.max(b, Number(d[e].timestamp))
        }
        return b
    };
    var Te = RegExp("^UA-\\d+-\\d+%3A[\\w-]+(?:%2C[\\w-]+)*(?:%3BUA-\\d+-\\d+%3A[\\w-]+(?:%2C[\\w-]+)*)*$"),
        Ue = /^~?[\w-]+(?:\.~?[\w-]+)*$/,
        Ve = /^\d+\.fls\.doubleclick\.net$/,
        We = /;gac=([^;?]+)/,
        Xe = /;gacgb=([^;?]+)/;

    function Ye(a, b, c) {
        if (Ve.test(a.location.host)) {
            if ((b = a.location.href.match(c)) && b.length === 2 && b[1].match(Te)) {
                a: {
                    try {
                        var d = decodeURIComponent(b[1]);
                        break a
                    } catch (h) {}
                    d = void 0
                }
                b = d || ""
            }
            else b = "";
            return b
        }
        d = [];
        a = u(q(Object, "keys").call(Object, b));
        for (c = a.next(); !c.done; c = a.next()) {
            c = c.value;
            for (var e = [], f = b[c], g = 0; g < f.length; g++) e.push(f[g].A);
            d.push(c + ":" + e.join(","))
        }
        return d.length > 0 ? d.join(";") : ""
    }

    function Ze(a, b, c, d) {
        for (var e = X(W()) ? me("_gac_gb", !0) : {}, f = [], g = !1, h = u(q(Object, "keys").call(Object, e)), k = h.next(); !k.done; k = h.next()) {
            k = k.value;
            var l = Qe("_gac_gb_" + k, b, c, d);
            g = g || l.length !== 0 && l.some(function(m) {
                return m === 1
            });
            f.push(k + ":" + l.join(","))
        }
        return {
            Fa: g ? f.join(";") : "",
            Ea: Ye(a, e, Xe)
        }
    }

    function $e(a, b) {
        return (a = a.location.href.match(new RegExp(";" + b + "=([^;?]+)"))) && a.length === 2 && a[1].match(Ue) ? a[1] : void 0
    }

    function af(a, b, c, d) {
        var e = e === void 0 ? !1 : e;
        if (Ve.test(a.location.host)) {
            if (a = $e(a, d)) {
                if (e) {
                    var f = new R;
                    ke(f, 2);
                    ke(f, 3);
                    return a.split(".").map(function(g) {
                        return {
                            A: g,
                            C: f,
                            D: [1]
                        }
                    })
                }
                return a.split(".").map(function(g) {
                    return {
                        A: g
                    }
                })
            }
        } else {
            if (c === "gclid") return a = (b || "_gcl") + "_aw", e ? Ie(a) : Y(a);
            if (c === "wbraid") return Y((b || "_gcl") + "_gb");
            if (c === "braids") return we({
                prefix: b
            })
        }
        return []
    }

    function bf(a, b) {
        return af(a, b, "gclid", "gclaw").map(function(c) {
            return c.A
        }).join(".")
    }

    function cf(a, b) {
        return af(a, b, "wbraid", "gclgb").map(function(c) {
            return c.A
        }).join(".")
    }

    function df(a, b) {
        var c = cf(a, b) !== "" || q(Object, "keys").call(Object, X(W()) ? me("_gac_gb", !0) : {}).length > 0;
        a = bf(a, b) !== "" || Ye(a, X(W()) ? me() : {}, We) !== "";
        return c && a
    }

    function ef(a) {
        if (ve("_gcl_aw").length === 0 && (!a || ve(a + "_aw").length === 0)) {
            a = Je(I.location.href, !0);
            for (var b = !0, c = u(q(Object, "keys").call(Object, a)), d = c.next(); !d.done; d = c.next())
                if (a[d.value] !== void 0) {
                    b = !1;
                    break
                }
            b && (a = Je(I.document.referrer, !1), a.gad_source = void 0);
            Le(a, !1, {});
            Pe()
        }
    }

    function ff(a, b, c) {
        a = Qe((b && b.prefix || "_gcl") + "_gb", a, b, c);
        return a.length === 0 || a.every(function(d) {
            return d === 0
        }) ? "" : a.join(".")
    };

    function gf() {
        var a = I.__uspapi;
        if (Db(a)) {
            var b = "";
            try {
                a("getUSPData", 1, function(c, d) {
                    d && c && (c = c.uspString) && RegExp("^[\\da-zA-Z-]{1,20}$").test(c) && (b = c)
                })
            } catch (c) {}
            return b
        }
    };
    var hf = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");

    function jf(a) {
        var b;
        return (b = a.google_tag_data) != null ? b : a.google_tag_data = {}
    }

    function kf(a) {
        a = a.google_tag_data;
        if (a != null && a.uach) {
            a = a.uach;
            var b = q(Object, "assign").call(Object, {}, a);
            a.fullVersionList && (b.fullVersionList = a.fullVersionList.slice(0));
            a = b
        } else a = null;
        return a
    }

    function lf(a) {
        var b, c;
        return typeof((b = a.navigator) == null ? void 0 : (c = b.userAgentData) == null ? void 0 : c.getHighEntropyValues) === "function"
    }

    function mf() {
        var a = window;
        if (lf(a)) {
            var b = jf(a);
            b.uach_promise || (a = a.navigator.userAgentData.getHighEntropyValues(hf).then(function(c) {
                b.uach != null || (b.uach = c);
                return c
            }), b.uach_promise = a)
        }
    };
    var nf = {
            id: !0,
            origin: !0,
            destination: !0,
            start_date: !0,
            end_date: !0,
            location_id: !0
        },
        of = /^[a-zA-Z0-9_]+$/,
        pf = !1,
        qf = "google_conversion_id google_conversion_format google_conversion_type google_conversion_order_id google_conversion_language google_conversion_value google_conversion_currency google_conversion_domain google_conversion_label google_conversion_color google_disable_viewthrough google_enable_display_cookie_match google_gtag_event_data google_remarketing_only google_conversion_linker google_tag_for_child_directed_treatment google_tag_for_under_age_of_consent google_allow_ad_personalization_signals google_restricted_data_processing google_conversion_items google_conversion_merchant_id google_user_id google_custom_params google_conversion_date google_conversion_time google_conversion_js_version onload_callback opt_image_generator google_gtm_url_processor google_conversion_page_url google_conversion_referrer_url google_gcl_cookie_prefix google_gcl_cookie_path google_gcl_cookie_flags google_gcl_cookie_domain google_gcl_cookie_max_age_seconds google_read_gcl_cookie_opt_out google_basket_feed_country google_basket_feed_language google_basket_discount google_basket_transaction_type google_additional_conversion_params google_additional_params google_transport_url google_gtm_experiments".split(" ");

    function rf(a, b) {
        var c = a;
        return function() {
            --c;
            c <= 0 && b()
        }
    }

    function sf(a) {
        return a != null ? encodeURIComponent(String(a)) : ""
    }

    function tf(a) {
        if (a != null) {
            a = String(a).substring(0, 512);
            var b = a.indexOf("#");
            return b == -1 ? a : a.substring(0, b)
        }
        return ""
    }

    function Z(a, b) {
        b = sf(b);
        return b != "" && (a = sf(a), a != "") ? "&".concat(a, "=", b) : ""
    }

    function uf(a) {
        var b = typeof a;
        return a == null || b == "object" || b == "function" ? null : String(a).replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/=/g, "\\=")
    }

    function vf(a) {
        if (!a || typeof a != "object" || typeof a.join == "function") return "";
        var b = [],
            c;
        for (c in a)
            if (Object.prototype.hasOwnProperty.call(a, c)) {
                var d = a[c];
                if (d && typeof d.join === "function") {
                    for (var e = [], f = 0; f < d.length; ++f) {
                        var g = uf(d[f]);
                        g != null && e.push(g)
                    }
                    d = e.length == 0 ? null : e.join(",")
                } else d = uf(d);
                (e = uf(c)) && d != null && b.push(e + "=" + d)
            }
        return b.join(";")
    }

    function wf(a) {
        return typeof a != "number" && typeof a != "string" ? "" : sf(a.toString())
    }

    function xf(a, b) {
        if (b.google_read_gcl_cookie_opt_out || b.google_remarketing_only || b.google_conversion_domain && (!b.google_gcl_cookie_prefix || !/^_ycl/.test(b.google_gcl_cookie_prefix))) return "";
        var c = "",
            d = yf(b),
            e = {};
        b.google_gcl_cookie_domain && (e.domain = b.google_gcl_cookie_domain);
        b.google_gcl_cookie_flags && (e.flags = b.google_gcl_cookie_flags);
        b.google_gcl_cookie_max_age_seconds != null && (e.U = b.google_gcl_cookie_max_age_seconds);
        b.google_gcl_cookie_path && (e.path = b.google_gcl_cookie_path);
        d && (e.prefix = d);
        if (zf(b) && b.M) var f = b.N === void 0;
        else Ve.test(a.location.host) ? f = !($e(a, "gclaw") || $e(a, "gac")) : (f = Math.max(Re("aw", d), Se(X(W()) ? me() : {})), f = Math.max(Re("gb", d), Se(X(W()) ? me("_gac_gb", !0) : {})) > f);
        if (f) {
            if (b.N !== void 0) return b.N;
            c = cf(a, d || void 0);
            f = b.google_conversion_label;
            var g = ff(f, e, b.M);
            c = Z("gclgb", c) + (g ? Z("mcov", g) : "");
            if (d) return b.N = c;
            d = Ze(a, f, e, b.M);
            a = d.Ea;
            d = d.Fa;
            c += (a ? Z("gacgb", a) : "") + (d ? Z("gacmcov", d) : "");
            return b.N = c
        }
        if (d) return b = bf(a, d), Z("gclaw", b);
        (b = bf(a)) && (c = Z("gclaw", b));
        b = Ye(a,
            X(W()) ? me() : {}, We);
        return c + (b ? Z("gac", b) : "")
    }

    function Af(a) {
        function b(d) {
            try {
                return decodeURIComponent(d), !0
            } catch (e) {
                return !1
            }
        }
        a = a ? a.title : "";
        if (a == void 0 || a == "") return "";
        a = encodeURIComponent(a);
        for (var c = 256; !b(a.substr(0, c));) c--;
        return "&tiba=" + a.substr(0, c)
    }

    function Bf(a, b, c, d, e, f) {
        var g = "https://",
            h = d.google_conversion_type === "landing" ? "/extclk" : "/";
        switch (e) {
            default: return "";
            case 2:
                    case 3:
                    var k = "googleads.g.doubleclick.net/";
                var l = "pagead/viewthroughconversion/";
                break;
            case 1:
                    k = "www.google.com/";l = "pagead/1p-conversion/";
                break;
            case 6:
                    k = "www.google.com/";l = "ccm/conversion/";
                break;
            case 0:
                    k = d.google_conversion_domain || "www.googleadservices.com/";l = "pagead/conversion/";
                break;
            case 5:
                    k = d.google_conversion_domain || "www.googleadservices.com/";l = "ccm/conversion/";
                break;
            case 4:
                    var m = d.google_gtm_experiments;k = m && m.apcm ? "www.google.com" : m && m.capiorig ? d.google_conversion_id + ".privacysandbox.googleadservices.com" : "www.google.com/";l = "pagead/privacysandbox/conversion/";
                break;
            case 7:
                    k = "googleads.g.doubleclick.net/",
                l = "td/rul/"
        }
        fb && d.google_transport_url && (k = d.google_transport_url);
        k[k.length - 1] !== "/" && (k += "/");
        if (k.indexOf("http://") === 0 || k.indexOf("https://") === 0) g = "";
        var r = [g, k, l, sf(d.google_conversion_id), h, "?random=", sf(d.google_conversion_time)].join(""),
            x =
            r,
            y = Z("cv", d.google_conversion_js_version),
            E = Z("fst", d.google_conversion_first_time),
            ba = Z("num", d.google_conversion_snippets),
            O = Z("fmt", d.google_conversion_format),
            Xa = d.google_remarketing_only ? Z("userId", d.google_user_id) : "",
            ca = d.google_tag_for_child_directed_treatment;
        var D = ca == null || ca !== 0 && ca !== 1 ? "" : Z("tfcd", ca);
        var na = d.google_tag_for_under_age_of_consent;
        var Wa = na == null || na !== 0 && na !== 1 ? "" : Z("tfua", na);
        var td = d.google_allow_ad_personalization_signals;
        var Pf = td === !1 ? Z("npa", 1) : td === !0 ? Z("npa",
            0) : "";
        var ud = d.google_restricted_data_processing;
        var Qf = hb ? ud === !0 ? Z("rdp", 1) : ud === !1 ? Z("rdp", 0) : "" : "";
        var Rf = Z("value", d.google_conversion_value),
            Sf = Z("currency_code", d.google_conversion_currency),
            Tf = Z("label", d.google_conversion_label),
            Uf = Z("oid", d.google_conversion_order_id),
            Vf = Z("bg", d.google_conversion_color);
        a: {
            var vd = d.google_conversion_language;
            if (vd != null) {
                var Ca = vd.toString();
                if (2 == Ca.length) {
                    var Lb = Z("hl", Ca);
                    break a
                }
                if (5 == Ca.length) {
                    Lb = Z("hl", Ca.substring(0, 2)) + Z("gl", Ca.substring(3, 5));
                    break a
                }
            }
            Lb = ""
        }
        var Wf = Z("guid", "ON"),
            Xf = !d.google_conversion_domain && "GooglemKTybQhCsO" in w && typeof w.GooglemKTybQhCsO == "function" ? Z("resp", "GooglemKTybQhCsO") : "",
            Yf = Z("disvt", d.google_disable_viewthrough),
            Zf = Z("eid", nb().join()),
            Mb = d.google_conversion_date,
            K = [];
        if (a) {
            var pa = a.screen;
            pa && (K.push(Z("u_h", pa.height)), K.push(Z("u_w", pa.width)), kb && (K.push(Z("u_ah", pa.availHeight)), K.push(Z("u_aw", pa.availWidth)), K.push(Z("u_cd", pa.colorDepth))));
            a.history && kb && K.push(Z("u_his", a.history.length))
        }
        Mb &&
            typeof Mb.getTimezoneOffset == "function" && kb && K.push(Z("u_tz", -Mb.getTimezoneOffset()));
        b && kb && (typeof b.javaEnabled == "function" && K.push(Z("u_java", b.javaEnabled())), b.plugins && K.push(Z("u_nplug", b.plugins.length)), b.mimeTypes && K.push(Z("u_nmime", b.mimeTypes.length)));
        var $f = K.join("");
        var ag = b && b.sendBeacon ? Z("sendb", "1") : "",
            cg = Cf(),
            dg = Z("ig", /googleadservices\.com/.test("www.googleadservices.com") ? 1 : 0),
            wd = vf(d.google_custom_params),
            xd = vf(f),
            yd = wd.concat(wd.length > 0 && xd.length > 0 ? ";" : "", xd);
        var eg = yd == "" ?
            "" : "&".concat("data=", encodeURIComponent(yd));
        var fg = xf(c, d);
        if (!C || F(23) != "658953496" && F(23) != "658953495" || d.google_read_gcl_cookie_opt_out || d.google_conversion_domain || d.google_remarketing_only) var zd = "";
        else {
            var Nb = yf(d),
                z = {};
            d.google_gcl_cookie_domain && (z.domain = d.google_gcl_cookie_domain);
            d.google_gcl_cookie_flags && (z.flags = d.google_gcl_cookie_flags);
            d.google_gcl_cookie_max_age_seconds != null && (z.U = d.google_gcl_cookie_max_age_seconds);
            d.google_gcl_cookie_path && (z.path = d.google_gcl_cookie_path);
            Nb && (z.prefix = Nb);
            var Da = !1;
            Da = Da === void 0 ? !0 : Da;
            var Za = ld(z.prefix);
            if (gd[Za]) id(z);
            else if (kd(Za, z.path, z.domain)) {
                var Ad = hd[ld(z.prefix)] || {
                    id: void 0,
                    R: void 0
                };
                if (Da) {
                    var Bd = Ad.id,
                        Cd = Ad.R,
                        Dd = ld(z.prefix),
                        $a = gd[Dd];
                    if ($a) {
                        var Ed = $a.split(".");
                        if (Ed.length === 2) {
                            var Fd = Number(Ed[1]) || 0;
                            if (Fd) {
                                var Gd = $a;
                                Bd && (Gd = $a + "." + Bd + "." + (Cd ? Cd : Math.floor(H() / 1E3)));
                                jd(Dd, Gd, z, Fd * 1E3)
                            }
                        }
                    }
                }
                id(z)
            } else {
                b: {
                    var Hd = Cc(I.location.href),
                        Id = M(Hd, "host", !1);
                    if (Id && Id.match(xc)) {
                        var Jd = M(Hd, "path");
                        if (Jd) {
                            var Kd = Jd.split("auiddc=");
                            if (Kd.length > 1) {
                                var Ld = Kd[1].split(";")[0].split("?")[0];
                                break b
                            }
                        }
                    }
                    Ld = void 0
                }
                var Md = Ld;Md ? (G(17), gd[Za] = Md) : Da && (jd(ld(z.prefix), [String(Math.round(Math.random() * 2147483647)), Math.round(H() / 1E3)].join("."), z), kd(Za, z.path, z.domain), id(z, !0))
            }
            var Nd = gd[ld(Nb)];
            zd = Nd ? Z("auid", Nd) : ""
        }
        var gg = zd,
            Od = d.google_conversion_page_url,
            hg = d.google_conversion_referrer_url,
            Ea = "";
        if (c) {
            if (a.top == a) var Pd = 0;
            else {
                var Ob = a.location.ancestorOrigins;
                Pd = Ob ? Ob[Ob.length - 1] == a.location.origin ? 1 : 2 : Oa(a.top) ? 1 : 2
            }
            var Qd = Pd;
            var Rd = Od ? Od : Qd == 1 ? a.top.location.href : a.location.href;
            var Sd = "";
            C && B(["509562772", "509562773"], cb, 21);
            if (C && (F(21) == "509562773" || F(21) == "509562772")) {
                for (var T, U = a, Td = U; U && U != U.parent;) U = U.parent, Oa(U) && (Td = U);
                T = Td;
                var Fa = T.location.href;
                if (T === T.top) var Ud = {
                    url: Fa,
                    Ga: !0
                };
                else {
                    var Pb = !1,
                        Qb = T.document;
                    Qb && Qb.referrer && (Fa = Qb.referrer, T.parent === T.top && (Pb = !0));
                    var Rb = T.location.ancestorOrigins;
                    if (Rb) {
                        var Sb = Rb[Rb.length - 1];
                        Sb && Fa.indexOf(Sb) === -1 && (Pb = !1, Fa = Sb)
                    }
                    Ud = {
                        url: Fa,
                        Ga: Pb
                    }
                }
                var Tb = Ud;
                Tb.url &&
                    Rd !== Tb.url && (Sd = Tb.url)
            }
            Ea += Z("frm", Qd);
            Ea += Z("url", tf(Rd));
            Ea += Z("ref", tf(hg || c.referrer));
            Ea += Z("top", tf(Sd))
        }
        var kg = [y, E, ba, O, Xa, D, Wa, Pf, Qf, Rf, Sf, Tf, Uf, Vf, Lb, Wf, Xf, Yf, Zf, $f, ag, cg, dg, eg, fg, gg, Ea, Af(c), Df(d.google_additional_params), Df(d.google_remarketing_only ? {} : d.google_additional_conversion_params), "&hn=" + sf("www.googleadservices.com"), Ef(a), Ff(a)].join(""),
            Wd = mb(),
            Ub = kg + (Wd.length > 0 ? "&debug_experiment_id=" + Wd : "");
        if (d.google_remarketing_only || d.google_conversion_domain) var Xd = Ub;
        else {
            var lg = [Z("mid",
                d.google_conversion_merchant_id), Z("fcntr", d.google_basket_feed_country), Z("flng", d.google_basket_feed_language), Z("dscnt", d.google_basket_discount), Z("bttype", d.google_basket_transaction_type)].join("");
            if (d) {
                var Vb = d.google_conversion_items;
                if (Vb) {
                    for (var Wb = [], Xb = 0, mg = Vb.length; Xb < mg; Xb++) {
                        var qa = Vb[Xb],
                            ra = [];
                        qa && (ra.push(wf(qa.value)), ra.push(wf(qa.quantity)), ra.push(wf(qa.item_id)), ra.push(wf(qa.start_date)), ra.push(wf(qa.end_date)), Wb.push("(" + ra.join("*") + ")"))
                    }
                    var Yb = Wb.length > 0 ? "&item=" +
                        Wb.join("") : ""
                } else Yb = ""
            } else Yb = "";
            var Yd = [Ub, lg, Yb].join("");
            Xd = Yd.length > 4E3 ? [Ub, Z("item", "elngth")].join("") : Yd
        }
        r = x + Xd;
        e === 1 || e === 6 ? r += [Z("gcp", 1), Z("sscte", 1), Z("ct_cookie_present", 1)].join("") : e == 3 && (r += Z("gcp", 1), r += Z("ct_cookie_present", 1));
        if (gb) {
            var Zd = gf();
            Zd !== void 0 && (r += Z("us_privacy", Zd || "error"))
        }
        zf(d) && (r = d.M ? r + Z("gbcov", 1) : r + Z("gbcov", 0));
        return r
    }

    function Gf(a) {
        if (!Bb) {
            var b = document;
            var c = "IFRAME";
            b.contentType === "application/xhtml+xml" && (c = c.toLowerCase());
            c = b.createElement(c);
            c.style.display = "none";
            c.src = "https://bid.g.doubleclick.net/xbbe/pixel?d=KAE";
            a.body.appendChild(c)
        }
    }

    function Hf() {
        return new Image
    }

    function If(a, b, c, d, e, f) {
        var g = c.onload_callback;
        e = e && g && g.call ? g : function() {};
        C && B(["512247838", "512247839"], jb ? 1 : 0, 22);
        d += Z("async", "1");
        g = c.google_gtm_url_processor;
        Db(g) && (d = g(d));
        var h = (g = c.opt_image_generator) && g.call,
            k = rb() ? {
                attributionsrc: ""
            } : void 0;
        if (!(f = h || !f)) {
            if (c.google_conversion_domain) var l = !1;
            else try {
                l = de(a, b, d, e, void 0, k)
            } catch (m) {
                l = !1
            }
            f = !l
        }
        f && (a = Hf, h && (a = g), a = a(), a.src = d, rb() && a.setAttribute("attributionsrc", ""), a.onload = e)
    }

    function Jf(a, b) {
        C && F(2) == "376635471" && (b.readyState === "complete" ? Gf(b) : a.addEventListener ? a.addEventListener("load", function() {
            Gf(b)
        }) : a.attachEvent("onload", function() {
            Gf(b)
        }))
    }

    function Kf(a) {
        if (a.google_conversion_type === "landing" || !a.google_conversion_id || a.google_remarketing_only && a.google_disable_viewthrough) return !1;
        a.google_conversion_date = new Date;
        a.google_conversion_time = a.google_conversion_date.getTime();
        a.google_conversion_snippets = typeof a.google_conversion_snippets === "number" && a.google_conversion_snippets > 0 ? a.google_conversion_snippets + 1 : 1;
        a.google_conversion_first_time === void 0 && (a.google_conversion_first_time = a.google_conversion_time);
        a.google_conversion_js_version =
            "9";
        a.google_conversion_format != 0 && a.google_conversion_format != 1 && a.google_conversion_format != 2 && a.google_conversion_format != 3 && (a.google_conversion_format = 3);
        a.google_enable_display_cookie_match !== !1 && (a.google_enable_display_cookie_match = !0);
        return !0
    }

    function Lf(a, b) {
        function c(f) {
            d[f] = b && b[f] != null ? b[f] : a[f]
        }
        for (var d = {}, e = 0; e < qf.length; e++) c(qf[e]);
        c("onload_callback");
        return d
    }

    function Mf(a) {
        for (var b = {}, c = 0; c < a.length; c++) {
            var d = a[c],
                e = void 0;
            d.hasOwnProperty("google_business_vertical") ? (e = d.google_business_vertical, b[e] = b[e] || {
                google_business_vertical: e
            }) : (e = "", Object.prototype.hasOwnProperty.call(b, e) || (b[e] = {}));
            e = b[e];
            for (var f = q(Object, "keys").call(Object, d).filter(function(k) {
                    return nf.hasOwnProperty(k)
                }), g = 0; g < f.length; g++) {
                var h = f[g];
                h in e || (e[h] = []);
                e[h].push(d[h])
            }
        }
        return q(Object, "values").call(Object, b)
    }

    function Cf() {
        var a = "";
        qb() && (a = Ab().map(function(b) {
            return b.join("-")
        }).join("_"));
        return Z("li", a)
    }

    function Ef(a) {
        if (!ib || !a.__gsaExp || !a.__gsaExp.id) return "";
        a = a.__gsaExp.id;
        if (!Db(a)) return "";
        try {
            var b = Number(a());
            return isNaN(b) ? "" : Z("gsaexp", b)
        } catch (c) {
            return ""
        }
    }

    function Ff(a) {
        function b(d, e) {
            e != null && c.push(d + "=" + encodeURIComponent(e))
        }
        if (!pb()) return "";
        a = kf(a);
        if (!a) return "";
        var c = [];
        b("&uaa", a.architecture);
        b("&uab", a.bitness);
        b("&uam", a.model);
        b("&uap", a.platform);
        b("&uapv", a.platformVersion);
        a.wow64 != null && b("&uaw", a.wow64 ? "1" : "0");
        a.fullVersionList && b("&uafvl", a.fullVersionList.map(function(d) {
            return encodeURIComponent(d.brand || "") + ";" + encodeURIComponent(d.version || "")
        }).join("|"));
        return c.join("")
    }

    function Df(a) {
        if (!a) return "";
        var b = "",
            c;
        for (c in a) a.hasOwnProperty(c) && (b += Z(c, a[c]));
        return b
    }

    function zf(a) {
        return (a = a.google_gtm_experiments) && a.gbcov ? !0 : !1
    }

    function yf(a) {
        return a.google_gcl_cookie_prefix && a.google_gcl_cookie_prefix !== "_gcl" && of .test(a.google_gcl_cookie_prefix) ? a.google_gcl_cookie_prefix : ""
    }

    function Nf(a, b) {
        if (!b.google_remarketing_only && Of(a, b)) {
            a = b.google_additional_conversion_params || {};
            var c = b.google_gtm_experiments;
            a.capi = c && c.apcm ? "2" : "1";
            b.google_additional_conversion_params = a
        }
    }

    function Of(a, b) {
        if (b.google_transport_url) return !1;
        if ((b = b.google_gtm_experiments) && b.apcm) return !0;
        if (!b || !b.capi) return !1;
        a: {
            if (!pf) {
                Ua("AzMBwcG8UIaKM1GV43UaxMDFsS7hsiLx0FXw9ULTOHJRGxkUVw+UPCxlzz5CudOm+WnidygXLcAHmad6rC6C9QEAAACUeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZWFkc2VydmljZXMuY29tOjQ0MyIsImZlYXR1cmUiOiJBdHRyaWJ1dGlvblJlcG9ydGluZ0Nyb3NzQXBwV2ViIiwiZXhwaXJ5IjoxNzE0NTIxNTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ\x3d\x3d", a);
                if (!jc() && !Ua(bg() ? "" : "A2kc5o2ErHAbqJvF2MHSdYtnc2Bp3n6Jn2kNeko6SgHH6zXBHn0+4BbAW2No9ylVJMkzJAPwMqCVHqXm+IF1DgQAAACKeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZWFkc2VydmljZXMuY29tOjQ0MyIsImZlYXR1cmUiOiJQcml2YWN5U2FuZGJveEFkc0FQSXMiLCJleHBpcnkiOjE2OTUxNjc5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9", a)) {
                    a = !1;
                    break a
                }
                pf = !0
            }
            a = jc()
        }
        return a
    }

    function ig(a, b, c, d, e) {
        a = Bf(a, b, c, d, 7, e);
        b = "AW-" + d.google_conversion_id;
        (d = d.google_conversion_label) && (b = b + "/" + d);
        a: {
            d = b;b = ic[3] === void 0 ? 1 : ic[3];e = 'iframe[data-tagging-id="' + d + '"]';c = [];
            try {
                if (b === 1) {
                    var f = J.querySelector(e);
                    f && (c = [f])
                } else c = q(Array, "from").call(Array, J.querySelectorAll(e))
            } catch (h) {}
            b: {
                try {
                    var g = J.querySelectorAll('iframe[allow="join-ad-interest-group"][data-tagging-id*="-"]');
                    break b
                } catch (h) {}
                g = void 0
            }
            f = g;g = ((f == null ? void 0 : f.length) || 0) >= (ic[2] === void 0 ? 50 : ic[2]);
            if (e = c.length >=
                1) e = Number(c[c.length - 1].dataset.loadTime),
            e !== void 0 && H() - e < (ic[1] === void 0 ? 6E4 : ic[1]) ? (G(9), e = !0) : e = !1;
            if (!e) {
                if (b === 1)
                    if (c.length >= 1) kc(c[0]);
                    else {
                        if (g) {
                            G(10);
                            break a
                        }
                    }
                else c.length >= b ? kc(c[0]) : g && kc(f[0]);
                ac(a, void 0, {
                    allow: "join-ad-interest-group"
                }, {
                    taggingId: d,
                    loadTime: H()
                })
            }
        }
    }

    function bg() {
        return !!q("www.googleadservices.com", "endsWith").call("www.googleadservices.com", "google.com")
    };
    var jg = la(["https://www.googletagmanager.com/debug/bootstrap"]),
        ng = !1,
        og = document.currentScript && document.currentScript.src || "";

    function pg(a, b, c) {
        try {
            if (!ng && (ng = !0, !c.google_gtm)) {
                var d = void 0,
                    e = void 0,
                    f = ae(a.location.href, "gtm_debug");
                qg(f) && (d = 2);
                d || b.referrer.indexOf("https://tagassistant.google.com/") !== 0 || (d = 3);
                !d && wa(b.cookie.split("; "), "__TAG_ASSISTANT=x") >= 0 && (d = 4);
                d || (e = b.documentElement.getAttribute("data-tag-assistant-present"), qg(e) && (d = 5));
                if (d) {
                    var g = "AW-" + (c.google_conversion_id || "");
                    if (!a["google.tagmanager.debugui2.queue"]) {
                        a["google.tagmanager.debugui2.queue"] = [];
                        var h = Ma(jg),
                            k = new p.Map([
                                ["id", g],
                                ["src",
                                    "LEGACY"
                                ],
                                ["cond", d]
                            ]),
                            l = Ka(h).toString(),
                            m = l.split(/[?#]/),
                            r = /[?]/.test(l) ? "?" + m[1] : "";
                        var x = Na(m[0], r, /[#]/.test(l) ? "#" + (r ? m[2] : m[1]) : "", k);
                        var y = Va("SCRIPT", b);
                        La(y, x);
                        var E = b.getElementsByTagName("script")[0];
                        E && E.parentNode && E.parentNode.insertBefore(y, E)
                    }
                    a["google.tagmanager.debugui2.queue"].push({
                        messageType: "LEGACY_CONTAINER_STARTING",
                        data: {
                            id: g,
                            scriptSource: og
                        }
                    })
                }
            }
        } catch (ba) {}
    }

    function qg(a) {
        if (a == null || a.length === 0) return !1;
        a = Number(a);
        var b = Date.now();
        return a < b + 3E5 && a > b - 9E5
    };

    function rg(a, b) {
        a.onload_callback = a.onload_callback && typeof a.onload_callback.call == "function" ? rf(b, a.onload_callback) : function() {}
    }

    function sg(a, b, c, d) {
        pg(a, c, d);
        qb() && (xb(2), d.google_gtm && zb(tb(), a));
        var e = !1;
        if (d.google_conversion_format != 3) return !1;
        try {
            if (Kf(d)) {
                d.google_remarketing_only && d.google_enable_display_cookie_match && !Bb && C && B(["376635470", "376635471"], Ya, 2);
                d.google_remarketing_only && !d.google_conversion_domain && C && B(["759238990", "759238991"], eb, 13);
                !d.google_remarketing_only || d.google_conversion_domain || C && (F(14) == "759248991" || F(14) == "759248990") || C && B(["759248990", "759248991"], db, 14);
                d.google_conversion_linker !==
                    !1 && (d.google_gtm || ef(d.google_gcl_cookie_prefix));
                if (d.google_remarketing_only == 1 && d.google_gtag_event_data != null && d.google_gtag_event_data.items != null && d.google_gtag_event_data.items.constructor === Array && d.google_gtag_event_data.items.length > 0) tg(a, b, c, d);
                else {
                    var f = d.google_gtm_experiments && d.google_gtm_experiments.ccmpp;
                    if (d.google_conversion_domain || d.google_transport_url && d.google_transport_url !== "https://pagead2.googlesyndication.com/") f = !1;
                    var g = !1;
                    bg() && (g = !0);
                    var h = d.google_additional_params;
                    h && h.dg && (g = h.dg === "e");
                    h = function(k, l, m) {
                        l = l === void 0 ? !0 : l;
                        m = m === void 0 ? !0 : m;
                        If(a, c, d, Bf(a, b, c, d, k), l, m)
                    };
                    d.google_gtm_experiments && d.google_gtm_experiments.fledge && (d.google_additional_params = d.google_additional_params || {}, d.google_additional_params.fledge = "1");
                    d.google_remarketing_only ? h(2) : g ? (rg(d, f ? 3 : 2), Nf(c, d), h(1), h(3), f && h(6, !0, !1)) : (rg(d, f ? 2 : 1), Nf(c, d), h(0), f && h(5, !0, !1), zf(d) && df(c, yf(d)) && (d.M = !0, h(0, !1)));
                    d.google_gtm_experiments && d.google_gtm_experiments.fledge && ig(a, b, c, d)
                }
                d.google_remarketing_only &&
                    d.google_enable_display_cookie_match && Jf(a, c);
                e = !0
            }
        } catch (k) {}
        return e
    }

    function tg(a, b, c, d) {
        var e = Mf(d.google_gtag_event_data.items);
        rg(d, e.length);
        for (var f = 0; f < e.length; f++) {
            var g = e[f];
            d.google_gtm_experiments && d.google_gtm_experiments.fledge && (d.google_additional_params = d.google_additional_params || {}, d.google_additional_params.fledge = "1");
            If(a, c, d, Bf(a, b, c, d, 2, g), !0, !0);
            d.google_gtm_experiments && d.google_gtm_experiments.fledge && ig(a, b, c, d, g);
            d.google_conversion_time = d.google_conversion_time + 1
        }
    };
    C = new function() {
        var a = [];
        var b = 0,
            c;
        for (c in ob) a[b++] = ob[c];
        a = a === void 0 ? [] : a;
        this.ca = {};
        this.v = {};
        for (b = 0; b < a.length; ++b) this.v[a[b]] = ""
    };
    B(["466465925", "466465926"], bb, 20);
    pb() && mf();
    C && B(["592230570", "592230571"], ab, 16);
    qb() && (xb(1), yb());

    function ug(a, b, c, d) {
        function e(m, r, x) {
            x = x === void 0 ? function() {} : x;
            var y = new Image;
            y.onload = m;
            y.onerror = x;
            y.src = r
        }

        function f() {
            --g;
            if (g <= 0) {
                var m = nd(a, !1),
                    r = m[b];
                r && (delete m[b], (m = r[0]) && m.call && m())
            }
        }
        d = d === void 0 ? [] : d;
        var g = c.length + 1;
        if (c.length === 2) {
            var h = c[0],
                k = c[1];
            Vd(h, 0, "rmt_tld", h.search($d)) >= 0 && Vd(h, 0, "ipr", h.search($d)) >= 0 && !k.match(rd)[6] && (k += sd(h), c[1] = ce(k, "rmt_tld", "1"))
        }
        for (h = {
                H: 0
            }; h.H < c.length; h = {
                H: h.H
            }, h.H++) {
            k = c[h.H];
            var l = ae(k, "fmt");
            switch (Number(l)) {
                case 1:
                case 2:
                    (l = a.document.getElementById("goog_conv_iframe")) &&
                    !l.src ? ac(k, f, void 0, void 0, l, !1) : e(f, k);
                    break;
                case 4:
                    de(a, a.document, k, f);
                    break;
                case 5:
                    if (a.navigator && a.navigator.sendBeacon)
                        if (a.navigator.sendBeacon(k, "")) {
                            f();
                            break
                        } else k = ce(k, "sendb", 2);
                    k = ce(k, "fmt", 3);
                    e(f, k);
                    break;
                default:
                    l = void 0, d && d[h.H] && (l = function(m) {
                        return function() {
                            cc(d[m.H]) && f()
                        }
                    }(h)), e(f, k, l)
            }
        }
        f()
    }
    for (var vg = ["GooglemKTybQhCsO"], wg = w, xg; vg.length && (xg = vg.shift());) vg.length || ug === void 0 ? wg[xg] && wg[xg] !== Object.prototype[xg] ? wg = wg[xg] : wg = wg[xg] = {} : wg[xg] = ug;
    window.google_trackConversion = function(a) {
        var b = window,
            c = navigator,
            d = document;
        a = Lf(b, a);
        a.google_conversion_format = 3;
        return sg(b, c, d, a)
    };
}).call(this);