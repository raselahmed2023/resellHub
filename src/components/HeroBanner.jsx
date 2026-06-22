import Link from "next/link";

const STATS = [
    { value: "1.2M+", label: "TOTAL PRODUCTS" },
    { value: "850K+", label: "VERIFIED SELLERS" },
    { value: "2.5M+", label: "ACTIVE BUYERS" },
];


export default function HeroBanner() {
    return (
        <section className="w-full bg-gradient-to-b from-slate-50 via-blue-50/30 to-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-7">

                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span> Certified Circular Marketplace
                </span>


                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Shop Sustainably,{" "}
                    <span className="text-emerald-600">Sell Intelligently.</span>
                </h1>

                <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl">
                    Join over 2 million eco-conscious traders in the world's most secure peer-to-peer
                    marketplace. Give{" "}
                    <span className="text-gray-700 font-medium">high-quality items</span>{" "}
                    a second life.
                </p>


                <div className="flex flex-col sm:flex-row items-center gap-4 mt-1">
                    <Link
                        href="/products"
                        className="w-44 text-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors shadow-sm text-sm">
                        Browse Products
                    </Link>
                    <Link
                        href="/register"
                        className="w-44 text-center border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold py-3.5 px-8 rounded-lg transition-colors text-sm">
                        Start Selling
                    </Link>
                </div>

                <div className="w-full max-w-2xl h-px bg-gray-200 mt-4" />

                <div className="w-full max-w-2xl grid grid-cols-3 gap-4">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <span className="text-emerald-600 font-bold text-lg sm:text-xl">
                                {value}
                            </span>
                            <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}