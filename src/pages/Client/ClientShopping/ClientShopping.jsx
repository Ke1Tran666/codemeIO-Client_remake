import { useState, useEffect } from 'react';
import { Trash2, Star, Search } from 'lucide-react';

const initialItems = [
    { id: 1, title: "Complete React Developer in 2023", instructor: "Andrei Neagoie", price: 84.99, rating: 4.7, totalRatings: 49283 },
    { id: 2, title: "Modern JavaScript From The Beginning", instructor: "Brad Traversy", price: 94.99, rating: 4.8, totalRatings: 32155 },
    { id: 3, title: "The Complete 2023 Web Development Bootcamp", instructor: "Dr. Angela Yu", price: 84.99, rating: 4.9, totalRatings: 78234 },
    { id: 4, title: "Complete React Developer in 2023", instructor: "Andrei Neagoie", price: 84.99, rating: 4.7, totalRatings: 49283 },
    { id: 5, title: "Modern JavaScript From The Beginning", instructor: "Brad Traversy", price: 94.99, rating: 4.8, totalRatings: 32155 },
    { id: 6, title: "The Complete 2023 Web Development Bootcamp", instructor: "Dr. Angela Yu", price: 84.99, rating: 4.9, totalRatings: 78234 },
];

const ClientShopping = () => {
    const [cartItems, setCartItems] = useState(initialItems);
    const [selectedItems, setSelectedItems] = useState(new Set(initialItems.map(item => item.id)));
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState(cartItems);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const toggleItemSelection = (id) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleAllItems = () => {
        if (selectedItems.size === filteredCourses.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredCourses.map(item => item.id)));
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        let filtered;
        if (!term) {
            filtered = cartItems;
        } else {
            filtered = cartItems.filter(course =>
                course.title.toLowerCase().includes(term.toLowerCase()) ||
                course.instructor.toLowerCase().includes(term.toLowerCase())
            );
        }
        setFilteredCourses(filtered);
        setSelectedItems(new Set(filtered.map(item => item.id)));
    };

    useEffect(() => {
        setFilteredCourses(cartItems);
    }, [cartItems]);

    const subtotal = filteredCourses
        .filter(item => selectedItems.has(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">{filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} in Cart</h2>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={selectedItems.size === filteredCourses.length && filteredCourses.length > 0}
                                    onChange={toggleAllItems}
                                />
                                <span className="ml-2 text-sm text-gray-700">Select All</span>
                            </label>
                        </div>
                        {filteredCourses.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-200 py-4">
                                <div className="sm:w-1/12 flex items-center justify-center mb-4 sm:mb-0">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                        checked={selectedItems.has(item.id)}
                                        onChange={() => toggleItemSelection(item.id)}
                                    />
                                </div>
                                <div className="sm:w-1/4 mb-4 sm:mb-0">
                                    <img src={`https://via.placeholder.com/240x135?text=Course+${item.id}`} alt={item.title} className="w-full rounded-lg" />
                                </div>
                                <div className="sm:w-8/12 sm:pl-4">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">By {item.instructor}</p>
                                    <div className="flex items-center mb-2">
                                        <span className="text-yellow-500 mr-1">{item.rating.toFixed(1)}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500 ml-1">({item.totalRatings.toLocaleString()})</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <button onClick={() => removeItem(item.id)} className="text-sm text-red-600 hover:text-red-800 flex items-center">
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove
                                        </button>
                                        <div className="text-right">
                                            <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:w-1/3">
                    <div className="bg-white rounded-lg shadow-md sticky top-4">
                        <div className="p-3 border-b">
                            <div className="relative w-full hidden md:block">
                                <div className="relative w-full group flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9ea7] w-4 h-4 pointer-events-none transition-colors group-focus-within:text-[#0d0c22]" />
                                    <input
                                        type="text"
                                        id="search"
                                        className="w-full h-10 px-4 pl-10 rounded-lg bg-white text-[#0d0c22] placeholder-[#9e9ea7] transition duration-300 ease-in-out border-2 border-transparent focus:outline-none focus:border-[rgba(44,143,255,0.4)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,143,255,0.1)] hover:border-[rgba(44,143,255,0.4)] hover:bg-white"
                                        placeholder="Search courses"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Total:</h2>
                            <div className="flex justify-between mb-4 text-xl font-bold">
                                <span>Total:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                                Checkout
                            </button>
                            <p className="text-xs text-center mt-4 text-gray-500">
                                30-Day Money-Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientShopping;