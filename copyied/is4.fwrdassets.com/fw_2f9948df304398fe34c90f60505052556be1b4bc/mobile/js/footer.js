var $emailField = $('#emailId');

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function submitEmail(e) {
    e.preventDefault();
    $("#emailrequired").hide();
    $("#emailalreadyexist").hide();
    $("#validemail").hide();
    var email = $('#emailId').val();
    if (email === "") {
        $("#emailrequired").show();
        return false;
    } else if (validateEmail(email)) {
        var data = $.param({
            emailAddress: email,
            fw: true,
            subscriptionGender: "F",
            pageType: "fwrdNtf",
            expiryDays: 30,
            productMaxQty: 1,
            subscribeSource: "fwrdNtfSubscribeMobile"
        });
        $.post("/r/ajax/NtfDialogSubmit.jsp", data, function(rtn) {
            rtn = $.parseJSON(rtn);
            var code = rtn[window.rcProps.ntf.keySubmitPromoCode];
            if (!code) {
                $("#emailalreadyexist").text("Your email is already subscribed to our newsletter").show();
            } else {
                $.modal({
                    url: window.rcProps.ntf.newCustomerDialogUrl,
                    triggerOpen: true,
                    overlayClose: true,
                    onComplete: function() {}
                });
            }
        });

        if (window.rcProps.google.isWhitelisted) {
            if (window.rcProps.ga4) {
                gtag('event', 'newsletter_signup', {
                    'send_to': window.rcProps.ga4.tagID
                });
            }
        }

    } else {
        $("#validemail").show();
    }
    return false;
};

onDocReady(function() {
    $('#emailSubscribe').keydown(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#signupEmailOpenButtonFwMobile').trigger('click');
        }
    });
    $("#emailalreadyexist").hide();
});

function validEmail(email) {
    var atPosition = email.indexOf("@");
    var dotPosition = email.lastIndexOf(".");
    if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition + 2 >= email.length) {
        $("#ShowErrorMessage").html('Not a valid e-mail address');
        $("#ShowErrorMessage").show();
        $emailField.focus();
        return false;
    }
    return true;
}

if (typeof emailSubscribe !== "undefined") {
    emailSubscribe.oninput = function() {
        $("#ShowErrorMessage").html('');
    };
}
onDocReady(function() {
    $('#signupEmailOpenButtonFwMobile').click(function() {
        if (validEmail($('#emailSubscribe').val())) {
            var data = JSON.parse(JSON.stringify(window.rcProps.ntf.subscriptionData));

            data.uri = data.uri + (window.location.hash != '' ? ('&page=' + window.location.hash.replace('#', '')) : '');
            data.email = $('#emailSubscribe').val();

            $.ajax({
                type: 'POST',
                url: '/r/ajax/CheckEmailSubscriptionNewsletter.jsp',
                data: $.param(data),
                success: function(data) {
                    var obj = parseRtn(data);
                    if (obj.duplicate == "true") {
                        $("#ShowErrorMessage").html('This email already has been registered');
                        $("#ShowErrorMessage").show().focus();
                    } else {
                        $.modal({
                            url: window.rcProps.ntf.subscribeDialogUrl,
                            triggerOpen: true,
                            returnFocus: $(this)
                        });
                    }
                }
            });
        }
    });
});

function parseRtn(rtn) {
    return JSON && JSON.parse(rtn) || $.parseJSON(rtn);
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value);
    var c_expires = ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    var c_path = "; path=/";
    document.cookie = c_name + "=" + c_value + c_expires + c_path;
}

onDocReady(function() {
    if (!window.rcProps || !window.rcProps.ntf) {
        return;
    }

    $('#ntf-ribbon').on('click', function(e) {
        e.preventDefault();

        var useCordialLightbox = $('#ntfToastTypeCordial').val();
        if (useCordialLightbox != null && useCordialLightbox == 'true') {
            if (top != null && top.PRIMER_API != null && top.PRIMER_API.LIGHTBOX != null) {
                top.PRIMER_API.LIGHTBOX.loadLightbox('10221e7e-6456-4398-8565-4b2c59cc6af4');
            } else {
                console.log("top.PRIMER_API.LIGHTBOX javascript not run due to library not loaded.");
            }
        } else {
            loadNtfToast();
        }
    });
    $("#email_signup_form").find("input").on('change keyup paste', function() {
        $(this).removeClass("error");
        $(this).attr("placeholder", "");
    });

    $("#ntf-toast-mobile-close").on("click", function() {
        setCookie(window.rcProps.ntf.noRibbonKey, true, 1);
        $(".ntf-toast--btn").remove();
        $("#ntf-toast-pop").removeClass('fixed-corner--with-btn');
    });

    $("#ntf-email-address_container").focus(function() {
        $("#ntf_email_wrapper").removeClass("is-error");
        $("#email-error-feedback_rev_mobile").text("").hide();
    })
});

var ntfData = window.rcProps.ntf || {};

function initializeNTFToast() {
    $('#modal').addClass("ntf-toast");
    $("#ntf-toast--form-id").submit(function(event) {
        event.preventDefault();
        $("#ntf-email-address").removeClass("is-error");
        $("#email-error-feedback_rev_mobile").removeClass("is-error");
        $("#email-error-feedback_rev_mobile").text("").hide();
        var input = $("#ntf-email-address");
        var value = input.val();
        // checks if email exists
        if (value == '') {
            // checks error for input field
            // back end to update error state
            input.val("");
            $("#email-error-feedback_rev_mobile").text(ntfData.missingEmailMessage).show();
            $("#ntf-email-address").addClass("is-error");
        } else if (!validateEmail(value)) {
            $("#email-error-feedback_rev_mobile").html('enter a valid email').show();
            $("#ntf-email-address").addClass("is-error");
        } else {
            $("#email-error-feedback_rev_mobile").html("").hide();
            $("#ntf-email-address").removeClass("is-error");
            var params = {};
            params['emailAddress'] = input.val();
            params['sectionURL'] = window.rcProps.sectionUrl;
            params['subscriptionGender'] = window.rcProps.ntf.department;
            params['subscribeSource'] = 'fwrdNtfSubscribeMobile';
            params['pageType'] = 'fwrdNtf';
            params['fw'] = true;
            params['expiryDays'] = 30;
            params['productMaxQty'] = 1;
            $.ajax({
                url: '/r/ajax/NtfDialogSubmit.jsp',
                data: params,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                type: "POST",
                cache: false,
                success: function(msg) {
                    var msgJson = JSON.parse(msg);
                    var result = msgJson[ntfData.keySubmitResult];
                    var promoCode = msgJson[ntfData.keySubmitPromoCode];

                    if (result == ntfData.submitIneligible) { // testcancel@revolvemail.com
                        isIneligibleEmail = true;
                        //$("#ntf-toast").hide();
                        $('#modal').hide().remove();
                        $("#ntf-toast-pop").hide();
                        $("#ntfUserEmailExisting").html(input.val());
                        $.modal({
                            url: window.rcProps.ntf.existingUserToastUrl,
                            triggerOpen: true,
                            type: "toast",
                            onOpen: function() {
                                $('#modal').addClass("ntf-toast");
                            }
                        });
                        setCookie("ntfUserInelligible", true, 365);
                        setCookie(window.rcProps.ntf.noRibbonKey, true, 365);
                    } else if (result == ntfData.submitIneligiblePurchased) { // testcancel@revolvemail.com
                        isIneligibleEmail = true;
                        //$("#ntf-toast").hide();
                        $('#modal').hide().remove();
                        $("#ntf-toast-pop").hide();
                        $("#ntfUserEmailExisting").html(input.val());
                        $.modal({
                            url: window.rcProps.ntf.existingUserToastUrl,
                            triggerOpen: true,
                            type: "toast",
                            onOpen: function() {
                                $('#modal').addClass("ntf-toast");
                            }
                        });
                        setCookie("ntfUserInelligiblePurchased", true, 365);
                        setCookie(window.rcProps.ntf.noRibbonKey, true, 365);
                    } else if (result == ntfData.submitNewCode || result == ntfData.submitCodexists) {
                        // trigger event on form success
                        $("#ntf-toast-pop").hide();
                        $.ajax({
                            type: "POST",
                            url: window.rcProps.ntf.newUserToastUrl,
                            success: function(html) {
                                $('#ntf-toast--new').remove();
                                $('body').append("<div id=\"ntf-toast--new\" class=\"modal modal--toast ntf-toast\" data-type=\"toast\">");
                                $("#modal").hide().remove();
                                $('#ntf-toast--new').append(html);
                                $("#emailaddress").html(input.val());
                                $("#ntfcode").html(promoCode);
                                $.modal({
                                    open: 'ntf-toast--new',
                                    triggerOpen: true
                                });
                                $(".js-ntf-restriction-modal").on("click", function() {
                                    $.modal({
                                        url: window.rcProps.restrictedToastUrl,
                                        triggerOpen: true,
                                        onClose: function() {
                                            $.modal({
                                                open: 'ntf-toast--new',
                                                triggerOpen: true
                                            })
                                        }
                                    });
                                });
                            }
                        });
                        setCookie("ntfUserInelligibleSuccess", true, 365);
                        setCookie(window.rcProps.ntf.noRibbonKey, true, 365);
                    } else if (result == ntfData.submitInvalid || result == ntfData.submitInvalidHighIPActivity) {
                        if (result != ntfData.submitInvalidHighIPActivity) {
                            toggleInvalidEmailAddress(true);
                        } else {
                            pleaseTryAgainLater();
                        }
                    } else {
                        console.log("Possible programming error: result not recognized, result[" + result + "], promoCode[" + promoCode + "]");
                    }
                }
            });
        }
    });
}

