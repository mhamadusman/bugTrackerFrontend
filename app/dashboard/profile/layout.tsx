import Navbar from "@/public/src/components/navbar/navbar"

interface LayoutProps {
    children: React.ReactNode
}
export default function layout({ children }: LayoutProps) {
    return (
        <>
            <div>
                <Navbar/>
                {children}

            </div>
        </>
    )
}