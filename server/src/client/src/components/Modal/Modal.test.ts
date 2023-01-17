import Modal from './Modal'

import { modalStore } from '~/stores/modal'

describe('앱 컴포넌트 테스트', () => {
    test('렌더링 테스트', () => {
        new Modal(document.body)
        expect(document.body.innerHTML).toBeTruthy()
        expect(document.body.innerHTML).toContain('github')
        expect(document.body.innerHTML).toContain('setting')
    })

    test('깃허브 모달 테스트', () => {
        const modal = document.querySelector('.github.modal')

        expect(modal).toBeTruthy()

        expect(modal?.classList.contains('hidden')).toBeTruthy()

        modalStore.set((prevState) => ({
            ...prevState,
            github: true,
        }))

        expect(modal?.classList.contains('hidden')).toBeFalsy()
    })

    test('셋팅 모달 테스트', () => {
        const modal = document.querySelector('.setting.modal')

        expect(modal).toBeTruthy()
        
        expect(modal?.classList.contains('hidden')).toBeTruthy()

        modalStore.set((prevState) => ({
            ...prevState,
            setting: true,
        }))

        expect(modal?.classList.contains('hidden')).toBeFalsy()
    })
})
