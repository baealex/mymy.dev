import Component from '@lib/component'

let sourcePath = ''

export default class ModalSettingContent extends Component {
    mount() {
        this.$el.querySelector('input')?.addEventListener('input', (e: any) => {
            sourcePath = e.target.value
        })
        this.$el.querySelector('button')?.addEventListener('click', (e: any) => {
            if (!sourcePath) {
                alert('Path is empty 🙀')
                return
            }

            if (!sourcePath.includes('https://github.com')) {
                alert('Path is not come from github 🙀')
                return
            }

            if (!sourcePath.includes('blob/')) {
                alert('Path is something wrong 🙀')
                return
            }

            sourcePath = sourcePath.replace('https://github.com', '')
            sourcePath = sourcePath.replace('blob/', '')
            
            location.replace('?raw=' + sourcePath)
        })
    }

    render() {
        return `
            <div class="section">
                <div class="split">
                    <p class="title">Source from GitHub</p>
                    <button>LOAD</button>
                </div>
                <input placeholder="https://github.com/user/repo/source" value=""/>
            </div>
        `
    }
}
