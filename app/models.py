from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base0 = declarative_base()
class Documents(Base0):
    __tablename__ = 'Documents'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    note = Column(String)
    
    def __repr__(self):
        return f"title: {self.ititled}| note: {self.note}"

Base1 = declarative_base()
class Quizzes(Base1):
    __tablename__ = 'Quizzes'
    id = Column(Integer, primary_key=True)
    title_eng = Column(String)
    title_far = Column(String)
    img = Column(String)
    href = Column(String)
    fan_name = Column(String)
    views = Column(Integer)
    publish = Column(Date)
    
    def __repr__(self):
        return f"<id: {self.id}| title: {self.title_eng + ' ' + self.title_far}| link: {self.href}| view: {self.views}| publish: {self.publish}>"

Base2 = declarative_base()
class Categories(Base2):
    __tablename__ = 'Categories'
    id = Column(Integer, primary_key=True)
    title_eng = Column(String)
    title_far = Column(String)
    img = Column(String)
    category = Column(String)
    href = Column(String)
    views = Column(Integer)
    publish = Column(Date)
    time = Column(Integer)
    
    def __repr__(self):
        return f"<id: {self.id}| title: {self.title_eng + ' ' + self.title_far}| category: {self.category} | link: {self.href}| view: {self.views}| publish: {self.publish}>"

Base3 = declarative_base()
class NewsletterUser(Base3):
    __tablename__ = 'Newsletter_User'
    id = Column(Integer, primary_key=True)
    userName = Column(String)
    email = Column(String)

    def __repr__(self):
        return f"<id: {self.id} | name: {self.userName} | email: {self.email}"

Base4 = declarative_base()
class quizQuestions(Base4):
    __tablename__ = 'Quiz_Questions'
    id = Column(Integer, primary_key=True)
    title_eng = Column(String)
    title_far = Column(String)
    type = Column(String)
    question = Column(String)
    option_1 = Column(String)
    option_2 = Column(String)
    option_3 = Column(String)
    option_4 = Column(String)
    answer = Column(String)
    category = Column(String)
    innerCategory = Column(String)
    publish = Column(Date)

    def __repr__(self):
        return f"id: {self.id} | title_far: {self.title_eng} | type: {self.type} | category: {self.category} | innerCategory: {self.innerCategory} | publish: {self.publish}"
