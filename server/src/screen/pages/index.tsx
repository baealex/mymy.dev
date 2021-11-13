import { 
    useEffect,
    useState,
} from 'react'

import dynamic from 'next/dynamic'

import axios from 'axios'

import { Lang, initCode } from '@modules/init-code';

const CodeMirror = dynamic(() => {
    import('codemirror/mode/rust/rust' as any)
    import('codemirror/mode/python/python' as any)
    import('codemirror/mode/javascript/javascript' as any)
    import('codemirror/theme/material-darker.css' as any)
    return import('@components/code-mirror')
}, {ssr: false})

function getParameter(name: string) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

export default function Home() {
    const [ isLoading, setIsLoading ] = useState(true);

    const [ lang, setLang ] = useState<Lang>('c');
    const [ source, setSource ] = useState('');
    const [ result, setResult ] = useState('');

    const postSource = async () => {
        setIsLoading(true)
        const { data } = await axios.request({
            method: 'POST',
            url: '/run/' + lang,
            data: {
                source: source,
            }
        })
        setResult(data)
        setIsLoading(false)
    }

    useEffect(() => {
        const raw = getParameter('raw')

        if (raw) {
            axios.request({
                method: 'POST',
                url: '/github/raw',
                data: {
                    raw: raw,
                }
            }).then(({ data }) => {
                setSource(data)
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            const keys = Object.keys(initCode)
            const chooseLang = keys[
                Math.floor(Math.random() * keys.length)
            ] as Lang
            setLang(chooseLang)
            setSource(initCode[chooseLang])
            setIsLoading(false)
        }
    }, []);
    
    return (
        <>
            <>
                <div className="main">
                    <CodeMirror
                        value={source}
                        className="code-top"
                        onBeforeChange={(_, __, value) => {
                            setSource(value)
                        }}
                        options={{
                            theme: 'material-darker',
                            lineNumbers: true,
                            mode: 'javascript'
                        }}
                    />
                    <div className="code-bottom">
                        <div>
                            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                                <option value="c">C</option>
                                <option value="cpp">C++</option>
                                <option value="rs">Rust</option>
                                <option value="js">JavaScript</option>
                                <option value="py">Python3</option>
                            </select>
                            <button className="lang-btn" type="button" onClick={() => postSource()}>
                                Run
                            </button>
                        </div>
                        <div className="code-console">
                            {result}
                        </div>
                        <div className="code-footer">
                            Copyright 2021 &copy; BaeJino.
                        </div>
                    </div>
                </div>
            </>
            {isLoading && (
                <>
                    <div className="loading">
                        <div className="dot-bricks"/>
                    </div>
                </>
            )}
        </>
    )
}