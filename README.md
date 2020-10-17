# loading-progress-bar

<div align="center">
  <a href="https://www.npmjs.com/package/loading-progress-bar">
    <img src="https://img.shields.io/npm/v/loading-progress-bar.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <!-- <a href="https://travis-ci.org/sumbad/loading-progress-bar?branch=master">
    <img src="https://travis-ci.org/sumbad/loading-progress-bar.svg?branch=master" alt="Build Status">
  </a> -->
  <!-- <a href="https://codecov.io/gh/sumbad/loading-progress-bar">
    <img src="https://codecov.io/gh/sumbad/loading-progress-bar/branch/master/graph/badge.svg" />
  </a> -->
  <a href="https://bundlephobia.com/result?p=loading-progress-bar">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/loading-progress-bar" />
  </a>
</div>

<h1 align="center">loading-progress-bar</h1>

<div align="center">
  <a href="https://github.com/sumbad/loading-progress-bar">
    <img src="./title.png" alt="Screenshot of the color picker">
  </a>
  <blockquote align="center">The universal, framework-agnostic loading progress bar component</blockquote>
</div>

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Options](#options)

---

## Installation

```
npm install loading-progress-bar --save
```

Or use one of the following content delivery networks:

[unpkg.com CDN](https://unpkg.com/loading-progress-bar?module):

```html
<script src="https://unpkg.com/loading-progress-bar"></script>
```

[Skypack CDN](https://cdn.skypack.dev/loading-progress-bar):

```html
<script src="https://cdn.skypack.dev/loading-progress-bar"></script>
```

---

## Usage

### Without bundling

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://unpkg.com/loading-progress-bar">
      loadingProgressBar.define('loading-progress-bar');
    </script>
  </head>

  <body>
    <loading-progress-bar id="loadingProgressBar"></loading-progress-bar>

    <script>
      const loadingProgressBarEl = document.querySelector('#loadingProgressBar');
      setInterval(() => {
        loadingProgressBarEl.generateProgress.next();
      }, 3000);
    </script>
  </body>
</html>
```

### With ReactJS

**index.js**

```js
import React, { useState } from 'react';
import { loadingProgressBarEl } from 'loading-progress-bar';
import { createReactElement } from '@web-companions/fc/adapters/react';

const LoadingProgressBarReact = loadingProgressBarEl('loading-progress-bar').adapter(createReactElement);

function Example() {
  const myRef = useRef(null);

  useEffect(() => {
    setInterval(() => {
      myRef.current.generateProgress.next();
    }, 3000);
  });

  return (
    <div>
      <LoadingProgressBarReact ref={myRef}></LoadingProgressBarReact>
    </div>
  );
}

```

### With bundling (e.g. Webpack)

**index.js**

```js
import { loadingProgressBar } from 'loading-progress-bar';

loadingProgressBar.define('loading-progress-bar');

// next code depends on your project
const loadingProgressBarEl = document.createElement('loading-progress-bar');
document.body.append(loadingProgressBarEl);
```


---

## API

- **generateProgress**: Generator; 
  - To generate the next progress step.
- **togglePause**: (isPause?: boolean) => void
  - To pause and continue the process.


---

## Options

<table>
  <thead>
    <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
      </td>
      <td>
        Number
      </td>
      <td>
        <code>2000</code>
      </td>
      <td>
        The animation duration.
      </td>
    </tr>
    <tr>
      <td>
        <code>stepsCount</code>
      </td>
      <td>
        Number
      </td>
      <td>
        <code>1</code>
      </td>
      <td>
        Count steps from start to end the animation. 
        Shows how many times need to invoke the function <code>generateProgress.next</code> to end the animation.
      </td>
    </tr>
  </tbody>
</table>