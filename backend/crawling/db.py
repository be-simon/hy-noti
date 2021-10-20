import sys
from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError
from error import panic


def truncate_db_all():
    PORTAL_MAX_DOCS = 50

    truncate_db('portal', PORTAL_MAX_DOCS)


def truncate_db(board, max_docs):
    client, collection = connect_db(board)
    n = collection.estimated_document_count()
    
    if n > max_docs:
        for docs in collection.find({}).sort('date', ASCENDING).limit(n - max_docs):
            _id = docs['_id']
            collection.delete_one({'_id':_id})
            
    client.close()
    
    
def connect_db(board):
    password = sys.argv[2]
    client = MongoClient('mongodb+srv://kdy20401:{}@cluster0.vcl3w.mongodb.net/hynoti?retryWrites=true&w=majority'.format(password))
    
    if board == 'portal':
        collection = client.notice.portal_notice
    elif board == 'cse':
        collection = client.notice.cse_notice
    
    collection.create_index('title', name='unique_title', unique=True)
    
    return client, collection
    
    
def insert_db(board, category, title, writer, date, content, files, driver=None):    
    client, collection = connect_db(board)
    fileLinks = str()
    
    # for example, fileLinks = 'a.pdf|b.pdf|c.hwp' or ''
    for name in files:
        if board == 'portal':
            fileLinks += 'https://hynotifile.s3.ap-northeast-2.amazonaws.com/portal/{}/{}|'.format(title, name)
        else:
            fileLinks += name + '|'
    fileLinks = fileLinks[:-1]
        
    # save a notice data to mongodb
    try:
        collection.insert_one({
            'category': category,
            'title': title,
            'writer': writer,
            'date': date,
            'content': str(content),
            'file': fileLinks
        })
    except DuplicateKeyError:
        # exception which is not an error
        print('the data has already been saved! stop crawling..')
        client.close()
        if driver is not None:
            driver.quit()
        raise DuplicateKeyError('duplicate document')
    except:
        client.close()
        panic('db', 'insert_db', driver)
    
    client.close()
