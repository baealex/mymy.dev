import os
import subprocess
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

@app.route('/ide')
def socket_ide():
    return render_template('ide.html')

def save_file(file_name, source_code):
    source_file = open(file_name, 'w', encoding='utf-8')
    source_file.write(source_code)
    source_file.close()

def run_code(code_type, file_name):
    try:
        data = subprocess.check_output([code_type, file_name], universal_newlines=True, timeout=0.5)
    except subprocess.TimeoutExpired:
        data = 'Timeout'
    except:
        data = 'Error'
    os.remove(file_name) 
    return data

@app.route("/py", methods=['GET','POST'])
@cross_origin()
def pyrun():
    if request.method =='GET':
        return 'Python'
    if request.method =='POST':
        pycode = request.form['source']

        """PYTHON FILTERING"""
        pycode = pycode.replace('import', '')

        """PYTHON RUNNING TIME"""
        pycode = "import time\nstart_time = time.time() * 1000\n" + pycode + "\nprint('Run Time: ' + str( round( (time.time() * 1000 - start_time), 4) ) + 'ms')"
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

        """JAVASCRIPT FILTERING"""
        jscode = jscode.replace('require', '')

        """JAVASCRIPT RUNNING TIME"""
        jscode = "console.time('Run Time');\n" + jscode + "\nconsole.timeEnd('Run Time');"
        username = request.args.get('name')

        file_name = str(username) + '.js'
        save_file(file_name, jscode)

        return run_code('node', file_name)