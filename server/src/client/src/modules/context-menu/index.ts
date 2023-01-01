import style from './style.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

interface Menu {
  label: string;
  click: () => void;
}

interface ContextMenuOptions {
  top: number;
  left: number;
  menus: Menu[]
}

function createContextMenu() {
    let createdContextMenu = false

    const destroyContextMenu = () => {
        document.querySelector(`.${cn('context-menu')}`).remove()
        createdContextMenu = false
    }

    document.addEventListener('click', () => {
        if (createdContextMenu) {
            destroyContextMenu()
        }
    })

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (createdContextMenu) {
                destroyContextMenu()
            }
        }
    })
    
    return {
        create(options: ContextMenuOptions) {
            if (createdContextMenu) {
                destroyContextMenu()
            }
        
            const contextBox = document.createElement('ul')
            contextBox.className = cn('context-menu')
            contextBox.style.top = `${options.top}px`
            contextBox.style.left = `${options.left}px`
            
            options.menus.forEach(menu => {
                const menuItem = document.createElement('li')
                menuItem.className = cn('context-menu-item')
                menuItem.innerText = menu.label
                menuItem.addEventListener('click', menu.click)
                contextBox.appendChild(menuItem)
            })
          
            document.body.appendChild(contextBox)
            createdContextMenu = true
        },
        destroy: destroyContextMenu
    }
}

export const contextMenu = createContextMenu()
