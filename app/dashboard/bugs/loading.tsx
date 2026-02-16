import { LoadingIndicator } from "@/public/src/components/loadingIndicator/loadingIndicator"
export default function loading() {
    return (
        <>
        <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
        </div>

        </>
    )
}