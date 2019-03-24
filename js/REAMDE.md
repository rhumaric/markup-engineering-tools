JavaScript utilities
====================

Approach: Provide a no-JS core experience. Use JS to provide shortcuts & enhancements. This is crucial, as [not everyone will have JS][why-no-js]. This also allow us to ["cut the mustard"][cut-the-mustard] to detect which browsers receive JavaScript support.

From there, that means we can work only in browsers with a good support for modern Web APIs. In turn, this allows to avoid bringing in heaps of JS (ahem `jQuery`) to get a normalized API to:
 - query the DOM (`querySelector`,`querySelectorAll`, `matches` and `closest`)
 - parse the DOM (`DOMParser` ftw!)
 - send HTTP requests (`XMLHttpRequest`)
 - and more...

To help the transition, sites like [plainjs.com] or [youmightnotneedjquery.com] provide a lot of help.

Using these native APIs as a base, we can start building a foundation of extra helpers which reduce the amount of code to send to browsers:

- *dom*: Syntax sugar over `querySelectorAll` to return proper Array (`.map`,`.forEach`able in all browsers), maybe same over `querySelector`. `qsa(selector, el)` and `qs(selector, el)` ?
- *events*: `delegate(selector, callback)` to enable event delegation over `addEventListener`. `dispatch(el, name, details)` as syntactic sugar of creating `CustomEvent`s.
- *xhr*: [Minimal Promise wrapping of XHRs][xhr-promise]
- *form*: Helpers for getting field values (incl. checkboxes, radio...), disabling fields (though `HTMLFieldsetElement.disabled` already provides loads), validating form, fields and fieldsets (hand in hand with the [constraint validation api][constraint-validation-api])
- *focus*: Helper to `tabindex=-1` elements that are not focussable before focusing them
- *show/hide*: With focusing/enabling and disabling (respectively) capabilities.

Misc:
- bringing JS onto the page (`defer` and `async`, JS modules)
- bundlers (`webpack`, `parcel`, `rollup` (?) )
- JavaScript feature general behaviours:
  - Attach to DOM node (MutationObserver or other methods)
  - Read properties: from object in window, `<template>` or `<script>` nodes, and/or data attributes
  - Enhance DOM node (eg. add ARIA, add extra wrappers, buttons...)
    - Cache nodes frequently modified if needed
    - Event listening (through delegation)
    - Rendering (`innerHTML` or more selective updates)
- The JavaScript lifecycle: mustard cut->polyfill->main->module initialization

Experiments to do:

- Notifications through events: elements triggers a `notification` event, that gets intercepted by whichever parent can display the notification
- If above works, translate that for client side form validation: invalid fields/fieldset trigger `valid`/`invalid` events that get inercepted by whatever need to display the error
- See if https://github.com/getify/TNG-Hooks can be used to share some data from up to deep down in the tree... might not be the role though



[why-no-js]: https://kryogenix.org/code/browser/everyonehasjs.html
[cut-the-mustard]: http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
[plainjs.com]: https://plainjs.com/javascript/
[youmightnotneedjquery.com]: http://youmightnotneedjquery.com/
[xhr-promise]: https://gist.github.com/rhumaric/09015901cfb48f216bee18cdd0343c45
[constraint-validation-api]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation