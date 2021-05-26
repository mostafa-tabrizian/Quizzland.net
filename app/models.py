from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

documentBase = declarative_base()
class Documents(documentBase):
    __tablename__ = 'Documents'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    note = Column(String)
    
    def __repr__(self):
        return f"title: {self.ititled}| note: {self.note}"

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
    
    def __repr__(self):
        return f"<id: {self.id}| title: {self.title_eng + ' ' + self.title_far}| category: {self.category} | link: {self.href}| view: {self.views}| publish: {self.publish}>"

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

    def __repr__(self):
        return f'{self.title_far, self.category, self.innerCategory, self.views, self.publish}'

quizzes4OptionBase = declarative_base()
class Quizzes4Option(quizzes4OptionBase):
    __tablename__ = 'Quizzes4Option'
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

    def __repr__(self):
        return f"<id: {self.id}| title: {self.title_far}| category: {self.category} | innerCategory: {self.innerCategory}>"


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
    category = Column(String)

fourOptionQuizQuestionsBase = declarative_base()
class fourOptionQuizQuestions(fourOptionQuizQuestionsBase):
    __tablename__ = 'Four_Option_Questions'
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

    def __repr__(self):
        return f"<id: {self.id} | name: {self.userName} | email: {self.email}"


    def __repr__(self):
        return f"id: {self.id} | title_far: {self.title_eng} | type: {self.type} | category: {self.category} | innerCategory: {self.innerCategory} | publish: {self.publish}"
