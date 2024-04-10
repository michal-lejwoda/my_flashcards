import withAuth from "../context/withAuth.tsx";

const Account = () => {
    return (
        <div>
            <h1>Account</h1>
        </div>
    );
};

export default withAuth(Account);
