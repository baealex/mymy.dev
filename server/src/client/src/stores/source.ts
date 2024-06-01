import { initCode } from '~/modules/code';
import Store from 'badland';
import { rememberOnStorage } from 'badland/dist/plugin';
import type { Lang } from 'types';

interface SourceStoreState {
    activeFile: string;
    files: { [key: string]: string };
}

class SourceStore extends Store<SourceStoreState> {
    constructor() {
        super();
        this.state = {
            activeFile: '',
            files: {}
        };
    }

    exists(fileName: string): boolean {
        return Object.keys(this.state.files).includes(fileName);
    }

    createNewFile(options?: {
        lang?: Lang;
        fileName?: string;
        fileData?: string;
    }) {
        const newFileName = options?.fileName
            ? options.fileName
            : 'New_File_' + Math.random().toFixed(5).replace('0.', '') + (options?.lang ? '.' + options.lang : '');
        this.set((state) => ({
            ...state,
            activeFile: newFileName,
            files: {
                ...state.files,
                [newFileName]: options?.fileData
                    ? options.fileData
                    : options?.lang ? initCode[options.lang] : ''
            }
        }));
        return options?.lang ? initCode[options?.lang] : '';
    }

    removeActiveFile() {
        if (Object.keys(this.state.files).length <= 1) {
            alert('You cannot delete the last file');
            return;
        }

        this.set((state) => {
            const nextFiles = Object.keys(state.files)
                .filter(file => file !== state.activeFile)
                .reduce((acc, cur) => {
                    return {
                        ...acc,
                        [cur]: state.files[cur]
                    };
                }, {});

            const nextActiveFile = Object.keys(nextFiles)[0];

            return {
                ...state,
                activeFile: nextActiveFile,
                files: nextFiles
            };
        });
    }

    renameActiveFile(fileName: string) {
        if (fileName !== this.state.activeFile && this.exists(fileName)) {
            alert('File name already exists');
            return;
        }

        this.set((state) => {
            const nextFiles = Object.keys(state.files)
                .map(file => file === state.activeFile ? fileName : file)
                .reduce((acc, cur) => {
                    return {
                        ...acc,
                        [cur]: cur === fileName ? state.files[state.activeFile] : state.files[cur]
                    };
                }, {});

            return {
                ...state,
                activeFile: fileName,
                files: nextFiles
            };
        });
    }

    downloadActiveFile() {
        const file = this.state.files[this.state.activeFile];
        const blob = new Blob([file], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.state.activeFile;
        a.click();
    }
}

export const sourceStore = new SourceStore();

rememberOnStorage('mymydev__source', sourceStore);
