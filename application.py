# this is app.py

import os
import random
import argparse
import urlparse

import requests
import bottle
from bottle import route, run, template, static_file, request, post, response

bottle.BaseRequest.MEMFILE_MAX = 10000000 #(10M)

app = bottle.Bottle()

@app.route('/')
def home():
  return "<h1>Hello!</h1>"

@app.route('/hello/<name>')
def index(name):
    return template('<b>Hello {{name}}</b>!', name=name)

@app.post('/api/anon-search')
def anon_search():
  url_to_be_fetched = request.forms.get('url')
  reply = requests.get(url_to_be_fetched)
  return {
    'status': 'OK',
    'url': url_to_be_fetched,
    'content': reply.text
  }

def gen_results(num):
  return [{'weight':random.random(), 'personalisation':random.random() } for x in range(num)]

def item_weight(item):
  return item['weight']

def item_personalisation(item):
  return item['personalisation']

@app.route('/api/search')
def search():
  query = request.query.get('query')
  return {
    'query': query,
    'sorted_items': sorted(gen_results(100), key=item_personalisation)
  }

application = app

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Process some integers.')
  parser.add_argument('--port', metavar='PORT', type=int, help='Port to serve on')
  parser.add_argument('--setup', help="Setup database")
  args = parser.parse_args()

  port = None
  if os.environ.get('PORT'):
    port = os.environ.get('PORT')
  elif args.port:
    port = args.port
  else:
    raise Exception("Port not configured!")

  app.run(host='0.0.0.0', port=port)
