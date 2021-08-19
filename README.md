# Red Perfume

[![Build Status](https://github.com/red-perfume/red-perfume/workflows/Build%20Status/badge.svg?branch=main)](https://github.com/red-perfume/red-perfume/actions?query=workflow%3A%22Build+Status%22+branch%3Amain) [![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/TheJaredWilcurt/9c5d16fe3fa8f8ef414fe8b0eff17f7f/raw/red-perfume__heads_main.json)](https://github.com/red-perfume/red-perfume/actions?query=workflow%3A%22Build+Status%22+branch%3Amain) [![Lint Coverage: 100%](https://img.shields.io/badge/Lint%20Coverage-100%25-brightgreen.svg?logo=eslint)](https://github.com/tjw-lint) [![Code of Conduct: No Ideologies](https://img.shields.io/badge/CoC-No%20Ideologies-blue)](/CODE_OF_CONDUCT.md) [![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE)

## Running the alpha locally

1. Install [Node/npm](https://nodejs.org) (lowest supported version not yet known, presumed to work with 12+)
1. `npm install --save-dev red-perfume`
1. Follow API instructions below
1. Leave feedback or report bugs

## Feedback

Leave feedback as an issue or a response [on Twitter](https://twitter.com/TheJaredWilcurt/status/1316205761047998471).


## **Star** and **Watch** this repo for updates.

Or follow me on [Twitter](https://twitter.com/TheJaredWilcurt) if that's easier.


## Experimental CSS Atomizer (WIP)

This is a library for a build tool that helps to drastically reduce the total amount of CSS that is shipped for your project. Facebook adopted this atomized CSS approach and it [reduced their homepage CSS by **80%**](https://engineering.fb.com/web/facebook-redesign/). Twitter also atomizes their CSS.

With `red-perfume` you write your CSS however you like (semantic class names, BEM, utility classes, whatever). Then reference them in your HTML normally.

**Example:**

```css
.cow,
.cat {
    font-size: 12px;
    padding: 8px;
}
.dog {
    font-size: 12px;
    background: #F00;
    padding: 8px;
}
```
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <p class="cool cow moo">
      Hi there!
    </p>
    <!--
      <span class="dog">comments are skipped</span>
    -->
    <h1 class="cool cat nice wow">
      Meow
    </h1>
    <h2 class="dog">
      Woof
    </h2>
  </body>
</html>
```
Then `red-perfume` atomizes the styling into atomic classes, and replaces the references to them:
```css
.rp__font-size__--COLON12px {
  font-size: 12px;
}
.rp__padding__--COLON8px {
  padding: 8px;
}
.rp__background__--COLON__--OCTOTHORPF00 {
  background: #F00;
}
```
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <p class="cool moo rp__font-size__--COLON12px rp__padding__--COLON8px">
      Hi there!
    </p>
    <!--
      <span class="dog">comments are skipped</span>
    -->
    <h1 class="cool nice wow rp__font-size__--COLON12px rp__padding__--COLON8px">
      Meow
    </h1>
    <h2 class="rp__font-size__--COLON12px rp__background__--COLON__--OCTOTHORPF00 rp__padding__--COLON8px">
      Woof
    </h2>
  </body>
</html>
```

This output isn't as pretty to read, but it's a build step, *not* your source code, so it doesn't really matter. **Note:** The class names can be uglified as well (`.rp__0`, `.rp__1`, etc.).

This above example already works as a proof of concept with the current code. However, the library needs a lot more work to be usable in most projects. Look at the **issues** page to see what work is left to be done and how you can help!


## API (subject to change before v1.0.0)

### API Example

You can point to files or pass strings in directly. Tasks are sequential, the output of one can feed into the input of the next. You can output to file or use callback hooks provided (more in the next example).

```js
const redPerfume = require('red-perfume');

redPerfume.atomize({
  verbose: true,
  customLogger: function (message, err) {
    console.log(message, err);
  },
  tasks: [
    {
      uglify: false,
      styles: {
        in: [
          './styles/file.css',
          './styles/style.css'
        ],
        // The two above files will be atomized and combined into this output
        out: './dist/styles/styles.css'
      },
      // The output markup will be a copy of the input but modified to have the class names replaced to match the new atomized styles from styles.out
      markup: [
        {
          in: './index.html',
          out: './dist/index.html'
        },
        {
          in: './contact.html',
          out: './dist/contact.html'
        }
      ],
      scripts: {
        out: './dist/atomic-styles.json'
      }
    },
    {
      uglify: true,
      styles: {
        data: '.example { padding: 10px; margin: 10px; }',
        hooks: {
          afterOutput: function (options, { task, cssData, processedStyles }) {
            console.log(options, task, cssData, processedStyles);
          }
        }
      },
      markup: [
        {
          data: '<!DOCTYPE html><html><body><div class="example"></div></body></html>',
          hooks: {
            afterOutput: function (options, { task, item, processedStyles, htmlData, processedMarkup }) {
              console.log(options, task, item, processedStyles, htmlData, processedMarkup);
            }
          }
        }
      ],
      scripts: {
        hooks: {
          afterOutput: function (options, { task, processedStyles }) {
            console.log(options, task, processedStyles);
          }
        }
      }
    }
  ]
});
```


### API Implementation Status: ALPHA

The documented API is fully implemented and tested. Though there are many edge cases that have not been covered yet (see: [issues](https://github.com/red-perfume/red-perfume/issues)), and some more advanced parts of the features yet to be implemented (also: [issues](https://github.com/red-perfume/red-perfume/issues)).


### API Documentation

Key                      | Type     | Allowed          | Default         | Description
:--                      | :--      | :--              | :--             | :--
`verbose`                | Boolean  | `true`, `false`  | `true`          | If true, consoles out helpful warnings and errors using `customLogger` or `console.error`.
`customLogger`           | Function | Any function     | `console.error` | You can pass in your own custom function to log errors/warnings to. When called the function will receive a `message` string for the first argument and sometimes an `error` object for the second argument. This can be useful in scenarios like adding in custom wrappers or colors in a command line/terminal. This function may be called multiple times before all tasks complete. Only called if `verbose` is true.
`tasks`                  | Array    | Array of objects | `undefined`     | An array of task objects. Each represents the settings for an atomization task to be performed.

**Tasks API:**

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`uglify`  | Boolean | `false`     | If `false` the atomized classes, and all references to them, are long (`.rp__padding__--COLOR12px`). If `true` they are short (`.rp__b5p`).
`styles`  | Object  | `undefined` | CSS settings. API below
`markup`  | Array   | `undefined` | HTML settings. An array of objects with their API defined below
`scripts` | Object  | `undefined` | JS settings. API below

**Styles Task API:**

Key       | Type     | Default     | Description
:--       | :--      | :--         | :--
`in`      | Array    | `undefined` | An array of strings to valid paths for CSS files. All files will remain untouched. A new atomized string is produced for `out`/hooks.
`data`    | String   | `undefined` | A string of CSS to be atomized. Files are provived via `in` are concatenated with `data` at the end, then atomized and sent to `out`/hooks.
`out`     | String   | `undefined` | A string file path output. If file exists it will be overwritten with the atomized styles from `in` and/or `data`

**Markup Task API:**

Key       | Type     | Default     | Description
:--       | :--      | :--         | :--
`in`      | String   | `undefined` | Path to an HTML file to be processed.
`data`    | String   | `undefined` | A string of markup to be processed. This is appended to the end of the `in` file contents if both are provided.
`out`     | String   | `undefined` | Path where the modified version of the `in` file will be stored. If file already exists, it will be overwritten.

**Scripts Task API:**

Key       | Type     | Default     | Description
:--       | :--      | :--         | :--
`out`     | String   | `undefined` | Path where a JSON object will be stored. The object contains keys (selectors) and values (array of strings of atomized class names). If file already exists, it will be overwritten.


#### API Hooks/Callbacks example

All the hooks are shown below. Most users will only use the `afterOutput` hooks as a simple callback to know when something has finished. Perhaps to pass along the atomized string to another plugin to minify, or generate a report or something. These hooks are primarily for those writing 3rd party plugins. Or for existing 3rd party libraries to add documentation on how to combine them with Red Perfume.

```js
redPerfume.atomize({
  hooks: {
    beforeValidation: function (options) {},
    afterValidation:  function (options) {},
    beforeTasks:      function (options) {},
    afterTasks:       function (options) {}
  },
  tasks: [
    {
      hooks: {
        beforeTask: function (options, { task }) {},
        afterTask:  function (options, { task, processedStyles, processedMarkup }) {}
      },
      styles: {
        hooks: {
          beforeRead:     function (options, { task }) {},
          afterRead:      function (options, { task, cssData }) {},
          afterProcessed: function (options, { task, cssData, processedStyles }) {},
          afterOutput:    function (options, { task, cssData, processedStyles }) {}
        }
      },
      markup: [
        {
          hooks: {
            beforeRead:     function (options, { task, item, processedStyles }) {},
            afterRead:      function (options, { task, item, processedStyles, htmlData }) {},
            afterProcessed: function (options, { task, item, processedStyles, htmlData, processedMarkup }) {},
            afterOutput:    function (options, { task, item, processedStyles, htmlData, processedMarkup }) {}
          }
        }
      ],
      scripts: {
        hooks: {
          beforeOutput: function (options, { task, processedStyles }) {},
          afterOutput:  function (options, { task, processedStyles }) {}
        }
      }
    }
  ]
});
```

**Hook descriptions:**

* Global hooks:
  * `beforeValidation` - Before the options object is validated and defaulted. The first thing ran before anything else.
  * `afterValidation` - Right after the options are validated, they will be in this state for the rest of all the hooks
  * `beforeTasks` - Right before we start processing the tasks array
  * `afterTasks` - After the last task as been processed, should be the final hook called. Nothing else happens after this.
* Task hooks
  * `beforeTask` - Ran right before a task starts.
  * `afterTask` - Ran right after a task finishes.
* Styles/Markup hooks:
  * `beforeRead` - Right before we get the string of text from files and/or `data`.
  * `afterRead` - Right after we get the string of text from files and/or `data`. Also right before we process/atomize the string.
  * `afterProcessed` - Right after the string has been atomized. Right before we output it to file if `out` is provided.
* Scripts hooks
  * `beforeOutput` - Right before we write the JSON to disk if `out` is provided.
* Styles/Markup/Scripts hook
  * `afterOutput` - Right after the file has been written to disk if `out` is provided. This is always called and the last thing to happen in a subTask

**Hook argument definitions:**

* `options` - The options object the user originall passed in (`beforeValidation`) or a modifed version with all API defaults in place (any point `afterValidation`)
* `task` - The current task object being processed. Looks like `{ styles, markup, scripts, hooks }`, see API above for more info.
* `processedStyles` - This object: `{ classMap, output }`
* `processedStyles.classMap` - An object where the keys are the original class names and the values are the atomized class names made from the original CSS rule. This is the same map we output in the `scripts` sub task. How the keys are written (with or without a `.`) and how the values are stored (as an array or string) are subject to change before v1.0.0.
* `processedStyles.output` - The atomized string of CSS.
* `processedMarkup` - An atomized string of HTML.
* `cssData` - This object: `{ cssString, styleErrors }`
* `cssData.cssString` - The string of all CSS input files and `data` combined, but not atomized.
* `cssData.styleErrors` - An array of errors from attempting to read in style files.
* `item` - The current markup item being processed. Looks like `{ in, out, data, hooks}`, see API above for more info.
* `htmlData` - This object: `{ markupString, markupErrors }`
* `htmlData.markupString` - The string of HTML from the `in` file and `data` combined, but not atomized.
* `htmlData.markupErrors` - An array of errors from attempting to read in style files.

The arguments defined here will always be the same, in every hook, with the excpection that `options` will be mutated during validation. However, due to the nature of JavaScript object referencing, it is very possible for 3rd party plugins to mutate many of these object values. This is intentional and allowed. Though we would encourage that you just store that on the original options object, the validation does not remove undocumented keys.


## Running locally to see the proof of concept or contribute

1. Install [Node.js](https://nodejs.org) & npm
1. Download or fork or clone the repo
1. `npm install`
1. `node manual-testing.js`


## Why is it called "Red Perfume"

This library takes in any CSS and breaks it down to pure Atomic CSS. This is a process called "CSS Atomization", and libraries that do this process are called "CSS Atomizers".

Outside of our industry jargon, "Atomizer" already exists as a word.

> **Atomizer** <sub><sup>(*NOUN*)</sup></sub>
> 1. A device for emitting water, perfume, or other liquids as a fine spray.
>
> \- [Oxford English Dictionary](https://www.lexico.com/definition/atomizer)

Though actual atomizers themselves have no consistent size, design, color, or shape. So there is no iconic image that represents them.

![Example of several atomizers of differnt size, shape, color and design](atomizer-comparison.jpg)

And though perfume bottles can also come in many shapes, colors, sizes and designs, they are still recognizable as perfume bottles.
