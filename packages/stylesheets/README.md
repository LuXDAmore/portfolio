# My Stylesheets

## Info

> ex. for every component that use a var, you have to import the file containing that vars to let scss know which one are you importing.

Every project has the same settings and, starting from files under the base-path, you're able to deep-extend every variable.
Most variables are [**SCSS-MAPS**](https://sass-lang.com/documentation/values/maps).

If you don't know about SCSS, readme more [here](https://sass-lang.com/).

### Helpers

Some helper-functions are still provided, like:

- `get-color`( *$name*, *$shade*: base );
- `get-font`( *$name*, *$type*: base );
- `get-breakpoint`( *$name*, *$type*: base ).

```scss

    // Colors
    $colors: (
        "common": (
            "base": #333,
            "grey": #ccc,
        ),
        "primary": #fff
    );

    $color-primary: get-color( "primary" ); // plain value will be extracted
    $color-common: get-color( "common" ); // "base" value will be extracted
    $color-common-grey: get-color( "common", "grey" ); // you have to specify which shade you want

```

### Mixins

Also, some useful mixins are provided, especially for media-utilities:

- `media-screen`( *$container-start*: false, *$container-end*: false, *$size-start*: base, *$size-end*: down );
  - `zero-to-xs`();
  - `xs-and-up`();
  - `zero-to-sm`();
  - `sm-and-up`();
  - `sm-to-md`();
  - `zero-to-md`();
  - `md-and-up`();
  - `md-to-lg`();
  - `zero-to-lg`();
  - `lg-and-up`();
  - `lg-to-xl`();
  - `lg-to-xxl`();
  - `xl-and-up`();
  - `xxl-and-up`();
  - `xxl-to-xxxl`();
  - `xxxl-and-up`().

```scss

    // Colors
    $breakpoints: (
        "md": (
            "base": 768px,
            "down": 767.98px, // Tricks for better responsive
        ),
    );

    .container {

        max-width: 500px;

        @include zero-to-md() {

            max-width: 1400px;

        }
        @include md-and-up() {

            max-width: 1450px;

        }
        @include md-to-lg() {

            max-width: 1500px;

        }

        // Generates
        // @media only screen and (max-device-width: [get-container( "md", down )]) {}
        // @media only screen and (min-device-width: [get-container( "md", base )]) {}
        // @media only screen and (min-device-width: [get-container( "md", base )]) and (max-device-width: [get-container( "lg", down )]) {}

    }

```

> `media-screen` is the main utility, it generate `@media only screen and ( min-device-width: get-container( $container-start, $size-start ) ) and ( max-device-width: get-container( $container-end, $size-end ) )` based on values provided.

### Vue 3

Vue `::v-deep` is **deprecated**, you now have to use `:deep()` selector, look at [RFCS](https://github.com/vuejs/rfcs/blob/main/active-rfcs/0023-scoped-styles-changes.md) or [SFC](https://vuejs.org/api/sfc-css-features.html#scoped-css).

A mixin is also provided to achieve this new purpose, `deep( ["selectors"] )`:

```scss

    /* Old way: */
    .parent ::v-deep .child {}
    .parent ::v-deep .child-2 {}

    /* Old way with scss vars: */
    .parent #{$v-deep} .child {}
    .parent #{$v-deep} .child-2 {}

    /* New way: */
    .parent :deep( .child ) {}
    .parent :deep( .child-2 ) {}

    /* New way with scss mixin: */
    .parent {

        @include deep( ".child" ".child-2" ) {}

    }

```

> Also `slotted( [ "selectors" ] )` and `global( [ "selectors" ])` are provided.

## Plugins

- [@nuxtjs/style-resources](https://github.com/nuxt-community/style-resources-module), share variables, mixins and functions across all style files;
- [modern-normalize](https://github.com/sindresorhus/modern-normalize), like [normalize.css](https://github.com/necolas/normalize.css), but for latest browsers only (check [known-issues](https://github.com/necolas/normalize.css#extended-details-and-known-issues));

## F.A.Q

- *Which folder should i use?*
  - **First of all**, remember to read the documentation for the [plugin](https://github.com/nuxt-community/style-resources-module#warning), then (**only after that**), choose carely which folder is better for your use case.

### TODO

- Add [sassdoc](http://sassdoc.com/) for methods.
