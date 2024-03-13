export const initCode = {
    c: `#include <stdio.h>

char* sayHello(void) {
    return "Hello, World!";
}

int main(void) {
    printf("%s", sayHello());
}
`,


    cpp: `#include <iostream>

using namespace std;

char* sayHello(void) {
    return "Hello, World!";
}

int main(void) {
    cout << sayHello() << endl;
}`,


    dart: `String sayHello() {
    return "Hello, World!";
}

void main() {
    print(sayHello());
}
`,


    ts: `const sayHello = (): string => {
    return 'Hello, World!'
}

(function main() {
    console.log(sayHello())
})()
`,


    js: `const sayHello = () => {
    return 'Hello, World!'
}

(function main() {
    console.log(sayHello())
})()
`,


    py: `def say_hello() -> str:
    return 'Hello, World!'

if __name__ == '__main__':
    print(say_hello())
`,


    rb: `def say_hello()
    puts "Hello, World!"
end

def main
    say_hello
end

at_exit { main }
`,


    rs: `fn say_hello() -> &'static str {
    "Hello, World!"
}

fn main() {
    println!("{}", say_hello())
}
`,
}

export type Lang = keyof typeof initCode;

export const langs = Object.keys(initCode) as Lang[]
