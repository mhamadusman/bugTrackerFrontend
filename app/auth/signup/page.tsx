import Signup from "@/public/src/components/signup/signup";
import { LoadingIndicator } from "@/public/src/components/loadingIndicator/loadingIndicator";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <main>
            
            <Suspense fallback={<LoadingIndicator />}>
                <Signup />
            </Suspense>
        </main>
    );
}