import App from './App';

describe('App Component Test', () => {
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
        
        new App(document.body);
        expect(document.body.innerHTML).toBeTruthy();
        expect(document.body.innerHTML).toContain('side');
        expect(document.body.innerHTML).toContain('main');
    });
});