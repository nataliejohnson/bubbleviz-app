# this is app.py

import os
import random
import argparse

import requests

from bottle import route, run, template, static_file, request, post

@route('/')
def home():
  return static_file("./index.html", root="./Session2/")

@route('/hello/<name>')
def index(name):
    return template('<b>Hello {{name}}</b>!', name=name)
  
@route('/api/random-test')
def random_test():
  return {'value': random.random()}

@post('/api/anon-search')
def anon_search():
  
  reply = requests.get(request.forms.get('url'))
  return {
    'status': 'OK',
    'url': request.forms.get('url'),
    'content': reply
  }

@route('/static/<pathname>')
def home(pathname):
  return static_file(pathname, root="./Session2/static")




def gen_results(num):
  return [{'weight':random.random(), 'personalisation':random.random() } for x in range(num)]

def item_weight(item):
  return item['weight']

def item_personalisation(item):
  return item['personalisation']

@route('/api/search')
def search():
  query = request.query.get('query')
  return {
    'query': query,
    'sorted_items': sorted(gen_results(100), key=item_personalisation)
  }

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Process some integers.')
  parser.add_argument('--port', metavar='PORT', type=int, help='Port to serve on')
  args = parser.parse_args()

  port = None
  if os.environ.get('PORT'):
    port = os.environ.get('PORT')
  elif args.port:
    port = args.port
  else:
    raise Exception("Port not configured!")

  run(host='0.0.0.0', port=port)
