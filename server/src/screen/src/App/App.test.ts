import { App } from './index';

describe('App test', () => {
    test('render test', () => {
        App(document.body);

        expect(document.body.textContent)
            .toContain('Hello, My Vanilla JS!');
    });
});