function subscribe() {
    $.modal({
        open: "subscribe",
        triggerOpen: true,
        returnFocus: $(this)
    });
}

function loadNtfToast() {
    $.modal({
        url: window.rcProps.ntf.regularToastUrl,
        type: 'toast',
        triggerOpen: true,
        returnFocus: $(this),
        onOpen: initializeNTFToast
    });
}

function submitSubscribeEmail() {
    var email = $('#emailSubscribe').val();
    if (typeof email == 'undefined' || email == null || email == '') {
        email = $('#ntf-email-address').val();
    }
    if (typeof email == 'undefined' || email == null || email == '') {
        email = $('#emailaddress').text(); //NTF Pop-up
    }
    var gender = $('input:radio[name=sex]:checked').val();
    var params = "email=" + email + "&gender=" + gender;

    try {
        if (typeof(crdl) != 'undefined' && crdl != null) {
            var cordialEmail = email;
            crdl('contact', {
                email: cordialEmail
            }, {});
        }
    } catch (e) {
        console.log(e);
    }

    var data = JSON.parse(JSON.stringify(window.rcProps.ntf.subscriptionData));
    data.mobile = "true";
    data.ptft = 'Email Signup Footer';
    data.pageType = window.rcProps.ntf.pageType;

    delete data.u;

    $.ajax({
        url: "/fw/mobile/SubscribeEmail.jsp",
        data: params + '&' + $.param(data),
        success: function(msg) {
            var href = "/fw/mobile/WelcomeSignUp.jsp?accountWelcome=false";
            try {
                var result = parseRtn(msg);

                if (result.success) {
                    href += "&cID=" + result.cID;
                    window.location = href;
                } else {
                    if (result.cordialError) {
                        alert(result.msg);
                    } else {
                        alert("Not a valid e-mail address");
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    });
}

function submitEmailMobile(e) {
    e.preventDefault();

    $("#emailrequired").hide();
    $("#emailalreadyexist").hide();
    $("#validemail").hide();

    var email = $('#emailId').val();

    if (email === "") {
        $("#emailrequired").show();
        $emailField.focus();
        return false;
    } else if (validateEmail(email)) {
        var data = $.param({
            emailAddress: email,
            fw: true,
            subscriptionGender: "F",
            pageType: "fwrdNtf",
            expiryDays: 30,
            productMaxQty: 1,
            subscribeSource: "fwrdNtfSubscribeMobile"
        });
        // /fw/mobile/WelcomeSignUp.jsp?accountWelcome=false
        $.post("/r/ajax/NtfDialogSubmit.jsp", data, function(rtn) {
            rtn = $.parseJSON(rtn);
            var code = rtn[window.rcProps.ntf.keySubmitPromoCode];
            if (!code) {
                $("#emailalreadyexist").text("Your email is already subscribed to our newsletter").show();
            } else {
                window.location.href = '/fw/mobile/WelcomeSignUp.jsp?accountWelcome=false';
            }
        });

        if (window.rcProps.google.isWhitelisted) {
            if (window.rcProps.ga4) {
                gtag('event', 'newsletter_signup', {
                    'send_to': window.rcProps.ga4.tagID
                });
            }
        }

    } else {
        $("#validemail").show();
        $emailField.focus();
    }

    return false;
}

function loadGAScript() {
    if (window.rcProps.google.isWhitelisted) {
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.defer = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', window.rcProps.google.trackerId, 'auto');
        var userid = window.rcProps.google.userId;
        if (userid > -1) {
            ga('set', 'userId', userid);
        }
        ga('set', 'dimension4', window.rcProps.google.sessionId);
        ga('set', 'dimension5', window.rcProps.browserId);
        ga('set', 'dimension6', window.rcProps.google.cf_bot_score);


        (function(window) {
            window.getDevicePixelRatio = function() {
                var ratio = 1;
                // To account for zoom, change to use deviceXDPI instead of systemXDPI
                if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
                    // Only allow for values > 1
                    ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
                } else if (window.devicePixelRatio !== undefined) {
                    ratio = window.devicePixelRatio;
                }
                return ratio;
            };
        })(this);
        var devicePixelRatio = window.getDevicePixelRatio();
        var pixelRatio;
        if (devicePixelRatio >= 3) {
            pixelRatio = "retina3x";
        } else if (devicePixelRatio >= 2) {
            pixelRatio = "retina2x";

        } else if (devicePixelRatio >= 1.5) {
            pixelRatio = "retina1.5x";
        } else {
            pixelRatio = "normal";
        }
        ga('set', 'dimension7', pixelRatio);


        addGAImpressions();
        addGAProductDetails();
        ga('send', 'pageview');
    }
}

function addGAImpressions() {
    if (window.rcProps.google.isWhitelisted) {
        var products = getImpressionProducts();
        if (typeof products !== 'undefined' && products && products.length > 0) {
            // prepare data for client side push
            if (typeof ga !== 'undefined') {
                ga('require', 'ec');
                for (var i = 0, len = products.length; i < len; i++) {
                    product = products[i];
                    ga('ec:addImpression', {
                        'id': product.code,
                        'name': product.name,
                        'category': product.category,
                        'brand': product.brand,
                        'price': product.price,
                        'list': window.rcProps.google.impressionsList,
                        'position': product.position
                    });
                }
            }

            // prepare data for server side push
            var productIDs = [];
            products.forEach(function(product) {
                productIDs.push(product.code);
            });
        }
    }
}

function getImpressionProducts() {
    var products = [];

    if (window.rcProps.google.isWhitelisted && window.rcProps.google.impressionProducts) {
        products = products.concat(window.rcProps.google.impressionProducts);
    }

    return products;
}

function addGAProductDetails() {
    if (window.rcProps.footer.isProductPage && window.rcProps.google.isWhitelisted) {
        var product = getGAProduct();
        if (typeof product !== 'undefined' && product) {
            if (typeof ga !== 'undefined') {
                ga('require', 'ec');
                ga('ec:addProduct', {
                    'id': product.code,
                    'name': product.name,
                    'category': product.category,
                    'brand': product.brand,
                    'price': product.price
                });
                ga('ec:setAction', 'detail');
            }
        }
    }
}

function getGAProduct() {
    return window.rcProps.google.isWhitelisted && window.rcProps.google.gaProduct ? window.rcProps.google.gaProduct : null;
}

function gaCheckout(step, option) {
    if (window.rcProps.google.isWhitelisted) {
        // option can be guest,signin,paypal,alipay
        if (typeof ga !== 'undefined') {
            ga('create', window.rcProps.google.trackerId);
            ga('require', 'ec');
            ga('ec:setAction', 'checkout', {
                'step': step,
                'option': option
            });
            ga('send', 'pageview');
        }

        if (window.rcProps.ga4) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'begin_checkout', {
                    'send_to': window.rcProps.ga4.tagID
                });
            }
        }
    }
}

