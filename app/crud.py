from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
import datetime, time
from config import DATABASE_URL
from models import *

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)
s = session()

def recreate_documents():
    Base0.metadata.drop_all(engine)
    Base0.metadata.create_all(engine)

def recreate_quizzes():
    Base1.metadata.drop_all(engine)
    Base1.metadata.create_all(engine)

def recreate_categories():
    Base2.metadata.drop_all(engine)
    Base2.metadata.create_all(engine)

def recreate_newsletterUrl():
    Base3.metadata.drop_all(engine)
    Base3.metadata.create_all(engine)

def recreate_quizQuestions():
    Base4.metadata.drop_all(engine)
    Base4.metadata.create_all(engine)



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

data = Documents(
    title = 'title',
    note = 'note'
)

data = Quizzes(
    title_far = 'بازی ذ ویتچر',
    title_eng = 'The Witcher',
    img = 'TRASH1.jpg',
    href = '/quiz/gaming/the-witcher/بازی-ذ-ویتچر',
    fan_name = '',
    views = 0,
    publish = datetime.datetime.now(),
)

# data = Categories(
#     title_far = 'ذ ویتچر',
#     title_eng = 'The Witcher',
#     img = 'TRASH-theWitcher.jpg',
#     href = '/category/gamings/the-witcher', # celebrities, gaming, movie&series, physiologies
#     category = 'celebrities', # celebrities, gaming, movie&series, physiologies
#     views = 0,
#     publish = datetime.datetime.now(),
#     time = time.time()
# )

# data = quizQuestions(
#     title_eng = 'most complete taylor swift quiz',
#     title_far = 'کامل-ترین-کویز-تیلور-سویفت',
#     type = 'oneCorrect', # 4option / oneCorrect / lowHigh
#     question = 'اسم وسط تیلور',
#     option_1 = 'جنیفر',
#     option_2 = 'الیسون',
#     option_3 = 'تنیس',
#     option_4 = 'امبرلا',
#     answer = 3,
#     category = 'celebrities', # celebrities, gaming, movie&series, physiologies
#     innerCategory = 'Taylor Swift',
#     publish = datetime.datetime.now(),
# )

#--------------------
# recreate_documents()
# recreate_quizzes()
# recreate_categories()
# recreate_newsletterUrl()
# recreate_quizQuestions()
# del_session()
# up_session()
# add_session(data)
#--------------------
