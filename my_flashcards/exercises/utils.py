from wagtail.models import Page


#subpage_function
def get_all_subclasses(cls):
    subclasses = cls.__subclasses__()
    all_subclasses = []
    for subclass in subclasses:
        all_subclasses.append(subclass)
        all_subclasses.extend(get_all_subclasses(subclass))
    print("get_all_suybss", all_subclasses)
    return all_subclasses

def get_exercise_subpage_type():
    from my_flashcards.exercises.exercises_models import ExerciseBase
    subclasses = get_all_subclasses(ExerciseBase)
    return [
        f"{cls._meta.app_label}.{cls.__name__}"
        for cls in subclasses
        if issubclass(cls, Page) and not cls._meta.abstract
    ]

#audio
def audio_upload_path(instance, filename):
    return f"audio/{filename}"


#check users answers
def check_user_answers(user_answers, correct_answers):
    score = 0
    result_answers = []
    for answer in user_answers:
        if answer in correct_answers:
            answer['correct'] = True
            result_answers.append(answer)
            score += 1
        else:
            answer['correct'] = False
            result_answers.append(answer)
    max_score = len(correct_answers)
    return {"score": score, "max_score": max_score, "result_answers": result_answers}

def check_user_answers_another_option(user_answer_map, exercises):
    result_answers = []
    score = 0
    for block in exercises:
        values = block.value
        question_id = values['question_id']
        correct_answer = values["correct_answer"]
        user_answer = user_answer_map.get(question_id)

        result = {
            "person_label": question_id,
            "provided_answer": user_answer,
            "correct_answer": correct_answer
        }

        if user_answer == correct_answer:
            result["correct"] = True
            score += 1
        else:
            result["correct"] = False

        result_answers.append(result)

    return {
        "score": score,
        "max_score": len(result_answers),
        "result_answers": result_answers
    }

def add_plus_one_to_score_if_correct():
    pass
