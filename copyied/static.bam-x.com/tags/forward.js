! function() {
    var t, e, r;
    class i {
        constructor() {}
        static getInstance() {
            return this.instance || (this.instance = new i), this.instance
        }
        formatUrl(t, e) {
            return t ? ((t = t.trim()).length > e && (t = t.substring(0, e)), t) : null
        }
    }
    let n = "https://app.howl.link",
        a = "https://pixel.howl.link",
        s = a;
    class o {
        constructor() {
            this.urlFormatter = i.getInstance()
        }
        async checkoutEvent(t, e, r, i) {
            let n = {
                events: [i.getPurchasePayload()],
                user: {
                    source_url: this.urlFormatter.formatUrl(window.location.href, 2048),
                    previous_url: this.urlFormatter.formatUrl(document.referrer, 2048)
                },
                merchantId: t,
                scriptUrl: e,
                brandUrl: r,
                orderSource: "brand-pixel-3.0"
            };
            await this.sendCheckoutToPixelApi(n)
        }
        async sendCheckoutToPixelApi(t) {
            let e = await this.getIpAndOrFingerprint();
            e ? .ip && (t.ip = e.ip), e ? .fp && (t.fp = e.fp), e ? .secondaryIp && (t.secondaryIp = e.secondaryIp);
            let r = t => new Promise(e => setTimeout(e, t));
            for (let e = 1; e <= 3; e++) try {
                let e = await fetch(`${s}/api/checkout`, {
                    method: "POST",
                    body: JSON.stringify(t)
                });
                return await e.json()
            } catch (t) {
                if (console.error(`HOWL: Attempt ${e} failed:`, t), 3 === e) throw Error(t);
                await r(500)
            }
        }
        async getIpAndOrFingerprint() {
            let t = fetch(`${n}/api/fp`).then(async t => {
                    let e = await t.json();
                    return {
                        fp: e ? .fp,
                        ip: e ? .ip
                    }
                }).catch(t => (console.error("Failed to get IP and fingerprint", t), {
                    fp: void 0,
                    ip: void 0
                })),
                e = fetch("https://checkip.amazonaws.com").then(async t => {
                    if (!t.ok) throw Error("Failed to fetch IP address");
                    return {
                        secondaryIp: (await t.text()).trim()
                    }
                }).catch(t => (console.error("Failed to get IP address", t), {
                    secondaryIp: void 0
                })),
                [r, i] = await Promise.all([t, e]),
                {
                    fp: a,
                    ip: s
                } = r,
                {
                    secondaryIp: o
                } = i;
            if (s || a || o) return {
                ip: s,
                fp: a,
                secondaryIp: o
            }
        }
    }
    class d {
        constructor() {
            this.cidLength = 64
        }
        static getInstance() {
            return d.instance || (d.instance = new d), d.instance
        }
        validateCid(t) {
            return t && /^[a-zA-Z0-9]*$/.test(t.substring(0, this.cidLength)) ? t.substring(0, this.cidLength) : null
        }
        validateAllCids(t) {
            let e = !1;
            if (t) {
                let r = [],
                    i = new Set;
                for (let n = 0; n < t.length; n++) {
                    let a = this.validateCid(t[n]);
                    (!a || a && a !== t[n] || i.has(a)) && (e = !0), a && !i.has(a) && (r.push(a), i.add(a))
                }
                if (r.length >= 1) return [r, e]
            }
            return [null, e]
        }
    }
    class c {
        constructor(t = () => window.localStorage) {
            this.storage = t()
        }
        get(t) {
            return this.storage.getItem(t)
        }
        set(t, e) {
            this.storage.setItem(t, e)
        }
        remove(t) {
            this.storage.removeItem(t)
        }
    }(r = t || (t = {})).NRTV_CID = "nrtv_cids", r.CHECKOUT = "nrtv_trigger_checkout";
    class l extends c {
        constructor() {
            super()
        }
        static getInstance() {
            return this.instance || (this.instance = new l), this.instance
        }
        getNrtvCid() {
            return this.get(t.NRTV_CID)
        }
        setNrtvCid(e) {
            let r = this.getNrtvCid() ? .split(",");
            r ? new Set(r).has(e) || (r.push(e), r.length > 1e4 && r.splice(0, 1), this.set(t.NRTV_CID, r.join(","))) : this.set(t.NRTV_CID, e)
        }
        setAllNrtvCids(e) {
            e ? this.set(t.NRTV_CID, e.join(",")) : this.remove(t.NRTV_CID)
        }
        getCheckoutsFired() {
            return this.get(t.CHECKOUT)
        }
        setCheckoutsFired(e) {
            let r = this.getCheckoutsFired() ? .split(",");
            r ? new Set(r).has(e) || (r.push(e), this.set(t.CHECKOUT, r.join(","))) : this.set(t.CHECKOUT, e)
        }
    }
    class h {
        constructor() {}
        static getInstance() {
            return this.instance || (this.instance = new h), this.instance
        }
        formatField(t, e) {
            return t ? (t.length > e && (t = t.substring(0, e)), t) : null
        }
    }
    class u {
        constructor() {}
        static getInstance() {
            return this.instance || (this.instance = new u), this.instance
        }
        formatCids(t, e) {
            if (t) {
                let r = t.split(",");
                return r.splice(r.length - e).join(",")
            }
            return null
        }
    }
    class w {
        constructor() {
            this.localStorage = l.getInstance(), this.fieldFormatter = h.getInstance(), this.cidFormatter = u.getInstance(), this.defaultCurrency = "USD", this.purchase = window.narrativ.eventData, this.cidValidator = d.getInstance()
        }
        getPurchasePayload() {
            return {
                order: {
                    id: this.fieldFormatter.formatField(this.getOrderId(), 50),
                    value: this.getOrderValue(),
                    currency: this.fieldFormatter.formatField(this.getCurrency(), 3),
                    cids: this.cidFormatter.formatCids(this.getAllCids(), 63),
                    is_new_customer: this.getIsNewCustomer()
                },
                products: this.getAllPurchasedProducts()
            }
        }
        getAllCids() {
            let t = this.localStorage.getNrtvCid() ? .split(",");
            if (t && t.length > 0) {
                let [e] = this.cidValidator.validateAllCids(t);
                if (e && e.length > 0) return e.join(",")
            }
            return null
        }
        getAllPurchasedProducts() {
            let t = this.purchase.products_purchased;
            return (t = Array.isArray(t) ? t : []) ? t.map(t => this.getProductData(t)) : []
        }
        getProductData(t) {
            return {
                id: this.fieldFormatter.formatField(t.product_id.toString(), 100),
                name: this.fieldFormatter.formatField(t.product_name, 255),
                brand: this.fieldFormatter.formatField(t.product_brand, 100),
                image_url: this.fieldFormatter.formatField(t.product_image, 2048),
                size: this.fieldFormatter.formatField(t.product_size, 20),
                color: this.fieldFormatter.formatField(t.product_color, 20),
                quantity: this.parseQuantity(t.product_quantity),
                price: this.parsePrice(t.product_price),
                currency: this.fieldFormatter.formatField(this.getCurrency(), 3)
            }
        }
        getOrderId() {
            return this.purchase.order_id.toString()
        }
        getOrderValue() {
            return this.parsePrice(this.purchase.order_value)
        }
        parsePrice(t) {
            let e = `${t}`.replace(/\$|,/g, "");
            return isNaN(parseInt(e)) && (e = "0.00"), parseFloat(e).toFixed(2)
        }
        parseQuantity(t) {
            return parseInt(t, 10) || 1
        }
        getCurrency() {
            let t = this.purchase.currency;
            return t && "US" === (t = t.toUpperCase().replace(/[()#_]/g, "")) && (t = "USD"), t || this.defaultCurrency
        }
        getIsNewCustomer() {
            let t = this.purchase.is_new_customer;
            return "boolean" == typeof t ? t : null
        }
    }
    let p = t => null == t || 0 == Object.keys(t).length,
        g = () => {
            window.BAMX_EVENT_DATA = window.NRTV_EVENT_DATA = {}, window.narrativ.eventData = {}
        },
        v = () => {
            !p(window.BAMX_EVENT_DATA) && p(window.NRTV_EVENT_DATA) && (window.NRTV_EVENT_DATA = window.BAMX_EVENT_DATA)
        };
    (e || (e = {})).CID = "nrtv_cid";
    class C {
        constructor(t, e) {
            this.localStorage = l.getInstance(), this.brandId = t, this.scriptUrl = e, this.brandUrl = window.location.origin, this.cidValidator = d.getInstance(), this.nrtvCid = this.getClickId(), this.refNrtvCid = this.getClickIdFromPreviousUrl(), this.isCheckoutPage = !1, this.checkoutKey = null, this.pollIntervalCount = 120, this.init()
        }
        init() {
            if (this.validateAndSetClickIds(), !window.narrativ.isCheckoutFired && this.shouldTriggerCheckout() && this.triggerCheckout(), !this.isCheckoutPage) {
                let t = 0,
                    e = setInterval(() => {
                        !window.narrativ.isCheckoutFired && this.shouldTriggerCheckout() ? (this.triggerCheckout(), clearInterval(e)) : t >= this.pollIntervalCount && clearInterval(e), t++
                    }, 500)
            }
        }
        validateAndSetClickIds() {
            if (!this.nrtvCid && !this.refNrtvCid) {
                let t = l.getInstance().getNrtvCid() ? .split(",");
                if (t && t.length > 0) {
                    let [e, r] = this.cidValidator.validateAllCids(t);
                    e && e.length > 0 && (this.nrtvCid = e[e.length - 1]), r && this.localStorage.setAllNrtvCids(e)
                }
            }
        }
        shouldTriggerCheckout() {
            return this.onCheckoutPage() && !this.isDuplicateCheckout() && this.containsProduct()
        }
        onCheckoutPage() {
            return (window.NRTV_EVENT_DATA && window.NRTV_EVENT_DATA.page_type || window.BAMX_EVENT_DATA && window.BAMX_EVENT_DATA.page_type) && p(window.narrativ.eventData) && (p(window.BAMX_EVENT_DATA) || (window.NRTV_EVENT_DATA = window.BAMX_EVENT_DATA), window.narrativ.eventData = { ...window.NRTV_EVENT_DATA
            }), window.narrativ.eventData && window.narrativ.eventData.page_type && (this.isCheckoutPage = "checkout" === window.narrativ.eventData.page_type), this.isCheckoutPage
        }
        isDuplicateCheckout() {
            if (this.isCheckoutPage && window.narrativ.eventData && window.narrativ.eventData.order_id) {
                this.checkoutKey = `${this.brandId}-${window.narrativ.eventData.order_id}`;
                let t = new Set(this.localStorage.getCheckoutsFired() ? .split(","));
                if (t && t.size > 0 && t.has(this.checkoutKey)) return console.warn("NRTV: Suppressing duplicate checkout."), !0
            }
            return !1
        }
        containsProduct() {
            return !this.isCheckoutPage || !window.narrativ.eventData || null != window.narrativ.eventData.order_id && "" != window.narrativ.eventData.order_id || 0 != window.narrativ.eventData.products_purchased.length || (console.warn("NRTV: Cannot fire checkout without a product."), !1)
        }
        getClickId() {
            let t = new URL(window.location.href),
                r = this.cidValidator.validateCid(t.searchParams.get(e.CID)) || this.parseCid(window.location.href);
            return r ? (this.localStorage.setNrtvCid(r), r) : null
        }
        getClickIdFromPreviousUrl() {
            if (!this.nrtvCid) try {
                let t = new URL(document.referrer),
                    r = this.cidValidator.validateCid(t.searchParams.get(e.CID)) || this.parseCid(document.referrer);
                if (r && this.validateCidIsNew(r)) return this.localStorage.setNrtvCid(r), r
            } catch (t) {}
            return null
        }
        validateCidIsNew(t) {
            let e = this.localStorage.getNrtvCid() ? .split(",");
            return !(e && new Set(e).has(t)) && !0
        }
        parseCid(t) {
            let r = decodeURIComponent(t).split(e.CID + "=");
            return r.length > 1 ? this.cidValidator.validateCid(r[1]) : null
        }
        triggerCheckout() {
            let t = new w;
            new o().checkoutEvent(this.brandId, this.scriptUrl, this.brandUrl, t).then(() => {
                window.narrativ.isCheckoutFired = !0, this.checkoutKey && this.localStorage.setCheckoutsFired(this.checkoutKey)
            })
        }
    }
    window.narrativ = window.narrativ || {}, window.NRTV_EVENT_DATA && (window.narrativ.eventData ? window.narrativ.eventData = { ...window.narrativ.eventData,
        ...window.NRTV_EVENT_DATA
    } : window.narrativ.eventData = { ...window.NRTV_EVENT_DATA
    }), window.narrativ.isInitialized || (window.narrativ.isInitialized = !0, window.narrativ.isCheckoutFired = !1, function() {
        let t, e, r = document.getElementById("nrtvTag") ? .getAttribute("data-narrativ-id"),
            i = window.location.origin,
            n = function() {
                for (let t of ['script[src*="static.bam-x.com/tags/"]', 'script[src*="static.narrativ.com/tags/"]', 'script[src*="public.howl-media.com/pixel/branch/"]', 'script[src*="public.howl-media.com/pixel/"]']) {
                    let e = document.querySelector(t);
                    if (e && e.src) try {
                        let t = new URL(e.src),
                            r = t.pathname.match(/\/tags\/([^\/.]+)/),
                            i = r ? r[1] : null;
                        return {
                            url: t.href,
                            brandName: i
                        }
                    } catch {}
                }
                return {
                    url: null,
                    brandName: null
                }
            }();
        !r && n && n.brandName && (t = n.brandName), e = n.url;
        let a = !!t;
        a && (v(), "chanel" === t && function() {
            let t;
            try {
                t = window.dataLayer[0].ecommerce.purchase
            } catch (t) {
                return
            }
            if (!t || !t.products) return;
            let e = t.products || [];
            if (e.length) {
                var r, i;
                for (let t = 0; t < e.length; t++) {
                    let r = e[t],
                        i = r.variant.split("/");
                    e[t] = {
                        product_quantity: function(t) {
                            let e = window.document.getElementsByClassName("cart-product__quantity");
                            for (let r = 0; r < e.length; r++) {
                                let i = e[r],
                                    n = i.getAttribute("data-test");
                                if (n && n.endsWith(t)) return i.innerText.toLowerCase().replace("qty", "").trim()
                            }
                            return "1"
                        }(r.dimension8),
                        product_price: r.price,
                        currency: window.dataLayer[0].ecommerce.currencyCode || null,
                        product_id: r.dimension8,
                        product_name: r.name,
                        product_brand: "CHANEL",
                        product_color: "(not set)" !== i[0] ? i[0] : null,
                        product_size: "(not set)" !== i[1] ? i[1] : null
                    }
                }
                r = t, i = e, window.NRTV_EVENT_DATA.products_purchased = i, window.NRTV_EVENT_DATA.order_value = r.actionField ? .revenue || 0, window.NRTV_EVENT_DATA.order_id = r.actionField ? .id || ""
            }
        }()), window.narrativ.pixel = new C(r || t, e);
        let s = window.location.href;
        new MutationObserver(e => {
            s !== window.location.href && (s = window.location.href, a ? window.narrativ.isCheckoutFired ? (window.narrativ.isCheckoutFired = !1, g()) : (v(), p(window.NRTV_EVENT_DATA) || (window.narrativ.eventData = { ...window.NRTV_EVENT_DATA
            })) : !window.narrativ.isCheckoutFired && window.NRTV_EVENT_DATA ? window.narrativ.eventData = { ...window.NRTV_EVENT_DATA
            } : window.narrativ.isCheckoutFired && (window.narrativ.isCheckoutFired = !1, window.NRTV_EVENT_DATA = {}, window.narrativ.eventData = {}), window.narrativ.isLanding = !1, window.narrativ.pixel = new C(r || t, i))
        }).observe(document.querySelector("body"), {
            childList: !0,
            subtree: !0
        })
    }())
}();