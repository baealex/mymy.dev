import { 
    useEffect,
    useState,
} from 'react'

import dynamic from 'next/dynamic'

import axios from 'axios'

const CodeMirror = dynamic(() => {
    import('codemirror/mode/javascript/javascript' as any)
    import('codemirror/theme/material-darker.css' as any)
    return import('react-codemirror')
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
    const [ isReady, setIsReady ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ source, setSource ] = useState('hello world');
    const [ result, setResult ] = useState('');

    const postSource = async (lang: string) => {
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
            setIsLoading(true)
            axios.request({
                method: 'POST',
                url: '/github/raw',
                data: {
                    raw: raw,
                }
            }).then(({ data }) => {
                setSource(data)
            }).finally(() => {
                setIsReady(true)
                setIsLoading(false)
            })
        } else {
            setIsReady(true)
        }
    }, []);
    
    return (
        <>
            <>
                <div className="main">
                    {isReady && (
                        <CodeMirror
                            value={source}
                            className="code-top"
                            onChange={(text) => setSource(text)}
                            options={{
                                theme: 'material-darker',
                                lineNumbers: true,
                                mode: 'javascript'
                            }}
                        />
                    )}
                    <div className="code-bottom">
                        <div>
                            <button className="lang-btn" type="button" onClick={() => postSource('c')}>C</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('cpp')}>C++</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('rs')}>Rust</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('py')}>Python3</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('js')}>JavaScript</button>
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
                    <div/>
                    <style jsx>{`
                        div {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 9999;
                            background: rgba(255, 255, 255, 0.8);
                        }
                    `}</style>
                </>
            )}
        </>
    )
}