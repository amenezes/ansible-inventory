import os

from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_caching import Cache
from flask_compress import Compress
from raven.contrib.flask import Sentry

from lib.server import Server
from lib.stats import Stats
from lib.utils import Util

app = Flask(__name__, static_folder='static')
app.config['COMPRESS_MIMETYPES'] = [
    'text/html', 'text/css', 'application/json', 'application/javascript'
    ]

compress = Compress()
compress.init_app(app)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})
cache.init_app(app)

utils = Util()
utils.load_env_config()
sentry = Sentry(app, dsn=os.getenv('SENTRY_DSN'))

def __get_servers_data():
    '''obtains the filtered data from the pointed report from the
    environment variable FACTS_REPORT'''
    servers = Server()
    return servers.get_data()


@app.route('/')
def index():
    '''Redirect to summary route'''
    return redirect(url_for('summary'))


@cache.cached(timeout=43200)
@app.route('/summary', methods=['GET'])
def summary():
    '''Return a set of data filtered from an ansible report file'''
    response = __get_servers_data()
    return render_template('summary.html', servers_data=response, organization=os.getenv('ORGANIZATION'))


@app.route('/summary/.json', methods=['GET'])
def summary_json():
    '''Return a set of json-formatted data filtered from an ansible report file'''
    response = __get_servers_data()
    return jsonify(response)


@cache.cached(timeout=43200)
@app.route('/stats', methods=['GET'])
def stats():
    servers = __get_servers_data()
    stats = Stats(servers['servers'])
    response = stats.overview()
    return render_template('stats.html', stats=response, organization=os.getenv('ORGANIZATION'))


@app.route('/stats/.json', methods=['GET'])
def stats_json():
    servers = __get_servers_data()
    stats = Stats(servers['servers'])
    return jsonify(stats.overview())


@cache.cached(timeout=86400)
@app.errorhandler(403)
def page_not_found(e):
    '''Redirect HTTP 403 code to 403.html template'''
    return render_template('403.html'), 403


@cache.cached(timeout=86400)
@app.errorhandler(404)
def page_not_found(e):
    '''Redirect HTTP 404 code to 404.html template'''
    return render_template('404.html'), 404


@cache.cached(timeout=86400)
@app.errorhandler(500)
def page_not_found(e):
    '''Redirect HTTP 500 code to 500.html template'''
    return render_template('500.html'), 500


@app.after_request
def apply_caching(response):
    '''Configure security HTTP headers'''
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response
