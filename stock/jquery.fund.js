/*!
 * Date: 2018-05-04
 */
(function ( document, jquery ) {

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

			fund = new $.fund(options, this[0]);
			$.data(this[0], "fund", fund);

			return fund;
		},
		refresh: function () {
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
		build: function () {
		}

	});
})(document, jquery);