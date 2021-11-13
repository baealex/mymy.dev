import App, { AppProps } from 'next/app'
import Head from 'next/head'

import '../styles/main.scss'

import 'codemirror/lib/codemirror.css'

class Main extends App<AppProps> {
    constructor(props: AppProps) {
        super(props);
    }

    render() {
        const {Component, pageProps} = this.props;

        return (
            <>
                <Head>
                    <title>Code Runner</title>
                    <meta name="theme-color" content="#000"/>
                    <meta name="msapplication-TileColor" content="#000"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <Component {...pageProps}/>
            </>
        )
    }
}

export default Main