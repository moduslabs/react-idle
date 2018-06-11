# React Idle
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)

Render components when browser is idle.

The idea is to allow Above The Fold content to render as soon as possible, letting the rest of the app render and update when the browser is idle.

This component uses [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback). Read more about performance benefits [here](https://developers.google.com/web/updates/2015/08/using-requestidlecallback). `requestIdleCallback` is also used in [Facebook](https://github.com/facebook/react/blob/233195cb6bc632ade61a8f64569b4d94061860d6/src/renderers/shared/fiber/ReactFiberScheduler.js#L815-L818).

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
React Idle doesn't have any direct dependencies. Since it's meant to be used with React, it expects that your project aready depends on [`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom).

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

### Publishing
```
npm publish --access public
```

## License

This project is [MIT](./LICENSE) licensed.
