/*!
 * Date: 2018-05-04
 */
(function (document, jquery) {

    "use strict";
    $.extend($.fn, {
        fund: function (options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, returning nothing.");
                }
                return;
            }
            var fund = $.data(this[0], "fund");
            if (fund) {
                return fund;
            }

            funder = new $.funder(options, this[0]);
            $.data(this[0], "fund", fund);

            return fund;
        },
        valid: function () {
            var valid, validator, errorList;

            if ($(this[0]).is("form")) {
                valid = this.validate().form();
            } else {
                errorList = [];
                valid = true;
                validator = $(this[0].form).validate();
                this.each(function () {
                    valid = validator.element(this) && valid;
                    errorList = errorList.concat(validator.errorList);
                });
                validator.errorList = errorList;
            }
            return valid;
        },

    });

    // constructor for validator
    $.funder = function (options, form) {
        this.settings = $.extend(true, {}, $.funder.defaults, options);
        this.currentForm = form;
        this.init();
    };

    $.extend($.funder, {

        defaults: {
            messages: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: false,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function (element) {
                this.lastActive = element;

                // Hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.hideThese(this.errorsFor(element));
                }
            },
            onfocusout: function (element) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onclick: function (element) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);

                    // or option elements, check parent select in that case
                } else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            }
        },
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        }
    });
})(document, jquery);