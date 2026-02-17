import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";

const ProductShowcase = () => {
    const { allProducts } = useSelector((state) => state.products);

    // Get products for Luxury Collection (first 4 products)
    const luxuryProducts = allProducts && allProducts.length >= 4 ? allProducts.slice(0, 4) : [];

    // Get products for Modern Classics (next 5 products, or first 5 if not enough)
    const modernClassicsProducts = allProducts && allProducts.length >= 9
        ? allProducts.slice(4, 9)
        : allProducts && allProducts.length > 4
            ? allProducts.slice(4)
            : allProducts?.slice(0, 5) || [];

    // If no products available, don't render the component
    if (!allProducts || allProducts.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 py-12">
            {/* Luxury Collection Section */}
            {luxuryProducts.length > 0 && (
                <div className="w-11/12 mx-auto mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Luxury Collection</h2>
                        <Link to="/products" className="text-brand-teal hover:text-brand-teal-dark font-medium flex items-center gap-2">
                            View All <span>→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {luxuryProducts.map((product, index) => (
                            <ProductCard data={product} key={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Modern Classics Section */}
            {modernClassicsProducts.length > 0 && (
                <div className="w-11/12 mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Modern Classics</h2>
                        <Link to="/products" className="text-brand-teal hover:text-brand-teal-dark font-medium flex items-center gap-2">
                            View All <span>→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {modernClassicsProducts.map((product, index) => (
                            <ProductCard data={product} key={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductShowcase;
