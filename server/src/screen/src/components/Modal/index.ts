import Component from '@lib/component';

import ModalGitHubContent from './ContentGitHub';
import ModalSettingContent from './ContentSetting';

import { modalStore } from '@stores/modal';

export default class Modal extends Component {
    mount() {
        const $modal = {
            github: this.$el.querySelector('.github.modal') as HTMLElement,
            setting: this.$el.querySelector('.setting.modal') as HTMLElement,
        };
        Object.keys($modal).forEach(_key => {
            const key = _key as keyof typeof $modal;
            $modal[key].querySelector('.close')?.addEventListener('click', () => {
                modalStore.set((prevState) => ({
                    ...prevState,
                    [key]: false,
                }));
            });
        });
        modalStore.subscribe((state) => {
            Object.keys(state).forEach(_key => {
                const key = _key as keyof typeof state;
                state[key]
                    ? $modal[key].classList.remove('hidden')
                    : $modal[key].classList.add('hidden');
            });
        });

        new ModalGitHubContent($modal.github, { className: 'content' });
        new ModalSettingContent($modal.setting, { className: 'content' });
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
        `;
    }
}