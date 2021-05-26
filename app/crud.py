from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime, time
from config import DATABASE_URL
from models import *

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)
s = session()

def recreate_documents():
    documentBase.metadata.drop_all(engine)
    documentBase.metadata.create_all(engine)

def recreate_quizzes():
    quizzesBase.metadata.drop_all(engine)
    quizzesBase.metadata.create_all(engine)

def recreate_categories():
    categoriesBase.metadata.drop_all(engine)
    categoriesBase.metadata.create_all(engine)

def recreate_newsletterUrl():
    newsletterBase.metadata.drop_all(engine)
    newsletterBase.metadata.create_all(engine)

def recreate_quizQuestions():
    quizQuestionsBase.metadata.drop_all(engine)
    quizQuestionsBase.metadata.create_all(engine)

def recreate_4OptionQuestions():
    fourOptionQuizQuestionsBase.metadata.drop_all(engine)
    fourOptionQuizQuestionsBase.metadata.create_all(engine)

def recreate_quizzes4Option():
    quizzes4OptionBase.metadata.drop_all(engine)
    quizzes4OptionBase.metadata.create_all(engine)

def add_session(data):
    try:
        s.add(data)
        s.commit()
    except Exception:
        s.rollback()
        raise 
    finally:
        s.close()

def del_session():
    try:
        sessionToDelete = s.query(Quizzes).filter(Quizzes.id == 4).first()
        s.delete(sessionToDelete)
        s.commit()
    except Exception:
        s.rollback()
        raise 
    finally:
        s.close()


def up_session():
    try:
        sessionToUpdate = s.query(Quizzes).filter(Quizzes.id == 1).first()
        # sessionToUpdate = s.query(Categories).filter(Categories.id == 6).first()
        # sessionToUpdate.view = 7
        # sessionToUpdate.img = 'TRASH-jennifer.jpg'
        sessionToUpdate.title_eng = 'Taylor Swift'
        s.add(sessionToUpdate)
        s.commit()
    except Exception:
        s.rollback()
        raise 
    finally:
        s.close()

# data = Documents(
#     title = 'title',
#     note = 'note'
# )

#--------------------
# recreate_documents()
# recreate_quizzes()
# recreate_categories()
# recreate_newsletterUrl()
# recreate_quizQuestions()
# recreate_quizzes4Option()
# recreate_4OptionQuestions()
# del_session()
# up_session()
# add_session(data)
#--------------------
