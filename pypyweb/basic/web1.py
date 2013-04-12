'''
Created on 2013/4/10

@author: kimhsiao

Title: Cherrypy study

Description: It's a easy start concept for cherrypy
'''

import cherrypy

class HelloWorld(object):
    @cherrypy.expose
    def index(self):
        return "Hello World!"
    # index.exposed = True

cherrypy.quickstart(HelloWorld())
