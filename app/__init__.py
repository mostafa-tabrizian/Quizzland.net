from flask import Flask, redirect, url_for, request, render_template
from crud import *
from view import *

if __name__ == '__main__':
    app.run(debug = True)