function insertGoogleRemarketing() {
    if (window.rcProps.google.remarketing.isWhitelisted && !window.rcProps.footer.isOrderSummary) {
        var google_tag_params = {};

        if (window.rcProps.footer.isDisplayProductPage) {
            google_tag_params = {
                ecomm_prodid: window.rcProps.pixel.productCode,
                ecomm_pagetype: 'product',
                ecomm_totalvalue: window.rcProps.pixel.productPrice
            };
        } else if (window.rcProps.footer.isValidSearchPage) {
            google_tag_params = {
                ecomm_prodid: null,
                ecomm_pagetype: 'searchresults',
                ecomm_totalvalue: null
            };
        } else if (window.rcProps.footer.isCategoryPage) {
            google_tag_params = {
                ecomm_prodid: null,
                ecomm_pagetype: 'category',
                ecomm_totalvalue: null,
                ecomm_category: window.rcProps.pixel.category
            };
        } else if (window.rcProps.footer.isDesignersPage) {
            google_tag_params = {
                ecomm_prodid: null,
                ecomm_pagetype: 'category',
                ecomm_totalvalue: null,
                ecomm_category: 'Designers'
            };
        } else if (window.rcProps.footer.isHomePage) {
            google_tag_params = {
                ecomm_prodid: null,
                ecomm_pagetype: 'home',
                ecomm_totalvalue: null
            };
        } else if (window.rcProps.footer.isOrderSummary) {
            // do nothing
        } else {
            google_tag_params = {
                ecomm_prodid: null,
                ecomm_pagetype: 'other',
                ecomm_totalvalue: null
            };
        }

        $.getScript("//www.googleadservices.com/pagead/conversion_async.js", function() {
            if (typeof window.google_trackConversion === 'function') {
                window.google_trackConversion({
                    google_conversion_id: 1015759326,
                    google_custom_params: google_tag_params,
                    google_remarketing_only: true
                });
            }
        });
    }
}

function insertGoogleRemarketingAddToCart() {
    if (window.rcProps.google.remarketing.isWhitelisted) {
        try {
            if (typeof window.google_trackConversion === 'function') {
                window.google_trackConversion({
                    google_conversion_id: 1015759326,
                    google_custom_params: {
                        ecomm_pagetype: 'cart',
                        ecomm_prodid: window.rcProps.google.remarketing.addToCartCodes,
                        ecomm_totalvalue: window.rcProps.google.remarketing.cartAmount
                    },
                    google_remarketing_only: true
                });
            }
            // Google Remarketing Script add to bag end
        } catch (googleRemarketingBagException) {
            console.log('Google remarketing bag exception: ' + googleRemarketingBagException);
        }
    }
}

function insertCordial(code, name, brandname, categoryName, retailPrice, imageUrl, department, cat1) {
    if (window.rcProps.cordial.isWhitelisted) {
        if (typeof(crdl) == 'undefined' || crdl == null) {
            return;
        }

        if (window.rcProps.cordial.userEmail) {
            crdl('contact', {
                email: window.rcProps.cordial.userEmail
            }, {});
        }

        var isProductPage = window.rcProps.footer.isProductPage || code != null;
        if (isProductPage) {
            cordialPdPPages(code, name, brandname, categoryName, retailPrice, imageUrl, department, cat1);
        } else if (window.rcProps.footer.isProductListingPage || window.rcProps.footer.isSearchPage) {
            cordialPlPPages();
        } else {
            crdl('event', 'browse', {
                'pageType': window.rcProps.cordial.pageType,
                'department': window.rcProps.pixel.department
            });
        }
    }
}

// do not call this function directly
function cordialPdPPages(code, name, brandname, categoryName, retailPrice, imageUrl, department, cat1) {
    if (window.rcProps.cordial.isWhitelisted) {


        var productIDValue = window.rcProps.pixel.productCode;
        if (typeof(code) !== 'undefined') {
            productIDValue = code;
        }
        var productName = window.rcProps.pixel.productName;
        if (typeof(name) !== 'undefined') {
            productName = name;
        }
        var imageUrlValue = window.rcProps.cordial.imageUrl;
        if (typeof(imageUrl) !== 'undefined') {
            imageUrlValue = imageUrl;
        }
        var brandName = window.rcProps.pixel.productBrandName;
        if (typeof(brandname) !== 'undefined') {
            brandName = brandname;
        }
        var cordialCategory = window.rcProps.cordial.pixelProductCategory;
        if (typeof(categoryName) !== 'undefined') {
            cordialCategory = categoryName;
        }

        if (typeof(department) === 'undefined') {
            department = window.rcProps.cordial.pixelDepartment;
        }

        if (typeof(cat1) === 'undefined') {
            cat1 = window.rcProps.cordial.pixelCat1;
        }

        var categories = getCategoriesArray(cordialCategory);
        crdl('event', 'browse', {
            'pageType': 'Product',
            'productID': productIDValue,
            'product': productName,
            'imageUrl': imageUrlValue,
            'brandName': brandName,
            'department': department,
            'productCategory': categoryName,
            'cat1': cat1,
        });
    }
}

// do not call this function directly
function cordialPlPPages() {
    if (window.rcProps.cordial.isWhitelisted) {

        var categories = getCategoriesArray(window.rcProps.pixel.category);
        crdl('event', 'browse', {
            'department': window.rcProps.pixel.department,
            'pageType': window.rcProps.cordial.pageType,
            'category': (typeof categories[0] !== 'undefined' ? categories[0].trim() : ''),
            'subcategory': (typeof categories[1] !== 'undefined' ? categories[1].trim() : ''),
            'subsubcategory': (typeof categories[2] !== 'undefined' ? categories[2].trim() : ''),
            'searchKeyword': window.rcProps.pixel.searchParameter
        });
    }
}

function getCategoriesArray(categories) {
    var categoryArr = [];
    if (typeof categories !== 'undefined') {
        categoryArr = categories.toString().split(":")
    }
    return categoryArr;
}

function insertFacebookAddToCart(productCode, price) {
    if (window.rcProps.facebook) {
        if (typeof fbq !== 'undefined') {
            const fbAddToCartEventID = '_' + Math.random().toString(36).substr(2, 9);
            fbq('track', 'AddToCart', {
                content_ids: [productCode],
                content_type: 'product',
                value: price,
                currency: 'USD'
            }, {
                eventID: fbAddToCartEventID
            });
            $.ajax({
                url: window.rcProps.facebook.apiUrl,
                method: 'POST',
                timeout: 200,
                data: {
                    data: JSON.stringify([{
                        event_name: 'AddToCart',
                        event_id: fbAddToCartEventID,
                        event_time: window.rcProps.facebook.eventTime,
                        action_source: 'website',
                        event_source_url: window.rcProps.facebook.eventSourceUrl,
                        user_data: window.rcProps.facebook.userData,
                        custom_data: {
                            content_ids: [productCode],
                            content_type: 'product',
                            value: price,
                            currency: 'USD'
                        }
                    }]),
                    siteFlag: "F",
                    countryCode: window.rcProps.facebook.countryCode
                }
            });
        }
    }
}

