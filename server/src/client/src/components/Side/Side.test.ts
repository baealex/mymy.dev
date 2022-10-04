import Side from '.'

import { modalStore } from '~/stores/modal'

describe('사이드 컴포넌트 테스트', () => {
    test('렌더링 테스트', () => {
        new Side(document.body)
        expect(document.body.innerHTML).toBeTruthy()
        expect(document.body.innerHTML).toContain('class="side"')
    })

    test('사용자가 깃허브 아이콘을 눌렀을 경우', () => {
        const $icon = document.querySelector('.top > div:nth-child(2)') as HTMLElement
        $icon.click()
        expect(modalStore.state.github).toBe(true)
    })

    test('사용자가 섫정 아이콘을 눌렀을 경우', () => {
        const $icon = document.querySelector('.bottom > div:nth-child(1)') as HTMLElement
        $icon.click()
        expect(modalStore.state.setting).toBe(true)
    })
})
