export const SOCKET_EVENT_NAME = {
    CODE_RUNNER: 'code-runner',
    CODE_RUNNER_ERROR: 'code-runner-error',
    CODE_RUNNER_RESULT: 'code-runner-result',
    GET_GITHUB_RAW: 'get-github-raw',
    GET_GITHUB_RAW_ERROR: 'get-github-raw-error',
    GET_GITHUB_RAW_RESULT: 'get-github-raw-result',
}

export interface CodeRunnerEventParams {
    language: string;
    source: string;
}

export function CodeRunnerEventParams(params: CodeRunnerEventParams) {
    return params
}

export interface CodeRunnerResultEventParams {
    data: string;
}

export function CodeRunnerResultEventParams(params: CodeRunnerResultEventParams) {
    return params
}

export interface GetGitHubRawEventParams {
    raw: string;
}

export function GetGitHubRawEventParams(params: GetGitHubRawEventParams) {
    return params
}

export interface GetGitHubRawResultEventParams {
    name: string;
    data: string;
}

export function GetGitHubRawResultEventParams(params: GetGitHubRawResultEventParams) {
    return params
}
