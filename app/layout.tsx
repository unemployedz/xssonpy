import type { Metadata } from "next";
export const metadata: Metadata={title:"XSSonPy — Web Security Scanner",description:"Safe, non-destructive web security checks."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}