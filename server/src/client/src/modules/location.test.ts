import { getParameter } from './location';

Object.defineProperty(window, 'location', { value: new URL('http://localhost?a=test1&b=test2') });

describe('location module test', () => {
    test('getParameter test 1', () => {
        expect(getParameter('a')).toBe('test1');
        expect(getParameter('b')).toBe('test2');
    });
});
