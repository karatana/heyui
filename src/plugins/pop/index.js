import Popper from '../popper';
import utils from '../../utils/utils';

const DEFAULT_OPTIONS = {
  container: false,
  delay: 0,
  html: false,
  placement: 'top',
  triggerOnce: false,
  content: '',
  disabled: false,
  trigger: 'hover focus',
  offset: 0,
  equalWidth: false,
  type: 'dropdown',
  preventOverflow: false
};

/**
 * Create a new Pop.js instance
 * @class Pop
 * @param {HTMLElement} reference - The reference element used to position the pop
 * @param {Object} options
 * @param {String} options.placement=bottom
 *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -end),
 *      left(-start, -end)`
 *
 * @param {HTMLElement} reference - The DOM node used as reference of the pop (it can be a jQuery element).
 * @param {Object} options - Configuration of the pop
 * @param {HTMLElement|String|false} options.container=false - Append the pop to a specific element.
 * @param {Number|Object} options.delay=0
 *      Delay showing and hiding the pop (ms) - does not apply to manual trigger type.
 *      If a number is supplied, delay is applied to both hide/show.
 *      Object structure is: `{ show: 500, hide: 100 }`
 * @param {Boolean} options.html=false - Insert HTML into the pop. If false, the content will inserted with `innerText`.
 * @param {String|PlacementFunction} options.placement='top' - One of the allowed placements, or a function returning one of them.
 * @param {String} options.template='<div class="pop" role="pop"><div class="pop-arrow"></div><div class="pop-inner"></div></div>'
 *      Base HTML to used when creating the pop.
 *      The pop's `content` will be injected into the `.pop-inner` or `.pop__inner`.
 *      `.pop-arrow` or `.pop__arrow` will become the pop's arrow.
 *      The outermost wrapper element should have the `.pop` class.
 * @param {String|HTMLElement|ContentFunction} options.content='' - Default content value if `content` attribute isn't present.
 * @param {String} options.trigger='hover focus manual'
 *      How pop is triggered - click | hover | focus | manual.
 *      You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger.
 * @param {HTMLElement} options.boundariesElement
 *      The element used as boundaries for the pop. For more information refer to Popper.js'
 *      [boundariesElement docs](https://popper.js.org/popper-documentation.html)
 * @param {Number|String} options.offset=0 - Offset of the pop relative to its reference. For more information refer to Popper.js'
 *      [offset docs](https://popper.js.org/popper-documentation.html)
 * @return {Object} instance - The generated pop instance
 */
class Pop {

  constructor(reference, options) {
    options = utils.extend({}, DEFAULT_OPTIONS, options);
    this.reference = reference;

    this.options = options;

    const triggerEvents = typeof options.trigger === 'string' ? options.trigger.split(' ').filter((trigger) => {
      return ['click', 'hover', 'focus', 'contextMenu'].indexOf(trigger) !== -1;
    }) : [];

    this.isOpen = false;

    this.arrowSelector = options.arrowSelector;
    this.innerSelector = options.innerSelector;
    this.triggerEvents = [];
    if (options.content.nodeType === 1) {
      options.content.style.display = "none";
    }
    this.setEventListeners(triggerEvents, options);
  }

  toggle() {
    if (this.isOpen) {
      return this.hide();
    } else {
      return this.show();
    }
  }

  create(reference, template, content) {
    const popGenerator = window.document.createElement('div');
    popGenerator.innerHTML = template;
    const popNode = popGenerator.childNodes[0];
    const allowHtml = this.options.html;

    popNode.id = `pop_${Math.random().toString(36).substr(2, 10)}`;
    const contentNode = popGenerator.querySelector(this.innerSelector);
    if (content.nodeType === 1) {
      if (allowHtml) contentNode.appendChild(content);
      content.style.display = "block";
    } else if (utils.isFunction(content)) {
      const contentText = content.call(reference);
      if (allowHtml) {
        contentNode.innerHTML = contentText;
      } else {
        contentNode.innerText = contentText;
      }
    } else if (allowHtml) {
      contentNode.innerHTML = content;
    } else {
      contentNode.innerText = content;
    }

    return popNode;
  }

