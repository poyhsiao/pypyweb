# -*- coding: utf-8 -*1-
'''
Created on 2013/4/12

@author: kimhsiao

Title: Cherrypy study

Description: It's a easy start concept for cherrypy
'''

import os.path
current_dir = os.path.dirname(os.path.abspath(__file__))

import cherrypy

class Root:
    @cherrypy.expose
    def index(self):
        print "Hello world"

if __name__ == '__main__':
    cherrypy.config.update({'environment': 'production',
                            'log.error_file': 'site.log',
                            'log.screen': True})

    mime_type = {'js': 'text/javascript',
                 'json': 'text/javascript',
                 'css': 'text/css',
                 'png': 'image/png',
                 'gif': 'image/gif',
                 'jpg': 'image/jpeg',
                 'ico': 'image/ico',
                 'html': 'text/html',
                 'htm': 'text/html'
    }

    conf = {'/css': {'tools.staticdir.on': True,
                     'tools.staticdir.dir': os.path.join(current_dir, 'static/css'),
                     'tools.staticdir.content_types': mime_type},
            '/html': {'tools.staticdir.on': True,
                      'tools.staticdir.dir': os.path.join(current_dir, 'static/html'),
                      'tools.staticdir.content_types': mime_type},
            '/script': {'tools.staticdir.on': True,
                       'tools.staticdir.dir': os.path.join(current_dir, 'static/script'),
                       'tools.staticdir.content_types': mime_type},
            '/image': {'tools.staticdir.on': True,
                       'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
                       'tools.staticdir.content_types': mime_type}}

    cherrypy.quickstart(Root(), '/', config = conf)
