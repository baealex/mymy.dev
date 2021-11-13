import fs from 'fs'
import subprocess from 'child_process'

export function runCode(commands: string[], isCompile=false) {
    try {
        const result = subprocess.execSync(commands.join(' '), {
            timeout: 5000
        })
        if (isCompile) {
            return ''
        }
        return(result.toString())
    } catch(e: any) {
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