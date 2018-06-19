import React, { PureComponent } from 'react';
import Article from './Article';
import './styles.css';

const TODAY = new Date();
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth();
const DEFAULT_LOCALE = 'en-US';
let LOCALE;

// get user's locale or resort to default
const getLocale = () => {
  if (LOCALE) return LOCALE;

  try {
    [LOCALE] = navigator.languages;
  } catch (e) {
    LOCALE = DEFAULT_LOCALE;
  }

  return LOCALE;
};

const zeroNumeric = num => String(num).padStart(2, '0');

const getMonths = () => {
  const locale = getLocale();
  const moDates = Array.from({ length: 12 }, (_, idx) => new Date(YEAR, MONTH + idx));
  const dateTimeFormat = new Intl.DateTimeFormat(locale, { month: 'long' });
  return new Map(
    moDates.map(date => [
      zeroNumeric(date.getMonth()),
      {
        month: dateTimeFormat.format(date),
        year: date.getFullYear(),
      },
    ])
  );
};

class Simple extends PureComponent {
  state = {
    active: null,
    months: getMonths(),
    waiting: false,
    onIdle: false,
  };

  focusedBtnEl = null;
  menuEl = null;

  componentDidUpdate(oldProps, oldState) {
    if (this.focusedBtnEl && this.state.active && oldState.active !== this.state.active)
      this.focusedBtnEl.focus();
  }

  componentDidMount() {
    if (this.menuEl) {
      this.menuEl.focus();
    }
  }

  changeActiveView = value => () => {
    this.setState({ waiting: true }, () => setTimeout(() => this.setState({ active: value }), 10));
  };

  doneWaiting = () => {
    this.setState({ waiting: false });
  };

  // Keyboard navigation
  onMenuKeyPress = e => {
    const { months, active } = this.state;
    const keys = Array.from(months.keys());
    const oldIndex = active ? keys.indexOf(active) : -1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        const prevIndex = (oldIndex > 0 ? oldIndex : keys.length) - 1;
        this.changeActiveView(keys[prevIndex])();
        break;

      case 'ArrowDown':
      case 's':
      case ' ':
        const nextIndex = oldIndex === keys.length - 1 ? 0 : oldIndex + 1;
        this.changeActiveView(keys[nextIndex])();
        break;
    }
  };

  render() {
    const { months, active, onIdle, waiting } = this.state;
    const month = active ? this.state.months.get(active).month : '';

    return (
      <main className="simple">
        <aside
          tabIndex={-1}
          onKeyDown={this.onMenuKeyPress}
          role="button"
          ref={el => {
            this.menuEl = el;
          }}>
          {Array.from(months, ([value, { month, year }]) => (
            <button
              key={value}
              onFocus={this.changeActiveView(value)}
              ref={el => {
                if (value === active) this.focusedBtnEl = el;
              }}>
              {month} - {year}
            </button>
          ))}
        </aside>
        <article>
          <Article {...{ active, month, onIdle }} onCompute={this.doneWaiting} />
          {waiting ? <section>Computing</section> : <div>&nbsp;</div>}
        </article>
      </main>
    );
  }
}

export default Simple;
