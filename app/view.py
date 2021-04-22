from flask import Flask, redirect, url_for, request, render_template

app = Flask(__name__)

@app.route('/')
def Main():
    return render_template('index.html')