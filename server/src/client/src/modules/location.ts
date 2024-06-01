export function getParameter(name: string) {
    const [result] = location.search
        .substr(1)
        .split('&')
        .filter(item => item.split('=')[0] === name)
        .map(item => decodeURIComponent(item.split('=')[1]));
    return result;
}
