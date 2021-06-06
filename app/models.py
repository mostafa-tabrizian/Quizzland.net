from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

documentBase = declarative_base()
class Documents(documentBase):
    __tablename__ = 'Documents'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    note = Column(String)
    
categoriesBase = declarative_base()
class Categories(categoriesBase):
    __tablename__ = 'Categories'
    id = Column(Integer, primary_key=True)
    category = Column(String)
    title_eng = Column(String)
    title_far = Column(String)
    monthly_views = Column(Integer)
    views = Column(Integer)
    publish = Column(DateTime, default=datetime.datetime.now)
    
quizzesBase = declarative_base()
class Quizzes(quizzesBase):
    __tablename__ = 'Quizzes'
    id = Column(Integer, primary_key=True)
    title_far = Column(String)
    category = Column(String)
    innerCategory = Column(String)
    monthly_views = Column(Integer)
    views = Column(Integer)
    fan_name = Column(String)
    background = Column(String)
    publish = Column(DateTime, default=datetime.datetime.now)

quizzesPointyBase = declarative_base()
class QuizzesPointy(quizzesPointyBase):
    __tablename__ = 'Pointy Quizzes'
    id = Column(Integer, primary_key=True)
    title_far = Column(String)
    monthly_views = Column(Integer)
    views = Column(Integer)
    category = Column(String)
    innerCategory = Column(String)
    result_UpTo_1 = Column(String)
    result_UpTo_2 = Column(String)
    result_UpTo_3 = Column(String)
    result_UpTo_4 = Column(String)
    result_UpTo_5 = Column(String)
    result_UpTo_6 = Column(String)
    result_UpTo_7 = Column(String)
    result_UpTo_8 = Column(String)
    result_UpTo_9 = Column(String)
    result_UpTo_10 = Column(String)
    background = Column(String)
    publish = Column(DateTime, default=datetime.datetime.now)

quizQuestionsBase = declarative_base()
class quizQuestions(quizQuestionsBase):
    __tablename__ = 'Quiz_Questions'
    id = Column(Integer, primary_key=True)
    title_eng = Column(String)
    title_far = Column(String)
    question = Column(String)
    option_1 = Column(String)
    option_2 = Column(String)
    option_3 = Column(String)
    option_4 = Column(String)
    answer = Column(String)
    answer_imGif = Column(String)
    answer_text = Column(String)
    category = Column(String)

quizPointyQuestionsBase = declarative_base()
class quizPointyQuestions(quizPointyQuestionsBase):
    __tablename__ = 'Pointy_Quiz_Questions'
    id = Column(Integer, primary_key=True)
    title_far = Column(String)
    question = Column(String)
    op_pt_1 = Column(String)
    op_pt_2 = Column(String)
    op_pt_3 = Column(String)
    op_pt_4 = Column(String)
    op_pt_5 = Column(String)
    op_pt_6 = Column(String)
    op_pt_7 = Column(String)
    op_pt_8 = Column(String)
    op_pt_9 = Column(String)
    op_pt_10 = Column(String)
    category = Column(String)
    innerCategory = Column(String)

newsletterBase = declarative_base()
class NewsletterUser(newsletterBase):
    __tablename__ = 'Newsletter_User'
    id = Column(Integer, primary_key=True)
    userName = Column(String)
    email = Column(String)
    favorite_Category = Column(String)
    added_on = Column(DateTime, default=datetime.datetime.now)