function insertCordialAddToCart(cartItems, totalCartAmount) {
    if (window.rcProps.cordial.isWhitelisted) {
        if (typeof(crdl) == 'undefined' || crdl == null) {
            return;
        }
        if (cartItems.length > 0) {
            var cartItem = cartItems[0];

            var addQty = 1;
            if (typeof(cartItem.qty) != undefined && cartItem.qty != null) {
                addQty = cartItem.qty;
            }

            crdl([
                ['cartitem', 'add', {
                    'productID': cartItem.productCode,
                    'sku': cartItem.productCode,
                    'category': cartItem.productCategory,
                    'name': cartItem.productName,
                    'images': [cartItem.imageUrl],
                    'description': cartItem.description,
                    'qty': addQty,
                    'itemPrice': cartItem.price,
                    'url': '',
                    'attr': {
                        'manufacturer': cartItem.brandName,
                    },
                    'productName': cartItem.productName,
                    'manufacturerName': cartItem.brandName,
                    'cat1': cartItem.cat1,
                    'department': cartItem.department,
                    'url': '',
                }]
            ]);

            crdl('event', 'cartitem', {
                'action': 'add',
                'productID': cartItem.productCode,
                'qty': addQty,
                'category': cartItem.productCategory,
                'productName': cartItem.productName,
                'manufacturerName': cartItem.brandName,
                'cat1': cartItem.cat1,
                'department': cartItem.department
            });
        }
    }
}

function insertCordialRemoveFromCart(productName, productCode, price, brand, category, qty) {
    if (window.rcProps.cordial.isWhitelisted) {
        if (typeof(crdl) == 'undefined' || crdl == null) {
            return;
        }

        var removeQty = 1;
        if (typeof(qty) != undefined && qty != null) {
            removeQty = qty;
        }

        crdl([
            ['cartitem', 'remove', {
                'productID': productCode,
                'sku': productCode,
                'category': category,
                'name': productName,
                'images': [],
                'qty': removeQty,
                'itemPrice': price,
                'url': '',
                'attr': {
                    'manufacturer': brand,
                }
            }]
        ]);

        crdl('event', 'cartitem', {
            'action': 'remove',
            'productID': productCode,
            'qty': removeQty
        });
    }
}

function insertCordialUpdateWishList(action, productCode) {
    if (window.rcProps.cordial.isWhitelisted) {
        if (typeof(crdl) == 'undefined' || crdl == null) {
            return;
        }

        crdl('event', 'favoriteitem', {
            'action': action,
            'productID': productCode,
            'qty': 1
        });
    }
}

function insertTaboola() {
    try {
        var taboola = window.rcProps.taboola

        if (taboola && taboola.isWhitelisted) {
            window._tfa = window._tfa || [];
            window._tfa.push({
                notify: 'event',
                name: 'page_view',
                id: taboola.id
            });

            var additionalObject = {}
            if (taboola.uri.includes("indexWomen.jsp") || taboola.uri.includes("indexMen.jsp")) {
                additionalObject = {
                    name: "HOME_PAGE_VISIT"
                };
            } else if (taboola.isSearchPage === "true") {
                additionalObject = {
                    name: "SEARCH",
                    searchTerm: taboola.searchTerm,
                    productIds: taboola.searchAndCategoryViewProductIds
                };
            } else if (taboola.isPLPPage === "true") {
                additionalObject = {
                    name: "CATEGORY_VIEW",
                    category: taboola.category,
                    categoryId: taboola.category,
                    productIds: taboola.searchAndCategoryViewProductIds
                };
            } else if (taboola.isProductPage === "true") {
                additionalObject = {
                    name: "PRODUCT_VIEW",
                    productIds: [taboola.productId]
                };
            } else if (taboola.isCheckoutPage === "true") {
                additionalObject = {
                    name: "CHECKOUT",
                    productIds: taboola.checkoutProductIds
                };
            }

            var taboolaObj = {
                notify: 'ecevent',
                id: taboola.id,
            };

            var mergedObjectToPush = Object.assign({}, taboolaObj, additionalObject);
            window._tfa.push(mergedObjectToPush)

                ! function(t, f, a, x) {
                    if (!document.getElementById(x)) {
                        t.async = 1;
                        t.src = a;
                        t.id = x;
                        f.parentNode.insertBefore(t, f);
                    }
                }
                (document.createElement('script'), document.getElementsByTagName('script')[0], '//cdn.taboola.com/libtrc/unip/' + taboola.id + '/tfa.js', 'tb_tfa_script');
        }
    } catch (e) {
        console.log(e);
    }
}

function insertTaboolaAddToCart(action, productCodesArray) {
    var taboola = window.rcProps.taboola
    if (taboola && taboola.isWhitelisted) {
        try {
            window._tfa = window._tfa || [];
            if (action === "add") {
                window._tfa.push({
                    notify: 'event',
                    name: 'add_to_cart',
                    id: taboola.id
                });
            }
            window._tfa.push({
                id: taboola.id,
                notify: 'ecevent',
                name: (action === "add") ? 'ADD_TO_CART' : 'REMOVE_FROM_CART',
                productIds: productCodesArray
            });
            ! function(t, f, a, x) {
                if (!document.getElementById(x)) {
                    t.async = 1;
                    t.src = a;
                    t.id = x;
                    f.parentNode.insertBefore(t, f);
                }
            }(document.createElement('script'), document.getElementsByTagName('script')[0], '//cdn.taboola.com/libtrc/unip/' + taboola.id + '/tfa.js', 'tb_tfa_script');
        } catch (e) {
            console.log(e);
        }
    }
}

function taboolaWishListAction(action, productCodesArray) {
    var taboola = window.rcProps.taboola;
    if (taboola && taboola.isWhitelisted) {
        try {
            window._tfa = window._tfa || [];
            window._tfa.push({
                id: taboola.id,
                notify: 'ecevent',
                name: (action === "add") ? 'ADD_TO_WISH_LIST' : 'REMOVE_FROM_WISH_LIST',
                productIds: [productCodesArray]
            });
            ! function(t, f, a, x) {
                if (!document.getElementById(x)) {
                    t.async = 1;
                    t.src = a;
                    t.id = x;
                    f.parentNode.insertBefore(t, f);
                }
            }(document.createElement('script'), document.getElementsByTagName('script')[0], '//cdn.taboola.com/libtrc/unip/' + taboola.id + '/tfa.js', 'tb_tfa_script');
        } catch (e) {
            console.log(e);
        }
    }
}

function gaUpdateWishList(action, productCode, callback) {
    var wishlistUpdated = false;
    if (window.rcProps.google.isWhitelisted) {
        if (typeof ga !== 'undefined' && action != 'undefined') {
            if (typeof callback === 'function') {
                ga('send', 'event', {
                    'eventCategory': 'heartproduct',
                    'eventAction': action,
                    'eventLabel': productCode,
                    'hitCallback': callback,
                    'hitCallbackFail': callback
                });
                setTimeout(callback, 500);
                wishlistUpdated = true;
            } else {
                ga('send', 'event', 'heartproduct', action, productCode);
                wishlistUpdated = true;
            }
        }
    }
    return wishlistUpdated;
}

function gaAddToCartActionWithAjax(action, productCode, size, qty) {
    if (window.rcProps.google.isWhitelisted) {
        $.ajax({
            url: "/r/ajax/GetProductInfo.jsp",
            method: "GET",
            data: {
                code: productCode,
                siteflag: "F"
            },
            success: function(json) {
                var productInfo = $.parseJSON(json);
                if (productInfo) {
                    if (productInfo.success) {
                        productInfo.quantity = qty;
                        productInfo.variant = size;
                        gaAddToCartActionProduct(action, productInfo);
                    } else {
                        colsole.log("Error message for product info:" + productInfo.message);
                    }
                }
            },
            error: function() {
                console.log("Error when getting product info from the server");
            }
        });
    }
}

//string values in product object should be already escaped
function gaAddToCartActionProduct(action, product) {
    if (window.rcProps.google.isWhitelisted) {
        if (typeof ga !== 'undefined') {
            ga('create', window.rcProps.google.trackerId);
            ga('require', 'ec');
            if (typeof product !== 'undefined') {
                ga('ec:addProduct', {
                    'id': product.code,
                    'name': product.name,
                    'category': product.category,
                    'brand': product.brand,
                    'variant': product.variant,
                    'price': product.price,
                    'quantity': product.quantity
                });
            }
            if (action) {
                var actionlabel = (action === 'add') ? 'addToCart' : 'removeFromCart';
                ga('ec:setAction', action);
                ga('send', 'event', 'product', 'click', actionlabel);
            }
        }
    }

    if (typeof ga4AddToCartActionProduct === 'function') {
        ga4AddToCartActionProduct(action, product);
    }

    if (action === 'add') {
        googleRetailAddToCartAction(product.code, product.name, product.quantity);
    }
}

