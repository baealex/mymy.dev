import Component from '@lib/component'

import ModalGitHubContent from './ContentGitHub'
import ModalSettingContent from './ContentSetting'

import { modalStore } from '@stores/modal'

export default class Modal extends Component {
    mount() {
        const $modal = {
            github: this.$el.querySelector('.github.modal') as HTMLElement,
            setting: this.$el.querySelector('.setting.modal') as HTMLElement,
        }
        Object.keys($modal).forEach(_key => {
            const key = _key as keyof typeof $modal
            $modal[key].querySelector('.close')?.addEventListener('click', () => {
                modalStore.set((prevState) => ({
                    ...prevState,
                    [key]: false,
                }))
            })

            let isMoveable = false
            let prevClientX = 0
            let prevClientY = 0
            let lastClientX = 0
            let lastClientY = 0
            window.addEventListener('mousedown', (e: any) => {
                if (e.target === $modal[key].querySelector('.header')) {
                    document.body.style.userSelect = 'none'
                    prevClientX = e.clientX - lastClientX
                    prevClientY = e.clientY - lastClientY
                    isMoveable = true
                }
            })
            window.addEventListener('mouseup', (e) => {
                document.body.style.userSelect = 'default'
                prevClientX = 0
                prevClientY = 0
                isMoveable = false
                $modal[key].style.opacity = '1'
            })
            window.addEventListener('mousemove', (e: any) => {
                if (isMoveable) {
                    const clientX = e.clientX - prevClientX
                    const clientY = e.clientY - prevClientY
                    lastClientX = clientX
                    lastClientY = clientY
                    $modal[key].style.transform = `translate(-50%, -50%) translate(${clientX}px, ${clientY}px)`
                    $modal[key].style.border = '1px dashed #ccc;'
                    $modal[key].style.opacity = '0.5'
                }
            })
        })
        modalStore.subscribe((state) => {
            Object.keys(state).forEach(_key => {
                const key = _key as keyof typeof state
                state[key]
                    ? $modal[key].classList.remove('hidden')
                    : $modal[key].classList.add('hidden')
            })
        }, { initialize: true })

        new ModalGitHubContent($modal.github, { className: 'content' })
        new ModalSettingContent($modal.setting, { className: 'content' })
    }

    render() {
        return `
            <div class="github modal hidden">
                <div class="header">
                    <div class="title">
                        <i class="fab fa-github"></i> GitHub
                    </div>
                    <div class="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
            <div class="setting modal hidden">
                <div class="header">
                    <div class="title">
                        <i class="fas fa-cog"></i> Setting
                    </div>
                    <div class="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        `
    }
}