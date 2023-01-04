export function html(strings: TemplateStringsArray, ...values: unknown[]) {
    let str = ''
    strings.forEach((string, i) => {
        str += string + (values[i] || '')
    })
    return str
}
