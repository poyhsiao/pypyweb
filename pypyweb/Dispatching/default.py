'''
Created on 2013/4/12

@author: kimhsiao

Title: Dispatching

Description: The very basic idea for Cherrypy
'''

import cherrypy

class OnePage(object):
    @cherrypy.expose
    def index(self):
        return "one Page!"

class HelloWorld(object):
    onepage = OnePage()

    @cherrypy.expose
    def index(self):
        return "Hello World!"

root = HelloWorld()
''' root will handle default page like "/"
'''
root.helloworld = HelloWorld()

root.onepage = OnePage()
''' on "/onepage" they will run "OnePage" class
'''

''' plz note
in Cherrypy the index() method is quite special one. for example as above,
class OnePage with index() method which is assigned to root.onepage, no matter
the user request "/onepage" or "/onepage/", they will execute "OnePage.index()"
'''

# root.otherpage = OtherPage()

cherrypy.quickstart(HelloWorld())
