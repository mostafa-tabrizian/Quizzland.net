from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
import datetime, time
from config import DATABASE_URL
from models import *

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)
s = session()

def recreate_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

# recreate_db()


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

# del_session()

def up_session():
    try:
        sessionToUpdate = s.query(Quizzes).filter(Quizzes.id == 2).first()
        sessionToUpdate.view = 7
        s.add(sessionToUpdate)
        s.commit()
    except Exception:
        s.rollback()
        raise 
    finally:
        s.close()

# up_session()

data = Quizzes(
    title_far = 'چشم های',
    title_eng = 'taylor swift',
    img = '/static/img/TRASH-taylor.jpg',
    href = 'quiz/gaming/the-witcher-3-اولین-کویز',
    views = 0,
    publish = datetime.datetime.now(),
    time = time.time()
)

# add_session(data)