// IN-2708 google address autocomplete
var googleAutoCompleteConfig = window.googleAutoCompleteConfig || {}; // {countryCode: {lang, country, input, autoFill}}

function loadGoogleMap(country, countryCode) {
    if ($ && $(document).ready) {
        $(document).ready(function() {
            loadGoogleMapAfterDomLoaded(country, countryCode)
        })
    } else {
        loadGoogleMapAfterDomLoaded(country, countryCode)
    }
}

function loadGoogleMapAfterDomLoaded(country, countryCode) {
    //console.log('---loadGoogleMap--fw_2f9948df304398fe34c90f60505052556be1b4bc/mobile/js/foot.js-', countryCode)

    var config = googleAutoCompleteConfig[countryCode]
    if (!config) {
        //console.log('--loadGoogleMap--cant find config-', countryCode, googleAutoCompleteConfig)
        return;
    }

    if (!window.rcProps.google.useGoogleAddressAutoComplete) {
        console.log('Not support Google Map');
        return;
    }

    var language = config.lang;

    var funcName = 'afterGoogleMapLoad' + Date.now() + '_' + ('' + Math.random()).substring(2);
    window[funcName] = function() {
        initGoogleAutoCompleteAfterLoad(countryCode, config);
    };

    if (window.google && window.google.maps) {
        window.google.maps = {};
    }


    var apiKey = 'AIzaSyC9NXzjugH4D32R1lPNVjN4cAkhs5q2fA8';
    if ('US' == countryCode || 'US' == country) {
        apiKey = 'AIzaSyDKEIpvhHSSK8MvGcH7FaZqEqjkNNuV53M';
    }

    var script = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=' + funcName + '&libraries=places&v=weekly&language=' + language;
    // console.log('-loadMapScript-', script)
    $.getScript(script, function(res) {
        // console.log('--load google map finished....', res);
    });
}

function initGoogleAutoCompleteAfterLoad(countryCode, config) {
    // console.log('--initGoogleAutoCompleteAfterLoad---', countryCode, config)
    if (!config || !config.input || !$(config.input).length) {
        console.log('please config the input element\'s selector, ' + countryCode);
        return;
    }

    var googleStreetSelector = config.country == 'US' ? config.input : (config.input + '_Google');
    $(googleStreetSelector).each(function(i, input) {
        var autoComplete = new google.maps.places.Autocomplete(input, {
            componentRestrictions: {
                country: [config.country || countryCode]
            },
            language: config.language || 'en',
            fields: ["address_components", "geometry"],
            types: ["address"],
        });
        autoComplete.addListener("place_changed", function() {
            var addressInfo = getAddressFromGoogleApi(autoComplete, countryCode);
            //console.log('-addressInfo-', addressInfo)
            if (config.autoFill) {
                config.autoFill(addressInfo, input, config);
            }
        });
    });
    initAutoCompleteForGoogleMap(config);
}

function initAutoCompleteForGoogleMap(config) {
    if (config.country == 'US') return;

    var streetSelector = config.input;
    var googleStreetSelector = config.input + "_Google";

    var __streetValue = [];
    var __autocompleteMap = [];

    $(streetSelector).each(function(i, street) {
        var form = $(street).parents('form');
        var googleStreet = form.find(googleStreetSelector);
        var streetContainer = form.find(config.inputContainer);
        var googleStreetContainer = form.find(config.inputContainer + '_Google');

        if ($(street).data('bindedGoogle')) return

        $(street).data('bindedGoogle', true)

        if (__autocompleteMap[i] === undefined) __autocompleteMap[i] = {};

        $(street).on("input propertychange", function() {
            var value = $(this).val();

            if ($(this).is(":visible")) {
                if (value.length > 5 && value.length - (__streetValue[i] || '').length === 1) {
                    //user seems to be typing their address out and not using browser autofill
                    googleStreet.val(value);

                    streetContainer.hide();

                    googleStreetContainer.show(0, function() {
                        //set up the autocomplete attribute map so that when a user uses autocomplete, we can disable browser
                        //autofill on all inputs. if the user then erases everything from the Loqate autocomplete street input,
                        //we will use this map to reset the autocomplete attributes
                        if ($.isEmptyObject(__autocompleteMap[i])) {
                            //we do it here instead of document ready because the email field is outside of this form
                            form.find("input").each(function() {
                                var $input = $(this);

                                __autocompleteMap[i][$input.attr("id")] = $input.attr("autocomplete");
                            });
                        }
                        form.find("input").each(function() {
                            $(this).attr("autocomplete", "none");
                        });
                    });
                    googleStreet.focus();
                    googleStreet[0].setSelectionRange(value.length, value.length); //IE11 cursor is at beginning

                }
            } else if (value !== __streetValue[i]) {
                googleStreetContainer.hide();
                streetContainer.show();
            }

            __streetValue[i] = value;
        });

        googleStreet.on("input propertychange", function() {
            if ($(this).is(":visible")) {
                var value = $(this).val();
                __streetValue[i] = value;

                if (value.length) {
                    $(street).val(value);
                } else {
                    //reset autocomplete attributes
                    form.find("input").each(function() {
                        var $input = $(this);
                        var autocompleteValue = __autocompleteMap[i][$input.attr("id")];

                        if (autocompleteValue) {
                            $input.attr("autocomplete", autocompleteValue);
                        } else {
                            $input.removeAttr("autocomplete");
                        }
                    });

                    googleStreetContainer.hide();

                    $(street).val("");
                    streetContainer.show();
                    $(street).focus();
                }
            }
        });
    })
}

function getAddressFromGoogleApi(autocomplete, countryCode) {
    if (!autocomplete || !autocomplete.getPlace) {
        return false;
    }

    var addrInfo = {
        street: ''
    };

    var place = autocomplete.getPlace();
    if (!place || !place.address_components) {
        return false;
    }

    //console.log('---google place--', place)

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    place.address_components.forEach(component => {
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];

        // componentType @See https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
        switch (componentType) {
            case "street_number":
                {
                    if (countryCode != 'US') {
                        addrInfo.street = `${component.long_name || ''} ${addrInfo.street || ''}`.trim();
                    }
                    addrInfo.streetNumber = component.short_name || '';
                    break;
                }

            case "route":
                {
                    if (addrInfo.street) {
                        addrInfo.street += ' ';
                    }
                    addrInfo.street += component.short_name || '';
                    break;
                }

            case "postal_code":
                {
                    addrInfo.postcode = (component.long_name || '') + (addrInfo.postcode || '');
                    break;
                }

            case "postal_code_suffix":
                {
                    addrInfo.postcode = (addrInfo.postcode || '') + '-' + (component.long_name || '');
                    break;
                }

            case "locality":
                addrInfo.city = component.long_name || '';
                break;

            case "administrative_area_level_1":
                {
                    addrInfo.state = component.short_name || '';
                    break;
                }
            case "administrative_area_level_2":
                {
                    addrInfo.street2 = component.short_name || '';
                    break;
                }

            case "postal_town":
                addrInfo.town = component.long_name || component.short_name || '';
                break;

            case "country":
                addrInfo.countryCode = component.short_name || '';
                break;
        }
    });

    // console.log('IN-2708--google address Info<footer>: ', addrInfo)
    return addrInfo;
}
// end of IN-2708 google address autocomplete

function setPixelCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + exdays * 24 * 60 * 60 * 1000);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/";
}

if (window.rcProps.pixel && window.rcProps.pixel.isValidPageSource) {
    setPixelCookie('pixelSource', window.rcProps.pixel.source, window.rcProps.pixel.cookieDays);

    if (window.rcProps.footer.cjWhitelisted) {
        if (window.rcProps.pixel.isValidConversionCookieSource) {
            setPixelCookie('cjeventId', window.rcProps.pixel.cjEventId, window.rcProps.pixel.cookieDays);
        }
    }
}

if (window.rcProps.crealytics && window.rcProps.crealytics.isWhitelisted && window.rcProps.crealytics.cclid != "") {
    setPixelCookie('crealyticsCookie', window.rcProps.crealytics.cclid, 30);
}

