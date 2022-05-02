import Main from '.';

describe('메인 컴포넌트 테스트', () => {
    beforeAll(() => {
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
    });

    test('렌더링 테스트', () => {
        new Main(document.body);
        expect(document.body.innerHTML).toBeTruthy();
        expect(document.body.innerHTML).toContain('main');
    });
});