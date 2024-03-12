export const initCode = {
    c: `#include <stdio.h>

char* sayHello(void) {
    return "Hello World!";
}

int main(void) {
    printf("%s", sayHello());
}
`,


    cpp: `#include <iostream>

using namespace std;

char* sayHello(void) {
    return "Hello World!";
}

int main(void) {
    cout << sayHello() << endl;
}`,


    rs: `fn say_hello() -> &'static str {
    "Hello World!"
}

fn main() {
    println!("{}", say_hello())
}
`,


    js: `const sayHello = () => {
    return 'Hello World!'
}

(function main() {
    console.log(sayHello())
})()
`,


    py: `def say_hello() -> str:
    return 'Hello World!'

if __name__ == '__main__':
    print(say_hello())
`,
}

export type Lang = keyof typeof initCode;

export const langs = Object.keys(initCode) as Lang[]
