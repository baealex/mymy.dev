import { langStore } from '~/stores/lang';
import { sourceStore } from '~/stores/source';
import { terminalStore } from '~/stores/terminal';

const data = {
    lang: '',
    source: '',
    terminal: '',
    fileName: ''
};

let event: NodeJS.Timeout;

function setData(newData: Partial<typeof data>) {
    Object.assign(data, newData);
    event && clearTimeout(event);
    event = setTimeout(() => {
        saveOnUrl(JSON.stringify(data));
    }, 300);
}

function saveOnUrl(data: string) {
    const base64 = btoa(encodeURIComponent(data));
    window.history.replaceState({}, '', `/#/${base64}`);
}

export function loadFromUrl(): unknown {
    const base64 = window.location.hash.slice(2);
    if (!base64) return;

    try {
        return JSON.parse(decodeURIComponent(atob(base64)));
    } catch (e) {
        console.error(e);
    }
}

sourceStore.subscribe((state) => {
    setData({
        fileName: state.activeFile,
        source: state.files[state.activeFile]
    });
});

langStore.subscribe((state) => {
    setData({ lang: state.data });
});

terminalStore.subscribe((state) => {
    setData({ terminal: state.data });
});