  updateContent(content) {
    this.options.content = content;
    if (!this.popNode || content == undefined) {
      return;
    }
    const contentNode = this.popNode.querySelector(this.innerSelector);
    const allowHtml = this.options.html;
    if (content.nodeType === 1) {
      if (allowHtml) contentNode.replaceChild(content, contentNode.firstChild);
      content.style.display = "block";
    } else if (allowHtml) {
      contentNode.innerHTML = content;
    } else {
      contentNode.innerText = content;
    }
    this.update();
  }

  initPopNode() {
    let reference = this.reference;
    let options = this.options
    const content = options.content || reference.getAttribute('content');

    if (!content) { return this; }

    const popNode = this.create(reference, options.template, content, options.html);

    popNode.setAttribute('aria-describedby', popNode.id);
    const container = this.findContainer(options.container, reference);

    this.append(popNode, container);
    if (options.class) {
      utils.addClass(popNode, options.class);
    }
    if (options.className) {
      utils.addClass(popNode, options.className);
    }

    this.popNode = popNode;
    this.popNode.setAttribute('aria-hidden', 'true');

    if (this.options.trigger.indexOf('hover') > -1) {
      this.setPopNodeEvent();
    }
  }

  initPopper() {
    let reference = this.reference;
    let options = this.options;
    let popNode = this.popNode;
    const container = this.findContainer(options.container, reference);

    let modifiers = {
      computeStyle: { gpuAcceleration: false },
      arrow: {
        enabled: false
      },
      inner: {
        enabled: false
      },
      preventOverflow: {
        boundariesElement: 'window',
        enabled: true
      }
    }

    // if (this.options.arrowSelector) {
    //   modifiers.arrow = {
    //     enabled: true,
    //     element: this.options.arrowSelector
    //   }
    // }
    // if (this.options.innerSelector) {
    //   modifiers.inner = {
    //     enabled: true,
    //     element: this.options.innerSelector
    //   }
    // }


    if (this.options.offset) {
      modifiers.offset = {
        enabled: true,
        offset: this.options.offset
      }
    }

    if (this.options.preventOverflow && container.tagName != 'BODY') {
      modifiers.hide = {
        enabled: false,
      };
      modifiers.flip = {
        boundariesElement: container,
        enabled: true
      }

      modifiers.preventOverflow = {
        enabled: false,
      }
    }
    if (this.options.trigger == 'contextMenu') {
      modifiers.flip = {
        enabled: false
      }
    }

    let popperOptions = {
      placement: options.placement,
      modifiers
    };
    this.popperOptions = popperOptions;
    this.popperInstance = new Popper(reference, popNode, popperOptions);
  }

  disabled() {
    this.options.disabled = true;
  }

  enabled() {
    this.options.disabled = false;
  }

  doshow() {
    if (!this.popNode) {
      this.initPopNode();
    }
    if (!this.popperInstance) {
      this.initPopper();
    }
    this.popperInstance.enableEventListeners();
    if (!this.popNode) {
      return;
    }
    if (this.options.equalWidth) {
      this.popNode.style.width = `${this.reference.clientWidth}px`;
    }

    this.popNode.style.display = '';
    utils.addClass(this.reference, 'h-pop-trigger');
    if (this.timeout) clearTimeout(this.timeout);
    if (this.timeout2) clearTimeout(this.timeout2);
    this.timeout = setTimeout(() => {
      this.popNode.setAttribute('aria-hidden', 'false');
      this.popperInstance.update();
    }, 0);
  }

  show() {
    if (this.isOpen || this.options.disabled) { return this; }
    // if (this.type == 'tooltip' && )
    this.isOpen = true;
    if (this.options.events && utils.isFunction(this.options.events.show)) {
      // this.options.events.show(() => {
      //   this.doshow();
      // });
      this.options.events.show();
      // return;
    }
    this.doshow();
    return this;
  }

  update() {
    if (this.popperInstance) {
      this.popperInstance.update();
    }
  }

