/**
 * React Idle v1.1.1
 * (c) Modus Create
 * MIT Licensed
 * https://labs.moduscreate.com
 */

// @flow
import * as React from 'react';
import { IdleQueue } from 'idlize/IdleQueue.mjs';

// Initialize the global queue manager
const queue = new IdleQueue();

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
  // The ready flag triggers re-render when needed
  ready: boolean,
};

type CancellableID = IdleCallbackID | TimeoutID | null;

// Let's see if this is a browser or node (server side rendering)
const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class OnIdle extends React.Component<Props, State> {
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
    // Call the onRender function (if it exists) after the children have been rendered
    if (!prevState.ready && this.state.ready && typeof this.props.onRender === 'function') {
      this.props.onRender();
    }
  }

  componentWillUnmount() {
    // Cleanup
    this.clearJob();
  }

  clearJob = () => {
    // Remove this task from the global queue
    queue.unshiftTask(this.queueRendering);
  };

  requestIdle = () => {
    // Clear the existing job if exists to avoid duplicates
    this.clearJob();
    if (this.props.skipSSR !== true) {
      // Queue up
      this.job = queue.pushTask(this.queueRendering);
    }
  };

  // Render when DOM is ready, not earlier
  queueRendering = () => {
    // We request animation frame so that rendering doesn't happen during another ongoing process
    requestAnimationFrame(this.readyToRender);
  };

  readyToRender = () => {
    this.setState({
      ready: true,
    });
  };

  render() {
    // Don't render anything if we are skipping SSR
    if (
      ((process.env.NODE_ENV === 'test' && '__SSR__' in window && window.__SSR__) || !isBrowser) &&
      this.props.skipSSR
    ) {
      return null;
    }

    return this.state.ready ? this.props.children : this.props.placeholder || null;
  }
}

export default OnIdle;
