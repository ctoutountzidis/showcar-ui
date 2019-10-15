import registerElement from '../../../07-utilities/helpers.js';

export default function (tagName) {
    let scrollbarWidth;

    function attachedCallback() {
        let lb = {
            self: this,
            parent: this.parentElement,
            container: this.querySelector('.sc-lightbox__container'),
            content: this.querySelector('.sc-lightbox__content'),
            close: Array.from(this.querySelectorAll('[data-lightbox-close]')),
            preventOutsideClose: this.getAttribute('prevent-outsideclose'),
            customIdentifier: this.getAttribute('data-custom') || ''
        };

        // Extend instance with callback information
        this.onCloseCallbacks = [];
        this.onOpenCallbacks = [];

        const id = this.id || '';
        const openElements = Array.from(document.querySelectorAll('[data-lightbox-open="' + id + '"]'));
        scrollbarWidth = measureScrollbarWidth();

        openElements.forEach(el => {
            el.addEventListener('click', () => showByTrigger(lb, el), false);
        });

        lb.close.forEach(el => {
            el.addEventListener('click', e => hideByTrigger(lb, e, lb.preventOutsideClose !== null), false);
        });
        this.lb = lb;
    }

    const showByTrigger= (lb, opener) => {
        if (
            opener.hasAttribute('data-lightbox-prevent-open') &&
            opener.getAttribute('data-lightbox-prevent-open') == 'true'
        ) {
            return;
        }
        show(lb);
    };

    const show = (lb) => {
        lb.overlay = document.createElement('div');
        lb.overlay.classList.add('sc-lightbox__overlay');

        if (lb.customIdentifier) {
            lb.overlay.setAttribute('data-custom', lb.customIdentifier);
        }

        document.body.appendChild(lb.overlay);

        lb.overlay.classList.add('sc-lightbox__overlay--visible');

        lb.overlay.appendChild(lb.container);

        lb.overlay.appendChild(lb.container);

        lb.container.classList.add('sc-lightbox__container--visible');

        if (lb.preventOutsideClose === null) {
            lb.overlay.addEventListener('click', e => hideByTrigger(lb, e), false);
            document.addEventListener('keydown', e => {
                if (e.keyCode === 27) hideByTrigger(lb, e);
            });
        }

        const html = document.querySelector('html');
        html.classList.add('sc-unscroll');
        html.style.marginRight = scrollbarWidth ? `${scrollbarWidth}px` : 0;

        setTimeout(() => {
            lb.overlay.classList.add('sc-lightbox--fadein');
        }, 20);

        lb.self.onOpenCallbacks.forEach(cb => cb());
    };

    /**
     * @param {boolean} executeOnCloseCallback executeOnCloseCallback Hide method gets called twice when clicking on close button, but we want to run close callback only-once
     */
    const hideByTrigger = (lb, e, executeOnCloseCallback = true) => {
        if (e.target === lb.overlay || lb.close.includes(e.target) || e.keyCode === 27) {
            e.preventDefault();

            hide(lb, executeOnCloseCallback);
        }
    };

    const hide = (lb, executeOnCloseCallback) => {
        // Unapply scrollbar fixes
        const html = document.querySelector('html');
        html.classList.remove('sc-unscroll');
        html.style.marginRight = 0; // reset margin

        lb.container.classList.remove('sc-lightbox__container--visible');
        lb.parent.appendChild(lb.container);
        if (lb.overlay) {
            lb.overlay.classList.remove('sc-lightbox--fadein');
            setTimeout(() => {
                lb.overlay.remove();
            }, 250);
        }

        executeOnCloseCallback && lb.self.onCloseCallbacks.forEach(cb => cb());
    };
    

    /**
     * Register callback to the current custom-element instance the call is made on
     */
    function registerOnOpenCallback(cb) {
        this.onOpenCallbacks.push(cb);
    }

    /**
     * Register callback to the current custom-element instance the call is made on
     */
    function registerOnCloseCallback(cb) {
        this.onCloseCallbacks.push(cb);
    }

    function showDirectly() {
        show(this.lb);
    }

    function hideDirectly() {
        hide(this.lb, true);
    }

    const measureScrollbarWidth = () => window && document && (window.innerWidth - document.documentElement.clientWidth) || 0;

    registerElement(
        {
            attachedCallback,
            tagName
        },
        {
            registerOnOpenCallback: {
                value: registerOnOpenCallback
            },
            registerOnCloseCallback: {
                value: registerOnCloseCallback
            },
            show: {
                value: showDirectly
            },
            hide: {
                value: hideDirectly
            }            
        }
    );
}
