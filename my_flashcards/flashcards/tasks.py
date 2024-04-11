from celery import shared_task

@shared_task()
def get_words_from_file(file):
    file_decoded = file.decode('utf-8')
    temp = []
    for index,i in enumerate(file_decoded.split('\n')):
        splitted_data = i.split('-')
        if len(splitted_data) == 2:
            front, back = map(str.strip, splitted_data)
        temp.append({"id": index, "front_side": front, "back_side":back})
    return temp
