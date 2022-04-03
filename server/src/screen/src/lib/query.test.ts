import { getParameter } from './query';

Object.defineProperty(window, 'location', {
    value: new URL('http://localhost?a=test1&b=test2')
});

describe('Query test', () => {
    test('getParameter test 1', () => {
        expect(getParameter('a')).toBe('test1');
        expect(getParameter('b')).toBe('test2');
    });
});