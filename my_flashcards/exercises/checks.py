class MatchExercisesCheck:
    @staticmethod
    def check_pair_exercises(pairs):
        print("pairs", pairs)
        correct_answers = []
        for block in pairs:
            if block.block_type != 'pair':
                continue
            for pair in block.value:
                left = pair.get('left_item')
                right = pair.get('right_item')
                if left is None or right is None:
                    continue
                correct_answers.append({
                    'left_item': left,
                    'right_item': right
                })
        return correct_answers
