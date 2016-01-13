#coding:utf-8
import json
import os.path
import csv
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options

from tornado.options import define,options
define('port',default=8000,help='run...',type=int)

class IndexHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('index.html')
		
if __name__ == '__main__':
	tornado.options.parse_command_line()
	app = tornado.web.Application(
		handlers =[
			(r'/',IndexHandler)
		],
		template_path = os.path.join(os.path.dirname(__file__),'templates'),
		static_path = os.path.join(os.path.dirname(__file__),'static'),
		debug = True
	)
	http_server = tornado.httpserver.HTTPServer(app)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()
	
