! function() {
    var t = {
            302: function(t, e, d) {
                var r;
                t.exports = r || function(t, e) {
                    if ("undefined" != typeof window && window.crypto && (r = window.crypto), "undefined" != typeof self && self.crypto && (r = self.crypto), "undefined" != typeof globalThis && globalThis.crypto && (r = globalThis.crypto), !r && "undefined" != typeof window && window.msCrypto && (r = window.msCrypto), !r && void 0 !== d.g && d.g.crypto && (r = d.g.crypto), !r) try {
                        r = d(882)
                    } catch (t) {}
                    var r, n = function() {
                            if (r) {
                                if ("function" == typeof r.getRandomValues) try {
                                    return r.getRandomValues(new Uint32Array(1))[0]
                                } catch (t) {}
                                if ("function" == typeof r.randomBytes) try {
                                    return r.randomBytes(4).readInt32LE()
                                } catch (t) {}
                            }
                            throw Error("Native crypto module could not be used to get secure random number.")
                        },
                        o = Object.create || function() {
                            function t() {}
                            return function(e) {
                                var d;
                                return t.prototype = e, d = new t, t.prototype = null, d
                            }
                        }(),
                        i = {},
                        a = i.lib = {},
                        $ = a.Base = {
                            extend: function(t) {
                                var e = o(this);
                                return t && e.mixIn(t), e.hasOwnProperty("init") && this.init !== e.init || (e.init = function() {
                                    e.$super.init.apply(this, arguments)
                                }), e.init.prototype = e, e.$super = this, e
                            },
                            create: function() {
                                var t = this.extend();
                                return t.init.apply(t, arguments), t
                            },
                            init: function() {},
                            mixIn: function(t) {
                                for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
                                t.hasOwnProperty("toString") && (this.toString = t.toString)
                            },
                            clone: function() {
                                return this.init.prototype.extend(this)
                            }
                        },
                        u = a.WordArray = $.extend({
                            init: function(t, d) {
                                t = this.words = t || [], e != d ? this.sigBytes = d : this.sigBytes = 4 * t.length
                            },
                            toString: function(t) {
                                return (t || c).stringify(this)
                            },
                            concat: function(t) {
                                var e = this.words,
                                    d = t.words,
                                    r = this.sigBytes,
                                    n = t.sigBytes;
                                if (this.clamp(), r % 4)
                                    for (var o = 0; o < n; o++) {
                                        var i = d[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                                        e[r + o >>> 2] |= i << 24 - (r + o) % 4 * 8
                                    } else
                                        for (var a = 0; a < n; a += 4) e[r + a >>> 2] = d[a >>> 2];
                                return this.sigBytes += n, this
                            },
                            clamp: function() {
                                var e = this.words,
                                    d = this.sigBytes;
                                e[d >>> 2] &= 0xffffffff << 32 - d % 4 * 8, e.length = t.ceil(d / 4)
                            },
                            clone: function() {
                                var t = $.clone.call(this);
                                return t.words = this.words.slice(0), t
                            },
                            random: function(t) {
                                for (var e = [], d = 0; d < t; d += 4) e.push(n());
                                return new u.init(e, t)
                            }
                        }),
                        l = i.enc = {},
                        c = l.Hex = {
                            stringify: function(t) {
                                for (var e = t.words, d = t.sigBytes, r = [], n = 0; n < d; n++) {
                                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                                    r.push((o >>> 4).toString(16)), r.push((15 & o).toString(16))
                                }
                                return r.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, d = [], r = 0; r < e; r += 2) d[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
                                return new u.init(d, e / 2)
                            }
                        },
                        s = l.Latin1 = {
                            stringify: function(t) {
                                for (var e = t.words, d = t.sigBytes, r = [], n = 0; n < d; n++) {
                                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                                    r.push(String.fromCharCode(o))
                                }
                                return r.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, d = [], r = 0; r < e; r++) d[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
                                return new u.init(d, e)
                            }
                        },
                        f = l.Utf8 = {
                            stringify: function(t) {
                                try {
                                    return decodeURIComponent(escape(s.stringify(t)))
                                } catch (t) {
                                    throw Error("Malformed UTF-8 data")
                                }
                            },
                            parse: function(t) {
                                return s.parse(unescape(encodeURIComponent(t)))
                            }
                        },
                        h = a.BufferedBlockAlgorithm = $.extend({
                            reset: function() {
                                this._data = new u.init, this._nDataBytes = 0
                            },
                            _append: function(t) {
                                "string" == typeof t && (t = f.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes
                            },
                            _process: function(e) {
                                var d, r = this._data,
                                    n = r.words,
                                    o = r.sigBytes,
                                    i = this.blockSize,
                                    a = o / (4 * i),
                                    $ = (a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0)) * i,
                                    l = t.min(4 * $, o);
                                if ($) {
                                    for (var c = 0; c < $; c += i) this._doProcessBlock(n, c);
                                    d = n.splice(0, $), r.sigBytes -= l
                                }
                                return new u.init(d, l)
                            },
                            clone: function() {
                                var t = $.clone.call(this);
                                return t._data = this._data.clone(), t
                            },
                            _minBufferSize: 0
                        });
                    a.Hasher = h.extend({
                        cfg: $.extend(),
                        init: function(t) {
                            this.cfg = this.cfg.extend(t), this.reset()
                        },
                        reset: function() {
                            h.reset.call(this), this._doReset()
                        },
                        update: function(t) {
                            return this._append(t), this._process(), this
                        },
                        finalize: function(t) {
                            return t && this._append(t), this._doFinalize()
                        },
                        blockSize: 16,
                        _createHelper: function(t) {
                            return function(e, d) {
                                return new t.init(d).finalize(e)
                            }
                        },
                        _createHmacHelper: function(t) {
                            return function(e, d) {
                                return new p.HMAC.init(t, d).finalize(e)
                            }
                        }
                    });
                    var p = i.algo = {};
                    return i
                }(Math)
            },
            674: function(t, e, d) {
                var r;
                r = d(302),
                    function(t) {
                        var e = r.lib,
                            d = e.WordArray,
                            n = e.Hasher,
                            o = r.algo,
                            i = [],
                            a = [];

                        function $(t) {
                            return (t - (0 | t)) * 0x100000000 | 0
                        }
                        for (var u = 2, l = 0; l < 64;)(function(e) {
                            for (var d = t.sqrt(e), r = 2; r <= d; r++)
                                if (!(e % r)) return !1;
                            return !0
                        })(u) && (l < 8 && (i[l] = $(t.pow(u, .5))), a[l] = $(t.pow(u, 1 / 3)), l++), u++;
                        var c = [],
                            s = o.SHA256 = n.extend({
                                _doReset: function() {
                                    this._hash = new d.init(i.slice(0))
                                },
                                _doProcessBlock: function(t, e) {
                                    for (var d = this._hash.words, r = d[0], n = d[1], o = d[2], i = d[3], $ = d[4], u = d[5], l = d[6], s = d[7], f = 0; f < 64; f++) {
                                        if (f < 16) c[f] = 0 | t[e + f];
                                        else {
                                            var h = c[f - 15],
                                                p = (h << 25 | h >>> 7) ^ (h << 14 | h >>> 18) ^ h >>> 3,
                                                y = c[f - 2],
                                                m = (y << 15 | y >>> 17) ^ (y << 13 | y >>> 19) ^ y >>> 10;
                                            c[f] = p + c[f - 7] + m + c[f - 16]
                                        }
                                        var v = $ & u ^ ~$ & l,
                                            g = r & n ^ r & o ^ n & o,
                                            b = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22),
                                            _ = s + (($ << 26 | $ >>> 6) ^ ($ << 21 | $ >>> 11) ^ ($ << 7 | $ >>> 25)) + v + a[f] + c[f],
                                            O = b + g;
                                        s = l, l = u, u = $, $ = i + _ | 0, i = o, o = n, n = r, r = _ + O | 0
                                    }
                                    d[0] = d[0] + r | 0, d[1] = d[1] + n | 0, d[2] = d[2] + o | 0, d[3] = d[3] + i | 0, d[4] = d[4] + $ | 0, d[5] = d[5] + u | 0, d[6] = d[6] + l | 0, d[7] = d[7] + s | 0
                                },
                                _doFinalize: function() {
                                    var e = this._data,
                                        d = e.words,
                                        r = 8 * this._nDataBytes,
                                        n = 8 * e.sigBytes;
                                    return d[n >>> 5] |= 128 << 24 - n % 32, d[(n + 64 >>> 9 << 4) + 14] = t.floor(r / 0x100000000), d[(n + 64 >>> 9 << 4) + 15] = r, e.sigBytes = 4 * d.length, this._process(), this._hash
                                },
                                clone: function() {
                                    var t = n.clone.call(this);
                                    return t._hash = this._hash.clone(), t
                                }
                            });
                        r.SHA256 = n._createHelper(s), r.HmacSHA256 = n._createHmacHelper(s)
                    }(Math), t.exports = r.SHA256
            },
            616: function() {},
            882: function() {}
        },
        e = {};

    function d(r) {
        var n = e[r];
        if (void 0 !== n) return n.exports;
        var o = e[r] = {
            exports: {}
        };
        return t[r].call(o.exports, o, o.exports, d), o.exports
    }
    d.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return d.d(e, {
                a: e
            }), e
        }, d.d = function(t, e) {
            for (var r in e) d.o(e, r) && !d.o(t, r) && Object.defineProperty(t, r, {
                enumerable: !0,
                get: e[r]
            })
        }, d.g = function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || Function("return this")()
            } catch (t) {
                if ("object" == typeof window) return window
            }
        }(), d.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, d.rv = function() {
            return "1.3.15"
        }, d.ruid = "bundler=rspack@1.3.15",
        function() {
            "use strict";
            var t, e, r, n, o, i, a, $, u, l, c, s, f, h, p, y, m, v, g, b, _, O, N, P, w, E, C, I, S, L, A, T, x, D, j, R, M, k, F, B, H, G, U, V, K, W, Y, Z, z, X, J = ["JP", "ID", "VN", "KR", "TH"];
            (I = y || (y = {})).WINDOWS_PHONE = "Windows Phone", I.ANDROID = "android", I.IOS = "ios", I.PC = "pc", (S = m || (m = {})).MUSICAL_LY = "musical_ly", S.MUSICALLY_GO = "musically_go", S.TRILL = "trill", S.ULTRALITE = "ultralite", S.LEMON8 = "lemon8", (p = {})[m.LEMON8] = {}, p[m.MUSICAL_LY] = ((f = {})[y.IOS] = "33.4.0", f[y.ANDROID] = "23.1.0", f), p[m.TRILL] = ((h = {})[y.IOS] = "33.4.0", h[y.ANDROID] = "23.1.0", h);
            var Q = function() {
                    return "undefined" != typeof window ? window : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : void 0 !== d.g ? d.g : Function("return this")()
                },
                q = function() {
                    return Q().TiktokAnalyticsObject || "ttq"
                },
                tt = function() {
                    return Q()[q()]
                },
                te = function() {
                    var t = Q();
                    return ("object" == typeof navigator && navigator.userAgent ? navigator.userAgent : "") || t._userAgent
                },
                td = function() {
                    return ((tt() || [])._cc || "").toUpperCase()
                },
                tr = function(t) {
                    try {
                        var e = tt()._plugins || {};
                        if (null != e[t]) return !!e[t];
                        return !0
                    } catch (t) {
                        return !0
                    }
                },
                tn = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
                to = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                ti = function(t) {
                    return !(t.length > 128) && !(t.length < 6) && tn.test(t)
                },
                ta = function(t) {
                    return !!t.toLowerCase().match(/^([a-f0-9]{64})$/)
                },
                t$ = function(t) {
                    if (0 === t.length) return null;
                    if ("=" === t.charAt(t.length - 1)) try {
                        var e = atob(t),
                            d = ta(e);
                        return !0 === d ? e : null
                    } catch (t) {}
                    return null
                },
                tu = function(t) {
                    if (0 === t.length) return null;
                    if ("=" === t.charAt(t.length - 1)) try {
                        for (var e = atob(t), d = "", r = 0; r < e.length; r++) {
                            var n = e.charCodeAt(r).toString(16);
                            d += 2 === n.length ? n : "0" + n
                        }
                        var o = ta(d);
                        return !0 === o ? d : null
                    } catch (t) {}
                    return null
                },
                tl = function(t) {
                    return !(t.length < 3) && to.test(t)
                };
            (L = v || (v = {})).EMPTY_VALUE = "empty_value", L.WRONG_FORMAT = "wrong_format", L.CORRECT_FORMAT = "correct_format", L.HASHED = "hashed", L.HASHED_ERR = "hashed_err", L.HASHED_CORRECT = "hashed_correct", L.PLAINTEXT_EMAIL = "plaintext_email", L.PLAINTEXT_PHONE = "plaintext_phone", (A = g || (g = {})).EMPTY_VALUE = "empty_value", A.PLAIN_EMAIL = "plain_email", A.PLAIN_PHONE = "plain_phone", A.HASHED = "hashed", A.FILTER_EVENTS = "filter_events", A.UNKNOWN_INVALID = "unknown_invalid", A.BASE64_STRING_HASHED = "base64_string_hashed", A.BASE64_HEX_HASHED = "base64_hex_hashed", A.PLAIN_MDN_EMAIL = "plain_mdn_email", A.ZIP_CODE_IS_NOT_HASHED = "zip_code_is_not_hashed", A.ZIP_CODE_IS_NOT_US = "zip_code_is_not_us", A.ZIP_CODE_IS_HASHED = "zip_code_is_hashed", A.ZIP_CODE_IS_US = "zip_code_is_us", (T = b || (b = {})).Manual = "manual", T.ManualV2 = "manual_v2", T.Auto = "auto", T.EBManual = "eb_manual", (x = _ || (_ = {})).empty = "empty", x.whitespace = "whitespace", x.hardcode = "hardcode", x.encode = "encode", (D = O || (O = {})).letterCase = "letter_case", D.isNotValidEmail = "is_not_valid_email", D.isNotPossibleEmail = "is_not_possible_email", D.domainTypo = "domain_typo", D.addressFormat = "address_format", (j = N || (N = {})).invalidCountry = "invalid_country", j.notANumber = "not_a_number", j.tooShort = "too_short", j.tooLong = "too_long", j.invalidLength = "invalid_length", j.emptyCountryCodeThroughIP = "empty_country_code_through_ip", j.invalidCountryAfterInjectPlus = "invalid_country_after_inject_plus", j.notANumberAfterInjectPlus = "not_a_number_after_inject_plus", j.tooShortAfterInjectPlus = "too_short_after_inject_plus", j.tooLongAfterInjectPlus = "too_long_after_inject_plus", j.invalidLengthAfterInjectPlus = "invalid_length_after_inject_plus", j.invalidCountryAfterInjectCountry = "invalid_country_after_inject_country", j.notANumberAfterInjectCountry = "not_a_number_after_inject_country", j.tooShortAfterInjectCountry = "too_short_after_inject_country", j.tooLongAfterInjectCountry = "too_long_after_inject_country", j.invalidLengthAfterInjectCountry = "invalid_length_after_inject_country", (R = P || (P = {})).missing = "missing", R.valid = "valid", R.invalid = "invalid";
            var tc = {
                raw_email: {
                    label: P.missing
                },
                raw_auto_email: {
                    label: P.missing
                },
                raw_phone: {
                    label: P.missing
                },
                raw_auto_phone: {
                    label: P.missing
                },
                hashed_email: {
                    label: P.missing
                },
                hashed_phone: {
                    label: P.missing
                },
                raw_eb_email: {
                    label: P.missing
                },
                raw_eb_phone: {
                    label: P.missing
                }
            };
            (M = w || (w = {}))[M.UNKNOWN = 0] = "UNKNOWN", M[M.HOLD = 1] = "HOLD", M[M.REVOKE = 2] = "REVOKE", M[M.GRANT = 3] = "GRANT";
            var ts = {
                    email: "raw_email",
                    eb_email: "raw_eb_email",
                    phone_number: "raw_phone",
                    auto_email: "raw_auto_email",
                    auto_phone_number: "raw_auto_phone",
                    sha256_email: "hashed_email",
                    sha256_phone_number: "hashed_phone"
                },
                tf = {
                    error: []
                };

            function th(t, e, d, r) {
                void 0 === d && (d = {}), void 0 === r && (r = !1);
                try {
                    var n = tt(),
                        o = n.getPlugin && n.getPlugin("Monitor") || null;
                    o && o.error && "function" == typeof o.error ? o.error.call(o, t, e, d, r) : tr("Monitor") && tf.error.push({
                        event: t,
                        err: e,
                        detail: d,
                        withoutJSB: r
                    })
                } catch (t) {}
            }(k = E || (E = {})).LOAD_START = "load_start", k.LOAD_END = "load_end", k.BEFORE_INIT = "before_init", k.INIT_START = "init_start", k.INIT_END = "init_end", k.JSB_INIT_START = "jsb_init_start", k.JSB_INIT_END = "jsb_init_end", k.BEFORE_AD_INFO_INIT_START = "before_ad_info_init_start", k.AD_INFO_INIT_START = "ad_info_init_start", k.AD_INFO_INIT_END = "ad_info_init_end", k.IDENTIFY_INIT_START = "identify_init_start", k.IDENTIFY_INIT_END = "identify_init_end", k.PLUGIN_INIT_START = "_init_start", k.PLUGIN_INIT_END = "_init_end", k.PIXEL_SEND = "pixel_send", k.PIXEL_SEND_PCM = "pixel_send_PCM", k.JSB_SEND = "jsb_send", k.HTTP_SEND = "http_send", k.HANDLE_CACHE = "handle_cache", k.INIT_ERROR = "init_error", k.PIXEL_EMPTY = "pixel_empty", k.JSB_ERROR = "jsb_error", k.API_ERROR = "api_error", k.PLUGIN_ERROR = "plugin_error", k.CUSTOM_INFO = "custom_info", k.CUSTOM_ERROR = "custom_error", k.CUSTOM_TIMER = "custom_timer", F || (F = function() {
                var t, e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                    r = arguments[1];
                r || (r = "undefined" != typeof window ? window : null);
                var n = r && (r.crypto || r.msCrypto);
                if (n) return function() {
                    var t = new Uint8Array(1);
                    return n.getRandomValues(t), t[0] / 255
                };
                try {
                    var o = d(616);
                    return function() {
                        return o.randomBytes(1).readUInt8() / 255
                    }
                } catch (t) {}
                if (e) return function() {
                    return Math.random()
                };
                throw (t = Error("secure crypto unusable, insecure Math.random not allowed")).source = "ulid", t
            }());
            var tp = function(t) {
                return t
            };

            function ty(t, e) {
                var d, r = t;
                return function() {
                    if (r) {
                        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++) o[i] = arguments[i];
                        d = t.apply(e, o), r = null
                    }
                    return d
                }
            }
            var tm = {
                    missing: 1,
                    valid: 2,
                    invalid: 3
                },
                tv = {
                    hit: !1,
                    labelName: P.valid
                },
                tg = function() {
                    return Object.assign({}, {
                        label: P.valid
                    })
                },
                tb = function(t, e, d) {
                    void 0 === d && (d = tg());
                    var r, n = [
                        []
                    ];
                    e.forEach(function(t) {
                        if (Array.isArray(t)) {
                            var e = [];
                            t.forEach(function(t) {
                                n.forEach(function(d) {
                                    e.push([].concat(d, [t]))
                                })
                            }), n = e
                        } else n.forEach(function(e) {
                            e.push(t)
                        })
                    });
                    var o = [],
                        i = (null == (r = d.suggested_values) ? void 0 : r.length) ? d.suggested_values[0] : void 0;
                    n.forEach(function(e) {
                        for (var d = [], r = Object.assign({}, tv), n = i, a = 0; a < e.length; a++) {
                            var $ = e[a],
                                u = n || t,
                                l = $.execute(u, r);
                            if (l.suggestedValue && (n = l.suggestedValue), d.push(l), r = l, !$.next(l)) break
                        }
                        o.push(d)
                    });
                    var a = [];
                    return o.forEach(function(t) {
                        var e;
                        t.forEach(function(t) {
                            var r, n, o;
                            d.label = tm[t.labelName] > tm[d.label] ? t.labelName : d.label, t.abnormalType && !(null == (r = d.abnormal_types) ? void 0 : r.includes(t.abnormalType)) && ((null == (n = d.abnormal_types) ? void 0 : n.push(t.abnormalType)) || (d.abnormal_types = [t.abnormalType])), t.suggestedValue && (o = t.suggestedValue, e = tp(o))
                        }), e && a.push(e)
                    }), a.length > 0 && (d.suggested_values = Array.from(new Set(a))), d
                },
                t_ = {
                    isHash: function(t) {
                        return !1
                    },
                    genIdentifierLabelByUserProperties: function(t) {
                        return {}
                    }
                },
                tO = {
                    validatePhoneNumberLength: function(t) {},
                    parsePhoneNumberFromString: function(t) {}
                },
                tN = {
                    tryDecodeHashedBase64String: function(t) {
                        return null
                    },
                    tryDecodeHashedBase64Hex: function(t) {
                        return null
                    }
                },
                tP = {
                    checkEmailFormat: function(t) {
                        return !1
                    },
                    checkMDNEmailFormat: function(t) {
                        return !1
                    }
                },
                tw = ["", "undefined", "null", "0"],
                tE = function(t, e) {
                    void 0 === e && (e = tv);
                    var d = !1,
                        r = t.replace(/&.*;/, ""),
                        n = tN.tryDecodeHashedBase64Hex(r),
                        o = tN.tryDecodeHashedBase64String(r);
                    return ((n || o) && (d = !0, r = n || o), d = r !== t) ? {
                        hit: d,
                        labelName: P.invalid,
                        abnormalType: _.encode,
                        suggestedValue: r
                    } : {
                        hit: d,
                        labelName: e.labelName
                    }
                },
                tC = /\+.*$/,
                tI = /\.|\+.*$/g,
                tS = {
                    "gmail.com": {
                        cut: tI
                    },
                    "googlemail.com": {
                        cut: tI,
                        aliasOf: "gmail.com"
                    },
                    "hotmail.com": {
                        cut: tC
                    },
                    "live.com": {
                        cut: tI
                    },
                    "outlook.com": {
                        cut: tC
                    }
                },
                tL = function(t) {
                    if ("string" != typeof t) return t;
                    var e = t.toLowerCase().split(/@/);
                    if (2 !== e.length) return t;
                    var d = e[0],
                        r = e[1];
                    return tS.hasOwnProperty(r) && (tS[r].hasOwnProperty("cut") && (d = d.replace(tS[r].cut, "")), tS[r].hasOwnProperty("aliasOf") && (r = tS[r].aliasOf)), d + "@" + r
                },
                tA = {
                    domainThreshold: 2,
                    secondLevelThreshold: 2,
                    topLevelThreshold: 2,
                    defaultDomains: ["msn.com", "bellsouth.net", "telus.net", "comcast.net", "optusnet.com.au", "earthlink.net", "sky.com", "icloud.com", "mac.com", "sympatico.ca", "googlemail.com", "att.net", "xtra.co.nz", "web.de", "cox.net", "gmail.com", "ymail.com", "aim.com", "rogers.com", "verizo.net", "rocketmail.com", "google.com", "optonline.net", "sbcglobal.net", "aol.com", "me.com", "btinternet.com", "charter.net", "shaw.ca"],
                    defaultSecondLevelDomains: ["yahoo", "hotmail", "mail", "live", "outlook", "gmx"],
                    defaultTopLevelDomains: ["com", "com.au", "com.tw", "ca", "co.nz", "co.uk", "de", "fr", "it", "ru", "net", "org", "edu", "gov", "jp", "nl", "kr", "se", "eu", "ie", "co.il", "us", "at", "be", "dk", "hk", "es", "gr", "ch", "no", "cz", "in", "net", "net.au", "info", "biz", "mil", "co.jp", "sg", "hu"],
                    run: function(t) {
                        t.domains = t.domains || tA.defaultDomains, t.secondLevelDomains = t.secondLevelDomains || tA.defaultSecondLevelDomains, t.topLevelDomains = t.topLevelDomains || tA.defaultTopLevelDomains, t.distanceFunction = t.distanceFunction || tA.sift3Distance;
                        var e = function(t) {
                                return t
                            },
                            d = t.suggested || e,
                            r = t.empty || e,
                            n = tA.suggest(tA.encodeEmail(t.email), t.domains, t.secondLevelDomains, t.topLevelDomains, t.distanceFunction);
                        return n ? d(n) : r()
                    },
                    suggest: function(t, e, d, r, n) {
                        t = t.toLowerCase();
                        var o = this.splitEmail(t);
                        if (!o || d && r && -1 !== d.indexOf(o.secondLevelDomain) && -1 !== r.indexOf(o.topLevelDomain)) return !1;
                        var i = this.findClosestDomain(o.domain, e, n, this.domainThreshold);
                        if (i)
                            if (i == o.domain) return !1;
                            else return {
                                address: o.address,
                                domain: i,
                                full: o.address + "@" + i
                            };
                        var a = this.findClosestDomain(o.secondLevelDomain, d, n, this.secondLevelThreshold),
                            $ = this.findClosestDomain(o.topLevelDomain, r, n, this.topLevelThreshold);
                        if (o.domain) {
                            var u = o.domain,
                                l = !1;
                            if (a && a != o.secondLevelDomain && (u = u.replace(o.secondLevelDomain, a), l = !0), $ && $ != o.topLevelDomain && (u = u.replace(o.topLevelDomain, $), l = !0), !0 == l) return {
                                address: o.address,
                                domain: u,
                                full: o.address + "@" + u
                            }
                        }
                        return !1
                    },
                    findClosestDomain: function(t, e, d, r) {
                        r = r || this.topLevelThreshold;
                        var n, o = 99,
                            i = null;
                        if (!t || !e) return !1;
                        d || (d = this.sift3Distance);
                        for (var a = 0; a < e.length; a++) {
                            if (t === e[a]) return t;
                            (n = d(t, e[a])) < o && (o = n, i = e[a])
                        }
                        return o <= r && null !== i && i
                    },
                    sift3Distance: function(t, e) {
                        if (null == t || 0 === t.length)
                            if (null == e || 0 === e.length) return 0;
                            else return e.length;
                        if (null == e || 0 === e.length) return t.length;
                        for (var d = 0, r = 0, n = 0, o = 0; d + r < t.length && d + n < e.length;) {
                            if (t.charAt(d + r) == e.charAt(d + n)) o++;
                            else {
                                r = 0, n = 0;
                                for (var i = 0; i < 5; i++) {
                                    if (d + i < t.length && t.charAt(d + i) == e.charAt(d)) {
                                        r = i;
                                        break
                                    }
                                    if (d + i < e.length && t.charAt(d) == e.charAt(d + i)) {
                                        n = i;
                                        break
                                    }
                                }
                            }
                            d++
                        }
                        return (t.length + e.length) / 2 - o
                    },
                    splitEmail: function(t) {
                        var e = t.trim().split("@");
                        if (e.length < 2) return !1;
                        for (var d = 0; d < e.length; d++)
                            if ("" === e[d]) return !1;
                        var r = e.pop();
                        if (!r) return !1;
                        var n = r.split("."),
                            o = "",
                            i = "";
                        if (0 == n.length) return !1;
                        if (1 == n.length) i = n[0];
                        else {
                            o = n[0];
                            for (var d = 1; d < n.length; d++) i += n[d] + ".";
                            i = i.substring(0, i.length - 1)
                        }
                        return {
                            topLevelDomain: i,
                            secondLevelDomain: o,
                            domain: r,
                            address: e.join("@")
                        }
                    },
                    encodeEmail: function(t) {
                        var e = encodeURI(t);
                        return e.replace("%20", " ").replace("%25", "%").replace("%5E", "^").replace("%60", "`").replace("%7B", "{").replace("%7C", "|").replace("%7D", "}")
                    }
                },
                tT = /^[^@]+@[^@]+$/,
                tx = [{
                    name: "empty",
                    execute: function(t, e) {
                        var d = tw.indexOf(t) > -1;
                        return d ? {
                            hit: d,
                            labelName: P.invalid,
                            abnormalType: _.empty
                        } : {
                            hit: d,
                            labelName: e.labelName
                        }
                    },
                    next: function(t) {
                        return !t.hit
                    }
                }, {
                    name: "whitespace",
                    execute: function(t, e) {
                        var d = t.replace(/\s/, "");
                        return d === t ? {
                            hit: !1,
                            labelName: e.labelName
                        } : {
                            hit: !0,
                            labelName: P.invalid,
                            abnormalType: _.whitespace,
                            suggestedValue: d
                        }
                    },
                    next: function() {
                        return !0
                    }
                }, {
                    name: "is_not_valid_email",
                    execute: function(t, e) {
                        var d = !tP.checkMDNEmailFormat(t);
                        return d ? {
                            hit: d,
                            labelName: P.invalid,
                            abnormalType: O.isNotValidEmail
                        } : {
                            hit: d,
                            labelName: e.labelName
                        }
                    },
                    next: function() {
                        return !0
                    }
                }, {
                    name: "letter_case",
                    execute: function(t, e) {
                        var d = t.toLowerCase(),
                            r = d !== t;
                        return r ? {
                            hit: r,
                            labelName: e.labelName,
                            abnormalType: O.letterCase,
                            suggestedValue: d
                        } : {
                            hit: r,
                            labelName: e.labelName
                        }
                    },
                    next: function() {
                        return !0
                    }
                }, {
                    name: "is_not_possible_email",
                    execute: function(t, e) {
                        var d = !tT.test(t);
                        return d ? {
                            hit: d,
                            labelName: P.invalid,
                            abnormalType: O.isNotPossibleEmail
                        } : {
                            hit: d,
                            labelName: e.labelName
                        }
                    },
                    next: function(t) {
                        return !t.hit
                    }
                }, {
                    name: "domain_typo",
                    execute: function(t, e) {
                        var d = "";
                        tA.run({
                            email: t,
                            suggested: function(t) {
                                d = t.full
                            },
                            empty: function() {}
                        });
                        var r = !!d && d !== t;
                        return r ? {
                            hit: r,
                            labelName: e.labelName,
                            abnormalType: O.domainTypo,
                            suggestedValue: d
                        } : {
                            hit: r,
                            labelName: e.labelName
                        }
                    },
                    next: function() {
                        return !0
                    }
                }, {
                    name: "address_format",
                    execute: function(t, e) {
                        var d = tL(t),
                            r = d !== t;
                        return r ? {
                            hit: r,
                            labelName: P.invalid,
                            abnormalType: O.addressFormat,
                            suggestedValue: d
                        } : {
                            hit: r,
                            labelName: e.labelName
                        }
                    },
                    next: function() {
                        return !0
                    }
                }],
                tD = function(t, e, d) {
                    void 0 === e && (e = ""), void 0 === d && (d = tO.parsePhoneNumberFromString);
                    var r = t,
                        n = e ? d(t, e) : d(t);
                    return n ? r = "86" === n.countryCallingCode ? n.nationalNumber : n.number : t.replace(/[^0-9]/g, "").length > 0 && (r = t.replace(/[^0-9]/g, "")), r
                },
                tj = {
                    NOT_A_NUMBER: N.notANumber,
                    INVALID_COUNTRY: N.invalidCountry,
                    TOO_SHORT: N.tooShort,
                    TOO_LONG: N.tooLong,
                    INVALID_LENGTH: N.invalidLength
                },
                tR = {
                    INVALID_COUNTRY: N.invalidCountryAfterInjectPlus,
                    TOO_SHORT: N.tooShortAfterInjectPlus,
                    TOO_LONG: N.tooLongAfterInjectPlus,
                    INVALID_LENGTH: N.invalidLengthAfterInjectPlus,
                    NOT_A_NUMBER: N.notANumberAfterInjectPlus
                },
                tM = {
                    EMPTY_COUNTRY_CODE_THROUGH_IP: N.emptyCountryCodeThroughIP,
                    INVALID_COUNTRY: N.invalidCountryAfterInjectCountry,
                    TOO_SHORT: N.tooShortAfterInjectCountry,
                    TOO_LONG: N.tooLongAfterInjectCountry,
                    INVALID_LENGTH: N.invalidLengthAfterInjectCountry,
                    NOT_A_NUMBER: N.notANumberAfterInjectCountry
                },
                tk = [{
                        name: "lib_rule",
                        execute: function(t, e) {
                            var d = tO.validatePhoneNumberLength(t),
                                r = {
                                    hit: !1,
                                    labelName: e.labelName
                                };
                            d && (r.hit = !0, r.labelName = P.invalid, r.abnormalType = tj[d]);
                            var n = tD(t);
                            return n !== t && (r.suggestedValue = n), r
                        },
                        next: function(t) {
                            return t.hit && t.abnormalType === N.invalidCountry
                        }
                    },
                    [{
                        name: "lib_rule_after_inject_plus",
                        execute: function(t, e) {
                            var d = "+" + t,
                                r = tO.validatePhoneNumberLength(d);
                            return r ? {
                                hit: !0,
                                labelName: P.invalid,
                                abnormalType: tR[r]
                            } : (d = tD(d), {
                                hit: !1,
                                labelName: e.labelName,
                                suggestedValue: d
                            })
                        },
                        next: function() {
                            return !0
                        }
                    }, {
                        name: "lib_rule_after_inject_country",
                        execute: function(t, e) {
                            var d = td();
                            if (!d) return {
                                hit: !0,
                                labelName: P.invalid,
                                abnormalType: tM.EMPTY_COUNTRY_CODE_THROUGH_IP
                            };
                            var r = tO.validatePhoneNumberLength(t, d);
                            if (r) return {
                                hit: !0,
                                labelName: P.invalid,
                                abnormalType: tM[r]
                            };
                            var n = tD(t, d);
                            return {
                                hit: !1,
                                labelName: e.labelName,
                                suggestedValue: n
                            }
                        },
                        next: function() {
                            return !0
                        }
                    }]
                ],
                tF = {
                    raw_email: tx,
                    raw_eb_email: tx,
                    raw_eb_phone: tk,
                    raw_auto_email: tx,
                    raw_phone: tk,
                    raw_auto_phone: tk,
                    hashed_email: [],
                    hashed_phone: []
                },
                tB = function(t, e, d) {
                    return void 0 === d && (d = tg()), tb(t, tF[e], d)
                },
                tH = function(t, e, d) {
                    var r = {},
                        n = tE(t, tv),
                        o = {
                            label: n.labelName
                        };
                    return n.abnormalType && (o.abnormal_types = [n.abnormalType]), n.suggestedValue && (o.suggested_values = [n.suggestedValue]), t_.isHash(t) ? r[d] = tB(t, d, o) : r[e] = tB(t, e, o), r
                },
                tG = function(t, e) {
                    return Object.assign(t, e)
                },
                tU = function(t) {
                    var e = {};
                    try {
                        if (!t) return e;
                        Object.entries(t).forEach(function(t) {
                            var d, r, n, o, i, a, $ = t[0],
                                u = t[1];
                            if (void 0 === u) {
                                var l, c = ts[$];
                                e = tG(e, ((l = {})[c] = tc[c], l));
                                return
                            }
                            switch ($) {
                                case "email":
                                case "sha256_email":
                                    e = tG(e, (d = String(u), tH(d, "raw_email", "hashed_email")));
                                    break;
                                case "auto_email":
                                    e = tG(e, (r = String(u), tH(r, "raw_auto_email", "hashed_email")));
                                    break;
                                case "phone_number":
                                case "sha256_phone_number":
                                    e = tG(e, (n = String(u), tH(n, "raw_phone", "hashed_phone")));
                                    break;
                                case "eb_phone_number":
                                    e = tG(e, (o = String(u), tH(o, "raw_eb_phone", "hashed_phone")));
                                    break;
                                case "auto_phone_number":
                                    e = tG(e, (i = String(u), tH(i, "raw_auto_phone", "hashed_phone")));
                                    break;
                                case "eb_email":
                                    e = tG(e, (a = String(u), tH(a, "raw_eb_email", "hashed_email")))
                            }
                            return e
                        })
                    } catch (t) {
                        th(E.CUSTOM_ERROR, t, {
                            custom_name: "gen_identifier_label_error"
                        })
                    }
                    return e
                },
                tV = {
                    version: 4,
                    country_calling_codes: {
                        1: ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"],
                        7: ["RU", "KZ"],
                        20: ["EG"],
                        27: ["ZA"],
                        30: ["GR"],
                        31: ["NL"],
                        32: ["BE"],
                        33: ["FR"],
                        34: ["ES"],
                        36: ["HU"],
                        39: ["IT", "VA"],
                        40: ["RO"],
                        41: ["CH"],
                        43: ["AT"],
                        44: ["GB", "GG", "IM", "JE"],
                        45: ["DK"],
                        46: ["SE"],
                        47: ["NO", "SJ"],
                        48: ["PL"],
                        49: ["DE"],
                        51: ["PE"],
                        52: ["MX"],
                        53: ["CU"],
                        54: ["AR"],
                        55: ["BR"],
                        56: ["CL"],
                        57: ["CO"],
                        58: ["VE"],
                        60: ["MY"],
                        61: ["AU", "CC", "CX"],
                        62: ["ID"],
                        63: ["PH"],
                        64: ["NZ"],
                        65: ["SG"],
                        66: ["TH"],
                        81: ["JP"],
                        82: ["KR"],
                        84: ["VN"],
                        86: ["CN"],
                        90: ["TR"],
                        91: ["IN"],
                        92: ["PK"],
                        93: ["AF"],
                        94: ["LK"],
                        95: ["MM"],
                        98: ["IR"],
                        211: ["SS"],
                        212: ["MA", "EH"],
                        213: ["DZ"],
                        216: ["TN"],
                        218: ["LY"],
                        220: ["GM"],
                        221: ["SN"],
                        222: ["MR"],
                        223: ["ML"],
                        224: ["GN"],
                        225: ["CI"],
                        226: ["BF"],
                        227: ["NE"],
                        228: ["TG"],
                        229: ["BJ"],
                        230: ["MU"],
                        231: ["LR"],
                        232: ["SL"],
                        233: ["GH"],
                        234: ["NG"],
                        235: ["TD"],
                        236: ["CF"],
                        237: ["CM"],
                        238: ["CV"],
                        239: ["ST"],
                        240: ["GQ"],
                        241: ["GA"],
                        242: ["CG"],
                        243: ["CD"],
                        244: ["AO"],
                        245: ["GW"],
                        246: ["IO"],
                        247: ["AC"],
                        248: ["SC"],
                        249: ["SD"],
                        250: ["RW"],
                        251: ["ET"],
                        252: ["SO"],
                        253: ["DJ"],
                        254: ["KE"],
                        255: ["TZ"],
                        256: ["UG"],
                        257: ["BI"],
                        258: ["MZ"],
                        260: ["ZM"],
                        261: ["MG"],
                        262: ["RE", "YT"],
                        263: ["ZW"],
                        264: ["NA"],
                        265: ["MW"],
                        266: ["LS"],
                        267: ["BW"],
                        268: ["SZ"],
                        269: ["KM"],
                        290: ["SH", "TA"],
                        291: ["ER"],
                        297: ["AW"],
                        298: ["FO"],
                        299: ["GL"],
                        350: ["GI"],
                        351: ["PT"],
                        352: ["LU"],
                        353: ["IE"],
                        354: ["IS"],
                        355: ["AL"],
                        356: ["MT"],
                        357: ["CY"],
                        358: ["FI", "AX"],
                        359: ["BG"],
                        370: ["LT"],
                        371: ["LV"],
                        372: ["EE"],
                        373: ["MD"],
                        374: ["AM"],
                        375: ["BY"],
                        376: ["AD"],
                        377: ["MC"],
                        378: ["SM"],
                        380: ["UA"],
                        381: ["RS"],
                        382: ["ME"],
                        383: ["XK"],
                        385: ["HR"],
                        386: ["SI"],
                        387: ["BA"],
                        389: ["MK"],
                        420: ["CZ"],
                        421: ["SK"],
                        423: ["LI"],
                        500: ["FK"],
                        501: ["BZ"],
                        502: ["GT"],
                        503: ["SV"],
                        504: ["HN"],
                        505: ["NI"],
                        506: ["CR"],
                        507: ["PA"],
                        508: ["PM"],
                        509: ["HT"],
                        590: ["GP", "BL", "MF"],
                        591: ["BO"],
                        592: ["GY"],
                        593: ["EC"],
                        594: ["GF"],
                        595: ["PY"],
                        596: ["MQ"],
                        597: ["SR"],
                        598: ["UY"],
                        599: ["CW", "BQ"],
                        670: ["TL"],
                        672: ["NF"],
                        673: ["BN"],
                        674: ["NR"],
                        675: ["PG"],
                        676: ["TO"],
                        677: ["SB"],
                        678: ["VU"],
                        679: ["FJ"],
                        680: ["PW"],
                        681: ["WF"],
                        682: ["CK"],
                        683: ["NU"],
                        685: ["WS"],
                        686: ["KI"],
                        687: ["NC"],
                        688: ["TV"],
                        689: ["PF"],
                        690: ["TK"],
                        691: ["FM"],
                        692: ["MH"],
                        850: ["KP"],
                        852: ["HK"],
                        853: ["MO"],
                        855: ["KH"],
                        856: ["LA"],
                        880: ["BD"],
                        886: ["TW"],
                        960: ["MV"],
                        961: ["LB"],
                        962: ["JO"],
                        963: ["SY"],
                        964: ["IQ"],
                        965: ["KW"],
                        966: ["SA"],
                        967: ["YE"],
                        968: ["OM"],
                        970: ["PS"],
                        971: ["AE"],
                        972: ["IL"],
                        973: ["BH"],
                        974: ["QA"],
                        975: ["BT"],
                        976: ["MN"],
                        977: ["NP"],
                        992: ["TJ"],
                        993: ["TM"],
                        994: ["AZ"],
                        995: ["GE"],
                        996: ["KG"],
                        998: ["UZ"]
                    },
                    countries: {
                        AC: ["247", "00", "(?:[01589]\\d|[46])\\d{4}", [5, 6]],
                        AD: ["376", "00", "(?:1|6\\d)\\d{7}|[135-9]\\d{5}", [6, 8, 9],
                            [
                                ["(\\d{3})(\\d{3})", "$1 $2", ["[135-9]"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["1"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]
                            ]
                        ],
                        AE: ["971", "00", "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}", [5, 6, 7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d{3})(\\d{2,9})", "$1 $2", ["60|8"]],
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[236]|[479][2-8]"], "0$1"],
                                ["(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", ["[479]"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"]
                            ], "0"
                        ],
                        AF: ["93", "00", "[2-7]\\d{8}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"]
                            ], "0"
                        ],
                        AG: ["1", "011", "(?:268|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([457]\\d{6})$", "268$1", 0, "268"],
                        AI: ["1", "011", "(?:264|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2457]\\d{6})$", "264$1", 0, "264"],
                        AL: ["355", "00", "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}", [6, 7, 8, 9],
                            [
                                ["(\\d{3})(\\d{3,4})", "$1 $2", ["80|9"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[2-6]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4"], "0$1"],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[23578]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1"]
                            ], "0"
                        ],
                        AM: ["374", "00", "(?:[1-489]\\d|55|60|77)\\d{6}", [8],
                            [
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0"], "0 $1"],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["2|3[12]"], "(0$1)"],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)"],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["[3-9]"], "0$1"]
                            ], "0"
                        ],
                        AO: ["244", "00", "[29]\\d{8}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[29]"]]
                            ]
                        ],
                        AR: ["54", "00", "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}", [10, 11],
                            [
                                ["(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 1],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", 1],
                                ["(\\d)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 0, "$1 $2 $3-$4"],
                                ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 15-$3-$4", ["91"], "0$1", 0, "$1 $2 $3-$4"],
                                ["(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", ["8"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9"], "0$1", 0, "$1 $2 $3-$4"]
                            ], "0", 0, "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?", "9$1"
                        ],
                        AS: ["1", "011", "(?:[58]\\d\\d|684|900)\\d{7}", [10], 0, "1", 0, "1|([267]\\d{6})$", "684$1", 0, "684"],
                        AT: ["43", "00", "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            [
                                ["(\\d)(\\d{3,12})", "$1 $2", ["1(?:11|[2-9])"], "0$1"],
                                ["(\\d{3})(\\d{2})", "$1 $2", ["517"], "0$1"],
                                ["(\\d{2})(\\d{3,5})", "$1 $2", ["5[079]"], "0$1"],
                                ["(\\d{3})(\\d{3,10})", "$1 $2", ["(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]"], "0$1"],
                                ["(\\d{4})(\\d{3,9})", "$1 $2", ["[2-467]|5[2-6]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5"], "0$1"]
                            ], "0"
                        ],
                        AU: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}", [5, 6, 7, 8, 9, 10, 12],
                            [
                                ["(\\d{2})(\\d{3,4})", "$1 $2", ["16"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["14|4"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:30|[89])"]]
                            ], "0", 0, "0|(183[12])", 0, 0, 0, [
                                ["(?:(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8]))\\d{3}|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4]))|(?:6[0-8]|[78]\\d)\\d{3}|9(?:[02-9]\\d{3}|1(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79])))))\\d{3}", [9]],
                                ["4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[016-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", [9]],
                                ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
                                ["190[0-26]\\d{6}", [10]], 0, 0, 0, ["163\\d{2,6}", [5, 6, 7, 8, 9]],
                                ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
                                ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]
                            ], "0011"
                        ],
                        AW: ["297", "00", "(?:[25-79]\\d\\d|800)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[25-9]"]]
                            ]
                        ],
                        AX: ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}", [5, 6, 7, 8, 9, 10, 11, 12], 0, "0", 0, 0, 0, 0, "18", 0, "00"],
                        AZ: ["994", "00", "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["90"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[13-9]"], "0$1"]
                            ], "0"
                        ],
                        BA: ["387", "00", "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-3]|[7-9]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]|6[56]"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6"], "0$1"]
                            ], "0"
                        ],
                        BB: ["1", "011", "(?:246|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-9]\\d{6})$", "246$1", 0, "246"],
                        BD: ["880", "00", "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}", [6, 7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{4,6})", "$1-$2", ["31[5-8]|[459]1"], "0$1"],
                                ["(\\d{3})(\\d{3,7})", "$1-$2", ["3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:28|4[14]|5)|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]"], "0$1"],
                                ["(\\d{4})(\\d{3,6})", "$1-$2", ["[13-9]|22"], "0$1"],
                                ["(\\d)(\\d{7,8})", "$1-$2", ["2"], "0$1"]
                            ], "0"
                        ],
                        BE: ["32", "00", "4\\d{8}|[1-9]\\d{7}", [8, 9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[239]|4[23]"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[15-8]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4"], "0$1"]
                            ], "0"
                        ],
                        BF: ["226", "00", "[025-7]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[025-7]"]]
                            ]
                        ],
                        BG: ["359", "00", "[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}", [6, 7, 8, 9],
                            [
                                ["(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"],
                                ["(\\d{3})(\\d{4})", "$1 $2", ["43[1-6]|70[1-9]"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:70|8)0"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[1-7]|7"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[48]|9[08]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"]
                            ], "0"
                        ],
                        BH: ["973", "00", "[136-9]\\d{7}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[13679]|8[047]"]]
                            ]
                        ],
                        BI: ["257", "00", "(?:[267]\\d|31)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2367]"]]
                            ]
                        ],
                        BJ: ["229", "00", "(?:[25689]\\d|40)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-689]"]]
                            ]
                        ],
                        BL: ["590", "00", "(?:590|(?:69|80)\\d|976)\\d{6}", [9], 0, "0", 0, 0, 0, 0, 0, [
                            ["590(?:2[7-9]|5[12]|87)\\d{4}"],
                            ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"],
                            ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["976[01]\\d{5}"]
                        ]],
                        BM: ["1", "011", "(?:441|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-8]\\d{6})$", "441$1", 0, "441"],
                        BN: ["673", "00", "[2-578]\\d{6}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-578]"]]
                            ]
                        ],
                        BO: ["591", "00(?:1\\d)?", "(?:[2-467]\\d\\d|8001)\\d{5}", [8, 9],
                            [
                                ["(\\d)(\\d{7})", "$1 $2", ["[23]|4[46]"]],
                                ["(\\d{8})", "$1", ["[67]"]],
                                ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["8"]]
                            ], "0", 0, "0(1\\d)?"
                        ],
                        BQ: ["599", "00", "(?:[34]1|7\\d)\\d{5}", [7], 0, 0, 0, 0, 0, 0, "[347]"],
                        BR: ["55", "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)", "(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-46-9]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}", [8, 9, 10, 11],
                            [
                                ["(\\d{4})(\\d{4})", "$1-$2", ["300|4(?:0[02]|37)", "4(?:02|37)0|[34]00"]],
                                ["(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", ["(?:[358]|90)0"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"], "($1)"],
                                ["(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["[16][1-9]|[2-57-9]"], "($1)"]
                            ], "0", 0, "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2"
                        ],
                        BS: ["1", "011", "(?:242|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([3-8]\\d{6})$", "242$1", 0, "242"],
                        BT: ["975", "00", "[17]\\d{7}|[2-8]\\d{6}", [7, 8],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-68]|7[246]"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[67]|7"]]
                            ]
                        ],
                        BW: ["267", "00", "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}", [7, 8, 10],
                            [
                                ["(\\d{2})(\\d{5})", "$1 $2", ["90"]],
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[24-6]|3[15-79]"]],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37]"]],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["0"]],
                                ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        BY: ["375", "810", "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}", [6, 7, 8, 9, 10, 11],
                            [
                                ["(\\d{3})(\\d{3})", "$1 $2", ["800"], "8 $1"],
                                ["(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"],
                                ["(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:[56]|7[467])|2[1-3]"], "8 0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-4]"], "8 0$1"],
                                ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[89]"], "8 $1"]
                            ], "8", 0, "0|80?", 0, 0, 0, 0, "8~10"
                        ],
                        BZ: ["501", "00", "(?:0800\\d|[2-8])\\d{6}", [7, 11],
                            [
                                ["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]],
                                ["(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]]
                            ]
                        ],
                        CA: ["1", "011", "(?:[2-8]\\d|90)\\d{8}|3\\d{6}", [7, 10], 0, "1", 0, 0, 0, 0, 0, [
                            ["(?:2(?:04|[23]6|[48]9|50|63)|3(?:06|43|6[578])|4(?:03|1[68]|3[178]|50|68|74)|5(?:06|1[49]|48|79|8[147])|6(?:04|13|39|47|72)|7(?:0[59]|42|53|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}", [10]],
                            ["", [10]],
                            ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", [10]],
                            ["900[2-9]\\d{6}", [10]],
                            ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:00|2[125-7]|33|44|66|77|88)|622)[2-9]\\d{6}", [10]], 0, ["310\\d{4}", [7]], 0, ["600[2-9]\\d{6}", [10]]
                        ]],
                        CC: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "0|([59]\\d{7})$", "8$1", 0, 0, [
                            ["8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}", [9]],
                            ["4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[016-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", [9]],
                            ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
                            ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
                            ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]
                        ], "0011"],
                        CD: ["243", "00", "[189]\\d{8}|[1-68]\\d{6}", [7, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1"],
                                ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]"], "0$1"]
                            ], "0"
                        ],
                        CF: ["236", "00", "(?:[27]\\d{3}|8776)\\d{4}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[278]"]]
                            ]
                        ],
                        CG: ["242", "00", "222\\d{6}|(?:0\\d|80)\\d{7}", [9],
                            [
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]]
                            ]
                        ],
                        CH: ["41", "00", "8\\d{11}|[2-9]\\d{8}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]|81"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["8"], "0$1"]
                            ], "0"
                        ],
                        CI: ["225", "00", "[02]\\d{9}", [10],
                            [
                                ["(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", ["2"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", ["0"]]
                            ]
                        ],
                        CK: ["682", "00", "[2-578]\\d{4}", [5],
                            [
                                ["(\\d{2})(\\d{3})", "$1 $2", ["[2-578]"]]
                            ]
                        ],
                        CL: ["56", "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0", "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}", [9, 10, 11],
                            [
                                ["(\\d{5})(\\d{4})", "$1 $2", ["219", "2196"], "($1)"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[1-36]"], "($1)"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9[2-9]"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])"], "($1)"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                                ["(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"]]
                            ]
                        ],
                        CM: ["237", "00", "[26]\\d{8}|88\\d{6,7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["88"]],
                                ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]|88"]]
                            ]
                        ],
                        CN: ["86", "00|1(?:[12]\\d|79)\\d\\d00", "1[127]\\d{8,9}|2\\d{9}(?:\\d{2})?|[12]\\d{6,7}|86\\d{6}|(?:1[03-689]\\d|6)\\d{7,9}|(?:[3-579]\\d|8[0-57-9])\\d{6,9}", [7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2[0-57-9])[19]", "(?:10|2[0-57-9])(?:10|9[56])", "(?:10|2[0-57-9])(?:100|9[56])"], "0$1"],
                                ["(\\d{3})(\\d{5,6})", "$1 $2", ["3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["(?:4|80)0"]],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]"], "0$1", 1],
                                ["(\\d{3})(\\d{7,8})", "$1 $2", ["9"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", 1],
                                ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[3-578]"], "0$1", 1],
                                ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-9]"]],
                                ["(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["[12]"], "0$1", 1]
                            ], "0", 0, "0|(1(?:[12]\\d|79)\\d\\d)", 0, 0, 0, 0, "00"
                        ],
                        CO: ["57", "00(?:4(?:[14]4|56)|[579])", "(?:60\\d\\d|9101)\\d{6}|(?:1\\d|3)\\d{9}", [10, 11],
                            [
                                ["(\\d{3})(\\d{7})", "$1 $2", ["6"], "($1)"],
                                ["(\\d{3})(\\d{7})", "$1 $2", ["3[0-357]|91"]],
                                ["(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", ["1"], "0$1", 0, "$1 $2 $3"]
                            ], "0", 0, "0(4(?:[14]4|56)|[579])?"
                        ],
                        CR: ["506", "00", "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}", [8, 10],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[3-9]"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]"]]
                            ], 0, 0, "(19(?:0[0-2468]|1[09]|20|66|77|99))"
                        ],
                        CU: ["53", "119", "[27]\\d{6,7}|[34]\\d{5,7}|(?:5|8\\d\\d)\\d{7}", [6, 7, 8, 10],
                            [
                                ["(\\d{2})(\\d{4,6})", "$1 $2", ["2[1-4]|[34]"], "(0$1)"],
                                ["(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)"],
                                ["(\\d)(\\d{7})", "$1 $2", ["5"], "0$1"],
                                ["(\\d{3})(\\d{7})", "$1 $2", ["8"], "0$1"]
                            ], "0"
                        ],
                        CV: ["238", "0", "(?:[2-59]\\d\\d|800)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-589]"]]
                            ]
                        ],
                        CW: ["599", "00", "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}", [7, 8],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[3467]"]],
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["9[4-8]"]]
                            ], 0, 0, 0, 0, 0, "[69]"
                        ],
                        CX: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "0|([59]\\d{7})$", "8$1", 0, 0, [
                            ["8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}", [9]],
                            ["4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[016-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", [9]],
                            ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
                            ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
                            ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]
                        ], "0011"],
                        CY: ["357", "00", "(?:[279]\\d|[58]0)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{6})", "$1 $2", ["[257-9]"]]
                            ]
                        ],
                        CZ: ["420", "00", "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]],
                                ["(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["96"]],
                                ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]],
                                ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]
                            ]
                        ],
                        DE: ["49", "00", "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:2[024-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[015]\\d|2[13]|31|[46][1-8])\\d{1,9}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                            [
                                ["(\\d{2})(\\d{3,13})", "$1 $2", ["3[02]|40|[68]9"], "0$1"],
                                ["(\\d{3})(\\d{3,12})", "$1 $2", ["2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1", "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1"], "0$1"],
                                ["(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]", "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]"], "0$1"],
                                ["(\\d{3})(\\d{4})", "$1 $2", ["138"], "0$1"],
                                ["(\\d{5})(\\d{2,10})", "$1 $2", ["3"], "0$1"],
                                ["(\\d{3})(\\d{5,11})", "$1 $2", ["181"], "0$1"],
                                ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["1(?:3|80)|9"], "0$1"],
                                ["(\\d{3})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1"],
                                ["(\\d{3})(\\d{7,12})", "$1 $2", ["8"], "0$1"],
                                ["(\\d{5})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1"],
                                ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
                                ["(\\d{4})(\\d{7})", "$1 $2", ["18[68]"], "0$1"],
                                ["(\\d{5})(\\d{6})", "$1 $2", ["15[0568]"], "0$1"],
                                ["(\\d{4})(\\d{7})", "$1 $2", ["15[1279]"], "0$1"],
                                ["(\\d{3})(\\d{8})", "$1 $2", ["18"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{7,8})", "$1 $2 $3", ["1(?:6[023]|7)"], "0$1"],
                                ["(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", ["15"], "0$1"]
                            ], "0"
                        ],
                        DJ: ["253", "00", "(?:2\\d|77)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[27]"]]
                            ]
                        ],
                        DK: ["45", "00", "[2-9]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-9]"]]
                            ]
                        ],
                        DM: ["1", "011", "(?:[58]\\d\\d|767|900)\\d{7}", [10], 0, "1", 0, "1|([2-7]\\d{6})$", "767$1", 0, "767"],
                        DO: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "8001|8[024]9"],
                        DZ: ["213", "00", "(?:[1-4]|[5-79]\\d|80)\\d{7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-4]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"], "0$1"]
                            ], "0"
                        ],
                        EC: ["593", "00", "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}", [8, 9, 10, 11],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[2-7]"], "(0$1)", 0, "$1-$2-$3"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"]]
                            ], "0"
                        ],
                        EE: ["372", "00", "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}", [7, 8, 10],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88"]],
                                ["(\\d{4})(\\d{3,4})", "$1 $2", ["[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])"]],
                                ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["7"]],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        EG: ["20", "00", "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}", [8, 9, 10],
                            [
                                ["(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1"],
                                ["(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|8[2468]|9[235-7]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[189]"], "0$1"]
                            ], "0"
                        ],
                        EH: ["212", "00", "[5-8]\\d{8}", [9], 0, "0", 0, 0, 0, 0, "528[89]"],
                        ER: ["291", "00", "[178]\\d{6}", [7],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[178]"], "0$1"]
                            ], "0"
                        ],
                        ES: ["34", "00", "[5-9]\\d{8}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-9]"]]
                            ]
                        ],
                        ET: ["251", "00", "(?:11|[2-579]\\d)\\d{7}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-579]"], "0$1"]
                            ], "0"
                        ],
                        FI: ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}", [5, 6, 7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d)(\\d{4,9})", "$1 $2", ["[2568][1-8]|3(?:0[1-9]|[1-9])|9"], "0$1"],
                                ["(\\d{3})(\\d{3,7})", "$1 $2", ["[12]00|[368]|70[07-9]"], "0$1"],
                                ["(\\d{2})(\\d{4,8})", "$1 $2", ["[1245]|7[135]"], "0$1"],
                                ["(\\d{2})(\\d{6,10})", "$1 $2", ["7"], "0$1"]
                            ], "0", 0, 0, 0, 0, "1[03-79]|[2-9]", 0, "00"
                        ],
                        FJ: ["679", "0(?:0|52)", "45\\d{5}|(?:0800\\d|[235-9])\\d{6}", [7, 11],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[235-9]|45"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        FK: ["500", "00", "[2-7]\\d{4}", [5]],
                        FM: ["691", "00", "(?:[39]\\d\\d|820)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[389]"]]
                            ]
                        ],
                        FO: ["298", "00", "[2-9]\\d{5}", [6],
                            [
                                ["(\\d{6})", "$1", ["[2-9]"]]
                            ], 0, 0, "(10(?:01|[12]0|88))"
                        ],
                        FR: ["33", "00", "[1-9]\\d{8}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"],
                                ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1"]
                            ], "0"
                        ],
                        GA: ["241", "00", "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}", [7, 8],
                            [
                                ["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["11|[67]"], "0$1"]
                            ], 0, 0, "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[467]\\d{6})", "$1"
                        ],
                        GB: ["44", "00", "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}", [7, 9, 10],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["845", "8454", "84546", "845464"], "0$1"],
                                ["(\\d{3})(\\d{6})", "$1 $2", ["800"], "0$1"],
                                ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:(?:38|69)7|5(?:24|39)|768|946)", "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)"], "0$1"],
                                ["(\\d{4})(\\d{5,6})", "$1 $2", ["1(?:[2-69][02-9]|[78])"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))"], "0$1"],
                                ["(\\d{4})(\\d{6})", "$1 $2", ["7"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1389]"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, [
                                ["(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0235])|4(?:[0-5]\\d\\d|69[7-9]|70[013579])|(?:(?:5[0-26-9]|[78][0-49])\\d|6(?:[0-4]\\d|50))\\d)|2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d\\d|1(?:[0-7]\\d\\d|8(?:[02]\\d|1[0-246-9])))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}", [9, 10]],
                                ["7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}", [10]],
                                ["80[08]\\d{7}|800\\d{6}|8001111"],
                                ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d", [7, 10]],
                                ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]],
                                ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]],
                                ["56\\d{8}", [10]]
                            ], 0, " x"
                        ],
                        GD: ["1", "011", "(?:473|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-9]\\d{6})$", "473$1", 0, "473"],
                        GE: ["995", "00", "(?:[3-57]\\d\\d|800)\\d{6}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["32"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[57]"]],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1"]
                            ], "0"
                        ],
                        GF: ["594", "00", "(?:[56]94|80\\d|976)\\d{6}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0"
                        ],
                        GG: ["44", "00", "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?", [7, 9, 10], 0, "0", 0, "0|([25-9]\\d{5})$", "1481$1", 0, 0, [
                            ["1481[25-9]\\d{5}", [10]],
                            ["7(?:(?:781|839)\\d|911[17])\\d{5}", [10]],
                            ["80[08]\\d{7}|800\\d{6}|8001111"],
                            ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d", [7, 10]],
                            ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]],
                            ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]],
                            ["56\\d{8}", [10]]
                        ]],
                        GH: ["233", "00", "(?:[235]\\d{3}|800)\\d{5}", [8, 9],
                            [
                                ["(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"], "0$1"]
                            ], "0"
                        ],
                        GI: ["350", "00", "(?:[25]\\d\\d|606)\\d{5}", [8],
                            [
                                ["(\\d{3})(\\d{5})", "$1 $2", ["2"]]
                            ]
                        ],
                        GL: ["299", "00", "(?:19|[2-689]\\d|70)\\d{4}", [6],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["19|[2-9]"]]
                            ]
                        ],
                        GM: ["220", "00", "[2-9]\\d{6}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]
                            ]
                        ],
                        GN: ["224", "00", "722\\d{6}|(?:3|6\\d)\\d{7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]]
                            ]
                        ],
                        GP: ["590", "00", "(?:590|(?:69|80)\\d|976)\\d{6}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, [
                                ["590(?:0[1-68]|[14][0-24-9]|2[0-68]|3[1289]|5[3-579]|6[0-289]|7[08]|8[0-689]|9\\d)\\d{4}"],
                                ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"],
                                ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["976[01]\\d{5}"]
                            ]
                        ],
                        GQ: ["240", "00", "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]],
                                ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]]
                            ]
                        ],
                        GR: ["30", "00", "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}", [10, 11, 12],
                            [
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]],
                                ["(\\d{4})(\\d{6})", "$1 $2", ["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2689]"]],
                                ["(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        GT: ["502", "00", "(?:1\\d{3}|[2-7])\\d{7}", [8, 11],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]
                            ]
                        ],
                        GU: ["1", "011", "(?:[58]\\d\\d|671|900)\\d{7}", [10], 0, "1", 0, "1|([3-9]\\d{6})$", "671$1", 0, "671"],
                        GW: ["245", "00", "[49]\\d{8}|4\\d{6}", [7, 9],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["40"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"]]
                            ]
                        ],
                        GY: ["592", "001", "9008\\d{3}|(?:[2-467]\\d\\d|862)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-46-9]"]]
                            ]
                        ],
                        HK: ["852", "00(?:30|5[09]|[126-9]?)", "8[0-46-9]\\d{6,7}|9\\d{4,7}|(?:[2-7]|9\\d{3})\\d{7}", [5, 6, 7, 8, 9, 11],
                            [
                                ["(\\d{3})(\\d{2,5})", "$1 $2", ["900", "9003"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
                                ["(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        HN: ["504", "00", "8\\d{10}|[237-9]\\d{7}", [8, 11],
                            [
                                ["(\\d{4})(\\d{4})", "$1-$2", ["[237-9]"]]
                            ]
                        ],
                        HR: ["385", "00", "(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}", [6, 7, 8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["6[01]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[67]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-5]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"]
                            ], "0"
                        ],
                        HT: ["509", "00", "[2-489]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[2-489]"]]
                            ]
                        ],
                        HU: ["36", "00", "[235-7]\\d{8}|[1-9]\\d{7}", [8, 9],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "(06 $1)"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"], "(06 $1)"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "06 $1"]
                            ], "06"
                        ],
                        ID: ["62", "00[89]", "(?:(?:00[1-9]|8\\d)\\d{4}|[1-36])\\d{6}|00\\d{10}|[1-9]\\d{8,10}|[2-9]\\d{7}", [7, 8, 9, 10, 11, 12, 13],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["15"]],
                                ["(\\d{2})(\\d{5,9})", "$1 $2", ["2[124]|[36]1"], "(0$1)"],
                                ["(\\d{3})(\\d{5,7})", "$1 $2", ["800"], "0$1"],
                                ["(\\d{3})(\\d{5,8})", "$1 $2", ["[2-79]"], "(0$1)"],
                                ["(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", ["8[1-35-9]"], "0$1"],
                                ["(\\d{3})(\\d{6,8})", "$1 $2", ["1"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["804"], "0$1"],
                                ["(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80"], "0$1"],
                                ["(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["8"], "0$1"]
                            ], "0"
                        ],
                        IE: ["353", "00", "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}", [7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"], "(0$1)"],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[45]0"], "(0$1)"],
                                ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2569]|4[1-69]|7[14]"], "(0$1)"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[78]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["4"], "(0$1)"],
                                ["(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0"
                        ],
                        IL: ["972", "0(?:0|1[2-9])", "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}", [7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d{4})(\\d{3})", "$1-$2", ["125"]],
                                ["(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]],
                                ["(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", ["12"]],
                                ["(\\d{4})(\\d{6})", "$1-$2", ["159"]],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]],
                                ["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", ["15"]]
                            ], "0"
                        ],
                        IM: ["44", "00", "1624\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "0|([25-8]\\d{5})$", "1624$1", 0, "74576|(?:16|7[56])24"],
                        IN: ["91", "00", "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}", [8, 9, 10, 11, 12, 13],
                            [
                                ["(\\d{8})", "$1", ["5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)"], 0, 1],
                                ["(\\d{4})(\\d{4,5})", "$1 $2", ["180", "1800"], 0, 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], 0, 1],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]"], "0$1", 1],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]"], "0$1", 1],
                                ["(\\d{5})(\\d{5})", "$1 $2", ["[6-9]"], "0$1", 1],
                                ["(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", ["1(?:6|8[06])", "1(?:6|8[06]0)"], 0, 1],
                                ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18"], 0, 1]
                            ], "0"
                        ],
                        IO: ["246", "00", "3\\d{6}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["3"]]
                            ]
                        ],
                        IQ: ["964", "00", "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}", [8, 9, 10],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]
                            ], "0"
                        ],
                        IR: ["98", "00", "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}", [4, 5, 6, 7, 10],
                            [
                                ["(\\d{4,5})", "$1", ["96"], "0$1"],
                                ["(\\d{2})(\\d{4,5})", "$1 $2", ["(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1"]
                            ], "0"
                        ],
                        IS: ["354", "00|1(?:0(?:01|[12]0)|100)", "(?:38\\d|[4-9])\\d{6}", [7, 9],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        IT: ["39", "00", "0\\d{5,10}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|(?:55|70)\\d{8}|8\\d{5}(?:\\d{2,4})?", [6, 7, 8, 9, 10, 11],
                            [
                                ["(\\d{2})(\\d{4,6})", "$1 $2", ["0[26]"]],
                                ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))"]],
                                ["(\\d{4})(\\d{2,6})", "$1 $2", ["0(?:[13-579][2-46-8]|8[236-8])"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["894"]],
                                ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|5"]],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1(?:44|[679])|[378]"]],
                                ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]|14"]],
                                ["(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]],
                                ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["3"]]
                            ], 0, 0, 0, 0, 0, 0, [
                                ["0669[0-79]\\d{1,6}|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}"],
                                ["3[1-9]\\d{8}|3[2-9]\\d{7}", [9, 10]],
                                ["80(?:0\\d{3}|3)\\d{3}", [6, 9]],
                                ["(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", [6, 8, 9, 10]],
                                ["1(?:78\\d|99)\\d{6}", [9, 10]], 0, 0, 0, ["55\\d{8}", [10]],
                                ["84(?:[08]\\d{3}|[17])\\d{3}", [6, 9]]
                            ]
                        ],
                        JE: ["44", "00", "1534\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "0|([0-24-8]\\d{5})$", "1534$1", 0, 0, [
                            ["1534[0-24-8]\\d{5}"],
                            ["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97[7-9]))\\d{5}"],
                            ["80(?:07(?:35|81)|8901)\\d{4}"],
                            ["(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"],
                            ["701511\\d{4}"], 0, ["(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"],
                            ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}"],
                            ["56\\d{8}"]
                        ]],
                        JM: ["1", "011", "(?:[58]\\d\\d|658|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "658|876"],
                        JO: ["962", "00", "(?:(?:[2689]|7\\d)\\d|32|53)\\d{6}", [8, 9],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"],
                                ["(\\d{3})(\\d{5,6})", "$1 $2", ["[89]"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["70"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]
                            ], "0"
                        ],
                        JP: ["81", "010", "00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1"],
                                ["(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51|63)|9(?:80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9]|636)|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9]|636[457-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["[36]|4(?:2[09]|7[01])", "[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[27-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9])|5(?:2|3[045]|4[0-369]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|49|51|6(?:[0-24]|36|5[0-3589]|72|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:49|55|83)[29]|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|7[015-9]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17|3[015-9]))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9(?:[019]|4[1-3]|6(?:[0-47-9]|5[01346-9])))|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|829(?:2|66)|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["[14]|[289][2-9]|5[3-9]|7[2-4679]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[257-9]"], "0$1"]
                            ], "0"
                        ],
                        KE: ["254", "000", "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}", [7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1"],
                                ["(\\d{3})(\\d{6})", "$1 $2", ["[17]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]
                            ], "0"
                        ],
                        KG: ["996", "00", "8\\d{9}|(?:[235-8]\\d|99)\\d{7}", [9, 10],
                            [
                                ["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[346]|[24-79])"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-79]|88"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0"
                        ],
                        KH: ["855", "00[14-9]", "1\\d{9}|[1-9]\\d{7,8}", [8, 9, 10],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-9]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]
                            ], "0"
                        ],
                        KI: ["686", "00", "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}", [5, 8], 0, "0"],
                        KM: ["269", "00", "[3478]\\d{6}", [7],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[3478]"]]
                            ]
                        ],
                        KN: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-7]\\d{6})$", "869$1", 0, "869"],
                        KP: ["850", "00|99", "85\\d{6}|(?:19\\d|[2-7])\\d{7}", [8, 10],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"]
                            ], "0"
                        ],
                        KR: ["82", "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))", "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}", [5, 6, 8, 9, 10, 11, 12, 13, 14],
                            [
                                ["(\\d{2})(\\d{3,4})", "$1-$2", ["(?:3[1-3]|[46][1-4]|5[1-5])1"], "0$1"],
                                ["(\\d{4})(\\d{4})", "$1-$2", ["1"]],
                                ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60|8"], "0$1"],
                                ["(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["[1346]|5[1-5]"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"],
                                ["(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", ["5"], "0$1"]
                            ], "0", 0, "0(8(?:[1-46-8]|5\\d\\d))?"
                        ],
                        KW: ["965", "00", "18\\d{5}|(?:[2569]\\d|41)\\d{6}", [7, 8],
                            [
                                ["(\\d{4})(\\d{3,4})", "$1 $2", ["[169]|2(?:[235]|4[1-35-9])|52"]],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[245]"]]
                            ]
                        ],
                        KY: ["1", "011", "(?:345|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-9]\\d{6})$", "345$1", 0, "345"],
                        KZ: ["7", "810", "(?:33622|8\\d{8})\\d{5}|[78]\\d{9}", [10, 14], 0, "8", 0, 0, 0, 0, "33|7", 0, "8~10"],
                        LA: ["856", "00", "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}", [8, 9, 10],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["30[013-9]"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[23]"], "0$1"]
                            ], "0"
                        ],
                        LB: ["961", "00", "[27-9]\\d{7}|[13-9]\\d{6}", [7, 8],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27-9]"]]
                            ], "0"
                        ],
                        LC: ["1", "011", "(?:[58]\\d\\d|758|900)\\d{7}", [10], 0, "1", 0, "1|([2-8]\\d{6})$", "758$1", 0, "758"],
                        LI: ["423", "00", "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}", [7, 9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["69"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]
                            ], "0", 0, "0|(1001)"
                        ],
                        LK: ["94", "00", "[1-9]\\d{8}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[1-689]"], "0$1"]
                            ], "0"
                        ],
                        LR: ["231", "00", "(?:2|33|5\\d|77|88)\\d{7}|[4-6]\\d{6}", [7, 8, 9],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[4-6]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3578]"], "0$1"]
                            ], "0"
                        ],
                        LS: ["266", "00", "(?:[256]\\d\\d|800)\\d{5}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2568]"]]
                            ]
                        ],
                        LT: ["370", "00", "(?:[3469]\\d|52|[78]0)\\d{6}", [8],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["52[0-7]"], "(8-$1)", 1],
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "8 $1", 1],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["37|4(?:[15]|6[1-8])"], "(8-$1)", 1],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[3-6]"], "(8-$1)", 1]
                            ], "8", 0, "[08]"
                        ],
                        LU: ["352", "00", "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}", [4, 5, 6, 7, 8, 9, 10, 11],
                            [
                                ["(\\d{2})(\\d{3})", "$1 $2", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]],
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]],
                                ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20[2-689]"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["2(?:[0367]|4[3-8])"]],
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["80[01]|90[015]"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["2(?:[0367]|4[3-8])"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})", "$1 $2 $3 $4", ["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"]]
                            ], 0, 0, "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"
                        ],
                        LV: ["371", "00", "(?:[268]\\d|90)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[269]|8[01]"]]
                            ]
                        ],
                        LY: ["218", "00", "[2-9]\\d{8}", [9],
                            [
                                ["(\\d{2})(\\d{7})", "$1-$2", ["[2-9]"], "0$1"]
                            ], "0"
                        ],
                        MA: ["212", "00", "[5-8]\\d{8}", [9],
                            [
                                ["(\\d{5})(\\d{4})", "$1-$2", ["5(?:29|38)", "5(?:29[89]|389)", "5(?:29[89]|389)0"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5[45]"], "0$1"],
                                ["(\\d{4})(\\d{5})", "$1-$2", ["5(?:2[2-489]|3[5-9]|9)|892", "5(?:2(?:[2-49]|8[235-9])|3[5-9]|9)|892"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1-$2", ["8"], "0$1"],
                                ["(\\d{3})(\\d{6})", "$1-$2", ["[5-7]"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, [
                                ["5(?:29(?:[189][05]|2[29]|3[01])|389[05])\\d{4}|5(?:2(?:[0-25-7]\\d|3[1-578]|4[02-46-8]|8[0235-7]|90)|3(?:[0-47]\\d|5[02-9]|6[02-8]|8[08]|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}"],
                                ["(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[017]\\d|2[0-2]|6[0-8]|8[0-3]))\\d{6}"],
                                ["80\\d{7}"],
                                ["89\\d{7}"], 0, 0, 0, 0, ["592(?:4[0-2]|93)\\d{4}"]
                            ]
                        ],
                        MC: ["377", "00", "(?:[3489]|6\\d)\\d{7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[389]"]],
                                ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["6"], "0$1"]
                            ], "0"
                        ],
                        MD: ["373", "00", "(?:[235-7]\\d|[89]0)\\d{6}", [8],
                            [
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[25-7]"], "0$1"]
                            ], "0"
                        ],
                        ME: ["382", "00", "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "0$1"]
                            ], "0"
                        ],
                        MF: ["590", "00", "(?:590|(?:69|80)\\d|976)\\d{6}", [9], 0, "0", 0, 0, 0, 0, 0, [
                            ["590(?:0[079]|[14]3|[27][79]|30|5[0-268]|87)\\d{4}"],
                            ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"],
                            ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["976[01]\\d{5}"]
                        ]],
                        MG: ["261", "00", "[23]\\d{8}", [9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["[23]"], "0$1"]
                            ], "0", 0, "0|([24-9]\\d{6})$", "20$1"
                        ],
                        MH: ["692", "011", "329\\d{4}|(?:[256]\\d|45)\\d{5}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1-$2", ["[2-6]"]]
                            ], "1"
                        ],
                        MK: ["389", "00", "[2-578]\\d{7}", [8],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2|34[47]|4(?:[37]7|5[47]|64)"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1"],
                                ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1"]
                            ], "0"
                        ],
                        ML: ["223", "00", "[24-9]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-9]"]]
                            ]
                        ],
                        MM: ["95", "00", "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}", [6, 7, 8, 9, 10],
                            [
                                ["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[4-7]|8[1-35]"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[137-9])"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92"], "0$1"],
                                ["(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", ["9"], "0$1"]
                            ], "0"
                        ],
                        MN: ["976", "001", "[12]\\d{7,9}|[5-9]\\d{7}", [8, 9, 10],
                            [
                                ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"], "0$1"],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[5-9]"]],
                                ["(\\d{3})(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1"],
                                ["(\\d{4})(\\d{5,6})", "$1 $2", ["[12](?:27|3[2-8]|4[2-68]|5[1-4689])", "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"], "0$1"],
                                ["(\\d{5})(\\d{4,5})", "$1 $2", ["[12]"], "0$1"]
                            ], "0"
                        ],
                        MO: ["853", "00", "0800\\d{3}|(?:28|[68]\\d)\\d{6}", [7, 8],
                            [
                                ["(\\d{4})(\\d{3})", "$1 $2", ["0"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[268]"]]
                            ]
                        ],
                        MP: ["1", "011", "[58]\\d{9}|(?:67|90)0\\d{7}", [10], 0, "1", 0, "1|([2-9]\\d{6})$", "670$1", 0, "670"],
                        MQ: ["596", "00", "(?:69|80)\\d{7}|(?:59|97)6\\d{6}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0"
                        ],
                        MR: ["222", "00", "(?:[2-4]\\d\\d|800)\\d{5}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-48]"]]
                            ]
                        ],
                        MS: ["1", "011", "(?:[58]\\d\\d|664|900)\\d{7}", [10], 0, "1", 0, "1|([34]\\d{6})$", "664$1", 0, "664"],
                        MT: ["356", "00", "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2357-9]"]]
                            ]
                        ],
                        MU: ["230", "0(?:0|[24-7]0|3[03])", "(?:5|8\\d\\d)\\d{7}|[2-468]\\d{6}", [7, 8, 10],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-46]|8[013]"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["5"]],
                                ["(\\d{5})(\\d{5})", "$1 $2", ["8"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "020"
                        ],
                        MV: ["960", "0(?:0|19)", "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}", [7, 10],
                            [
                                ["(\\d{3})(\\d{4})", "$1-$2", ["[3467]|9[13-9]"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        MW: ["265", "00", "(?:[1289]\\d|31|77)\\d{7}|1\\d{6}", [7, 9],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[2-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[137-9]"], "0$1"]
                            ], "0"
                        ],
                        MX: ["52", "0[09]", "1(?:(?:44|99)[1-9]|65[0-689])\\d{7}|(?:1(?:[017]\\d|[235][1-9]|4[0-35-9]|6[0-46-9]|8[1-79]|9[1-8])|[2-9]\\d)\\d{8}", [10, 11],
                            [
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["33|5[56]|81"], 0, 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-9]"], 0, 1],
                                ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 $3 $4", ["1(?:33|5[56]|81)"], 0, 1],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 $3 $4", ["1"], 0, 1]
                            ], "01", 0, "0(?:[12]|4[45])|1", 0, 0, 0, 0, "00"
                        ],
                        MY: ["60", "00", "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}", [8, 9, 10],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1(?:[02469]|[378][1-9]|53)|8", "1(?:[02469]|[37][1-9]|53|8(?:[1-46-9]|5[7-9]))|8"], "0$1"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1(?:[367]|80)"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", ["1"], "0$1"]
                            ], "0"
                        ],
                        MZ: ["258", "00", "(?:2|8\\d)\\d{7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-79]"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        NA: ["264", "00", "[68]\\d{7,8}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["87"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]
                            ], "0"
                        ],
                        NC: ["687", "00", "(?:050|[2-57-9]\\d\\d)\\d{3}", [6],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[02-57-9]"]]
                            ]
                        ],
                        NE: ["227", "00", "[027-9]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[089]|2[013]|7[04]"]]
                            ]
                        ],
                        NF: ["672", "00", "[13]\\d{5}", [6],
                            [
                                ["(\\d{2})(\\d{4})", "$1 $2", ["1[0-3]"]],
                                ["(\\d)(\\d{5})", "$1 $2", ["[13]"]]
                            ], 0, 0, "([0-258]\\d{4})$", "3$1"
                        ],
                        NG: ["234", "009", "(?:[124-7]|9\\d{3})\\d{6}|[1-9]\\d{7}|[78]\\d{9,13}", [7, 8, 10, 11, 12, 13, 14],
                            [
                                ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["78"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]|9(?:0[3-9]|[1-9])"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[3-7]|8[2-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[7-9]"], "0$1"],
                                ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]"], "0$1"],
                                ["(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]"], "0$1"]
                            ], "0"
                        ],
                        NI: ["505", "00", "(?:1800|[25-8]\\d{3})\\d{4}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[125-8]"]]
                            ]
                        ],
                        NL: ["31", "00", "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|8\\d{6,9}|9\\d{6,10}|1\\d{4,5}", [5, 6, 7, 8, 9, 10, 11],
                            [
                                ["(\\d{3})(\\d{4,7})", "$1 $2", ["[89]0"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["66"], "0$1"],
                                ["(\\d)(\\d{8})", "$1 $2", ["6"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-578]|91"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", ["9"], "0$1"]
                            ], "0"
                        ],
                        NO: ["47", "00", "(?:0|[2-9]\\d{3})\\d{4}", [5, 8],
                            [
                                ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[489]|59"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-7]"]]
                            ], 0, 0, 0, 0, 0, "[02-689]|7[0-8]"
                        ],
                        NP: ["977", "00", "(?:1\\d|9)\\d{9}|[1-9]\\d{7}", [8, 10, 11],
                            [
                                ["(\\d)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1"],
                                ["(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-59]|[67][2-6])"], "0$1"],
                                ["(\\d{3})(\\d{7})", "$1-$2", ["9"]]
                            ], "0"
                        ],
                        NR: ["674", "00", "(?:444|(?:55|8\\d)\\d|666)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[4-68]"]]
                            ]
                        ],
                        NU: ["683", "00", "(?:[47]|888\\d)\\d{3}", [4, 7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["8"]]
                            ]
                        ],
                        NZ: ["64", "0(?:0|161)", "[29]\\d{7,9}|50\\d{5}(?:\\d{2,3})?|6[0-35-9]\\d{6}|7\\d{7,8}|8\\d{4,9}|(?:11\\d|[34])\\d{7}", [5, 6, 7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{3,8})", "$1 $2", ["8[1-579]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["50[036-8]|[89]0", "50(?:[0367]|88)|[89]0"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["24|[346]|7[2-57-9]|9[2-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|[59]|80"], "0$1"],
                                ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1|2[028]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:[169]|7[0-35-9])|7|86"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, 0, "00"
                        ],
                        OM: ["968", "00", "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}", [7, 8, 9],
                            [
                                ["(\\d{3})(\\d{4,6})", "$1 $2", ["[58]"]],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["2"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[179]"]]
                            ]
                        ],
                        PA: ["507", "00", "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}", [7, 8, 10, 11],
                            [
                                ["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]],
                                ["(\\d{4})(\\d{4})", "$1-$2", ["[68]"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        PE: ["51", "00|19(?:1[124]|77|90)00", "(?:[14-8]|9\\d)\\d{7}", [8, 9],
                            [
                                ["(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)"],
                                ["(\\d)(\\d{7})", "$1 $2", ["1"], "(0$1)"],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["[4-8]"], "(0$1)"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]]
                            ], "0", 0, 0, 0, 0, 0, 0, "00", " Anexo "
                        ],
                        PF: ["689", "00", "4\\d{5}(?:\\d{2})?|8\\d{7,8}", [6, 8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]],
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4|8[7-9]"]],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]
                            ]
                        ],
                        PG: ["675", "00|140[1-3]", "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}", [7, 8],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["18|[2-69]|85"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[78]"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        PH: ["63", "00", "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}", [6, 8, 9, 10, 11, 12, 13],
                            [
                                ["(\\d)(\\d{5})", "$1 $2", ["2"], "(0$1)"],
                                ["(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)"],
                                ["(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)"],
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|8[2-8]"], "(0$1)"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                                ["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]]
                            ], "0"
                        ],
                        PK: ["92", "00", "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}", [8, 9, 10, 11, 12],
                            [
                                ["(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", ["[89]0"], "0$1"],
                                ["(\\d{4})(\\d{5})", "$1 $2", ["1"]],
                                ["(\\d{3})(\\d{6,7})", "$1 $2", ["2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])", "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]"], "(0$1)"],
                                ["(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"], "(0$1)"],
                                ["(\\d{5})(\\d{5})", "$1 $2", ["58"], "(0$1)"],
                                ["(\\d{3})(\\d{7})", "$1 $2", ["3"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"], "(0$1)"],
                                ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[24-9]"], "(0$1)"]
                            ], "0"
                        ],
                        PL: ["48", "00", "(?:6|8\\d\\d)\\d{7}|[1-9]\\d{6}(?:\\d{2})?|[26]\\d{5}", [6, 7, 8, 9, 10],
                            [
                                ["(\\d{5})", "$1", ["19"]],
                                ["(\\d{3})(\\d{3})", "$1 $2", ["11|20|64"]],
                                ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1", "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"]],
                                ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"]],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[2-8]|[2-7]|8[1-79]|9[145]"]],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["8"]]
                            ]
                        ],
                        PM: ["508", "00", "(?:[45]|80\\d\\d)\\d{5}", [6, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[45]"], "0$1"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]
                            ], "0"
                        ],
                        PR: ["1", "011", "(?:[589]\\d\\d|787)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "787|939"],
                        PS: ["970", "00", "[2489]2\\d{6}|(?:1\\d|5)\\d{8}", [8, 9, 10],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2489]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]
                            ], "0"
                        ],
                        PT: ["351", "00", "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["16|[236-9]"]]
                            ]
                        ],
                        PW: ["680", "01[12]", "(?:[24-8]\\d\\d|345|900)\\d{4}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]
                            ]
                        ],
                        PY: ["595", "00", "59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}", [6, 7, 8, 9, 10, 11],
                            [
                                ["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"],
                                ["(\\d{2})(\\d{5})", "$1 $2", ["[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"], "(0$1)"],
                                ["(\\d{3})(\\d{4,5})", "$1 $2", ["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["87"]],
                                ["(\\d{3})(\\d{6})", "$1 $2", ["9(?:[5-79]|8[1-6])"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]
                            ], "0"
                        ],
                        QA: ["974", "00", "[2-7]\\d{7}|800\\d{4}(?:\\d{2})?|2\\d{6}", [7, 8, 9],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["2[126]|8"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]"]]
                            ]
                        ],
                        RE: ["262", "00", "976\\d{6}|(?:26|[68]\\d)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2689]"], "0$1"]
                            ], "0", 0, 0, 0, 0, "26[23]|69|[89]"
                        ],
                        RO: ["40", "00", "(?:[2378]\\d|90)\\d{7}|[23]\\d{5}", [6, 9],
                            [
                                ["(\\d{3})(\\d{3})", "$1 $2", ["2[3-6]", "2[3-6]\\d9"], "0$1"],
                                ["(\\d{2})(\\d{4})", "$1 $2", ["219|31"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[237-9]"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, 0, 0, " int "
                        ],
                        RS: ["381", "00", "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}", [6, 7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d{3})(\\d{3,9})", "$1 $2", ["(?:2[389]|39)0|[7-9]"], "0$1"],
                                ["(\\d{2})(\\d{5,10})", "$1 $2", ["[1-36]"], "0$1"]
                            ], "0"
                        ],
                        RU: ["7", "810", "8\\d{13}|[347-9]\\d{9}", [10, 14],
                            [
                                ["(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-6]2|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-6]2|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2"], "8 ($1)", 1],
                                ["(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]"], "8 ($1)", 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", 1],
                                ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[349]|8(?:[02-7]|1[1-8])"], "8 ($1)", 1],
                                ["(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["8"], "8 ($1)"]
                            ], "8", 0, 0, 0, 0, "3[04-689]|[489]", 0, "8~10"
                        ],
                        RW: ["250", "00", "(?:06|[27]\\d\\d|[89]00)\\d{6}", [8, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]]
                            ], "0"
                        ],
                        SA: ["966", "00", "92\\d{7}|(?:[15]|8\\d)\\d{8}", [9, 10],
                            [
                                ["(\\d{4})(\\d{5})", "$1 $2", ["9"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["81"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]
                            ], "0"
                        ],
                        SB: ["677", "0[01]", "(?:[1-6]|[7-9]\\d\\d)\\d{4}", [5, 7],
                            [
                                ["(\\d{2})(\\d{5})", "$1 $2", ["7|8[4-9]|9(?:[1-8]|9[0-8])"]]
                            ]
                        ],
                        SC: ["248", "010|0[0-2]", "800\\d{4}|(?:[249]\\d|64)\\d{5}", [7],
                            [
                                ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]|9[57]"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        SD: ["249", "00", "[19]\\d{8}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[19]"], "0$1"]
                            ], "0"
                        ],
                        SE: ["46", "00", "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}", [6, 7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], "0$1", 0, "$1 $2 $3"],
                                ["(\\d{3})(\\d{4})", "$1-$2", ["9(?:00|39|44|9)"], "0$1", 0, "$1 $2"],
                                ["(\\d{2})(\\d{3})(\\d{2})", "$1-$2 $3", ["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3"],
                                ["(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3"],
                                ["(\\d{3})(\\d{2,3})(\\d{3})", "$1-$2 $3", ["9(?:00|39|44)"], "0$1", 0, "$1 $2 $3"],
                                ["(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["10|7"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9"], "0$1", 0, "$1 $2 $3 $4"],
                                ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", ["[26]"], "0$1", 0, "$1 $2 $3 $4 $5"]
                            ], "0"
                        ],
                        SG: ["65", "0[0-3]\\d", "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}", [8, 10, 11],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[369]|8(?:0[1-5]|[1-9])"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]],
                                ["(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", ["7"]],
                                ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]
                            ]
                        ],
                        SH: ["290", "00", "(?:[256]\\d|8)\\d{3}", [4, 5], 0, 0, 0, 0, 0, 0, "[256]"],
                        SI: ["386", "00|10(?:22|66|88|99)", "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}", [5, 6, 7, 8],
                            [
                                ["(\\d{2})(\\d{3,6})", "$1 $2", ["8[09]|9"], "0$1"],
                                ["(\\d{3})(\\d{5})", "$1 $2", ["59|8"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[0139]|51|6"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-57]"], "(0$1)"]
                            ], "0", 0, 0, 0, 0, 0, 0, "00"
                        ],
                        SJ: ["47", "00", "0\\d{4}|(?:[489]\\d|[57]9)\\d{6}", [5, 8], 0, 0, 0, 0, 0, 0, "79"],
                        SK: ["421", "00", "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}", [6, 7, 9],
                            [
                                ["(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", ["21"], "0$1"],
                                ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["[3-5][1-8]1", "[3-5][1-8]1[67]"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", ["[3-5]"], "0$1"]
                            ], "0"
                        ],
                        SL: ["232", "00", "(?:[237-9]\\d|66)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{6})", "$1 $2", ["[236-9]"], "(0$1)"]
                            ], "0"
                        ],
                        SM: ["378", "00", "(?:0549|[5-7]\\d)\\d{6}", [8, 10],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]],
                                ["(\\d{4})(\\d{6})", "$1 $2", ["0"]]
                            ], 0, 0, "([89]\\d{5})$", "0549$1"
                        ],
                        SN: ["221", "00", "(?:[378]\\d|93)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]]
                            ]
                        ],
                        SO: ["252", "00", "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}", [6, 7, 8, 9],
                            [
                                ["(\\d{2})(\\d{4})", "$1 $2", ["8[125]"]],
                                ["(\\d{6})", "$1", ["[134]"]],
                                ["(\\d)(\\d{6})", "$1 $2", ["[15]|2[0-79]|3[0-46-8]|4[0-7]"]],
                                ["(\\d)(\\d{7})", "$1 $2", ["24|[67]"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[3478]|64|90"]],
                                ["(\\d{2})(\\d{5,7})", "$1 $2", ["1|28|6(?:0[5-7]|[1-35-9])|9[2-9]"]]
                            ], "0"
                        ],
                        SR: ["597", "00", "(?:[2-5]|68|[78]\\d)\\d{5}", [6, 7],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]],
                                ["(\\d{3})(\\d{3})", "$1-$2", ["[2-5]"]],
                                ["(\\d{3})(\\d{4})", "$1-$2", ["[6-8]"]]
                            ]
                        ],
                        SS: ["211", "00", "[19]\\d{8}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[19]"], "0$1"]
                            ], "0"
                        ],
                        ST: ["239", "00", "(?:22|9\\d)\\d{5}", [7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[29]"]]
                            ]
                        ],
                        SV: ["503", "00", "[267]\\d{7}|[89]00\\d{4}(?:\\d{4})?", [7, 8, 11],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[267]"]],
                                ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]]
                            ]
                        ],
                        SX: ["1", "011", "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|(5\\d{6})$", "721$1", 0, "721"],
                        SY: ["963", "00", "[1-39]\\d{8}|[1-5]\\d{7}", [8, 9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-5]"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1", 1]
                            ], "0"
                        ],
                        SZ: ["268", "00", "0800\\d{4}|(?:[237]\\d|900)\\d{6}", [8, 9],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[0237]"]],
                                ["(\\d{5})(\\d{4})", "$1 $2", ["9"]]
                            ]
                        ],
                        TA: ["290", "00", "8\\d{3}", [4], 0, 0, 0, 0, 0, 0, "8"],
                        TC: ["1", "011", "(?:[58]\\d\\d|649|900)\\d{7}", [10], 0, "1", 0, "1|([2-479]\\d{6})$", "649$1", 0, "649"],
                        TD: ["235", "00|16", "(?:22|[69]\\d|77)\\d{6}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2679]"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "00"
                        ],
                        TG: ["228", "00", "[279]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[279]"]]
                            ]
                        ],
                        TH: ["66", "00[1-9]", "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}", [8, 9, 10, 13],
                            [
                                ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13-9]"], "0$1"],
                                ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]
                            ], "0"
                        ],
                        TJ: ["992", "810", "(?:00|[1-57-9]\\d)\\d{7}", [9],
                            [
                                ["(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317"]],
                                ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[34]7|91[78]"]],
                                ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3[1-5]"]],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[0-57-9]"]]
                            ], 0, 0, 0, 0, 0, 0, 0, "8~10"
                        ],
                        TK: ["690", "00", "[2-47]\\d{3,6}", [4, 5, 6, 7]],
                        TL: ["670", "00", "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}", [7, 8],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]|70"]],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["7"]]
                            ]
                        ],
                        TM: ["993", "810", "[1-6]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"], "(8 $1)"],
                                ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-5]"], "(8 $1)"],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["6"], "8 $1"]
                            ], "8", 0, 0, 0, 0, 0, 0, "8~10"
                        ],
                        TN: ["216", "00", "[2-57-9]\\d{7}", [8],
                            [
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]"]]
                            ]
                        ],
                        TO: ["676", "00", "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}", [5, 7],
                            [
                                ["(\\d{2})(\\d{3})", "$1-$2", ["[2-4]|50|6[09]|7[0-24-69]|8[05]"]],
                                ["(\\d{4})(\\d{3})", "$1 $2", ["0"]],
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[5-9]"]]
                            ]
                        ],
                        TR: ["90", "00", "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}", [7, 10, 12, 13],
                            [
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["512|8[01589]|90"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5(?:[0-59]|61)", "5(?:[0-59]|616)", "5(?:[0-59]|6161)"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24][1-8]|3[1-9]"], "(0$1)", 1],
                                ["(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", ["80"], "0$1", 1]
                            ], "0"
                        ],
                        TT: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-46-8]\\d{6})$", "868$1", 0, "868"],
                        TV: ["688", "00", "(?:2|7\\d\\d|90)\\d{4}", [5, 6, 7],
                            [
                                ["(\\d{2})(\\d{3})", "$1 $2", ["2"]],
                                ["(\\d{2})(\\d{4})", "$1 $2", ["90"]],
                                ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]
                            ]
                        ],
                        TW: ["886", "0(?:0[25-79]|19)", "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}", [7, 8, 9, 10, 11],
                            [
                                ["(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", ["202"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[258]0"], "0$1"],
                                ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]", "[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"], "0$1"],
                                ["(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["7"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, 0, 0, "#"
                        ],
                        TZ: ["255", "00[056]", "(?:[25-8]\\d|41|90)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["5"]],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1"]
                            ], "0"
                        ],
                        UA: ["380", "00", "[89]\\d{9}|[3-9]\\d{8}", [9, 10],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]", "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]"], "0$1"],
                                ["(\\d{4})(\\d{5})", "$1 $2", ["3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6(?:[12][3-7]|[459])", "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6(?:[12][3-7]|[459])"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|89|9[1-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, 0, "0~0"
                        ],
                        UG: ["256", "00[057]", "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}", [9],
                            [
                                ["(\\d{4})(\\d{5})", "$1 $2", ["202", "2024"], "0$1"],
                                ["(\\d{3})(\\d{6})", "$1 $2", ["[27-9]|4(?:6[45]|[7-9])"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["[34]"], "0$1"]
                            ], "0"
                        ],
                        US: ["1", "011", "[2-9]\\d{9}|3\\d{6}", [10],
                            [
                                ["(\\d{3})(\\d{4})", "$1-$2", ["310"], 0, 1],
                                ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", ["[2-9]"], 0, 1, "$1-$2-$3"]
                            ], "1", 0, 0, 0, 0, 0, [
                                ["505(?:[2-57-9]\\d\\d|6(?:[0-35-9]\\d|44))\\d{4}|(?:2(?:0[1-35-9]|1[02-9]|2[03-589]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[01356]|3[0-24679]|4[167]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[349]|7[0589]|8[04])|5(?:0[1-47-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-47]|7[0-5]|8[0256])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[01679]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[068]|3[0-289]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01357-9]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}"],
                                [""],
                                ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"],
                                ["900[2-9]\\d{6}"],
                                ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[125-7]|33|44|66|77|88)[2-9]\\d{6}"]
                            ]
                        ],
                        UY: ["598", "0(?:0|1[3-9]\\d)", "4\\d{9}|[1249]\\d{7}|(?:[49]\\d|80)\\d{5}", [7, 8, 10],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["405|8|90"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"],
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[124]"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["4"], "0$1"]
                            ], "0", 0, 0, 0, 0, 0, 0, "00", " int. "
                        ],
                        UZ: ["998", "810", "(?:33|55|[679]\\d|88)\\d{7}", [9],
                            [
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[35-9]"], "8 $1"]
                            ], "8", 0, 0, 0, 0, 0, 0, "8~10"
                        ],
                        VA: ["39", "00", "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}", [6, 7, 8, 9, 10, 11], 0, 0, 0, 0, 0, 0, "06698"],
                        VC: ["1", "011", "(?:[58]\\d\\d|784|900)\\d{7}", [10], 0, "1", 0, "1|([2-7]\\d{6})$", "784$1", 0, "784"],
                        VE: ["58", "00", "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}", [10],
                            [
                                ["(\\d{3})(\\d{7})", "$1-$2", ["[24-689]"], "0$1"]
                            ], "0"
                        ],
                        VG: ["1", "011", "(?:284|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "1|([2-578]\\d{6})$", "284$1", 0, "284"],
                        VI: ["1", "011", "[58]\\d{9}|(?:34|90)0\\d{7}", [10], 0, "1", 0, "1|([2-9]\\d{6})$", "340$1", 0, "340"],
                        VN: ["84", "00", "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}", [7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{5})", "$1 $2", ["80"], "0$1", 1],
                                ["(\\d{4})(\\d{4,6})", "$1 $2", ["1"], 0, 1],
                                ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[69]"], "0$1", 1],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[3578]"], "0$1", 1],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2[48]"], "0$1", 1],
                                ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["2"], "0$1", 1]
                            ], "0"
                        ],
                        VU: ["678", "00", "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}", [5, 7],
                            [
                                ["(\\d{3})(\\d{4})", "$1 $2", ["[57-9]"]]
                            ]
                        ],
                        WF: ["681", "00", "(?:40|72)\\d{4}|8\\d{5}(?:\\d{3})?", [6, 9],
                            [
                                ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[478]"]],
                                ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]
                            ]
                        ],
                        WS: ["685", "0", "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}", [5, 6, 7, 10],
                            [
                                ["(\\d{5})", "$1", ["[2-5]|6[1-9]"]],
                                ["(\\d{3})(\\d{3,7})", "$1 $2", ["[68]"]],
                                ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]
                            ]
                        ],
                        XK: ["383", "00", "[23]\\d{7,8}|(?:4\\d\\d|[89]00)\\d{5}", [8, 9],
                            [
                                ["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-4]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[23]"], "0$1"]
                            ], "0"
                        ],
                        YE: ["967", "00", "(?:1|7\\d)\\d{7}|[1-7]\\d{6}", [7, 8, 9],
                            [
                                ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7[24-68]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"]
                            ], "0"
                        ],
                        YT: ["262", "00", "80\\d{7}|(?:26|63)9\\d{6}", [9], 0, "0", 0, 0, 0, 0, "269|63"],
                        ZA: ["27", "00", "[1-79]\\d{8}|8\\d{4,9}", [5, 6, 7, 8, 9, 10],
                            [
                                ["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-9]"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]
                            ], "0"
                        ],
                        ZM: ["260", "00", "800\\d{6}|(?:21|63|[79]\\d)\\d{7}", [9],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[28]"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["[79]"], "0$1"]
                            ], "0"
                        ],
                        ZW: ["263", "00", "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}", [5, 6, 7, 8, 9, 10],
                            [
                                ["(\\d{3})(\\d{3,5})", "$1 $2", ["2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]"], "0$1"],
                                ["(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["[49]"], "0$1"],
                                ["(\\d{3})(\\d{4})", "$1 $2", ["80"], "0$1"],
                                ["(\\d{2})(\\d{7})", "$1 $2", ["24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2", "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"], "(0$1)"],
                                ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
                                ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)", "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"], "0$1"],
                                ["(\\d{4})(\\d{6})", "$1 $2", ["8"], "0$1"],
                                ["(\\d{2})(\\d{3,5})", "$1 $2", ["1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]"], "0$1"],
                                ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["29[013-9]|39|54"], "0$1"],
                                ["(\\d{4})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258|5483"], "0$1"]
                            ], "0"
                        ]
                    },
                    nonGeographic: {
                        800: ["800", 0, "(?:00|[1-9]\\d)\\d{6}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["\\d"]]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, ["(?:00|[1-9]\\d)\\d{6}"]]
                        ],
                        808: ["808", 0, "[1-9]\\d{7}", [8],
                            [
                                ["(\\d{4})(\\d{4})", "$1 $2", ["[1-9]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, ["[1-9]\\d{7}"]]
                        ],
                        870: ["870", 0, "7\\d{11}|[35-7]\\d{8}", [9, 12],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[35-7]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, ["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"]]
                        ],
                        878: ["878", 0, "10\\d{10}", [12],
                            [
                                ["(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", ["1"]]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["10\\d{10}"]]
                        ],
                        881: ["881", 0, "[0-36-9]\\d{8}", [9],
                            [
                                ["(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[0-36-9]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, ["[0-36-9]\\d{8}"]]
                        ],
                        882: ["882", 0, "[13]\\d{6}(?:\\d{2,5})?|285\\d{9}|(?:[19]\\d|49)\\d{6}", [7, 8, 9, 10, 11, 12],
                            [
                                ["(\\d{2})(\\d{5})", "$1 $2", ["16|342"]],
                                ["(\\d{2})(\\d{6})", "$1 $2", ["4"]],
                                ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[19]"]],
                                ["(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["3[23]"]],
                                ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"]],
                                ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["34[57]"]],
                                ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["34"]],
                                ["(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["[1-3]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, ["342\\d{4}|(?:337|49)\\d{6}|3(?:2|47|7\\d{3})\\d{7}", [7, 8, 9, 10, 12]], 0, 0, 0, 0, 0, 0, ["1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:(?:285\\d\\d|3(?:45|[69]\\d{3}))\\d|9[89])\\d{6}"]]
                        ],
                        883: ["883", 0, "(?:210|370\\d\\d)\\d{7}|51\\d{7}(?:\\d{3})?", [9, 10, 12],
                            [
                                ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"]],
                                ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["2"]],
                                ["(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"]],
                                ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[35]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["(?:210|(?:370[1-9]|51[013]0)\\d)\\d{7}|5100\\d{5}"]]
                        ],
                        888: ["888", 0, "\\d{11}", [11],
                            [
                                ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3"]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, ["\\d{11}"]]
                        ],
                        979: ["979", 0, "[1359]\\d{8}", [9],
                            [
                                ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[1359]"]]
                            ], 0, 0, 0, 0, 0, 0, [0, 0, 0, ["[1359]\\d{8}"]]
                        ]
                    }
                };

            function tK(t, e) {
                var d = Array.prototype.slice.call(e);
                return d.push(tV), t.apply(this, d)
            }

            function tW(t) {
                return (tW = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }

            function tY(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function tZ(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }

            function tz(t) {
                var e, d, r, n, o = function(t) {
                        if (Array.isArray(t)) return t
                    }(e = Array.prototype.slice.call(t)) || function(t, e) {
                        var d, r, n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (null != n) {
                            var o = [],
                                i = !0,
                                a = !1;
                            try {
                                for (n = n.call(t); !(i = (d = n.next()).done) && (o.push(d.value), o.length !== e); i = !0);
                            } catch (t) {
                                a = !0, r = t
                            } finally {
                                try {
                                    i || null == n.return || n.return()
                                } finally {
                                    if (a) throw r
                                }
                            }
                            return o
                        }
                    }(e, 4) || function(t, e) {
                        if (t) {
                            if ("string" == typeof t) return tZ(t, 4);
                            var d = Object.prototype.toString.call(t).slice(8, -1);
                            if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                            if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return tZ(t, e)
                        }
                    }(e, 4) || function() {
                        throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }(),
                    i = o[0],
                    a = o[1],
                    $ = o[2],
                    u = o[3];
                if ("string" == typeof i) d = i;
                else throw TypeError("A text for parsing must be a string.");
                if (a && "string" != typeof a)
                    if (tX(a)) $ ? (r = a, n = $) : n = a;
                    else throw Error("Invalid second argument: ".concat(a));
                else u ? (r = $, n = u) : (r = void 0, n = $), a && (r = function(t) {
                    for (var e = 1; e < arguments.length; e++) {
                        var d = null != arguments[e] ? arguments[e] : {};
                        e % 2 ? tY(Object(d), !0).forEach(function(e) {
                            var r, n, o;
                            r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                                value: o,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }) : r[n] = o
                        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : tY(Object(d)).forEach(function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                        })
                    }
                    return t
                }({
                    defaultCountry: a
                }, r));
                return {
                    text: d,
                    options: r,
                    metadata: n
                }
            }
            var tX = function(t) {
                    return "object" === tW(t)
                },
                tJ = "0-9０-９٠-٩۰-۹",
                tQ = "".concat("-‐-―−ー－").concat("／/").concat("．.").concat(" \xa0\xad​⁠　").concat("()（）［］\\[\\]").concat("~⁓∼～"),
                tq = "+＋";

            function t0(t) {
                return (t0 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }

            function t1(t) {
                if (void 0 === t) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }

            function t2(t) {
                var e = "function" == typeof Map ? new(window[window.TiktokAnalyticsObject || "ttq"] ? ._ttq_map || Map) : void 0;
                return (t2 = function(t) {
                    var d;
                    if (null === t || (d = t, -1 === Function.toString.call(d).indexOf("[native code]"))) return t;
                    if ("function" != typeof t) throw TypeError("Super expression must either be null or a function");
                    if (void 0 !== e) {
                        if (e.has(t)) return e.get(t);
                        e.set(t, r)
                    }

                    function r() {
                        return t3(t, arguments, t8(this).constructor)
                    }
                    return r.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: r,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t9(r, t)
                })(t)
            }

            function t3(t, e, d) {
                return (t3 = t4() ? Reflect.construct : function(t, e, d) {
                    var r = [null];
                    r.push.apply(r, e);
                    var n = new(Function.bind.apply(t, r));
                    return d && t9(n, d.prototype), n
                }).apply(null, arguments)
            }

            function t4() {
                if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                } catch (t) {
                    return !1
                }
            }

            function t9(t, e) {
                return (t9 = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e, t
                })(t, e)
            }

            function t8(t) {
                return (t8 = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                })(t)
            }
            var t6 = function(t) {
                if ("function" != typeof t && null !== t) throw TypeError("Super expression must either be null or a function");
                r.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: r,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(r, "prototype", {
                    writable: !1
                }), t && t9(r, t);
                var e, d = (e = t4(), function() {
                    var t, d = t8(r);
                    return t = e ? Reflect.construct(d, arguments, t8(this).constructor) : d.apply(this, arguments),
                        function(t, e) {
                            if (e && ("object" === t0(e) || "function" == typeof e)) return e;
                            if (void 0 !== e) throw TypeError("Derived constructors may only return object or undefined");
                            return t1(t)
                        }(this, t)
                });

                function r(t) {
                    var e;
                    if (!(this instanceof r)) throw TypeError("Cannot call a class as a function");
                    return Object.setPrototypeOf(t1(e = d.call(this, t)), r.prototype), e.name = e.constructor.name, e
                }
                return Object.defineProperty(r, "prototype", {
                    writable: !1
                }), r
            }(t2(Error));

            function t5(t, e) {
                t = t.split("-"), e = e.split("-");
                for (var d = t[0].split("."), r = e[0].split("."), n = 0; n < 3; n++) {
                    var o = Number(d[n]),
                        i = Number(r[n]);
                    if (o > i) return 1;
                    if (i > o) return -1;
                    if (!isNaN(o) && isNaN(i)) return 1;
                    if (isNaN(o) && !isNaN(i)) return -1
                }
                return t[1] && e[1] ? t[1] > e[1] ? 1 : t[1] < e[1] ? -1 : 0 : !t[1] && e[1] ? 1 : t[1] && !e[1] ? -1 : 0
            }

            function t7(t) {
                return (t7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }

            function et(t, e) {
                if (!(t instanceof e)) throw TypeError("Cannot call a class as a function")
            }

            function ee(t, e) {
                for (var d = 0; d < e.length; d++) {
                    var r = e[d];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }

            function ed(t, e, d) {
                return e && ee(t.prototype, e), d && ee(t, d), Object.defineProperty(t, "prototype", {
                    writable: !1
                }), t
            }
            var er = " ext. ",
                en = /^\d+$/,
                eo = function() {
                    function t(e) {
                        et(this, t),
                            function(t) {
                                if (!t) throw Error("[libphonenumber-js] `metadata` argument not passed. Check your arguments.");
                                if (!ec(t) || !ec(t.countries)) throw Error("[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(ec(t) ? "an object of shape: { " + Object.keys(t).join(", ") + " }" : "a " + es(t) + ": " + t, "."))
                            }(e), this.metadata = e, eh.call(this, e)
                    }
                    return ed(t, [{
                        key: "getCountries",
                        value: function() {
                            return Object.keys(this.metadata.countries).filter(function(t) {
                                return "001" !== t
                            })
                        }
                    }, {
                        key: "getCountryMetadata",
                        value: function(t) {
                            return this.metadata.countries[t]
                        }
                    }, {
                        key: "nonGeographic",
                        value: function() {
                            if (!this.v1 && !this.v2 && !this.v3) return this.metadata.nonGeographic || this.metadata.nonGeographical
                        }
                    }, {
                        key: "hasCountry",
                        value: function(t) {
                            return void 0 !== this.getCountryMetadata(t)
                        }
                    }, {
                        key: "hasCallingCode",
                        value: function(t) {
                            if (this.getCountryCodesForCallingCode(t)) return !0;
                            if (this.nonGeographic()) {
                                if (this.nonGeographic()[t]) return !0
                            } else {
                                var e = this.countryCallingCodes()[t];
                                if (e && 1 === e.length && "001" === e[0]) return !0
                            }
                        }
                    }, {
                        key: "isNonGeographicCallingCode",
                        value: function(t) {
                            return this.nonGeographic() ? !!this.nonGeographic()[t] : !this.getCountryCodesForCallingCode(t)
                        }
                    }, {
                        key: "country",
                        value: function(t) {
                            return this.selectNumberingPlan(t)
                        }
                    }, {
                        key: "selectNumberingPlan",
                        value: function(t, e) {
                            if (t && en.test(t) && (e = t, t = null), t && "001" !== t) {
                                if (!this.hasCountry(t)) throw Error("Unknown country: ".concat(t));
                                this.numberingPlan = new ei(this.getCountryMetadata(t), this)
                            } else if (e) {
                                if (!this.hasCallingCode(e)) throw Error("Unknown calling code: ".concat(e));
                                this.numberingPlan = new ei(this.getNumberingPlanMetadata(e), this)
                            } else this.numberingPlan = void 0;
                            return this
                        }
                    }, {
                        key: "getCountryCodesForCallingCode",
                        value: function(t) {
                            var e = this.countryCallingCodes()[t];
                            if (e) {
                                if (1 === e.length && 3 === e[0].length) return;
                                return e
                            }
                        }
                    }, {
                        key: "getCountryCodeForCallingCode",
                        value: function(t) {
                            var e = this.getCountryCodesForCallingCode(t);
                            if (e) return e[0]
                        }
                    }, {
                        key: "getNumberingPlanMetadata",
                        value: function(t) {
                            var e = this.getCountryCodeForCallingCode(t);
                            if (e) return this.getCountryMetadata(e);
                            if (this.nonGeographic()) {
                                var d = this.nonGeographic()[t];
                                if (d) return d
                            } else {
                                var r = this.countryCallingCodes()[t];
                                if (r && 1 === r.length && "001" === r[0]) return this.metadata.countries["001"]
                            }
                        }
                    }, {
                        key: "countryCallingCode",
                        value: function() {
                            return this.numberingPlan.callingCode()
                        }
                    }, {
                        key: "IDDPrefix",
                        value: function() {
                            return this.numberingPlan.IDDPrefix()
                        }
                    }, {
                        key: "defaultIDDPrefix",
                        value: function() {
                            return this.numberingPlan.defaultIDDPrefix()
                        }
                    }, {
                        key: "nationalNumberPattern",
                        value: function() {
                            return this.numberingPlan.nationalNumberPattern()
                        }
                    }, {
                        key: "possibleLengths",
                        value: function() {
                            return this.numberingPlan.possibleLengths()
                        }
                    }, {
                        key: "formats",
                        value: function() {
                            return this.numberingPlan.formats()
                        }
                    }, {
                        key: "nationalPrefixForParsing",
                        value: function() {
                            return this.numberingPlan.nationalPrefixForParsing()
                        }
                    }, {
                        key: "nationalPrefixTransformRule",
                        value: function() {
                            return this.numberingPlan.nationalPrefixTransformRule()
                        }
                    }, {
                        key: "leadingDigits",
                        value: function() {
                            return this.numberingPlan.leadingDigits()
                        }
                    }, {
                        key: "hasTypes",
                        value: function() {
                            return this.numberingPlan.hasTypes()
                        }
                    }, {
                        key: "type",
                        value: function(t) {
                            return this.numberingPlan.type(t)
                        }
                    }, {
                        key: "ext",
                        value: function() {
                            return this.numberingPlan.ext()
                        }
                    }, {
                        key: "countryCallingCodes",
                        value: function() {
                            return this.v1 ? this.metadata.country_phone_code_to_countries : this.metadata.country_calling_codes
                        }
                    }, {
                        key: "chooseCountryByCountryCallingCode",
                        value: function(t) {
                            return this.selectNumberingPlan(t)
                        }
                    }, {
                        key: "hasSelectedNumberingPlan",
                        value: function() {
                            return void 0 !== this.numberingPlan
                        }
                    }]), t
                }(),
                ei = function() {
                    function t(e, d) {
                        et(this, t), this.globalMetadataObject = d, this.metadata = e, eh.call(this, d.metadata)
                    }
                    return ed(t, [{
                        key: "callingCode",
                        value: function() {
                            return this.metadata[0]
                        }
                    }, {
                        key: "getDefaultCountryMetadataForRegion",
                        value: function() {
                            return this.globalMetadataObject.getNumberingPlanMetadata(this.callingCode())
                        }
                    }, {
                        key: "IDDPrefix",
                        value: function() {
                            if (!this.v1 && !this.v2) return this.metadata[1]
                        }
                    }, {
                        key: "defaultIDDPrefix",
                        value: function() {
                            if (!this.v1 && !this.v2) return this.metadata[12]
                        }
                    }, {
                        key: "nationalNumberPattern",
                        value: function() {
                            return this.v1 || this.v2 ? this.metadata[1] : this.metadata[2]
                        }
                    }, {
                        key: "possibleLengths",
                        value: function() {
                            if (!this.v1) return this.metadata[this.v2 ? 2 : 3]
                        }
                    }, {
                        key: "_getFormats",
                        value: function(t) {
                            return t[this.v1 ? 2 : this.v2 ? 3 : 4]
                        }
                    }, {
                        key: "formats",
                        value: function() {
                            var t = this;
                            return (this._getFormats(this.metadata) || this._getFormats(this.getDefaultCountryMetadataForRegion()) || []).map(function(e) {
                                return new ea(e, t)
                            })
                        }
                    }, {
                        key: "nationalPrefix",
                        value: function() {
                            return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5]
                        }
                    }, {
                        key: "_getNationalPrefixFormattingRule",
                        value: function(t) {
                            return t[this.v1 ? 4 : this.v2 ? 5 : 6]
                        }
                    }, {
                        key: "nationalPrefixFormattingRule",
                        value: function() {
                            return this._getNationalPrefixFormattingRule(this.metadata) || this._getNationalPrefixFormattingRule(this.getDefaultCountryMetadataForRegion())
                        }
                    }, {
                        key: "_nationalPrefixForParsing",
                        value: function() {
                            return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7]
                        }
                    }, {
                        key: "nationalPrefixForParsing",
                        value: function() {
                            return this._nationalPrefixForParsing() || this.nationalPrefix()
                        }
                    }, {
                        key: "nationalPrefixTransformRule",
                        value: function() {
                            return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8]
                        }
                    }, {
                        key: "_getNationalPrefixIsOptionalWhenFormatting",
                        value: function() {
                            return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9]
                        }
                    }, {
                        key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
                        value: function() {
                            return this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this.getDefaultCountryMetadataForRegion())
                        }
                    }, {
                        key: "leadingDigits",
                        value: function() {
                            return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10]
                        }
                    }, {
                        key: "types",
                        value: function() {
                            return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11]
                        }
                    }, {
                        key: "hasTypes",
                        value: function() {
                            return (!this.types() || 0 !== this.types().length) && !!this.types()
                        }
                    }, {
                        key: "type",
                        value: function(t) {
                            if (this.hasTypes() && el(this.types(), t)) return new eu(el(this.types(), t), this)
                        }
                    }, {
                        key: "ext",
                        value: function() {
                            return this.v1 || this.v2 ? er : this.metadata[13] || er
                        }
                    }]), t
                }(),
                ea = function() {
                    function t(e, d) {
                        et(this, t), this._format = e, this.metadata = d
                    }
                    return ed(t, [{
                        key: "pattern",
                        value: function() {
                            return this._format[0]
                        }
                    }, {
                        key: "format",
                        value: function() {
                            return this._format[1]
                        }
                    }, {
                        key: "leadingDigitsPatterns",
                        value: function() {
                            return this._format[2] || []
                        }
                    }, {
                        key: "nationalPrefixFormattingRule",
                        value: function() {
                            return this._format[3] || this.metadata.nationalPrefixFormattingRule()
                        }
                    }, {
                        key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
                        value: function() {
                            return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat()
                        }
                    }, {
                        key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
                        value: function() {
                            return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat()
                        }
                    }, {
                        key: "usesNationalPrefix",
                        value: function() {
                            return !(!this.nationalPrefixFormattingRule() || e$.test(this.nationalPrefixFormattingRule()))
                        }
                    }, {
                        key: "internationalFormat",
                        value: function() {
                            return this._format[5] || this.format()
                        }
                    }]), t
                }(),
                e$ = /^\(?\$1\)?$/,
                eu = function() {
                    function t(e, d) {
                        et(this, t), this.type = e, this.metadata = d
                    }
                    return ed(t, [{
                        key: "pattern",
                        value: function() {
                            return this.metadata.v1 ? this.type : this.type[0]
                        }
                    }, {
                        key: "possibleLengths",
                        value: function() {
                            if (!this.metadata.v1) return this.type[1] || this.metadata.possibleLengths()
                        }
                    }]), t
                }();

            function el(t, e) {
                switch (e) {
                    case "FIXED_LINE":
                        return t[0];
                    case "MOBILE":
                        return t[1];
                    case "TOLL_FREE":
                        return t[2];
                    case "PREMIUM_RATE":
                        return t[3];
                    case "PERSONAL_NUMBER":
                        return t[4];
                    case "VOICEMAIL":
                        return t[5];
                    case "UAN":
                        return t[6];
                    case "PAGER":
                        return t[7];
                    case "VOIP":
                        return t[8];
                    case "SHARED_COST":
                        return t[9]
                }
            }
            var ec = function(t) {
                    return "object" === t7(t)
                },
                es = function(t) {
                    return t7(t)
                };

            function ef(t, e) {
                if ((e = new eo(e)).hasCountry(t)) return e.country(t).countryCallingCode();
                throw Error("Unknown country: ".concat(t))
            }

            function eh(t) {
                var e = t.version;
                "number" == typeof e ? (this.v1 = 1 === e, this.v2 = 2 === e, this.v3 = 3 === e, this.v4 = 4 === e) : e ? -1 === t5(e, "1.2.0") ? this.v2 = !0 : -1 === t5(e, "1.7.35") ? this.v3 = !0 : this.v4 = !0 : this.v1 = !0
            }
            var ep = function(t) {
                return "([".concat(tJ, "]{1,").concat(t, "})")
            };

            function ey(t) {
                var e = "[ \xa0\\t,]*",
                    d = "[:\\.．]?[ \xa0\\t,-]*",
                    r = "[ \xa0\\t]*";
                return ";ext=" + ep("20") + "|" + (e + "(?:e?xt(?:ensi(?:ó?|\xf3))?n?|ｅ?ｘｔｎ?|доб|anexo)" + d + ep("20")) + "#?|" + (e + "(?:[xｘ#＃~～]|int|ｉｎｔ)" + d + ep("9")) + "#?|" + ("[- ]+" + ep("6")) + "#|" + (r + "(?:,{2}|;)" + d + ep("15")) + "#?|" + (r + "(?:,)+" + d + ep("9")) + "#?"
            }
            var em = "[" + tq + "]{0,1}(?:[" + tQ + "]*[" + tJ + "]){3,}[" + tQ + tJ + "]*",
                ev = RegExp("^[" + tq + "]{0,1}(?:[" + tQ + "]*[" + tJ + "]){1,2}$", "i"),
                eg = RegExp("^[" + tJ + "]{2}$|^" + (em + "(?:" + ey()) + ")?$", "i");

            function eb(t) {
                return t.length >= 2 && eg.test(t)
            }
            var e_ = RegExp("(?:" + ey() + ")$", "i"),
                eO = {
                    0: "0",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    "０": "0",
                    "１": "1",
                    "２": "2",
                    "３": "3",
                    "４": "4",
                    "５": "5",
                    "６": "6",
                    "７": "7",
                    "８": "8",
                    "９": "9",
                    "٠": "0",
                    "١": "1",
                    "٢": "2",
                    "٣": "3",
                    "٤": "4",
                    "٥": "5",
                    "٦": "6",
                    "٧": "7",
                    "٨": "8",
                    "٩": "9",
                    "۰": "0",
                    "۱": "1",
                    "۲": "2",
                    "۳": "3",
                    "۴": "4",
                    "۵": "5",
                    "۶": "6",
                    "۷": "7",
                    "۸": "8",
                    "۹": "9"
                };

            function eN(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }

            function eP(t) {
                for (var e, d = "", r = function(t, e) {
                        var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (d) return (d = d.call(t)).next.bind(d);
                        if (Array.isArray(t) || (d = function(t, e) {
                                if (t) {
                                    if ("string" == typeof t) return eN(t, void 0);
                                    var d = Object.prototype.toString.call(t).slice(8, -1);
                                    if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                                    if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return eN(t, e)
                                }
                            }(t))) {
                            d && (t = d);
                            var r = 0;
                            return function() {
                                return r >= t.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: t[r++]
                                }
                            }
                        }
                        throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }(t.split("")); !(e = r()).done;) {
                    var n = e.value;
                    d += function(t, e) {
                        if ("+" === t) {
                            if (e) return;
                            return "+"
                        }
                        return eO[t]
                    }(n, d) || ""
                }
                return d
            }

            function ew(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }

            function eE(t, e) {
                return function t(e, d, r) {
                    var n = r.type(d),
                        o = n && n.possibleLengths() || r.possibleLengths();
                    if (!o) return "IS_POSSIBLE";
                    if ("FIXED_LINE_OR_MOBILE" === d) {
                        if (!r.type("FIXED_LINE")) return t(e, "MOBILE", r);
                        var i = r.type("MOBILE");
                        i && (o = function(t, e) {
                            for (var d, r = t.slice(), n = function(t, e) {
                                    var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                    if (d) return (d = d.call(t)).next.bind(d);
                                    if (Array.isArray(t) || (d = function(t, e) {
                                            if (t) {
                                                if ("string" == typeof t) return ew(t, void 0);
                                                var d = Object.prototype.toString.call(t).slice(8, -1);
                                                if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                                                if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return ew(t, e)
                                            }
                                        }(t))) {
                                        d && (t = d);
                                        var r = 0;
                                        return function() {
                                            return r >= t.length ? {
                                                done: !0
                                            } : {
                                                done: !1,
                                                value: t[r++]
                                            }
                                        }
                                    }
                                    throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                }(e); !(d = n()).done;) {
                                var o = d.value;
                                0 > t.indexOf(o) && r.push(o)
                            }
                            return r.sort(function(t, e) {
                                return t - e
                            })
                        }(o, i.possibleLengths()))
                    } else if (d && !n) return "INVALID_LENGTH";
                    var a = e.length,
                        $ = o[0];
                    return $ === a ? "IS_POSSIBLE" : $ > a ? "TOO_SHORT" : o[o.length - 1] < a ? "TOO_LONG" : o.indexOf(a, 1) >= 0 ? "IS_POSSIBLE" : "INVALID_LENGTH"
                }(t, void 0, e)
            }

            function eC(t, e) {
                return "IS_POSSIBLE" === eE(t, e)
            }

            function eI(t, e) {
                if (t) {
                    if ("string" == typeof t) return eS(t, e);
                    var d = Object.prototype.toString.call(t).slice(8, -1);
                    if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                    if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return eS(t, e)
                }
            }

            function eS(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }

            function eL(t, e) {
                return t = t || "", RegExp("^(?:" + e + ")$").test(t)
            }

            function eA(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }
            var eT = ["MOBILE", "PREMIUM_RATE", "TOLL_FREE", "SHARED_COST", "VOIP", "PERSONAL_NUMBER", "PAGER", "UAN", "VOICEMAIL"];

            function ex(t, e, d) {
                if (e = e || {}, t.country) {
                    (d = new eo(d)).selectNumberingPlan(t.country, t.countryCallingCode);
                    var r = e.v2 ? t.nationalNumber : t.phone;
                    if (eL(r, d.nationalNumberPattern())) {
                        if (eD(r, "FIXED_LINE", d)) return d.type("MOBILE") && "" === d.type("MOBILE").pattern() || !d.type("MOBILE") || eD(r, "MOBILE", d) ? "FIXED_LINE_OR_MOBILE" : "FIXED_LINE";
                        for (var n, o = function(t, e) {
                                var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                if (d) return (d = d.call(t)).next.bind(d);
                                if (Array.isArray(t) || (d = function(t, e) {
                                        if (t) {
                                            if ("string" == typeof t) return eA(t, void 0);
                                            var d = Object.prototype.toString.call(t).slice(8, -1);
                                            if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                                            if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return eA(t, e)
                                        }
                                    }(t))) {
                                    d && (t = d);
                                    var r = 0;
                                    return function() {
                                        return r >= t.length ? {
                                            done: !0
                                        } : {
                                            done: !1,
                                            value: t[r++]
                                        }
                                    }
                                }
                                throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                            }(eT); !(n = o()).done;) {
                            var i = n.value;
                            if (eD(r, i, d)) return i
                        }
                    }
                }
            }

            function eD(t, e, d) {
                return !(!(e = d.type(e)) || !e.pattern() || e.possibleLengths() && 0 > e.possibleLengths().indexOf(t.length)) && eL(t, e.pattern())
            }
            var ej = /(\$\d)/,
                eR = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/;

            function eM(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }

            function ek(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function eF(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var d = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? ek(Object(d), !0).forEach(function(e) {
                        var r, n, o;
                        r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[n] = o
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : ek(Object(d)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                    })
                }
                return t
            }
            var eB = {
                formatExtension: function(t, e, d) {
                    return "".concat(t).concat(d.ext()).concat(e)
                }
            };

            function eH(t, e, d, r, n) {
                var o, i, a, $, u, l, c = function(t, e) {
                    for (var d, r = function(t, e) {
                            var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                            if (d) return (d = d.call(t)).next.bind(d);
                            if (Array.isArray(t) || (d = function(t, e) {
                                    if (t) {
                                        if ("string" == typeof t) return eM(t, void 0);
                                        var d = Object.prototype.toString.call(t).slice(8, -1);
                                        if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                                        if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return eM(t, e)
                                    }
                                }(t))) {
                                d && (t = d);
                                var r = 0;
                                return function() {
                                    return r >= t.length ? {
                                        done: !0
                                    } : {
                                        done: !1,
                                        value: t[r++]
                                    }
                                }
                            }
                            throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }(t); !(d = r()).done;) {
                        var n = d.value;
                        if (n.leadingDigitsPatterns().length > 0) {
                            var o = n.leadingDigitsPatterns()[n.leadingDigitsPatterns().length - 1];
                            if (0 !== e.search(o)) continue
                        }
                        if (eL(e, n.pattern())) return n
                    }
                }(r.formats(), t);
                return c ? (o = t, i = c, $ = (a = {
                    useInternationalFormat: "INTERNATIONAL" === d,
                    withNationalPrefix: !c.nationalPrefixIsOptionalWhenFormattingInNationalFormat() || !n || !1 !== n.nationalPrefix,
                    carrierCode: e,
                    metadata: r
                }).useInternationalFormat, u = a.withNationalPrefix, a.carrierCode, a.metadata, l = o.replace(new RegExp(i.pattern()), $ ? i.internationalFormat() : u && i.nationalPrefixFormattingRule() ? i.format().replace(ej, i.nationalPrefixFormattingRule()) : i.format()), $ ? l.replace(RegExp("[".concat(tQ, "]+"), "g"), " ").trim() : l) : t
            }

            function eG(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function eU(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var d = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? eG(Object(d), !0).forEach(function(e) {
                        var r, n, o;
                        r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[n] = o
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : eG(Object(d)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                    })
                }
                return t
            }
            var eV = function() {
                    var t;

                    function e(t, d, r) {
                        if (!(this instanceof e)) throw TypeError("Cannot call a class as a function");
                        if (!t) throw TypeError("`country` or `countryCallingCode` not passed");
                        if (!d) throw TypeError("`nationalNumber` not passed");
                        if (!r) throw TypeError("`metadata` not passed");
                        var n = new eo(r);
                        eK(t) && (this.country = t, n.country(t), t = n.countryCallingCode()), this.countryCallingCode = t, this.nationalNumber = d, this.number = "+" + this.countryCallingCode + this.nationalNumber, this.metadata = r
                    }
                    return t = [{
                            key: "setExt",
                            value: function(t) {
                                this.ext = t
                            }
                        }, {
                            key: "isPossible",
                            value: function() {
                                return function(t, e, d) {
                                    if (void 0 === e && (e = {}), d = new eo(d), e.v2) {
                                        if (!t.countryCallingCode) throw Error("Invalid phone number object passed");
                                        d.selectNumberingPlan(t.countryCallingCode)
                                    } else {
                                        if (!t.phone) return !1;
                                        if (t.country) {
                                            if (!d.hasCountry(t.country)) throw Error("Unknown country: ".concat(t.country));
                                            d.country(t.country)
                                        } else {
                                            if (!t.countryCallingCode) throw Error("Invalid phone number object passed");
                                            d.selectNumberingPlan(t.countryCallingCode)
                                        }
                                    }
                                    if (d.possibleLengths()) return eC(t.phone || t.nationalNumber, d);
                                    if (t.countryCallingCode && d.isNonGeographicCallingCode(t.countryCallingCode)) return !0;
                                    throw Error('Missing "possibleLengths" in metadata. Perhaps the metadata has been generated before v1.0.18.')
                                }(this, {
                                    v2: !0
                                }, this.metadata)
                            }
                        }, {
                            key: "isValid",
                            value: function() {
                                var t, e;
                                return t = t = {
                                    v2: !0
                                }, e = new eo(e = this.metadata), !!this.country && ((e.selectNumberingPlan(this.country, this.countryCallingCode), e.hasTypes()) ? void 0 !== ex(this, t, e.metadata) : eL(t.v2 ? this.nationalNumber : this.phone, e.nationalNumberPattern()))
                            }
                        }, {
                            key: "isNonGeographic",
                            value: function() {
                                return new eo(this.metadata).isNonGeographicCallingCode(this.countryCallingCode)
                            }
                        }, {
                            key: "isEqual",
                            value: function(t) {
                                return this.number === t.number && this.ext === t.ext
                            }
                        }, {
                            key: "getType",
                            value: function() {
                                return ex(this, {
                                    v2: !0
                                }, this.metadata)
                            }
                        }, {
                            key: "format",
                            value: function(t, e) {
                                return function(t, e, d, r) {
                                    if (d = d ? eF(eF({}, eB), d) : eB, r = new eo(r), t.country && "001" !== t.country) {
                                        if (!r.hasCountry(t.country)) throw Error("Unknown country: ".concat(t.country));
                                        r.country(t.country)
                                    } else {
                                        if (!t.countryCallingCode) return t.phone || "";
                                        r.selectNumberingPlan(t.countryCallingCode)
                                    }
                                    var n, o, i, a, $, u, l, c, s, f, h, p, y, m = r.countryCallingCode(),
                                        v = d.v2 ? t.nationalNumber : t.phone;
                                    switch (e) {
                                        case "NATIONAL":
                                            if (!v) return "";
                                            return n = y = eH(v, t.carrierCode, "NATIONAL", r, d), o = t.ext, i = r, a = d.formatExtension, o ? a(n, o, i) : n;
                                        case "INTERNATIONAL":
                                            if (!v) return "+".concat(m);
                                            return y = eH(v, null, "INTERNATIONAL", r, d), $ = y = "+".concat(m, " ").concat(y), u = t.ext, l = r, c = d.formatExtension, u ? c($, u, l) : $;
                                        case "E.164":
                                            return "+".concat(m).concat(v);
                                        case "RFC3966":
                                            var g = {
                                                    number: "+".concat(m).concat(v),
                                                    ext: t.ext
                                                },
                                                b = g.number,
                                                _ = g.ext;
                                            if (!b) return "";
                                            if ("+" !== b[0]) throw Error('"formatRFC3966()" expects "number" to be in E.164 format.');
                                            return "tel:".concat(b).concat(_ ? ";ext=" + _ : "");
                                        case "IDD":
                                            if (!d.fromCountry) return;
                                            return s = function(t, e, d, r, n) {
                                                if (ef(r, n.metadata) === d) {
                                                    var o, i, a = eH(t, e, "NATIONAL", n);
                                                    return "1" === d ? d + " " + a : a
                                                }
                                                var $ = (o = void 0, ((i = new eo(n.metadata)).selectNumberingPlan(r, o), i.defaultIDDPrefix()) ? i.defaultIDDPrefix() : eR.test(i.IDDPrefix()) ? i.IDDPrefix() : void 0);
                                                if ($) return "".concat($, " ").concat(d, " ").concat(eH(t, null, "INTERNATIONAL", n))
                                            }(v, t.carrierCode, m, d.fromCountry, r), f = t.ext, h = r, p = d.formatExtension, f ? p(s, f, h) : s;
                                        default:
                                            throw Error('Unknown "format" argument passed to "formatNumber()": "'.concat(e, '"'))
                                    }
                                }(this, t, e ? eU(eU({}, e), {}, {
                                    v2: !0
                                }) : {
                                    v2: !0
                                }, this.metadata)
                            }
                        }, {
                            key: "formatNational",
                            value: function(t) {
                                return this.format("NATIONAL", t)
                            }
                        }, {
                            key: "formatInternational",
                            value: function(t) {
                                return this.format("INTERNATIONAL", t)
                            }
                        }, {
                            key: "getURI",
                            value: function(t) {
                                return this.format("RFC3966", t)
                            }
                        }],
                        function(t, e) {
                            for (var d = 0; d < e.length; d++) {
                                var r = e[d];
                                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                            }
                        }(e.prototype, t), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                }(),
                eK = function(t) {
                    return /^[A-Z]{2}$/.test(t)
                },
                eW = RegExp("([" + tJ + "])");

            function eY(t, e) {
                var d, r, n, o = function(t, e) {
                        if (t && e.numberingPlan.nationalPrefixForParsing()) {
                            var d = RegExp("^(?:" + e.numberingPlan.nationalPrefixForParsing() + ")"),
                                r = d.exec(t);
                            if (r) {
                                var n, o, i, a = r.length - 1,
                                    $ = a > 0 && r[a];
                                if (e.nationalPrefixTransformRule() && $) n = t.replace(d, e.nationalPrefixTransformRule()), a > 1 && (o = r[1]);
                                else {
                                    var u = r[0];
                                    n = t.slice(u.length), $ && (o = r[1])
                                }
                                if ($) {
                                    var l = t.indexOf(r[1]);
                                    t.slice(0, l) === e.numberingPlan.nationalPrefix() && (i = e.numberingPlan.nationalPrefix())
                                } else i = r[0];
                                return {
                                    nationalNumber: n,
                                    nationalPrefix: i,
                                    carrierCode: o
                                }
                            }
                        }
                        return {
                            nationalNumber: t
                        }
                    }(t, e),
                    i = o.carrierCode,
                    a = o.nationalNumber;
                return a !== t && (d = t, r = a, !(!eL(d, (n = e).nationalNumberPattern()) || eL(r, n.nationalNumberPattern())) || e.possibleLengths() && ! function(t, e) {
                    switch (eE(t, e)) {
                        case "TOO_SHORT":
                        case "INVALID_LENGTH":
                            return !1;
                        default:
                            return !0
                    }
                }(a, e)) ? {
                    nationalNumber: t
                } : {
                    nationalNumber: a,
                    carrierCode: i
                }
            }

            function eZ(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var d = 0, r = Array(e); d < e; d++) r[d] = t[d];
                return r
            }
            var ez = RegExp("[" + tq + tJ + "]"),
                eX = RegExp("[^" + tJ + "#]+$");

            function eJ(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function eQ(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var d = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? eJ(Object(d), !0).forEach(function(e) {
                        var r, n, o;
                        r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[n] = o
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : eJ(Object(d)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                    })
                }
                return t
            }

            function eq(t, e, d) {
                return function(t, e, d) {
                    if (e = e || {}, d = new eo(d), e.defaultCountry && !d.hasCountry(e.defaultCountry)) {
                        if (e.v2) throw new t6("INVALID_COUNTRY");
                        throw Error("Unknown country: ".concat(e.defaultCountry))
                    }
                    var r, n, o, i, a = function(t, e, d) {
                            if (t && 0 === t.indexOf("tel:")) return function(t) {
                                t = t.replace(/^tel:/, "tel=");
                                for (var e, d, r, n = function(t, e) {
                                        var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                        if (d) return (d = d.call(t)).next.bind(d);
                                        if (Array.isArray(t) || (d = eI(t))) {
                                            d && (t = d);
                                            var r = 0;
                                            return function() {
                                                return r >= t.length ? {
                                                    done: !0
                                                } : {
                                                    done: !1,
                                                    value: t[r++]
                                                }
                                            }
                                        }
                                        throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                    }(t.split(";")); !(r = n()).done;) {
                                    var o, i = function(t) {
                                            if (Array.isArray(t)) return t
                                        }(o = r.value.split("=")) || function(t, e) {
                                            var d, r, n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                            if (null != n) {
                                                var o = [],
                                                    i = !0,
                                                    a = !1;
                                                try {
                                                    for (n = n.call(t); !(i = (d = n.next()).done) && (o.push(d.value), o.length !== e); i = !0);
                                                } catch (t) {
                                                    a = !0, r = t
                                                } finally {
                                                    try {
                                                        i || null == n.return || n.return()
                                                    } finally {
                                                        if (a) throw r
                                                    }
                                                }
                                                return o
                                            }
                                        }(o, 2) || eI(o, 2) || function() {
                                            throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                        }(),
                                        a = i[0],
                                        $ = i[1];
                                    switch (a) {
                                        case "tel":
                                            e = $;
                                            break;
                                        case "ext":
                                            d = $;
                                            break;
                                        case "phone-context":
                                            "+" === $[0] && (e = $ + e)
                                    }
                                }
                                if (!eb(e)) return {};
                                var u = {
                                    number: e
                                };
                                return d && (u.ext = d), u
                            }(t);
                            var r = function(t, e, d) {
                                if (t) {
                                    if (t.length > 250) {
                                        if (d) throw new t6("TOO_LONG");
                                        return
                                    }
                                    if (!1 === e) return t;
                                    var r = t.search(ez);
                                    if (!(r < 0)) return t.slice(r).replace(eX, "")
                                }
                            }(t, d, e);
                            if (!r) return {};
                            if (!eb(r)) return ev.test(r) ? {
                                error: "TOO_SHORT"
                            } : {};
                            var n = function(t) {
                                var e = t.search(e_);
                                if (e < 0) return {};
                                for (var d = t.slice(0, e), r = t.match(e_), n = 1; n < r.length;) {
                                    if (r[n]) return {
                                        number: d,
                                        ext: r[n]
                                    };
                                    n++
                                }
                            }(r);
                            return n.ext ? n : {
                                number: r
                            }
                        }(t, e.v2, e.extract),
                        $ = a.number,
                        u = a.ext,
                        l = a.error;
                    if (!$) {
                        if (e.v2) {
                            if ("TOO_SHORT" === l) throw new t6("TOO_SHORT");
                            throw new t6("NOT_A_NUMBER")
                        }
                        return {}
                    }
                    var c = function(t, e, d, r) {
                            var n, o = function(t, e, d, r) {
                                    if (!t) return {};
                                    if ("+" !== t[0]) {
                                        var n = function(t, e, d, r) {
                                            if (e) {
                                                var n = new eo(r);
                                                n.selectNumberingPlan(e, d);
                                                var o = new RegExp(n.IDDPrefix());
                                                if (0 === t.search(o)) {
                                                    var i = (t = t.slice(t.match(o)[0].length)).match(eW);
                                                    if (!i || null == i[1] || !(i[1].length > 0) || "0" !== i[1]) return t
                                                }
                                            }
                                        }(t, e, d, r);
                                        if (n && n !== t) t = "+" + n;
                                        else {
                                            if (e || d) {
                                                var o = function(t, e, d, r) {
                                                        var n = e ? ef(e, r) : d;
                                                        if (0 === t.indexOf(n)) {
                                                            (r = new eo(r)).selectNumberingPlan(e, d);
                                                            var o = t.slice(n.length),
                                                                i = eY(o, r).nationalNumber,
                                                                a = eY(t, r).nationalNumber;
                                                            if (!eL(a, r.nationalNumberPattern()) && eL(i, r.nationalNumberPattern()) || "TOO_LONG" === eE(a, r)) return {
                                                                countryCallingCode: n,
                                                                number: o
                                                            }
                                                        }
                                                        return {
                                                            number: t
                                                        }
                                                    }(t, e, d, r),
                                                    i = o.countryCallingCode,
                                                    a = o.number;
                                                if (i) return {
                                                    countryCallingCode: i,
                                                    number: a
                                                }
                                            }
                                            return {
                                                number: t
                                            }
                                        }
                                    }
                                    if ("0" === t[1]) return {};
                                    r = new eo(r);
                                    for (var $ = 2; $ - 1 <= 3 && $ <= t.length;) {
                                        var u = t.slice(1, $);
                                        if (r.hasCallingCode(u)) return r.selectNumberingPlan(u), {
                                            countryCallingCode: u,
                                            number: t.slice($)
                                        };
                                        $++
                                    }
                                    return {}
                                }(eP(t), e, d, r.metadata),
                                i = o.countryCallingCode,
                                a = o.number;
                            if (i) r.selectNumberingPlan(i);
                            else {
                                if (!a || !e && !d) return {};
                                r.selectNumberingPlan(e, d), e && (n = e), i = d || ef(e, r.metadata)
                            }
                            if (!a) return {
                                countryCallingCode: i
                            };
                            var $ = eY(eP(a), r),
                                u = $.nationalNumber,
                                l = $.carrierCode,
                                c = function(t, e, d) {
                                    var r = d.getCountryCodesForCallingCode(t);
                                    if (r) return 1 === r.length ? r[0] : function(t, e, d) {
                                        d = new eo(d);
                                        for (var r, n = function(t, e) {
                                                var d = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                                if (d) return (d = d.call(t)).next.bind(d);
                                                if (Array.isArray(t) || (d = function(t, e) {
                                                        if (t) {
                                                            if ("string" == typeof t) return eZ(t, void 0);
                                                            var d = Object.prototype.toString.call(t).slice(8, -1);
                                                            if ("Object" === d && t.constructor && (d = t.constructor.name), "Map" === d || "Set" === d) return Array.from(t);
                                                            if ("Arguments" === d || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(d)) return eZ(t, e)
                                                        }
                                                    }(t))) {
                                                    d && (t = d);
                                                    var r = 0;
                                                    return function() {
                                                        return r >= t.length ? {
                                                            done: !0
                                                        } : {
                                                            done: !1,
                                                            value: t[r++]
                                                        }
                                                    }
                                                }
                                                throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                            }(t); !(r = n()).done;) {
                                            var o = r.value;
                                            if (d.country(o), d.leadingDigits()) {
                                                if (e && 0 === e.search(d.leadingDigits())) return o
                                            } else if (ex({
                                                    phone: e,
                                                    country: o
                                                }, void 0, d.metadata)) return o
                                        }
                                    }(r, e, d.metadata)
                                }(i, u, r);
                            return c && (n = c, "001" === c || r.country(n)), {
                                country: n,
                                countryCallingCode: i,
                                nationalNumber: u,
                                carrierCode: l
                            }
                        }($, e.defaultCountry, e.defaultCallingCode, d),
                        s = c.country,
                        f = c.nationalNumber,
                        h = c.countryCallingCode,
                        p = c.carrierCode;
                    if (!d.hasSelectedNumberingPlan()) {
                        if (e.v2) throw new t6("INVALID_COUNTRY");
                        return {}
                    }
                    if (!f || f.length < 2) {
                        if (e.v2) throw new t6("TOO_SHORT");
                        return {}
                    }
                    if (f.length > 17) {
                        if (e.v2) throw new t6("TOO_LONG");
                        return {}
                    }
                    if (e.v2) {
                        var y = new eV(h, f, d.metadata);
                        return s && (y.country = s), p && (y.carrierCode = p), u && (y.ext = u), y
                    }
                    var m = (e.extended ? !!d.hasSelectedNumberingPlan() : !!s) && eL(f, d.nationalNumberPattern());
                    return e.extended ? {
                        country: s,
                        countryCallingCode: h,
                        carrierCode: p,
                        valid: m,
                        possible: !!m || !!(!0 === e.extended && d.possibleLengths() && eC(f, d)),
                        phone: f,
                        ext: u
                    } : m ? (r = s, n = f, o = u, i = {
                        country: r,
                        phone: n
                    }, o && (i.ext = o), i) : {}
                }(t, eQ(eQ({}, e), {}, {
                    v2: !0
                }), d)
            }

            function e0(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function e1(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var d = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? e0(Object(d), !0).forEach(function(e) {
                        var r, n, o;
                        r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[n] = o
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : e0(Object(d)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                    })
                }
                return t
            }

            function e2() {
                var t, e = tz(arguments),
                    d = e.text,
                    r = e.options,
                    n = e.metadata,
                    o = r;
                o && o.defaultCountry && (t = o.defaultCountry, void 0 === n.countries[t]) && (o = e1(e1({}, o), {}, {
                    defaultCountry: void 0
                }));
                try {
                    return eq(d, o, n)
                } catch (t) {
                    if (t instanceof t6);
                    else throw t
                }
            }

            function e3() {
                return tK(e2, arguments)
            }

            function e4(t, e) {
                var d = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), d.push.apply(d, r)
                }
                return d
            }

            function e9(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var d = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? e4(Object(d), !0).forEach(function(e) {
                        var r, n, o;
                        r = t, n = e, o = d[e], n in r ? Object.defineProperty(r, n, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[n] = o
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(d)) : e4(Object(d)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(d, e))
                    })
                }
                return t
            }

            function e8() {
                var t = tz(arguments),
                    e = t.text,
                    d = t.options,
                    r = t.metadata;
                d = e9(e9({}, d), {}, {
                    extract: !1
                });
                try {
                    var n = eq(e, d, r);
                    (r = new eo(r)).selectNumberingPlan(n.countryCallingCode);
                    var o = eE(n.nationalNumber, r);
                    if ("IS_POSSIBLE" !== o) return o
                } catch (t) {
                    if (t instanceof t6) return t.message;
                    throw t
                }
            }

            function e6() {
                return tK(e8, arguments)
            }
            var e5 = d(674),
                e7 = d.n(e5),
                dt = function(t) {
                    return e7()(t).toString()
                };
            (B = C || (C = {})).EXTERNAL = "external", B.APP = "app", B.TIKTOK = "tiktok", Symbol.for("ID"), Symbol.for("type"), Symbol.for("partner"), Symbol.for("Options"), Symbol.for("Plugins"), Symbol.for("Rules"), Symbol.for("Info"), Symbol.for("extraParams"), Symbol.for("WebLibraryInfo"), Symbol.for("SignalType"), Symbol.for("IsOnsitePage");
            var de = function() {
                    var t, e;
                    return (null == (t = tt()) || null == (e = t._env) ? void 0 : e.env) || C.EXTERNAL
                },
                dd = function(t) {
                    return (t || de()) !== C.EXTERNAL
                };

            function dr() {
                dr = function() {
                    return t
                };
                var t = {},
                    e = Object.prototype,
                    d = e.hasOwnProperty,
                    r = Object.defineProperty || function(t, e, d) {
                        t[e] = d.value
                    },
                    n = "function" == typeof Symbol ? Symbol : {},
                    o = n.iterator || "@@iterator",
                    i = n.asyncIterator || "@@asyncIterator",
                    a = n.toStringTag || "@@toStringTag";

                function $(t, e, d) {
                    return Object.defineProperty(t, e, {
                        value: d,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }), t[e]
                }
                try {
                    $({}, "")
                } catch (t) {
                    $ = function(t, e, d) {
                        return t[e] = d
                    }
                }

                function u(t, e, d, n) {
                    var o, i, a, $, u = Object.create((e && e.prototype instanceof s ? e : s).prototype);
                    return r(u, "_invoke", {
                        value: (o = t, i = d, a = new N(n || []), $ = "suspendedStart", function(t, e) {
                            if ("executing" === $) throw Error("Generator is already running");
                            if ("completed" === $) {
                                if ("throw" === t) throw e;
                                return w()
                            }
                            for (a.method = t, a.arg = e;;) {
                                var d = a.delegate;
                                if (d) {
                                    var r = function t(e, d) {
                                        var r = d.method,
                                            n = e.iterator[r];
                                        if (void 0 === n) return d.delegate = null, "throw" === r && e.iterator.return && (d.method = "return", d.arg = void 0, t(e, d), "throw" === d.method) || "return" !== r && (d.method = "throw", d.arg = TypeError("The iterator does not provide a '" + r + "' method")), c;
                                        var o = l(n, e.iterator, d.arg);
                                        if ("throw" === o.type) return d.method = "throw", d.arg = o.arg, d.delegate = null, c;
                                        var i = o.arg;
                                        return i ? i.done ? (d[e.resultName] = i.value, d.next = e.nextLoc, "return" !== d.method && (d.method = "next", d.arg = void 0), d.delegate = null, c) : i : (d.method = "throw", d.arg = TypeError("iterator result is not an object"), d.delegate = null, c)
                                    }(d, a);
                                    if (r) {
                                        if (r === c) continue;
                                        return r
                                    }
                                }
                                if ("next" === a.method) a.sent = a._sent = a.arg;
                                else if ("throw" === a.method) {
                                    if ("suspendedStart" === $) throw $ = "completed", a.arg;
                                    a.dispatchException(a.arg)
                                } else "return" === a.method && a.abrupt("return", a.arg);
                                $ = "executing";
                                var n = l(o, i, a);
                                if ("normal" === n.type) {
                                    if ($ = a.done ? "completed" : "suspendedYield", n.arg === c) continue;
                                    return {
                                        value: n.arg,
                                        done: a.done
                                    }
                                }
                                "throw" === n.type && ($ = "completed", a.method = "throw", a.arg = n.arg)
                            }
                        })
                    }), u
                }

                function l(t, e, d) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, d)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                t.wrap = u;
                var c = {};

                function s() {}

                function f() {}

                function h() {}
                var p = {};
                $(p, o, function() {
                    return this
                });
                var y = Object.getPrototypeOf,
                    m = y && y(y(P([])));
                m && m !== e && d.call(m, o) && (p = m);
                var v = h.prototype = s.prototype = Object.create(p);

                function g(t) {
                    ["next", "throw", "return"].forEach(function(e) {
                        $(t, e, function(t) {
                            return this._invoke(e, t)
                        })
                    })
                }

                function b(t, e) {
                    var n;
                    r(this, "_invoke", {
                        value: function(r, o) {
                            function i() {
                                return new e(function(n, i) {
                                    ! function r(n, o, i, a) {
                                        var $ = l(t[n], t, o);
                                        if ("throw" !== $.type) {
                                            var u = $.arg,
                                                c = u.value;
                                            return c && "object" == typeof c && d.call(c, "__await") ? e.resolve(c.__await).then(function(t) {
                                                r("next", t, i, a)
                                            }, function(t) {
                                                r("throw", t, i, a)
                                            }) : e.resolve(c).then(function(t) {
                                                u.value = t, i(u)
                                            }, function(t) {
                                                return r("throw", t, i, a)
                                            })
                                        }
                                        a($.arg)
                                    }(r, o, n, i)
                                })
                            }
                            return n = n ? n.then(i, i) : i()
                        }
                    })
                }

                function _(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
                }

                function O(t) {
                    var e = t.completion || {};
                    e.type = "normal", delete e.arg, t.completion = e
                }

                function N(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }], t.forEach(_, this), this.reset(!0)
                }

                function P(t) {
                    if (t) {
                        var e = t[o];
                        if (e) return e.call(t);
                        if ("function" == typeof t.next) return t;
                        if (!isNaN(t.length)) {
                            var r = -1,
                                n = function e() {
                                    for (; ++r < t.length;)
                                        if (d.call(t, r)) return e.value = t[r], e.done = !1, e;
                                    return e.value = void 0, e.done = !0, e
                                };
                            return n.next = n
                        }
                    }
                    return {
                        next: w
                    }
                }

                function w() {
                    return {
                        value: void 0,
                        done: !0
                    }
                }
                return f.prototype = h, r(v, "constructor", {
                    value: h,
                    configurable: !0
                }), r(h, "constructor", {
                    value: f,
                    configurable: !0
                }), f.displayName = $(h, a, "GeneratorFunction"), t.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === f || "GeneratorFunction" === (e.displayName || e.name))
                }, t.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, h) : (t.__proto__ = h, $(t, a, "GeneratorFunction")), t.prototype = Object.create(v), t
                }, t.awrap = function(t) {
                    return {
                        __await: t
                    }
                }, g(b.prototype), $(b.prototype, i, function() {
                    return this
                }), t.AsyncIterator = b, t.async = function(e, d, r, n, o) {
                    void 0 === o && (o = Promise);
                    var i = new b(u(e, d, r, n), o);
                    return t.isGeneratorFunction(d) ? i : i.next().then(function(t) {
                        return t.done ? t.value : i.next()
                    })
                }, g(v), $(v, a, "Generator"), $(v, o, function() {
                    return this
                }), $(v, "toString", function() {
                    return "[object Generator]"
                }), t.keys = function(t) {
                    var e = Object(t),
                        d = [];
                    for (var r in e) d.push(r);
                    return d.reverse(),
                        function t() {
                            for (; d.length;) {
                                var r = d.pop();
                                if (r in e) return t.value = r, t.done = !1, t
                            }
                            return t.done = !0, t
                        }
                }, t.values = P, N.prototype = {
                    constructor: N,
                    reset: function(t) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(O), !t)
                            for (var e in this) "t" === e.charAt(0) && d.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type) throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done) throw t;
                        var e = this;

                        function r(d, r) {
                            return i.type = "throw", i.arg = t, e.next = d, r && (e.method = "next", e.arg = void 0), !!r
                        }
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var o = this.tryEntries[n],
                                i = o.completion;
                            if ("root" === o.tryLoc) return r("end");
                            if (o.tryLoc <= this.prev) {
                                var a = d.call(o, "catchLoc"),
                                    $ = d.call(o, "finallyLoc");
                                if (a && $) {
                                    if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                                    if (this.prev < o.finallyLoc) return r(o.finallyLoc)
                                } else if (a) {
                                    if (this.prev < o.catchLoc) return r(o.catchLoc, !0)
                                } else {
                                    if (!$) throw Error("try statement without catch or finally");
                                    if (this.prev < o.finallyLoc) return r(o.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var n = this.tryEntries[r];
                            if (n.tryLoc <= this.prev && d.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                                var o = n;
                                break
                            }
                        }
                        o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                        var i = o ? o.completion : {};
                        return i.type = t, i.arg = e, o ? (this.method = "next", this.next = o.finallyLoc, c) : this.complete(i)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type) throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), c
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var d = this.tryEntries[e];
                            if (d.finallyLoc === t) return this.complete(d.completion, d.afterLoc), O(d), c
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var d = this.tryEntries[e];
                            if (d.tryLoc === t) {
                                var r = d.completion;
                                if ("throw" === r.type) {
                                    var n = r.arg;
                                    O(d)
                                }
                                return n
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(t, e, d) {
                        return this.delegate = {
                            iterator: P(t),
                            resultName: e,
                            nextLoc: d
                        }, "next" === this.method && (this.arg = void 0), c
                    }
                }, t
            }

            function dn(t, e, d, r, n, o, i) {
                try {
                    var a = t[o](i),
                        $ = a.value
                } catch (t) {
                    d(t);
                    return
                }
                a.done ? e($) : Promise.resolve($).then(r, n)
            }

            function di() {
                return da.apply(this, arguments)
            }

            function da() {
                var t;
                return t = dr().mark(function t() {
                    var e;
                    return dr().wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                            case 0:
                                var d;
                                if (!(tr("Monitor") && !dd() && (d = td(), J.indexOf(d) > -1))) {
                                    t.next = 9;
                                    break
                                }
                                if (t.prev = 1, !("cookieDeprecationLabel" in navigator)) {
                                    t.next = 4;
                                    break
                                }
                                return t.abrupt("return", (null == (e = navigator.cookieDeprecationLabel) ? void 0 : e.getValue()) || "");
                            case 4:
                                t.next = 9;
                                break;
                            case 6:
                                return t.prev = 6, t.t0 = t.catch(1), t.abrupt("return", "api_error");
                            case 9:
                                return t.abrupt("return", "not_support");
                            case 10:
                            case "end":
                                return t.stop()
                        }
                    }, t, null, [
                        [1, 6]
                    ])
                }), (da = function() {
                    var e = this,
                        d = arguments;
                    return new Promise(function(r, n) {
                        var o = t.apply(e, d);

                        function i(t) {
                            dn(o, r, n, i, a, "next", t)
                        }

                        function a(t) {
                            dn(o, r, n, i, a, "throw", t)
                        }
                        i(void 0)
                    })
                }).apply(this, arguments)
            }

            function d$() {
                d$ = function() {
                    return t
                };
                var t = {},
                    e = Object.prototype,
                    d = e.hasOwnProperty,
                    r = Object.defineProperty || function(t, e, d) {
                        t[e] = d.value
                    },
                    n = "function" == typeof Symbol ? Symbol : {},
                    o = n.iterator || "@@iterator",
                    i = n.asyncIterator || "@@asyncIterator",
                    a = n.toStringTag || "@@toStringTag";

                function $(t, e, d) {
                    return Object.defineProperty(t, e, {
                        value: d,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }), t[e]
                }
                try {
                    $({}, "")
                } catch (t) {
                    $ = function(t, e, d) {
                        return t[e] = d
                    }
                }

                function u(t, e, d, n) {
                    var o, i, a, $, u = Object.create((e && e.prototype instanceof s ? e : s).prototype);
                    return r(u, "_invoke", {
                        value: (o = t, i = d, a = new N(n || []), $ = "suspendedStart", function(t, e) {
                            if ("executing" === $) throw Error("Generator is already running");
                            if ("completed" === $) {
                                if ("throw" === t) throw e;
                                return w()
                            }
                            for (a.method = t, a.arg = e;;) {
                                var d = a.delegate;
                                if (d) {
                                    var r = function t(e, d) {
                                        var r = d.method,
                                            n = e.iterator[r];
                                        if (void 0 === n) return d.delegate = null, "throw" === r && e.iterator.return && (d.method = "return", d.arg = void 0, t(e, d), "throw" === d.method) || "return" !== r && (d.method = "throw", d.arg = TypeError("The iterator does not provide a '" + r + "' method")), c;
                                        var o = l(n, e.iterator, d.arg);
                                        if ("throw" === o.type) return d.method = "throw", d.arg = o.arg, d.delegate = null, c;
                                        var i = o.arg;
                                        return i ? i.done ? (d[e.resultName] = i.value, d.next = e.nextLoc, "return" !== d.method && (d.method = "next", d.arg = void 0), d.delegate = null, c) : i : (d.method = "throw", d.arg = TypeError("iterator result is not an object"), d.delegate = null, c)
                                    }(d, a);
                                    if (r) {
                                        if (r === c) continue;
                                        return r
                                    }
                                }
                                if ("next" === a.method) a.sent = a._sent = a.arg;
                                else if ("throw" === a.method) {
                                    if ("suspendedStart" === $) throw $ = "completed", a.arg;
                                    a.dispatchException(a.arg)
                                } else "return" === a.method && a.abrupt("return", a.arg);
                                $ = "executing";
                                var n = l(o, i, a);
                                if ("normal" === n.type) {
                                    if ($ = a.done ? "completed" : "suspendedYield", n.arg === c) continue;
                                    return {
                                        value: n.arg,
                                        done: a.done
                                    }
                                }
                                "throw" === n.type && ($ = "completed", a.method = "throw", a.arg = n.arg)
                            }
                        })
                    }), u
                }

                function l(t, e, d) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, d)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                t.wrap = u;
                var c = {};

                function s() {}

                function f() {}

                function h() {}
                var p = {};
                $(p, o, function() {
                    return this
                });
                var y = Object.getPrototypeOf,
                    m = y && y(y(P([])));
                m && m !== e && d.call(m, o) && (p = m);
                var v = h.prototype = s.prototype = Object.create(p);

                function g(t) {
                    ["next", "throw", "return"].forEach(function(e) {
                        $(t, e, function(t) {
                            return this._invoke(e, t)
                        })
                    })
                }

                function b(t, e) {
                    var n;
                    r(this, "_invoke", {
                        value: function(r, o) {
                            function i() {
                                return new e(function(n, i) {
                                    ! function r(n, o, i, a) {
                                        var $ = l(t[n], t, o);
                                        if ("throw" !== $.type) {
                                            var u = $.arg,
                                                c = u.value;
                                            return c && "object" == typeof c && d.call(c, "__await") ? e.resolve(c.__await).then(function(t) {
                                                r("next", t, i, a)
                                            }, function(t) {
                                                r("throw", t, i, a)
                                            }) : e.resolve(c).then(function(t) {
                                                u.value = t, i(u)
                                            }, function(t) {
                                                return r("throw", t, i, a)
                                            })
                                        }
                                        a($.arg)
                                    }(r, o, n, i)
                                })
                            }
                            return n = n ? n.then(i, i) : i()
                        }
                    })
                }

                function _(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
                }

                function O(t) {
                    var e = t.completion || {};
                    e.type = "normal", delete e.arg, t.completion = e
                }

                function N(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }], t.forEach(_, this), this.reset(!0)
                }

                function P(t) {
                    if (t) {
                        var e = t[o];
                        if (e) return e.call(t);
                        if ("function" == typeof t.next) return t;
                        if (!isNaN(t.length)) {
                            var r = -1,
                                n = function e() {
                                    for (; ++r < t.length;)
                                        if (d.call(t, r)) return e.value = t[r], e.done = !1, e;
                                    return e.value = void 0, e.done = !0, e
                                };
                            return n.next = n
                        }
                    }
                    return {
                        next: w
                    }
                }

                function w() {
                    return {
                        value: void 0,
                        done: !0
                    }
                }
                return f.prototype = h, r(v, "constructor", {
                    value: h,
                    configurable: !0
                }), r(h, "constructor", {
                    value: f,
                    configurable: !0
                }), f.displayName = $(h, a, "GeneratorFunction"), t.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === f || "GeneratorFunction" === (e.displayName || e.name))
                }, t.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, h) : (t.__proto__ = h, $(t, a, "GeneratorFunction")), t.prototype = Object.create(v), t
                }, t.awrap = function(t) {
                    return {
                        __await: t
                    }
                }, g(b.prototype), $(b.prototype, i, function() {
                    return this
                }), t.AsyncIterator = b, t.async = function(e, d, r, n, o) {
                    void 0 === o && (o = Promise);
                    var i = new b(u(e, d, r, n), o);
                    return t.isGeneratorFunction(d) ? i : i.next().then(function(t) {
                        return t.done ? t.value : i.next()
                    })
                }, g(v), $(v, a, "Generator"), $(v, o, function() {
                    return this
                }), $(v, "toString", function() {
                    return "[object Generator]"
                }), t.keys = function(t) {
                    var e = Object(t),
                        d = [];
                    for (var r in e) d.push(r);
                    return d.reverse(),
                        function t() {
                            for (; d.length;) {
                                var r = d.pop();
                                if (r in e) return t.value = r, t.done = !1, t
                            }
                            return t.done = !0, t
                        }
                }, t.values = P, N.prototype = {
                    constructor: N,
                    reset: function(t) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(O), !t)
                            for (var e in this) "t" === e.charAt(0) && d.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type) throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done) throw t;
                        var e = this;

                        function r(d, r) {
                            return i.type = "throw", i.arg = t, e.next = d, r && (e.method = "next", e.arg = void 0), !!r
                        }
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var o = this.tryEntries[n],
                                i = o.completion;
                            if ("root" === o.tryLoc) return r("end");
                            if (o.tryLoc <= this.prev) {
                                var a = d.call(o, "catchLoc"),
                                    $ = d.call(o, "finallyLoc");
                                if (a && $) {
                                    if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                                    if (this.prev < o.finallyLoc) return r(o.finallyLoc)
                                } else if (a) {
                                    if (this.prev < o.catchLoc) return r(o.catchLoc, !0)
                                } else {
                                    if (!$) throw Error("try statement without catch or finally");
                                    if (this.prev < o.finallyLoc) return r(o.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var n = this.tryEntries[r];
                            if (n.tryLoc <= this.prev && d.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                                var o = n;
                                break
                            }
                        }
                        o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                        var i = o ? o.completion : {};
                        return i.type = t, i.arg = e, o ? (this.method = "next", this.next = o.finallyLoc, c) : this.complete(i)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type) throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), c
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var d = this.tryEntries[e];
                            if (d.finallyLoc === t) return this.complete(d.completion, d.afterLoc), O(d), c
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var d = this.tryEntries[e];
                            if (d.tryLoc === t) {
                                var r = d.completion;
                                if ("throw" === r.type) {
                                    var n = r.arg;
                                    O(d)
                                }
                                return n
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(t, e, d) {
                        return this.delegate = {
                            iterator: P(t),
                            resultName: e,
                            nextLoc: d
                        }, "next" === this.method && (this.arg = void 0), c
                    }
                }, t
            }

            function du(t, e, d, r, n, o, i) {
                try {
                    var a = t[o](i),
                        $ = a.value
                } catch (t) {
                    d(t);
                    return
                }
                a.done ? e($) : Promise.resolve($).then(r, n)
            }

            function dl() {
                return dc.apply(this, arguments)
            }

            function dc() {
                var t;
                return t = d$().mark(function t() {
                    var e;
                    return d$().wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                            case 0:
                                if (function() {
                                        var t;
                                        return tr("Monitor") && (t = td(), J.indexOf(t) > -1) && !dd()
                                    }()) {
                                    t.next = 2;
                                    break
                                }
                                return t.abrupt("return");
                            case 2:
                                if (t.prev = 2, !("browsingTopics" in document && "function" == typeof document.browsingTopics)) {
                                    t.next = 8;
                                    break
                                }
                                return t.next = 6, document.browsingTopics();
                            case 6:
                                return e = t.sent, t.abrupt("return", e.map(function(t) {
                                    return t.topic
                                }));
                            case 8:
                                return t.abrupt("return", [-1]);
                            case 11:
                                return t.prev = 11, t.t0 = t.catch(2), th(E.CUSTOM_ERROR, t.t0, {
                                    custom_name: "topics",
                                    custom_enum: "getAllTopics"
                                }), t.abrupt("return", [-2]);
                            case 15:
                            case "end":
                                return t.stop()
                        }
                    }, t, null, [
                        [2, 11]
                    ])
                }), (dc = function() {
                    var e = this,
                        d = arguments;
                    return new Promise(function(r, n) {
                        var o = t.apply(e, d);

                        function i(t) {
                            du(o, r, n, i, a, "next", t)
                        }

                        function a(t) {
                            du(o, r, n, i, a, "throw", t)
                        }
                        i(void 0)
                    })
                }).apply(this, arguments)
            }
            ty(function() {
                return /open_news/i.test(te())
            }), ty(function() {
                return /ultralite/i.test(te())
            });
            var ds = q();
            if ("object" == typeof window && window[ds] && window[ds].getPlugin && window[ds].getPlugin("Identify")) {
                window[ds].getPlugin("Identify").setIdentifyUtils({
                    isHash: ta,
                    genIdentifierLabelByUserProperties: tU,
                    tryDecodeHashedBase64Hex: tu,
                    tryDecodeHashedBase64String: t$,
                    parsePhoneNumberFromString: e3,
                    validatePhoneNumberLength: e6,
                    checkEmailFormat: ti,
                    checkMDNEmailFormat: tl,
                    sha256: dt,
                    getCookieDeprecationLabel: di,
                    getAllTopics: dl
                }), G = (H = {
                    isHash: ta,
                    genIdentifierLabelByUserProperties: tU,
                    tryDecodeHashedBase64Hex: tu,
                    tryDecodeHashedBase64String: t$,
                    parsePhoneNumberFromString: e3,
                    validatePhoneNumberLength: e6,
                    checkEmailFormat: ti,
                    checkMDNEmailFormat: tl,
                    sha256: dt,
                    getCookieDeprecationLabel: di,
                    getAllTopics: dl
                }).parsePhoneNumberFromString, U = H.validatePhoneNumberLength, V = H.isHash, K = H.genIdentifierLabelByUserProperties, W = H.tryDecodeHashedBase64String, Y = H.tryDecodeHashedBase64Hex, Z = H.checkEmailFormat, z = H.checkMDNEmailFormat, X = H.sha256, e = (t = {
                    checkEmailFormat: Z,
                    checkMDNEmailFormat: z
                }).checkEmailFormat, r = t.checkMDNEmailFormat, tP.checkEmailFormat = e, tP.checkMDNEmailFormat = r, o = (n = {
                    tryDecodeHashedBase64String: W,
                    tryDecodeHashedBase64Hex: Y
                }).tryDecodeHashedBase64String, i = n.tryDecodeHashedBase64Hex, tN.tryDecodeHashedBase64String = o, tN.tryDecodeHashedBase64Hex = i, $ = (a = {
                    isHash: V,
                    genIdentifierLabelByUserProperties: K
                }).isHash, u = a.genIdentifierLabelByUserProperties, t_.isHash = $, t_.genIdentifierLabelByUserProperties = u, c = (l = {
                    parsePhoneNumberFromString: G,
                    validatePhoneNumberLength: U
                }).parsePhoneNumberFromString, s = l.validatePhoneNumberLength, tO.parsePhoneNumberFromString = c, tO.validatePhoneNumberLength = s, tp = X
            }
        }()
}();