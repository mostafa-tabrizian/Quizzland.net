from flask import Flask, redirect, url_for, request, render_template
from view import *
from crud import *



if __name__ == '__main__':
    app.run(debug = True)