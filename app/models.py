from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
class Quizzes(Base):
    __tablename__ = 'Quizzes'
    id = Column(Integer, primary_key=True)
    title_eng = Column(String)
    title_far = Column(String)
    href = Column(String)
    views = Column(Integer)
    publish = Column(Date)
    time = Column(Integer)
    
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

