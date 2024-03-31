import datetime

TYPE_OF_LEARN = [
    ('LEARN', 'LEARN'),
    ('BROWSE', 'BROWSE'),
    ('BROWSE_AND_LEARN', 'BROWSE_AND_LEARN'),
]


POSSIBLE_RESULTS = [
    {"1": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(minutes=10), "correct": False}, "MEDIUM": {"time": datetime.timedelta(days=1), "correct": True}, "EASY": {"time": datetime.timedelta(days=3), "correct": True}}},
    {"2": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(minutes=10), "correct": False}, "MEDIUM": {"time": datetime.timedelta(days=2), "correct": True}, "EASY": {"time": datetime.timedelta(days=6), "correct": True}}},
    {"3": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(days=1), "correct": True}, "MEDIUM": {"time": datetime.timedelta(days=3), "correct": True}, "EASY": {"time": datetime.timedelta(days=9), "correct": True}}},
    {"4": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(days=2), "correct": True}, "MEDIUM": {"time": datetime.timedelta(days=4), "correct": True}, "EASY": {"time": datetime.timedelta(days=18), "correct": True}}},
    {"5": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(days=2), "correct": True}, "MEDIUM": {"time": datetime.timedelta(days=5), "correct": True}, "EASY": {"time": datetime.timedelta(days=36), "correct": True}}},
    {"6": {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False}, "HARD": {"time": datetime.timedelta(days=2), "correct": True}, "MEDIUM": {"time": datetime.timedelta(days=6), "correct": True}, "EASY": {"time": datetime.timedelta(days=72), "correct": True}}},
]
