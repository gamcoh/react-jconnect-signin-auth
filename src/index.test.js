/* @flow */
import JConnectSignInButton, { appleAuthHelpers, useScript } from './index';

describe('index', () => {
  it('exports all modules', () => {
    expect(JConnectSignInButton).toEqual(expect.any(Function));
    expect(appleAuthHelpers).toEqual(expect.any(Object));
    expect(useScript).toEqual(expect.any(Function));
  });
});
