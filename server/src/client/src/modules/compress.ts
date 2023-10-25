import LZString from 'lz-string'

// 텍스트를 압축하는 함수
export const compress = (text: string): string => {
    const compressed = LZString.compressToUTF16(text)
    return compressed
}

// 압축된 텍스트를 풀어주는 함수
export const decompress = (compressed: string): string => {
    const decompressed = LZString.decompressFromUTF16(compressed)
    return decompressed
}