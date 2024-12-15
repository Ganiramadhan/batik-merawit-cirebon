import { Link } from '@inertiajs/react';
import btmcLogo from '../../images/BTMC.png';
import igiLogo from '../../images/IGI.png';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="flex flex-row items-center space-x-4">
                <Link href="/">
                    <img src={igiLogo} alt="IGI Logo" className="w-32 h-auto" />
                </Link>
                <Link href="/">
                    <img src={btmcLogo} alt="BTMC Logo" className="w-32 h-auto" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
