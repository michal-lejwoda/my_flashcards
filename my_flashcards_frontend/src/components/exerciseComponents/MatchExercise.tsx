import {MatchExerciseProps} from "../../interfaces.tsx";

const MatchExercise = ({exercise}: MatchExerciseProps) => {
    console.log("exercise", exercise)
    return (
        <div>
            <h1>Match Exercise</h1>
        </div>
    );
};

export default MatchExercise;
