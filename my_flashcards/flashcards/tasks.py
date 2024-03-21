from celery import shared_task

@shared_task()
def get_words_from_file(file):
    """A pointless Celery task to demonstrate usage."""
    file_content = file.read().decode('utf-8')  # Dekodowanie danych binarnych do UTF-8
    # Wyświetlenie zawartości pliku w konsoli
    print(file_content)
    return "Hello World!"
