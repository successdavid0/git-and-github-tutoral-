function insertTikTok() {
    try {
        var tiktok = window.rcProps.tiktok;
        var pixelParams;
        var pixelId;
        if (tiktok && tiktok.pixelParams != null && tiktok.isWhitelisted) {
            pixelParams = JSON.parse(tiktok.pixelParams);
            pixelId = tiktok.id;

            ! function(w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = w[t] = w[t] || [];
                ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function(t, e) {
                    t[e] = function() {
                        t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                    }
                };
                for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
                ttq.instance = function(t) {
                    for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                    return e
                }, ttq.load = function(e, n) {
                    var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                    var o = document.createElement("script");
                    o.type = "text/javascript", o.defer = !0, o.src = i + "?sdkid=" + e + "&lib=" + t;
                    var a = document.getElementsByTagName("script")[0];
                    a.parentNode.insertBefore(o, a)
                };
                ttq.load(pixelId);
                ttq.page();
            }(window, document, 'ttq');

            ttq.identify({
                sha256_email: (pixelParams.emailSHA256) ? pixelParams.emailSHA256 : '',
                sha256_phone_number: (pixelParams.phoneSHA256) ? pixelParams.phoneSHA256 : ''
            });

            if (pixelParams.searchPage) {
                var contentsVal = [];
                if (pixelParams.productList !== undefined && pixelParams.productList.length > 0) {
                    contentsVal = pixelParams.productList.slice(0, 5)
                        .map(product => product.productCode);
                }

                ttq.track('Search', {
                    content_type: 'product_group',
                    query: tiktok.pixelSearchParam,
                    contents: contentsVal
                });
            } else if (pixelParams.pdpPage && pixelParams.product != null) {
                var pixelProductCode = pixelParams.product.productCode;
                var pixelProductCode = pixelProductCode.replace(/_/g, '-');
                var tiktokViewContentMainEventID = "ViewContent_" + Math.floor(Math.random() * 1000000);

                const tikTokViewContentMainData = {
                    contents: [{
                        content_id: pixelProductCode,
                        content_type: 'product_group',
                        quantity: 1,
                        price: pixelParams.product.productPrice,
                    }],
                    currency: pixelParams.currency,
                    value: pixelParams.product.productPrice,
                };

                ttq.track('ViewContent',
                    tikTokViewContentMainData, {
                        event_id: tiktokViewContentMainEventID
                    }
                );
            } else if (pixelParams.checkoutPage) {
                var contentId = [];
                if (pixelParams.cartData !== undefined && pixelParams.cartData.length > 0) {
                    contentId = pixelParams.cartData.map(product => product.productCode);
                }

                const initiateCheckoutData = {
                    content_id: contentId
                };

                ttq.track('InitiateCheckout', initiateCheckoutData);
            }
        }
    } catch (e) {
        console.error('Error in insertTikTok()', e);
    }
}

function insertTiktokAddToCart(productCode) {
    try {
        var tiktok = window.rcProps.tiktok;
        var pixelParams;
        if (tiktok && tiktok.pixelParams && tiktok.isWhitelisted) {
            pixelParams = JSON.parse(tiktok.pixelParams);
            const tikTokAddToCartDataMain = {
                contents: [{
                    content_id: productCode,
                    content_type: 'product_group',
                    quantity: 1,
                    price: pixelParams.product.productPrice,
                }],
                value: pixelParams.product.productPrice,
                currency: pixelParams.currency,
            };

            var tiktokAddToCartMainEventID = "AddToCart_" + Math.floor(Math.random() * 1000000);
            if (typeof ttq !== 'undefined') {
                ttq.identify({
                    sha256_email: (pixelParams.emailSHA256 !== null) ? pixelParams.emailSHA256 : '',
                    sha256_phone_number: (pixelParams.phoneSHA256 !== null) ? pixelParams.phoneSHA256 : ''
                });

                ttq.track('AddToCart',
                    tikTokAddToCartDataMain, {
                        event_id: tiktokAddToCartMainEventID
                    }
                );
            }
        }
    } catch (e) {
        console.log(e);
    }
}