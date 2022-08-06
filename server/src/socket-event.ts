export const SOCKET_EVENT_NAME = {
    CODE_RUNNER: 'code-runner',
    CODE_RUNNER_ERROR: 'code-runner-error',
    CODE_RUNNER_RESULT: 'code-runner-result'
}

export interface CodeRunnerEventParams {
    language: string;
    source: string;
}

export function CodeRunnerEventParams(params: CodeRunnerEventParams) {
    return params
}

export interface CodeRunnerResultEventParams {
    result: string;
}

export function CodeRunnerResultEventParams(params: CodeRunnerResultEventParams) {
    return params
}
