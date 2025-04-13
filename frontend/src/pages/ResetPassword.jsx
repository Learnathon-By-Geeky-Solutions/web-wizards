import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { uidb64, token } = useParams(); // Get uidb64 and token from URL
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uidb64: uidb64,
                    token: token,
                    new_password: password,
                    confirm_password: confirmPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong!");
            }

            const data = await response.json();
            setLoading(false);
            setMessage("Password reset successful! Redirecting...");
            setTimeout(() => navigate("/login"), 3000); // Redirect to login page
        } catch (error) {
            setLoading(false);
            setMessage(error.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
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
                        className={`w-full p-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`} 
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;