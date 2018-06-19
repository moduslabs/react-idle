import React, { Component } from 'react';
import OnIdle from '@modus/react-idle';
import './styles.css';

let LOCALE;

const getLocale = () => {
  if (LOCALE) return LOCALE;

  try {
    [LOCALE] = navigator.languages;
  } catch (e) {
    LOCALE = 'en-US';
  }

  return LOCALE;
};

const formatNumber = num =>
  Intl.NumberFormat(getLocale(), {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);

const expensiveFn = () => {
  let text = [];
  // Anything inside try/catch block won't be optimized
  // We are doing something expensive, aren't we
  try {
    for (let i = 0; i < 8; i++) {
      const content = document.body.innerHTML.split('');
      for (let j = 0; j < content.length; j++) {
        // Just some expensive stuff
        const code = content[j].charCodeAt(0);
        const math = (num => Math.ceil((Math.sqrt(num) * 100) / Math.random()) / 100)(code);
        const el = document.createElement('p');
        el.innerHTML = math;
        const appended = document.body.appendChild(el.cloneNode());
        document.body.removeChild(appended);
        text.push(math);
      }
    }
  } catch (_) {}

  return text;
};

const Month = ({ month }) => {
  const data = expensiveFn();

  return data.slice(0, 5).map((item, idx) => (
    <dd key={idx} className="percentage" style={{ '--value': `${Math.min(item, 100)}%` }}>
      <span className="text">{`${formatNumber(item)}%`}</span>
    </dd>
  ));
};

class Article extends Component {
  state = {
    useOnIdle: false,
  };

  onIdleChange = e => {
    this.setState({ useOnIdle: e.currentTarget.checked });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.active !== nextProps.active || this.state.useOnIdle !== nextState.useOnIdle;
  }

  componentDidUpdate() {
    this.computeCompleted();
  }

  componentDidMount() {
    this.computeCompleted();
  }

  computeCompleted = () => {
    this.props.onCompute();
  };

  render() {
    const { month, active } = this.props;
    const { useOnIdle } = this.state;

    return (
      <section>
        <dl className="bar-chart">
          <dt>{active ? `Market share for ${month}` : ''}</dt>
          {useOnIdle ? (
            <OnIdle placeholder={<dd>Crunching numbers...</dd>}>
              {active ? <Month month={month} /> : null}
            </OnIdle>
          ) : (
            active && <Month month={month} />
          )}
        </dl>
        <small>
          Please choose a month.<br />
          Press tab to quickly change selection.<br />
          Notice how central area waits until the browser has enough free time to render the view.
        </small>
        <label className="idle-check">
          <input type="checkbox" checked={useOnIdle} onChange={this.onIdleChange} />
          <span>Render on Idle</span>
        </label>
      </section>
    );
  }
}

export default Article;
