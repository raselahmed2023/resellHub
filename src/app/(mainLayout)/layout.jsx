import Footer from "@/components/Footer";
import AppNavbar from "@/components/Navbar";


export default function RootLayout({ children }) {
    return (
        <div>
            <AppNavbar />
            <div>{children}</div>
            
            <Footer></Footer>
        </div>
    );
}
