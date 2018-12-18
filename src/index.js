// @flow
import * as React from 'react';

type Props = {
  children: React.Node,

  // Show a placeholder until children are rendered
  placeholder?: React.Node,

  // Fires when content is rendered, but only if onIdle was used
  onRender?: () => void,

  // Don't render component if Server Side Rendering is used
  skipSSR?: boolean,

  // True to render updates synchronously, without onIdle
  // Default: false to render updates when browser becomes idle
  syncUpdate?: boolean,
};

type State = {
  ready: boolean,
};

type CancellableID = IdleCallbackID | TimeoutID | null;

type IdleCallback = {
  timeout: number,
};

const DEFAULT_TIMEOUT = 6000;

// Let's see if this is a browser or node (server side rendering)
const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// Replacement for requestIdleCallback in SSR - execute immediately
const fallbackOnIdle: (Function, IdleCallback) => TimeoutID | null = (cb: Function) => {
  if (isBrowser) {
    return setTimeout(cb, 1);
  }
  cb();
  return null;
};

const fallbackOffIdle = (id?: TimeoutID) => {
  if (id) {
    // $FlowFixMe
    clearTimeout(id);
  }
};

// Defaulting to immediate rendering unless browser supports requestIdleCallback
const isIdleCallbackSupported = isBrowser && typeof window.requestIdleCallback === 'function';
const onIdle = isIdleCallbackSupported ? window.requestIdleCallback : fallbackOnIdle;
const offIdle = isIdleCallbackSupported ? window.cancelIdleCallback : fallbackOffIdle;

export default class OnIdle extends React.Component<Props, State> {
  static defaultProps = {
    placeholder: null,
  };

  state = {
    ready: false,
  };

  job: CancellableID = null;

  componentDidMount() {
    this.requestIdle();
  }

  componentWillReceiveProps(nextProps: Props) {
    // We will render updates onIdle, unless this.props.syncUpdate is true
    if (!this.props.syncUpdate && this.props.children !== nextProps.children) {
      this.setState({ ready: false });
      this.requestIdle();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.ready && this.state.ready && typeof this.props.onRender === 'function') {
      this.props.onRender();
    }
  }

  componentWillUnmount() {
    this.clearJob();
  }

  clearJob = () => {
    // Flow will complain because this.job is either TimeoutID or IdleCallbackID
    // and it can't mix them. We know that clearTimeout will consume only TimeoutID
    // but we need to find a way work this out with Flow
    if (this.job) {
      // $FlowFixMe
      offIdle(this.job);
    }
  };

  requestIdle = () => {
    this.clearJob();
    if (this.props.skipSSR !== true) {
      this.job = onIdle(this.queueRendering, { timeout: DEFAULT_TIMEOUT });
    }
  };

  // Render when DOM is ready, not earlier
  queueRendering = () => {
    requestAnimationFrame(this.readyToRender);
  };

  readyToRender = () => {
    this.setState({
      ready: true,
    });
  };

  render() {
    // Don't render anything if we are skipping SSR
    if (((process.env.NODE_ENV === 'test' && window.__SSR__) || !isBrowser) && this.props.skipSSR) {
      return null;
    }

    return this.state.ready ? this.props.children : this.props.placeholder;
  }
}
