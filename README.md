# React Idle
[![CircleCI](https://circleci.com/gh/ModusCreateOrg/react-idle/tree/master.svg?style=svg)](https://circleci.com/gh/ModusCreateOrg/react-idle/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/326d2ade32726ead6067/maintainability)](https://codeclimate.com/github/ModusCreateOrg/react-idle/maintainability)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ModusCreateOrg/react-idle/blob/master/LICENSE)
[![Enterprise Web Development](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg)](https://moduscreate.com)

Render components when browser is idle.

The idea is to allow Above The Fold content to render as soon as possible, letting the rest of the app render and update when the browser is idle.

This component uses [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) which is also used in [React](https://reactjs.org/blog/2017/09/26/react-v16.0.html#javascript-environment-requirements).

## Demo
See a working [react-idle demo](https://react-idle.modus.app/) and compare rendering performance between syncronous rendering and rendering on idle.

## Getting started
Install `react-idle` using npm.

```bash
npm install @modus/react-idle --save
```

### Usage
```jsx
import * as React from 'react';
import OnIdle from '@modus/react-idle';

export default class MyView extends React.Component {
  render() {
    <section>
      <article>This is above the fold content that must render ASAP</article>
      <OnIdle>
        <aside>This heavy component can be rendered when the browser is idle</aside>
      </OnIdle>
    </section>
  }
}
```

### Dependencies
React Idle has only one direct dependency: [idlize](https://www.npmjs.com/package/idlize). Since it's meant to be used with React, it expects that your project already depends on [`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom).

NPM will not automatically install these dependencies for you, but it will show a friendly warning message with instructions.

## Configuration
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | React Node | ✓ | Children you want to render on idle |
| placeholder | React Node |  | Placeholder component that shows before the render takes place |
| onRender | Function |  | Callback executed after render completes. No arguments provided. |
| skipSSR | Boolean |  | Use this property to prevent the children from being rendered in Server Side Rendering. Defaults to false. |
| syncUpdate | Boolean |  | Use this property to render updates immediately instead of triggering another `onIdle` process. Defaults to false. |

## Contributing

### Testing
This project uses Jest for unit testing. To execute tests run this command:

```sh
npm test
```

It's useful to run tests in watch mode when developing for incremental updates.

```sh
npm run test:watch
```

## License

This project is [MIT](./LICENSE) licensed.
