import os
import subprocess
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def intro():
    return render_template('intro.html')

@app.route('/ide')
def ide_form():
    return render_template('ide.html')

def save_file(file_name, source_code):
    source_file = open(file_name, 'w', encoding='utf-8')
    source_file.write(source_code)
    source_file.close()

def run_code(command, file_name):
    try:
        data = subprocess.check_output(command, universal_newlines=True, timeout=0.5)
    except subprocess.TimeoutExpired:
        data = 'Timeout'
    except:
        data = 'Error'
    	
    try:
        os.remove(file_name)
    except FileNotFoundError:
        data = 'Compile Error'
    
    return data

@app.route("/run/c", methods=['GET','POST'])
@cross_origin()
def c_run():
    if request.method =='GET':
        return 'C'
    if request.method =='POST':
        c_code = request.form['source']

        """C FILTERING"""
        c_code = c_code.replace('#include', '')
        c_code = c_code.replace('<stdio.h>', '')

        """C HEADER INCLUDE"""
        c_code = "#include <stdio.h>\n" + c_code
        username = request.args.get('name')

        file_name = str(username) + '.c'
        save_file(file_name, c_code)

        """C COMPILE"""
        run_code(['gcc', file_name, '-o', username], file_name)
        
        return run_code(['./'+username], username)

@app.route("/run/cpp", methods=['GET','POST'])
@cross_origin()
def cpp_run():
    if request.method =='GET':
        return 'C++'
    if request.method =='POST':
        c_code = request.form['source']

        """C++ FILTERING"""
        c_code = c_code.replace('#include', '')
        c_code = c_code.replace('<iostream>', '')

        """C++ HEADER INCLUDE"""
        c_code = "#include <iostream>\n" + c_code
        username = request.args.get('name')

        file_name = str(username) + '.cpp'
        save_file(file_name, c_code)

        """C++ COMPILE"""
        run_code(['g++', file_name, '-o', username], file_name)
        
        return run_code(['./'+username], username)

@app.route("/run/py3", methods=['GET','POST'])
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

        return run_code(['python', file_name], file_name)

@app.route("/run/js", methods=['GET','POST'])
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

        return run_code(['node', file_name], file_name)