from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
import datetime, time
from config import DATABASE_URL
from models import *

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)
s = session()

def recreate_quizzes():
    Base1.metadata.drop_all(engine)
    Base1.metadata.create_all(engine)

def recreate_categories():
    Base2.metadata.drop_all(engine)
    Base2.metadata.create_all(engine)

def recreate_newsletterUrl():
    Base3.metadata.drop_all(engine)
    Base3.metadata.create_all(engine)



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
        # sessionToUpdate = s.query(Quizzes).filter(Quizzes.id == 2).first()
        sessionToUpdate = s.query(Categories).filter(Categories.id == 6).first()
        # sessionToUpdate.view = 7
        # sessionToUpdate.img = 'TRASH-jennifer.jpg'
        sessionToUpdate.category = 'gamings'
        s.add(sessionToUpdate)
        s.commit()
    except Exception:
        s.rollback()
        raise 
    finally:
        s.close()

# data = Quizzes(
#     title_far = 'کامل ترین کویز تیلور سویفت',
#     title_eng = 'ُTaylor Swift',
#     href = '/quiz/celebrities/taylor-swift/کامل-ترین-کویز-تیلور-سویفت',
#     # href = '/quiz/celebrities/taylor-swift/',
#     views = 0,
#     publish = datetime.datetime.now(),
#     time = time.time()
# )

# data = Categories(
#     title_far = 'ذ ویتچر',
#     title_eng = 'The Witcher',
#     img = 'TRASH-theWitcher.jpg',
#     href = '/category/gamings/the-witcher', # celebrities, gamings, movie&series, physiologies
#     category = 'celebrities', # celebrities, gamings, movie&series, physiologies
#     views = 0,
#     publish = datetime.datetime.now(),
#     time = time.time()
# )

#--------------------
# recreate_quizzes()
# recreate_categories()
# recreate_newsletterUrl()
# del_session()
# up_session()
# add_session(data)
#--------------------
