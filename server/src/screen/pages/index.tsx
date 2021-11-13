import { 
    useState,
} from 'react';

import axios from 'axios';

export default function Home() {
    const [ isLoading, setIsLoading ] = useState(false);

    const [ source, setSource ] = useState('');
    const [ result, setResult ] = useState('');

    const postSource = async (lang: string) => {
        setIsLoading(true);

        const { data } = await axios.request({
            method: 'POST',
            url: '/run/' + lang,
            data: {
                source: source,
            }
        })
        setResult(data);
        
        setIsLoading(false);
    }
    
    return (
        <>
            <>
                <div className="main">
                    <textarea className="code-top" value={source} onChange={(e) => setSource(e.target.value)}/>
                    <div className="code-bottom">
                        <div>
                            <button className="lang-btn" type="button" onClick={() => postSource('c')}>C</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('cpp')}>C++</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('rs')}>Rust</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('py')}>Python3</button>
                            <button className="lang-btn" type="button" onClick={() => postSource('js')}>JavaScript</button>
                        </div>
                        <div className="code-console" id="result">
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
                            background: rgba(255, 255, 255, 0.8);
                        }
                    `}</style>
                </>
            )}
        </>
    )
}