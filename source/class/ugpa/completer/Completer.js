/* ************************************************************************

   Copyright: 2022

   License: MIT license

   Authors: Dmitrii Zolotov (goldim) zolotovdy@yandex.ru

************************************************************************ */

qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,
    implement: [qx.ui.form.IModel],
    include: [ugpa.completer.MFilterMode],

    construct(source, widget) {
        // noinspection JSAnnotator
        super();
        this.__source = source;
        this.setWidget(widget);
        this.__delayTimer = null;
    },

    destruct() {
        this.__delayTimer = null;
    },

    events: {
        "activated": "qx.event.type.Event",
        "highlighted": "qx.event.type.Event"
    },

    properties: {
        /** The delay in milliseconds between when a keystroke occurs and when a search is performed.
         *  A zero-delay makes sense for local data (more responsive),
         *  but can produce a lot of load for remote data,
         *  while being less responsive */
        delay: {
            init: 0,
            check: "Integer",
            event: "changeDelay"
        },

        enabled: {
            init: true,
            check: "Boolean",
            event: "changeEnabled"
        },

        model: {
            init: null,
            event: "changeModel",
            check: "qx.data.IListData"
        },

        /**
         * If set to true the first item will automatically
         * be focused when the menu is shown.
         */
        autoFocus: {
            init: false,
            check: "Boolean",
            event: "changeAutoFocus"
        },

        /**
         *  The case sensitivity of the matching
         */
        caseSensitivity: {
            init: "sensitive",
            check: ["insensitive", "sensitive"],
            event: "changeCaseSensitivity"
        },

        /**
         * The minimum number of characters a user must type before a search is performed.
         * Zero is useful for local data with just a few items,
         * but a higher value should be used
         * when a single character search could match a few thousand items.
         */
        minLength: {
            init: 1,
            check: "Integer",
            event: "changeMinLength"
        },

        /**
         * The maximum allowed size on screen of the completer, measured in items
         */
        maxVisibleItems: {
            init: 7,
            check: "Integer",
            event: "changeMaxVisibleItems"
        },

        widget: {
            init: null,
            apply: "_applyWidget",
            check: "ugpa.completer.IWidget"
        },

        popup: {
            init: null,
            apply: "_applyPopup",
            check: "ugpa.completer.IPopup"
        }
    },

    members: {
        _applyWidget(widget) {
            widget.addListener("input", this._onInput, this);
            widget.addListener("click", this._onFocus, this);
            widget.addListener("tap", this._onFocus, this);

            this.__updatePopupWidth(this.getPopup());
        },

        __updatePopupWidth(popup) {
            if (popup) {
                const widget = this.getWidget();
                if (widget) {
                    popup.setWidth(widget.getWidth());
                }
            }
        },

        _applyPopup(popup) {
            this.__updatePopupWidth(popup);
        },

        _onFocus() {
            if (!this.getEnabled()) {
                this.getPopup().hide();
                return;
            }
            const value = this.getWidget().getValue();
            if (!value && this.getMinLength() > 0) {
                return;
            }
            this.__showPopup();
            this.__applyInput(value === null ? "" : value);
        },

        _onInput(e) {
            if (!this.getEnabled()) {
                return;
            }
            const input = e.getData();
            if (input.length < this.getMinLength()) {
                if (this.getPopup().isVisible()) {
                    this.getPopup().hide();
                }
                return;
            }
            this.__searchWithTimer(input);
        },

        __searchWithTimer(input) {
            this.__stopDelayTimer();

            this.__delayTimer = qx.event.Timer.once(function() {
                this.__showPopup();
                this.__applyInput(input);
            }, this, this.getDelay());
        },

        __stopDelayTimer() {
            if (this.__delayTimer) {
                this.__delayTimer.stop();
                this.__delayTimer = null;
            }
        },

        __showPopup() {
            const popup = this.getPopup();
            popup.show();
            popup.placeToWidget(this.getWidget());
        },

        __applyAutofocus() {
            if (this.getAutoFocus()) {
                const popup = this.getPopup();
                this._setupAutoFocus(popup);
            }
        },

        search(value) {
            this.__searchWithTimer(value);
        },

        __applyInput(input) {
            this._clearPopup();
            const values = this.filterByInput(input, this.__source);
            if (values.length) {
                values.slice(0, this.getMaxVisibleItems()).forEach(this._addItemOnPopup, this);
                this.__applyAutofocus();
            } else {
                this.getPopup().hide();
            }
        }
    }
});