function insertNaver() {
    if (window.rcProps.naver.isWhitelisted) {
        try {
            $.getScript(window.rcProps.naver.scriptUrl, function() {
                if (!window.wcs_add) window.wcs_add = {};
                wcs_add["wa"] = "s_273d70f08c48";
                if (!window._nasa) window._nasa = {};
                wcs.inflow("fwrd.com");
                wcs_do(_nasa);
            });
        } catch (e) {
            console.log('error inserting HTTPS naver tracking code to footer.jsp: ' + e);
        }
    }
}

function insertCriteo() {
    if (window.rcProps.criteo.isWhitelisted && window.rcProps.criteo.countryId != 0 && !window.rcProps.footer.isOrderSummary) {
        var st = document.createElement("script");
        st.type = "text/javascript";
        st.src = "//static.criteo.net/js/ld/ld.js";
        st.defer = true;
        $('head').append(st);

        window.criteo_q = window.criteo_q || [];
        var hashMD5 = "md5";
        var hashSHA256 = "sha256";
        if (window.rcProps.footer.isDisplayProductPage) {
            // criteo product page
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewItem",
                item: window.rcProps.pixel.productCode
            });
        } else if (window.rcProps.footer.isCategoryPage && window.rcProps.criteo.viewList) {
            // Criteo Search Tag Start, moved from brand page
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewList",
                item: window.rcProps.criteo.viewList
            });
        } else if (window.rcProps.footer.isEditorialPage && window.rcProps.criteo.viewList) {
            // Criteo Search Tag Start, moved from brand page
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewList",
                item: window.rcProps.criteo.viewList
            });
        } else if (window.rcProps.footer.isHomePage) {
            // criteo homepage
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewHome"
            });
        } else if (window.rcProps.footer.isShoppingBagPage) {
            // criteo shopping bag
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewBasket",
                item: window.rcProps.criteo.jsonCartItems
            });
        } else if (window.rcProps.footer.isSearchPage) {
            // criteo shopping bag
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : /iPad/.test(navigator.userAgent) ? "t" : "d"
            }, {
                event: "viewSearchResult",
                item: window.rcProps.criteo.searchProductCodes,
                keywords: window.rcProps.criteo.keyword,
                category: window.rcProps.criteo.category,
                page_number: window.rcProps.criteo.pageNum
            });
        } else {
            // criteo View page
            window.criteo_q.push({
                event: "setAccount",
                account: window.rcProps.criteo.countryId
            }, {
                event: "setRetailerVisitorId",
                id: window.rcProps.browserId
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailMD5,
                hash_method: hashMD5
            }, {
                event: "setEmail",
                email: window.rcProps.footer.hashedEmailSHA256,
                hash_method: hashSHA256
            }, {
                event: "setEmail",
                email: window.rcProps.footer.emailEmpty
            }, {
                event: "setSiteType",
                type: "m"
            }, {
                event: "viewPage"
            });
        }
    }
}

function insertCriteoAddToCart(productcode) {
    var hashMD5 = "md5";
    var hashSHA256 = "sha256";
    if (window.rcProps.criteo.isWhitelisted && window.rcProps.criteo.accountId !== 0) {
        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push({
            event: "setAccount",
            account: window.rcProps.criteo.accountId
        }, {
            event: "setRetailerVisitorId",
            id: window.rcProps.browserId
        }, {
            event: "setEmail",
            email: window.rcProps.footer.hashedEmailMD5,
            hash_method: hashMD5
        }, {
            event: "setEmail",
            email: window.rcProps.footer.hashedEmailSHA256,
            hash_method: hashSHA256
        }, {
            event: "setEmail",
            email: window.rcProps.footer.emailEmpty
        }, {
            event: "setSiteType",
            type: window.rcProps.criteo.addToCartSiteType
        }, {
            event: "addToCart",
            item: [{
                id: productcode,
                price: window.rcProps.pixel.productPrice,
                quantity: 1
            }]
        });
    }
}

