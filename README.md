> This repository is now [hosted on Gitlab](https://gitlab.com/romaricpascal/markup-engineering-tools). Please head there if you wish to contribute. Thanks 🙂

Markup engineering toolbox
==========================

[![Build Status](https://travis-ci.org/rhumaric/markup-engineering-tools.svg?branch=master)](https://travis-ci.org/rhumaric/markup-engineering-tools)

> Gather in a CSS + HTML first list of patterns that can be easily composed. Start with small patterns and build up to larger components, finally providing markup + CSS + JS for mor interactive patterns.

Principles
----------

- isolation: make it easy to apply the patterns at specific breakpoints, to specific BEM elements depending on the modifier
- reuse: provide functions, mixins and variables that make it easy to reuse isolated part of the pattern (eg. just the value of a box shadow). Will help when working with 3rd party markup (JS libraries or default CMS outputs)
- explain principles: don't provide just code, provide the concepts so the knowledge can be reused
- hard reset: as in everything is black on white, sans-serif... as much as possible. This provides a perfecf foundation to customize styles as needed
- cancelable default: over the hard reset, provide defaults that can be easily applied (through a `no-default` class for example)
- consistent naming scheme: limit confusion on whether responsiveness comes from a prefix, infix, suffix...
- promote accessible practices: think focus, reduced-motion, high contrast mode...
- pick'n'choose: allow to easily bring only parts of the framework
- bilingual documentation: I speak French and English, so might as well document things in both

State of the art
----------------

This is obviously not the first CSS/front-end framework and there's plenty of wheels not to reinvent out there:

 - Boostrap: https://getbootstrap.com/
 - Foundation: https://foundation.zurb.com/sites/docs/
 - InuitCSS: https://github.com/inuitcss/inuitcss
 - Bulma: https://bulma.io/
 - Tailwind: https://tailwindcss.com/docs/what-is-tailwind/
 - Scampi: https://gitlab.com/pidila/scampi
 - Rocssti: https://rocssti.net/en/
 - Knacss: https://www.knacss.com/
 - Sseeeedd: https://ffoodd.github.io/sseeeedd/

Government pattern libraries (eg.https://design-system.service.gov.uk/, https://designsystem.gov.au/)

And in any case: http://styleguides.io/

When coming to HTML + CSS + JS components, there's quite a few examples at https://inclusive-components.design/, written with accessibility in mind.

Tech
----

Final output will for sure be CSS, but to keep things maintainable, it'll have to be broken down into smaller pieces.
SASS would be my first choice, popular, stable... however no dynamic invocation of mixins, which I could foresee being handy
to render the final CSS without too much repetition.

PostCSS as an addition would allow to bring in Johnatan Neal's `media()` function (https://github.com/jonathantneal/postcss-media-fn)
and open the door to a bit of responsive values. Mixins don't seem as nice as with SASS (no ifs for example, but are they needed),
but would allow to program things in JS. Still doesn't feel ideal. Tailwind could provide a nice starting point in terms of architecture, if not something to fork to update the naming.

What about stuff like Stylus or others? Bit more arcane, but in the end, if they have the right features...

Doc tech
--------

The project will involve a lot of documentation writing. Needs a bit of thinking as to which tech to pick for that and how to get the code and the documentation to live side by side without.

Selector & specificity management
---------------------------------

CSS provides a variety of selector as well as different ways to combine them.

Element selectors might be used to enforce proper semantics (thinking `:checked + label[for]` kind of things). The universal selector `*` can also be used when patterns call for it, but best limited to using with `>` or `+` combinators. Using it with simple descendance (` `) or following siblings `~` combinators might result in too wide a targeting. Combination of specific elements should be avoided as much as possible, that's just replicating the HTML structure in CSS, ie. not where it should be. Element wide styling should be fenced by a `:not(no-default)` selector to easily get to a blank state, rather than having to undo specific properties and make styling depend on the default styles.

IDs are best left out of the picture given we're talking of a framework to be used in various environments. Don't want to force IDs on the user (plus IDs are best left out unless no edition of the HTML is possible. Best leave them to do HTMLy things like linking to a part of the document, labeling fields or doing ARIA labelling and descriptions).

This leaves classes and attribute selectors to make the main way of applying styles for the framework. This levels the playing field to a `0 0 N 0` specificity, and ideally we'll want to keep N as low as possible (2 most probably). Any form of combinations should be OK, as long as the second class is an element of the block (ideally we don't want a block to style another block). But again idea would be to keep that as targetted as the patterns allow.

For attribute selectors, if ever used as selectors on their own, they should get a `:not(no-default)` variant (probably need a separate naming to avoid collisition with the elements' `no-default`). But mostly, they should remain used in combination with a class (either as `.class[attr="value"]` or `.class [attr="value"]).

Organisation & naming
---------------------

BEM naming scheme (camelCase or kebab-case still TBD, not really important).

```css
.pattern
.pattern--variation
.pattern__element
```

Breakpoints brought as modifiers: `--from-<bp>`,`--until-<bp>`,`--between-<bp>`

Element classes will be nested in their parents:

- this prevents style leaks if block class gets removed
- this allows mixins to enable patterns responsively by just having the block taking a modifier

Namespacing with a prefix to be defined. Would avoid collision for regularly used classes ('.button','.container'...)

Make the naming configurable (eg. camelCase vs kebabCase, prefixing/infixing/suffixing responsiveness...)

`.no-<pattern>` to remove: provides consistency for cancelling patterns, especially at utility level (`border` cancels with `0`, `max-width` with `none`, `background-color` with `transparent`...). That said how does that work with larger patterns? `.no-separator` would cancel the separations?

Takes precedence over the `<pattern>` as it's easier to remove `.no-display` in JS than re-add the appropriate display for example.

For properties that can be used as shortcuts or a whole, the wider scope goes first, allowing to redefine smaller scopes later on.

```css
.p-10p {
  padding: 10%;
}

.pt-10p {
  padding-top: 10%;
}
```

Equally, responsive variations come after the blanket ones.

```css
.p-10p {
  padding: 10%;
}

@media (min-width: 375px) {
  .p-10p--from-sm {
    padding: 10%;
  }
}
```

To sum up, for this padding property, the classes would follow this order so everything cascades properly:

1. `.p-10p`
2. `.pt-10p`
3. `.no-p`
4. `.no-pt`
5. `.p-10p--from-sm`
6. `.pt-10p--from-sm`
7. `.no-pt--from-sm`

Now let's complexify a bit and handle more complex component. Let's talk about a rythm pattern that would need some margin adjustment Ideally, it should be expressed with:

```html
<section class="rythm">
  <h2>Section title</h2>
  <p>Section content 1</p>
  <a class="mt-small">Read more about section title</a>
</section>
```

Given rythm would style children with the `* + *` selector, `mt-small` wouldn't be able to take over, unless its selector was actually `:root .mt-small`. `.mt-small` would take over whether the selector comes before or after `.rythm` thanks to specificity.

Unfortunately, if the pattern was a bit more complex and needed element classes. Say a list with separators (border + mt + pt) between its items until wider viewports calls for a different design:

```html
<ul class="with-separators--until-md">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li class="with-separators__light mt-small">Item 4</li>
  <li class="with-separators__light">Item 4</li>
  <li class="with-separators__light">Item 4</li>
</ul>
```

If `.with-separators__light` target the margins and `.mt-small` wants to tweak that margin, the only place it can do so is by being declared after `.with-separators__light`.

I guess the ideal order to cascade properly would be:

```css
.large-pattern
.medium-pattern
.small-pattern
.no-pattern
.large-pattern--from-sm
.utility
.no-utility
.utility--from-sm
.no-utility--from-sm
```

This also make sense in case of conflicts between patterns. If pattern A & B style a common set of property. If B should always come after A, then B is probably a modifier of A, not a pattern of its own. If not, the conflict resolution calls for a smaller pattern, which would come in after both A & B and superseed them.

Now during authoring, we probably wouldn't want to care about all this ordering. Patterns would be best grouped in their own file. But a PostCSS plugin could definitely reorder stuff in the right order: sort by number of declarations (possibly accounting for an order of concerns maybe? Box model first, then layout (in case of margin overriding), typography (because if a layout plays with `font-size` to remove inline whitespace it needs restoring properly) and appearance?). The same way, we probably wouldn't want to prefix all single class selectors with `:root` by hand.

Next problem is surely how to solve the media queries ordering. Common approach is to go mobile first, so that would solve a basic list of breakpoints. Now what about `(max-width)` ones, or `(min-width: X) and (max-width: Y)`? And what about height?

```html
<div class="padded-rythm--until-lg pt-10--from-md">
</div>
```

What should the padding be? If I read this what would I expect the padding to be between md and lg? Probably 10 because it's a smaller pattern.

What if I wanted a larger pattern to take over though? If two patterns collide, either create a wider pattern that handles responsiveness overall, or add an overriding pattern that handles the case when collision happens.

### Definitions

Concerns: CSS allows to change various properties of the elements. Those can be grouped into different concerns.

- Size and spacing (margin, padding & border-width)
- Layout
- Typography
- Appearance

Utilities: classes targetting a unique property
Patterns: classes affecting properties of a single concern
Components: classes affecting properties of mixed concerns

### Organisation

Idea is to have a two layer structure:

1. patterns and component define variables/maps, functions and mixins
2. a rendering layer runs these mixins to generate the necessary classes

This gives an order of:
All in all, this then calls for:
 - function
 - variables (as they might want to use functions)
 - mixins (as they might want to use variables as default... not sure when these are resolved)

The first layer tries to separate the different concerns that CSS addresses:

- **Sizing and spacing**
  - **Length functions**:
    Most CSS lenghts are relative (to parent, to viewport, to font-size).
    These functions aim to help show that in the code, rather than having magic numbers.
    This would also bring responsive ramps to scale a length between 2 breakpoints
  - ** Breakpoint functions**:
    Functions to easily create breakpoints from a `name: value` map of breakpoints: `from($bp-name)`,`until($bp-name)`,`between($bp-name)`. Also includes a mixin to add new values to the map deeper in the code (and maybe one to generate the breakpoints? though what's the gain compared to the existing `@media` behaviour?).
  - **Sizing**:
    Utility classes for: width, height, max-width, max-height, min-width?, min-height?
    Grid helpers to generate width that allow for gutters
    Fab four technique (https://medium.freecodecamp.org/the-fab-four-technique-to-create-responsive-emails-without-media-queries-baf11fdfa848)
    Aspect ratio
  - **Spacing**:
    Utility classes for: margin, padding (both positive and negative)
    Rythm classes using the `> * + *` selector to create consistent spacing inside a parent.
    Rules of thumbs/principles:
     - prefer going always in the same direction ( `* + *` + `top/left` to avoid removing margin on last elements)
     - is it padding/is it margin?
     - other?
  - **Containers** (`max-width` + inline margins to `auto`)
- **Layout**
  - **Display utilities**
  - **Float utilities** (left, right, none, clearfix)
  - **Flex utilities**
  - **Positioning utilities**:
    - relative, absolute, fixed, sticky
    - pinning (`top/right/bottom/left: 0`) utilities (top, left, right, bottom, top-left..., top-left-right...)
  - **Column system(s)**: How to make them progressively enhanced properly? (`max-width` + `flex: 1 1 0`?)
- **Typo**
  - **Font families map** (grouping of `font-family`,`font-weight` and `font-style`)
  - **Font size and lineheight**
  - **Uppercase and letter spacing**
  - **Cancelling ascenders and descenders whitespace**
  - **Heading styles?** (or are they part of a later bit, they might have some appearance tweaks too?)
  - **Prose content** (or part of a later section, they might have some appearance tweaks too?)
- **Colors, gradients and images**
  - ** Color functions**:
    Besides SASS existing functions, a `contrasted-color($ref,$light, $dark)` to pick the most contrasted color sounds a good plan. A handy thing could be `tint` and `shade` functions that work with contrast, rather than % of lightness. For example `tint($color, 1.35)` would generated a lighter color with a contrast ratio of 1.35 against `$color`. Unsure how this could be implemented, if at all, though.
  - **Colors, bg color & border colors** utilities
  - **Borders utilities** (size and radii)
  - **Shapes**:
    - with pseudo-els & borders (eg. ticks, circles, dots, rectangles, arrows, what else?)
    - with gradients (dashes, squares, circles, what else?)
- **Misc**
  - **Visibility utilities**: Visibility hidden, sr-only (and sr-only when not focused)
  - **Revealable patterns**: Class toggle to transition from hidden to revealed (fade, translate, behind, collapse)
  - **Selectable**: none
  - **Pointer events**: none
- **Components**: From here on, bring in some HTML
  - **Landmarks & headings**
    Mostly markup, just a couple of classes for heading levels and encouraging to use them rather than the elements for handling headings
  - **Interactive elements** (links, buttons & labels)
    - **Link-like**: (invisible, discreet, regular, with fancy underline)
    - **Button like** (filled, outline, 3D...)
    - **Button groups** (for `<a>`,`<button>`, but also `[type="checkbox] + label`)
    - **Expanded interactive area**: Use pseudo els to cover the closest position:relative parent.
  - **Forms**
    - **Checkables** (styled checkboxes/radio)
    - **Valid/invalid states**
    - **Labeling and describing fields** (markup)
    - **Label & input groups**
    - **Button & input groups**
    - **Label & input & button groups**
    - Probably lots more to put in there
  - **Images**
    - Probably more markup heavy (`src`,`srcset`,`<picture>`...)
    - **Fitting** (`object-fit`, also without the support for it)
  - **Icons**
    - Because they're not quite like images
  - **Embeds**
    - Responsive videos keeping their aspect ratio
  - **Tables**
    - Research needed
  - **Interactive components**: Starts bringing in some JS here, and lookup ARIA patterns to implement them properly
    - Dropdowns
    - Tooltips
    - Tabs & panels
    - Accordions
    - Modals
    - Notifications
    - Alerts
    - Others?

### Misc

[Cutting the mustard for CSS]: https://github.com/Fall-Back/CSS-Mustard-Cut
