import datetime

TYPE_OF_LEARN = [
    ('LEARN', 'LEARN'),
    ('BROWSE', 'BROWSE'),
    ('BROWSE_AND_LEARN', 'BROWSE_AND_LEARN'),
]


POSSIBLE_RESULTS = [
    {1: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 1}, "HARD": {"time": datetime.timedelta(minutes=10), "correct": False, "next_level": 1}, "MEDIUM": {"time": datetime.timedelta(days=1), "correct": True, "next_level": 2}, "EASY": {"time": datetime.timedelta(days=3), "correct": True, "next_level": 2}}},
    {2: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 1}, "HARD": {"time": datetime.timedelta(minutes=10), "correct": False , "next_level": 2}, "MEDIUM": {"time": datetime.timedelta(days=2), "correct": True, "next_level": 3}, "EASY": {"time": datetime.timedelta(days=6), "correct": True, "next_level": 3}}},
    {3: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 2}, "HARD": {"time": datetime.timedelta(days=1), "correct": True , "next_level": 3}, "MEDIUM": {"time": datetime.timedelta(days=3), "correct": True, "next_level": 4}, "EASY": {"time": datetime.timedelta(days=9), "correct": True, "next_level": 4}}},
    {4: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 3}, "HARD": {"time": datetime.timedelta(days=2), "correct": True, "next_level": 4}, "MEDIUM": {"time": datetime.timedelta(days=4), "correct": True, "next_level": 5}, "EASY": {"time": datetime.timedelta(days=18), "correct": True, "next_level": 5}}},
    {5: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 4}, "HARD": {"time": datetime.timedelta(days=2), "correct": True, "next_level": 5}, "MEDIUM": {"time": datetime.timedelta(days=5), "correct": True, "next_level": 6}, "EASY": {"time": datetime.timedelta(days=36), "correct": True, "next_level": 6}}},
    {6: {"AGAIN": {"time": datetime.timedelta(minutes=1), "correct": False, "next_level": 5}, "HARD": {"time": datetime.timedelta(days=2), "correct": True , "next_level": 6}, "MEDIUM": {"time": datetime.timedelta(days=6), "correct": True, "next_level": 6}, "EASY": {"time": datetime.timedelta(days=72), "correct": True, "next_level": 6}}},
]
