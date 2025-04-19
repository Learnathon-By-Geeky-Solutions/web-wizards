import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../store/api/authApi";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Get token from query parameter
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    
    // Use the RTK Query mutation hook
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await resetPassword({
                token: token,
                password: password
            }).unwrap();
            
            setMessage("Password reset successful! Redirecting...");
            setTimeout(() => navigate("/login"), 3000); // Redirect to login page
        } catch (error) {
            setMessage(error.data?.error || error.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
                {!token && (
                    <div className="text-red-500 text-center mb-4">
                        Invalid reset link. Please request a new password reset link.
                    </div>
                )}
                {token && (
                    <>
                        <p className={`text-center mb-4 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>{message}</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label className="block mb-2">New Password:</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="form-group">
                                <label className="block mb-2">Confirm Password:</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={`w-full p-2 text-white rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`} 
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}
                <div className="mt-4 text-center">
                    <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;