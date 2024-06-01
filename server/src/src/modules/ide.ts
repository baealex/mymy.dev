import fs from 'fs';
import subprocess from 'child_process';
import type { ExecException } from 'child_process';

type Error = ExecException & {
    stderr: string;
};

interface CreateDockerRunCommandProps {
    env: string;
    filename: string;
    command: string;
}

function createDockerRunCommand({ env, filename, command }: CreateDockerRunCommandProps) {
    return [
        'docker run',
        '--rm',
        '--platform linux/amd64',
        '-i',
        `-v ./${filename}:/temp/${filename}`,
        `baealex/mymydev-env-${env}`,
        `/bin/bash -c "${command}"`
    ];
}

export function runCode(props: CreateDockerRunCommandProps) {
    try {
        const result = subprocess.execSync(createDockerRunCommand(props).join(' '), {
            timeout: 10000,
            shell: '/bin/bash'
        });
        return (result.toString());
    } catch (e: unknown) {
        const error = e as Error;

        if (error.signal === 'SIGTERM' || error.signal === 'SIGKILL') {
            return 'Timeout';
        }
        if (error.stderr) {
            return error.stderr.toString();
        }

        console.log(error);
        return 'Error';
    }
}

export function safety(source: string, keywords: string[]) {
    for (const keyword of keywords) {
        source = source.replace(new RegExp(keyword), '');
    }
    return source;
}

export function cleaner(filename: string) {
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
}
