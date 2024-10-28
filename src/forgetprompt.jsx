import { Link } from "react-router-dom";

const ForgetPrompt = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Reset your password</h1>
      <p className="text-lg text-gray-700 max-w-md mb-8 shadow-lg p-4 rounded-lg">
        You will receive an email with instructions on how to reset your password
        in a few minutes.
      </p>
      <Link 
        to="/" 
        className="text-blue-500 hover:text-blue-700 underline transition"
      >
        Back to login
      </Link>
    </div>
  );
};

export default ForgetPrompt;
