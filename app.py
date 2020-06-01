import os
import time
import subprocess

from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)

def save_file(file_name, source_code):
    source_file = open(file_name, 'w', encoding='utf-8')
    source_file.write(source_code)
    source_file.close()

def run_code(command, file_name):
    start_time = time.time() * 1000
    try:
        data = subprocess.check_output(command, universal_newlines=True, timeout=5)
    except subprocess.TimeoutExpired:
        data = 'Timeout'
    except:
        data = 'Error'
    	
    try:
        os.remove(file_name)
    except FileNotFoundError:
        data = 'Compile Error'
    
    return {
        'result': data,
        'time': str( round( (time.time() * 1000 - start_time), 4) ) + 'ms'
    }

@app.route('/')
def intro():
    return render_template('intro.html')

@app.route('/ide')
def ide():
    return render_template('ide.html')

@app.route("/run/<type>", methods=['GET','POST'])
def run(type):
    if request.method =='GET':
        return str(type)
    
    if request.method =='POST':
        code = request.form['source']
        intt = request.args.get('intt')
        file_name = request.args.get('intt')

        if type == 'c':
            code = code.replace('#include', '')
            code = code.replace('<stdio.h>', '')
            code = "#include <stdio.h>\n" + code
            file_name += '.c'
        if type == 'cpp':
            code = code.replace('#include', '')
            code = code.replace('<iostream>', '')
            code = "#include <iostream>\n" + code
            file_name += '.cpp'
        if type == 'py3':
            code = code.replace('import', '')
            file_name += '.py'
        if type == 'js':
            code = code.replace('require', '')
            file_name += '.js'
        
        save_file(file_name, code)
        
        if type == 'c':
            run_code(['gcc', file_name, '-o', intt], file_name)
            return run_code(['./' + intt], intt)
        if type == 'cpp':
            run_code(['g++', file_name, '-o', intt], file_name)
            return run_code(['./' + intt], intt)
        if type == 'py3':
            return run_code(['python', file_name], file_name)
        if type == 'js':
            return run_code(['node', file_name], file_name)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)