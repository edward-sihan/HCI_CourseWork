import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <ClerkSignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    afterSignUpUrl="/"
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded",
                            card: "w-full",
                            rootBox: "w-full",
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default SignUp