// Insert Snapchat Pixel
function insertSnapchatAddToCart(itemID) {
    if (window.rcProps.footer.snapchatWhitelisted) {
        try {
            if (typeof snaptr !== 'undefined') {
                snaptr('track', 'ADD_CART', {
                    'user_hashed_email': window.rcProps.footer.parsedEmail,
                    'item_ids': [itemID]
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

function insertSnapchat() {
    if (window.rcProps.footer.snapchatWhitelisted && !window.rcProps.footer.isOrderSummary) {
        (function(e, t, n) {
            if (e.snaptr) return;
            var a = e.snaptr = function() {
                a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments)
            };
            a.queue = [];
            var s = 'script';
            r = t.createElement(s);
            r.defer = !0;
            r.src = n;
            var u = t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r, u);
        })
        (window, document, 'https://sc-static.net/scevent.min.js');
        snaptr('init', '75c3330f-9a96-4cf7-bc84-df5bb8f327ee', {
            'user_email': window.rcProps.footer.parsedEmail
        });
        snaptr('track', 'PAGE_VIEW'); <!-- End Snap Pixel Code -->
    }
}

function insertStylightPixel() {
    if (window.rcProps.footer.stylightId) {
        (function(w, d, t, u, r, a, m) {
            w['StylightAnalyticsRef'] = r;
            w[r] = w[r] || function() {
                (w[r].q = w[r].q || []).push(arguments)
            }, w[r].s = new Date() / 1;
            a = d.createElement(t),
                m = d.getElementsByTagName(t)[0];
            a.defer = 1;
            a.src = u;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://stats-bq.stylight.net/tracking.js?p=' + window.rcProps.footer.stylightId, 'sty');
    }
}

function insertYahooStandard() {
    if (window.rcProps.footer.yahooWhitelisted) {
        (function(w, d, t, r, u) {
            w[u] = w[u] || [];
            w[u].push({
                projectId: "10000",
                properties: {
                    pixelId: "10091203"
                }
            });
            var s = d.createElement(t);
            s.src = r;
            s.defer = true;
            s.onload = s.onreadystatechange = function() {
                var y, rs = this.readyState,
                    c = w[u];
                if (rs && rs != "complete" && rs != "loaded") {
                    return
                }
                try {
                    y = YAHOO.ywa.I13N.fireBeacon;
                    w[u] = [];
                    w[u].push = function(p) {
                        y([p])
                    };
                    y(c)
                } catch (e) {}
            };
            var scr = d.getElementsByTagName(t)[0],
                par = scr.parentNode;
            par.insertBefore(s, scr)
        })(window, document, "script", "https://s.yimg.com/wi/ytc.js", "dotq");

        if (window.rcProps.footer.isProductPage) {
            productViewYahoo(window.rcProps.pixel.productCode, 'detailview');
        }
    }
}

function productViewYahoo(productcode, actionlabel) {
    if (window.rcProps.footer.yahooWhitelisted) {
        if (productcode != null) {
            window.dotq = window.dotq || [];
            window.dotq.push({
                'projectId': '10000',
                'properties': {
                    'pixelId': '10091203',
                    'qstrings': {
                        'et': 'custom',
                        'ea': 'ViewProduct',
                        'el': actionlabel,
                        'product_id': productcode
                    }
                }
            });
        }
    }
}

function addToCartYahoo(productcode, size) {
    if (window.rcProps.footer.yahooWhitelisted) {
        if (typeof size !== 'undefined' && size !== null) {
            productcode = productcode + '-' + size;
        }
        window.dotq = window.dotq || [];
        window.dotq.push({
            'projectId': '10000',
            'properties': {
                'pixelId': '10091203',
                'qstrings': {
                    'et': 'custom',
                    'ea': 'AddToCart',
                    'product_id': productcode
                }
            }
        });
    }
}

function loadBamx() {
    if (window.rcProps.bamx) {
        var pageType = null;

        window.BAMX_EVENT_DATA = {
            site_type: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? 'mobile' : /iPad/.test(navigator.userAgent) ? 'tablet' : 'desktop',
            ip: null,
            user_email: window.rcProps.bamx.userId,
            user_id: window.rcProps.bamx.userId,
            product_id: null,
            product_name: null,
            product_brand: null,
            product_price: null,
            product_size: null,
            product_quantity: null,
            products_in_cart: null,
            products_purchased: null,
            subscription_email: window.rcProps.bamx.userId,
            name: window.rcProps.bamx.name,
            billing_city: null,
            billing_state: null,
            billing_zip_code: null,
            billing_country: null,
            order_id: null,
            order_value: null,
            currency: 'USD',
            last_four: null,
            is_new_customer: window.rcProps.bamx.isNewCustomer
        };

        if (window.rcProps.footer.isHomePage) {
            pageType = "homepage";
        } else if (window.rcProps.footer.isBrandsPage || window.rcProps.footer.isProductListingPage) {
            pageType = "brand";
        } else if (window.rcProps.footer.isDisplayProductPage) {
            pageType = "product";
        } else if (window.rcProps.footer.isShoppingBagPage) {
            pageType = "shopping bag";

            window.BAMX_EVENT_DATA.products_in_cart = window.rcProps.bamx.productsInCart;
        } else if (window.rcProps.footer.isOrderSummary) {
            pageType = "other";
        }

        if (pageType) {
            window.BAMX_EVENT_DATA.page_type = pageType;
        }

        if (!window.rcProps.footer.isOrderSummary) {
            (function(window, document, account) {
                var b = document.createElement("script");
                b.type = "text/javascript";
                b.defer = true;
                b.src = "//static.bam-x.com/tags/" + account + ".js";
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(b, a);
            })(window, document, "forward");
        }
    }
}

if (window.rcProps.footer && window.rcProps.footer.clickidCookie) {
    setPixelCookie('ir_clickid', window.rcProps.footer.clickidCookie, 90);
}

function insertFacebookPageView() {
    if (window.rcProps.facebook) {
        ! function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.defer = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window,
            document, 'script', '//connect.facebook.net/en_US/fbevents.js');
        // Insert Your Facebook Pixel ID below.
        try {
            const eventsArr = [];
            const fbPageViewEventID = '_' + Math.random().toString(36).substr(2, 9);
            fbq('init', window.rcProps.facebook.pixelID, window.rcProps.facebook.userData);
            fbq('track', 'PageView', {}, {
                eventID: fbPageViewEventID
            });
            eventsArr.push({
                event_name: 'PageView',
                event_id: fbPageViewEventID,
                event_time: window.rcProps.facebook.eventTime,
                action_source: 'website',
                event_source_url: window.rcProps.facebook.eventSourceUrl,
                user_data: window.rcProps.facebook.userData
            });
            const fbViewContentEventID = '_' + Math.random().toString(36).substr(2, 9);
            if (window.rcProps.footer.isProductPage) {
                fbq('track', window.rcProps.facebook.trackValue, {
                    content_ids: [window.rcProps.pixel.productCode],
                    content_type: 'product',
                    value: window.rcProps.pixel.productPrice,
                    currency: 'USD'
                }, {
                    eventID: fbViewContentEventID
                });
                eventsArr.push({
                    event_name: window.rcProps.facebook.trackValue,
                    event_id: fbViewContentEventID,
                    event_time: window.rcProps.facebook.eventTime,
                    action_source: 'website',
                    event_source_url: window.rcProps.facebook.eventSourceUrl,
                    user_data: window.rcProps.facebook.userData,
                    custom_data: {
                        content_ids: [window.rcProps.pixel.productCode],
                        content_type: 'product',
                        value: window.rcProps.pixel.productPrice,
                        currency: 'USD'
                    }
                });
            } else if (window.rcProps.footer.isProductListingPage) {
                fbq('track', window.rcProps.facebook.trackValue, {
                    content_ids: window.rcProps.facebook.productListForFbPixel,
                    content_type: 'product'
                }, {
                    eventID: fbViewContentEventID
                });
                eventsArr.push({
                    event_name: window.rcProps.facebook.trackValue,
                    event_id: fbViewContentEventID,
                    event_time: window.rcProps.facebook.eventTime,
                    action_source: 'website',
                    event_source_url: window.rcProps.facebook.eventSourceUrl,
                    user_data: window.rcProps.facebook.userData,
                    custom_data: {
                        content_ids: window.rcProps.facebook.productListForFbPixel,
                        content_type: 'product'
                    }
                });
            }
            $.ajax({
                url: window.rcProps.facebook.apiUrl,
                method: 'POST',
                timeout: 200,
                data: {
                    data: JSON.stringify(eventsArr),
                    siteFlag: "F",
                    countryCode: window.rcProps.facebook.countryCode
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}

function insertBaidu() {
    if (window.rcProps.footer.baiduWhitelisted) {
        (function(d) {
            (window.bd_cpro_rtid = window.bd_cpro_rtid || []).push({
                id: "nWc1nWRL"
            });
            var s = d.createElement("script");
            s.type = "text/javascript";
            s.defer = true;
            s.src = location.protocol + "//cpro.baidu.com/cpro/ui/rt.js";
            var s0 = d.getElementsByTagName("script")[0];
            s0.parentNode.insertBefore(s, s0);
        })(document);

        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?13aa58766538d3d693c15d887718ec49";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }
}

function insertYandexMetrika() {
    if (window.rcProps.footer.yandexWhitelisted) {
        if (!window.rcProps.footer.isOrderSummary) {
            (function(m, e, t, r, i, k, a) {
                m[i] = m[i] || function() {
                    (m[i].a = m[i].a || []).push(arguments)
                };
                m[i].l = 1 * new Date();
                k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.defer = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(30959941, "init", {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true
            });
        }
    }
}


function loadJSFile(filename, async) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    if (async) {
        fileref.setAttribute("async", "async");
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

function loadJSFileDefer(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    fileref.setAttribute("defer", "defer");

    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

function insertBing() {
    if (window.rcProps.footer.bingWhitelisted) {
        try {
            (function(w, d, t, r, u) {
                var f, n, i;
                w[u] = w[u] || [], f = function() {
                    var o = {
                        ti: "4003729"
                    };
                    o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
                }, n = d.createElement(t), n.src = r, n.defer = 1, n.onload = n.onreadystatechange = function() {
                    var s = this.readyState;
                    s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
                }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
            })(window, document, "script", "https://bat.bing.com/bat.js", "uetq");
        } catch (bingException) {
            console.log('Bing exception' + bingException);
        }
    }
}

function insertSkimLinks() {
    if (window.rcProps.footer.slimLinksWhitelisted) {
        loadJSFileDefer('https://assistjs.skimresources.com/js/skimtag.fwrd.com.js');
        var skimTagEvent = window.skimTagEvent || {
            "event_type": "page_impression"
        };
    }
}

onDocReady(function() {
    jQuery.loadScript = function(url, callback) {
        jQuery.ajax({
            url: url,
            dataType: 'script',
            success: callback,
            async: true
        });
    };
});

function insertKenshoo() {
    if (window.rcProps.footer.kenshooWhitelisted) {

        $.loadScript('https://services.xg4ken.com/js/kenshoo.js?cid=7e9927c6-1bc9-4730-a6c2-470fe960f223', function() {
            if (typeof kenshoo !== 'undefined') {
                kenshoo.trackEvent('landingPage', '6233', '7e9927c6-1bc9-4730-a6c2-470fe960f223');
            }
        });

        ! function(a, b, c, d, e, f, g) {
            a.ktag || (e = function()

                {
                    e.sendEvent ? e.sendEvent(arguments) : e.ktq.push(arguments)
                }, e.ktq = [],
                a.ktag = e, f = b.getElementsByTagName(d)[0], g = b.createElement(d), g.defer = !0, g.src = c, f.parentNode.appendChild(g))
        }(window, document, "//resources.xg4ken.com/js/v2/ktag.js?tid=KT-N3F69-3EB", "script");

        ktag('setup', 'KT-N3F69-3EB', window.rcProps.footer.hashedEmail);
    }
}

function insertHivewyre() {
    if (window.rcProps.footer.hivewyreWhitelisted) {
        if (window.rcProps.footer.isOrderSummary) {
            //minus conversion/thank you page
        } else {
            var pixelHw = document.createElement("IMG");
            pixelHw.setAttribute("src", "https://secure.adnxs.com/px?id=848235&seg=1303132,8581645&order_id=Visitor&t=2");
            pixelHw.setAttribute("height", "1");
            pixelHw.setAttribute("width", "1");
            pixelHw.style.display = "none";
            document.body.appendChild(pixelHw);
        }
    }
}

if (!(window.rcProps.isDev || window.rcProps.isTest)) {
    //<![CDATA[
    (function() {
        function riskifiedBeaconLoad() {
            var store_domain = 'revolve.com';
            var session_id = window.rcProps.browserId;
            var url = ('https:' == document.location.protocol ? 'https://' : 'http://') +
                "beacon.riskified.com?shop=" + store_domain + "&sid=" + session_id;
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.defer = true;
            s.src = url;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }

        if (window.attachEvent)
            window.attachEvent('onload', riskifiedBeaconLoad);
        else
            window.addEventListener('load', riskifiedBeaconLoad, false);
    })();
    //]]>
}

function insertStaticFloodLightSiteTag() {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    if (window.rcProps.googleSA360.isInternational) {
        if (window.rcProps.googleSA360.isWhitelisted) {
            gtag('config', 'DC-10347190');

            if (window.rcProps.googleSA360.isShoppingBag) {
                gtag('event', 'conversion', {
                    'allow_custom_scripts': true,
                    'send_to': 'DC-10347190/sbag1/shopp0+standard'
                });
            }
        }
    } else {
        gtag('config', 'DC-10226740');
    }
}

/**
 * BEGIN IPINYOU
 */

function insertIpinYou() {
    if (window.rcProps.ipinyou) {
        (function(w, d, s, l, a) {
            w._CommandName_ = l;
            w[l] = w[l] || function() {
                (w[l].q = w[l].q || []).push(arguments);
                w[l].track = function() {
                    (w[l].q[w[l].q.length - 1].t = []).push(arguments)
                };
                return w[l]
            }, w[l].a = a, w[l].l = 1 * new Date();
            var c = d.createElement(s);
            c.defer = 1;
            c.src = '//fm.ipinyou.com/j/a.js';
            var h = d.getElementsByTagName(s)[0];
            h.parentNode.insertBefore(c, h);
        })(window, document, 'script', 'py', 'kps8T..6XkITK4_hzr3pFbOaJHeVP');
        if (typeof py !== 'undefined') {
            py('set', 'user', {
                'id': window.rcProps.userId,
                'category': "58210"
            });
            if (window.rcProps.footer.isProductPage) {
                if (window.rcProps.ipinyou.doesProductExist) {
                    py('set', 'site', {
                        'industry': 'retail'
                    });
                    py('event', 'viewItem', window.rcProps.ipinyou.viewItemData);
                }
            } else if (window.rcProps.ipinyou.isWelcomeSignUp) {
                py('event', 'statistics', window.rcProps.ipinyou.stasticsData);
            } else {
                py('event', 'viewPage');
            }
        }
    }
}

function iPinYouAddtoCart(code) {
    if (window.rcProps.ipinyou) {
        if (typeof py !== 'undefined' && code != 'undefined') {
            py('event', 'addCart', code, 'kps8T.M2Z.JnVdY0z3s_cxXDLd_JsVB0');
        }
    }
}

function iPinYouHeartItem(code) {
    if (window.rcProps.ipinyou) {
        if (typeof py !== 'undefined' && code != 'undefined') {
            py('event', 'addCart', code).track('kps8T.a2Z.8Jvq8ByHYZjXolOIWZULC_');
        }
    }
}

function iPinYouBuyNow(code) {
    if (window.rcProps.ipinyou) {
        if (typeof py !== 'undefined' && code != 'undefined') {
            py('event', 'purchase', window.rcProps.ipinyou.purchaseData);
        }
    }
}

/**
 * END IPINYOU
 */

function insertCJ() {
    if (window.rcProps.cj) {
        //BEGIN CJ TRACKING CODE
        if (!window.cj) window.cj = {};
        cj.sitePage = {
            enterpriseId: window.rcProps.cj.enterpriseId,
            pageType: window.rcProps.cj.pageType,
            userId: window.rcProps.cj.userId,
            emailHash: window.rcProps.cj.emailHash,
            referringChannel: window.rcProps.cj.referringChannel,
            items: window.rcProps.cj.items
        };
        (function(a, b, c, d) {
            a = 'https://www.mczbf.com/tags/11468/tag.js';
            b = document;
            c = 'script';
            d = b.createElement(c);
            d.src = a;
            d.type = 'text/java' + c;
            d.defer = true;
            d.id = 'cjapitag';
            a = b.getElementsByTagName(c)[0];
            a.parentNode.insertBefore(d, a)
        })();
        //END CJ TRACKING CODE
    }
}


function insertGA4() {
    if (window.rcProps.ga4) {
        loadJSFileDefer('https://www.googletagmanager.com/gtag/js?id=<%=GA4TagID%>');

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', window.rcProps.ga4.tagID, {
            'browser_id': window.rcProps.ga4.browser_id,
            'page_type': window.rcProps.ga4.page_type,
            'user_id': window.rcProps.ga4.user_id
        });
        gtag('set', 'user_properties', {
            'forward_user_id': window.rcProps.ga4.user_id
        });

        if (window.rcProps.ga4.doesProductExist) {
            gtag('event', 'view_item', {
                'currency': 'USD', // required
                'items': [{
                    'item_name': window.rcProps.ga4.viewItemData.name,
                    'item_id': window.rcProps.ga4.viewItemData.code,
                    'quantity': window.rcProps.ga4.viewItemData.quantity,
                    'price': window.rcProps.ga4.viewItemData.price,
                    'item_category': window.rcProps.ga4.viewItemData.category,
                    'item_brand': window.rcProps.ga4.viewItemData.brand
                }],
                'send_to': window.rcProps.ga4.tagID
            });
        }
    }
}

function ga4AddToCartActionProduct(action, product) {
    if (window.rcProps.ga4) {
        if (typeof gtag !== 'undefined' && action) {
            var ga4actionlabel = (action === 'add') ? 'add_to_cart' : 'remove_from_cart';

            if (typeof product !== 'undefined') {
                gtag('event', ga4actionlabel, {
                    'currency': 'USD',
                    'items': [{
                        'item_name': product.name,
                        'item_id': product.code,
                        'quantity': product.quantity,
                        'price': product.price,
                        'item_category': product.category,
                        'item_brand': product.brand
                    }],
                    'send_to': window.rcProps.ga4.tagID
                });
            }
        }
    }
}

function googleRetailAddToCartAction(productCode, productName, quantity) {
    sendRetailApiEvent({
        eventType: window.rcProps.grs.addToCartEventName,
        productDetails: [{
            product: {
                id: productCode,
                title: productName
            },
            quantity: quantity
        }]
    });
}

function sendRetailApiEvent(eventParams) {
    if (window.rcProps.grs.allowEventRecording) {
        if (!eventParams) {
            return;
        }
        var visitorId = localStorage.getItem(window.rcProps.grs.localStorageKey);

        if (visitorId) {
            var user_event = {
                visitorId: visitorId,
                sessionId: window.rcProps.grs.sessionId,
                userInfo: {
                    directUserRequest: true
                }
            };
            if (window.rcProps.grs.userId) {
                user_event.userInfo.userId = window.rcProps.grs.userId;
            }
            Object.assign(user_event, eventParams);

            window._gre = window._gre || [];
            // Credentials for project.
            _gre.push(['apiKey', window.rcProps.grs.apiKey]);
            _gre.push(['logEvent', user_event]);
            _gre.push(['projectId', window.rcProps.grs.projectId]);
            _gre.push(['locationId', 'global']);
            _gre.push(['catalogId', 'default_catalog']);
            _gre.push(['debug', window.rcProps.grs.debug]);

            (function() {
                var gre = document.createElement('script');
                gre.type = 'text/javascript';
                gre.defer = true;
                gre.src = 'https://www.gstatic.com/retail/v2_event.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(gre, s);
            })();
        }
    }
}

function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}