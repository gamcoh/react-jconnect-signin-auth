/* @flow */
import JConnectSignInButton, { jconnectAuthHelpers, useScript } from './index';

describe('index', () => {
  it('exports all modules', () => {
    expect(JConnectSignInButton).toEqual(expect.any(Function));
    expect(jconnectAuthHelpers).toEqual(expect.any(Object));
    expect(useScript).toEqual(expect.any(Function));
  });
});
