import Side from './Side';

describe('Side Component Test', () => {
    test('Render Test', () => {
        new Side(document.body);
        expect(document.body.innerHTML).toBeTruthy();
        expect(document.body.innerHTML).toContain('side');
    });
});