import Main from './Main';

describe('Main Component Test', () => {
    test('Render Test', () => {
        document.createRange = () => {
            const range = new Range();
    
            range.getBoundingClientRect = jest.fn();
    
            range.getClientRects = () => {
                return {
                    item: () => null,
                    length: 0,
                    [Symbol.iterator]: jest.fn()
                };
            };
    
            return range;
        };
        
        new Main(document.body);
        expect(document.body.innerHTML).toBeTruthy();
        expect(document.body.innerHTML).toContain('main');
    });
});