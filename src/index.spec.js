import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { renderToString } from 'react-dom/server';
import OnIdle from './index';

const Placeholder = () => <div className="placeholder">Waiting</div>;
const Delayed = () => <div className="delayed">Delayed task</div>;

const snapshot = ({ element, ...rest }) => {
  const wrapper = renderer.create(<OnIdle {...rest}>{element}</OnIdle>);
  const tree = wrapper.toJSON();
  expect(tree).toMatchSnapshot();
  return tree;
};

describe('Smoke tests', () => {
  it(`renders delayed`, () => {
    snapshot({
      element: <Delayed />,
    });
  });

  it('renders placeholder', () => {
    snapshot({
      placeholder: <Placeholder />,
      element: <Delayed />,
    });
  });
});

describe('Server-side rendering', () => {
  it('skips rendering', () => {
    // tell component we are simulating Server Side Rendering
    global.__SSR__ = true;

    expect(
      renderToString(
        <OnIdle skipSSR>
          <Delayed />
        </OnIdle>
      )
    ).toMatchSnapshot();

    // teardown
    global.__SSR__ = false;
  });

  it('renders just placeholder', () => {
    // tell component we are simulating Server Side Rendering
    global.__SSR__ = true;

    expect(
      renderToString(
        <OnIdle placeholder={<Placeholder />}>
          <Delayed />
        </OnIdle>
      )
    ).toMatchSnapshot();

    // teardown
    global.__SSR__ = false;
  });
});

describe('Children', () => {
  it('are mounted on Render', done => {
    const div = document.createElement('div');
    const onRender = () => {
      expect(div.querySelector('.delayed')).toBeInstanceOf(HTMLDivElement);
      done();
    };
    ReactDOM.render(
      <OnIdle onRender={onRender}>
        <Delayed />
      </OnIdle>,
      div
    );
  });

  it('are not mounted immediately', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <OnIdle>
        <Delayed />
      </OnIdle>,
      div
    );

    expect(div.querySelector('.delayed')).toBeNull();
  });

  it('are replaced with placeholder before idle', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <OnIdle placeholder={<Placeholder />}>
        <Delayed />
      </OnIdle>,
      div
    );

    expect(div.querySelector('.placeholder')).toBeInstanceOf(HTMLDivElement);
  });

  it('will not render in SSR', () => {
    const div = document.createElement('div');
    global.__SSR__ = true;

    ReactDOM.render(
      <OnIdle skipSSR placeholder={<Placeholder />}>
        <Delayed />
      </OnIdle>,
      div
    );

    expect(Array.from(div.childNodes)).toHaveLength(0);
  });
});
