import { useState, useEffect } from 'react';
import Header from '@/Components/Header';
import WelcomeFooter from '@/Components/WelcomeFooter';
import About from '@/Components/About';
import Product from '@/Components/Product';
import Contact from '@/Components/Contact';
import Hero from '@/Components/Hero';

export default function Welcome({ totalBatik, totalMember, user }) {  
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("home");

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setIsMenuOpen(false); 
    };

    useEffect(() => {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveMenu(entry.target.id); 
                }
            });
        }, { threshold: 0.5 });

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Component */}
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                activeMenu={activeMenu}
                handleMenuClick={handleMenuClick}
                user={user}  // Pass user prop
            />

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero and Info Section */}
                <Hero totalBatik={totalBatik} totalMember={totalMember} />

                {/* About Section */}
                <About />
                
                {/* Product Section */}
                <Product />

                {/* Contact Section */}
                <Contact />

                {/* Footer Component */}
                {/* <WelcomeFooter /> */}
            </main>
        </div>
    );
}
