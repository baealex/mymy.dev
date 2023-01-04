import fs from 'fs'
import subprocess from 'child_process'

interface RunCodeOption {
    isCompile: boolean;
}

export function runCode(commands: string[], option?: RunCodeOption) {
    try {
        const result = subprocess.execSync(commands.join(' '), {
            timeout: 10000
        })
        if (option?.isCompile) {
            return ''
        }
        return(result.toString())
    } catch(e: any) {
        if (e.signal === 'SIGTERM' || e.signal === 'SIGKILL') {
            return 'Timeout'
        }
        if (e.stderr) {
            return e.stderr.toString()
        }
    }
}

export function safety(source: string, keywords: string[]) {
    for (const keyword of keywords) {
        source = source.replace(new RegExp(keyword), '')
    }
    return source
}

export function cleaner(filename: string) {
    const [ uuid ] = filename.split('.')
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename)
    }
    if (fs.existsSync(uuid)) {
        fs.unlinkSync(uuid)
    }
}
