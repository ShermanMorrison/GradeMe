__author__ = 'phrayezzen'

from flask.ext.login import UserMixin

class User(UserMixin):

    def __init__(self, username, first_name, last_name, grader=False):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.grader = grader

    def is_authenticated(self):
        return True
        #return true if user is authenticated, provided credentials

    def is_active(self):
        return True
        #return true if user is activte and authenticated

    def is_annonymous(self):
        return False
        #return true if annon, actual user return false

    def get_id(self):
        return unicode(self.username)
        #return unicode id for user, and used to load user from user_loader callback

    def __repr__(self):
        return '<User %r>' % (self.username)