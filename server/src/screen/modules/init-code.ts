export const initCode = {
    c:
`char* hello(void) {
    return "Hello World!";
}

int main(void) {
    printf(hello());
}
`,


    cpp:
`using namespace std;

char* hello(void) {
    return "Hello World!";
}

int main(void) {
    cout << hello() << endl;
}`,


    rs:
`fn hello() -> &'static str {
    "Hello World!"
}

fn main() {
    println!("{}", hello())
}
`,


    js:
`function hello() {
    return 'Hello World!'
}

(function main() {
    console.log(hello())
})()
`,


    py:
`def hello():
    return 'Hello World!'

if __name__ == '__main__':
    print(hello())
`,
};

export const langs = Object.keys(initCode);

export type Lang = keyof typeof initCode;