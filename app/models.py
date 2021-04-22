from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
class Quizzes(Base):
    __tablename__ = 'Quizzes'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    link = Column(String)
    view = Column(Integer)
    publish = Column(Date)
    time = Column(Integer)
    
    def __repr__(self):
        return f"<id: {self.id}| title: {self.title}| link: {self.link}| view: {self.view}| publish: {self.publish}>"