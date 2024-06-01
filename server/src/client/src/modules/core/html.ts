export function html(texts: TemplateStringsArray, ...values: unknown[]) {
    return texts.map((text, i) => text + (values[i] || '')).join('');
}