  hide() {
    if (!this.popperInstance) return this;
    if (!this.isOpen) { return this; }

    if (this.timeout) clearTimeout(this.timeout);
    if (this.timeout2) clearTimeout(this.timeout2);
    this.timeout = setTimeout(() => {
      utils.removeClass(this.reference, 'h-pop-trigger');
      if (this.options.events && utils.isFunction(this.options.events.hide)) {
        this.options.events.hide.call(null);
      }
      this.popNode.setAttribute('aria-hidden', 'true');
      this.isOpen = false;
      this.timeout2 = setTimeout(() => {
        if (this.popNode) {
          this.popNode.style.display = 'none';
          if (this.popperInstance) {
            this.popperInstance.disableEventListeners();
          }
        }
      }, 300)
    }, this.options.delay);
    return this;
  }

  destory() {
    if (this.documentHandler) {
      document.removeEventListener('click', this.documentHandler);
    }
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }

    this.triggerEvents.forEach(({ event, func }) => {
      this.reference.removeEventListener(event, func, event == 'focus' || event == 'blur');
    });
    this.triggerEvents = [];

    if (this.popNode) {
      this.hide();
      this.popNode.parentNode.removeChild(this.popNode);
      this.popNode = null;
    }
    return this;
  }

  findContainer(container, reference) {
    if (typeof container === 'string') {
      container = window.document.querySelector(container);
    } else if (container === false) {
      container = reference.parentNode;
    }
    return container;
  }

  append(popNode, container) {
    container.appendChild(popNode);
  }

  setEventListeners(triggerEvents, options) {
    let reference = this.reference;
    const directtriggerEvents = [];
    const oppositetriggerEvents = [];

    triggerEvents.forEach((event) => {
      switch (event) {
        case 'hover':
          directtriggerEvents.push('mouseenter');
          oppositetriggerEvents.push('mouseleave');
          break;
        case 'focus':
          directtriggerEvents.push('focus');
          oppositetriggerEvents.push('blur');
          break;
        case 'click':
          directtriggerEvents.push('click');
          if (!this.options.triggerOnce) oppositetriggerEvents.push('click');
          break;
        case 'contextMenu':
          directtriggerEvents.push('contextmenu');
          oppositetriggerEvents.push('click');
          break;
        default:
          break;
      }
    });

    directtriggerEvents.forEach((event) => {
      const func = (evt) => {
        if (evt.type == 'contextmenu') {
          evt.preventDefault();
          evt.stopPropagation();
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          } else {
            document.selection.empty();
          }
          let rect = reference.getBoundingClientRect();
          this.options.offset = `${evt.clientX - rect.x}, -${rect.bottom - evt.clientY - 10}`;
          if (this.popperInstance) {
            this.popperInstance.defaultOptions.modifiers.offset = {
              enabled: true,
              offset: this.options.offset
            }
            this.popperInstance.updateModifiers();
            this.popperInstance.update();
          }
        }
        if (this.isOpen === true) { return; }
        evt.usedByPop = true;
        this.scheduleShow();
      };
      this.triggerEvents.push({ event, func });
      reference.addEventListener(event, func, event == 'focus');
    });

    oppositetriggerEvents.forEach((event) => {
      const func = (evt) => {
        if (evt.usedByPop === true) { return; }
        this.scheduleHide();
      };
      this.triggerEvents.push({ event, func });
      reference.addEventListener(event, func, event == 'blur');
    });

    if (options.closeOnClickBody) {
      this.documentHandler = (e) => {
        if (!this.popNode || e.target.parentNode == null) return;
        if (!this.isOpen || reference.contains(e.target) || this.popNode.contains(e.target)) {
          return false;
        }
        
        let targetReference = e.reference;
        if (reference && this.popNode.contains(targetReference)) {
          return false;
        }
        this.hide();
      };
      document.addEventListener('click', this.documentHandler);
    }
  }

  scheduleShow() {
    this.show();
  }

  scheduleHide() {
    if (this.isOpen === false) { return; }
    if (!document.body.contains(this.popNode)) { return; }
    this.hide();
  }

  setPopNodeEvent() {
    this.popNode.addEventListener('mouseenter', () => {
      this.doshow();
    });
    this.popNode.addEventListener('mouseout', (event) => {
      const relatedreference = event.relatedreference || event.toElement;
      if (!this.popNode.contains(relatedreference) && relatedreference != this.reference && !this.reference.contains(relatedreference)) {
        this.scheduleHide();
      }
    });
  }
}

export default Pop;
