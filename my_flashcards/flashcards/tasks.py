from celery import shared_task

@shared_task()
def get_words_from_file(file):
    file_decoded = file.decode('utf-8')
    temp = []
    for i in file_decoded.split('\n'):
        splitted_data = i.split('-')
        if len(splitted_data) == 2:
            front, back = map(str.strip, splitted_data)
        temp.append([front, back])
    return temp
