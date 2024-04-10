import withAuth from "../context/withAuth.tsx";

const CreateComponent = () => {
    return (
        <div>
            <h1>Create Component</h1>
        </div>
    );
};

export default withAuth(CreateComponent);
