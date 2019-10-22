import subprocess
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

def save_file(file_name, source_code):
    source_file = open(file_name, 'w', encoding='utf-8')
    source_file.write(source_code)
    source_file.close()

def run_code(code_type, file_name):
    try:
        data = subprocess.check_output([code_type, file_name], universal_newlines=True, timeout=1)
    except subprocess.TimeoutExpired:
        data = 'TimeOut'
    except:
        data = 'Error'
    return data

@app.route("/py", methods=['GET','POST'])
@cross_origin()
def pyrun():
    if request.method =='GET':
        return 'Python'
    if request.method =='POST':
        pycode = request.form['source']
        pycode = "import time\nstart_time = time.time()\n" + pycode + "\nprint('Run Time : ' + str(time.time() - start_time))"
        username = request.args.get('name')

        file_name = str(username) + '.py'
        save_file(file_name, pycode)

        return run_code('python', file_name)

@app.route("/js", methods=['GET','POST'])
@cross_origin()
def jsrun():
    if request.method =='GET':
        return 'JavaScript'
    if request.method =='POST':
        jscode = request.form['source']
        jscode = "console.time('Run Time');\n" + jscode + "\nconsole.timeEnd('Run Time');"
        username = request.args.get('name')

        file_name = str(username) + '.js'
        save_file(file_name, jscode)

        return run_code('node', file_name)