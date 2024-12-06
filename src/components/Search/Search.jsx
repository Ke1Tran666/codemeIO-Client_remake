import { Search } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const InputSearch = ({ searchTerm, onSearch, placeholder }) => {
    return (
        <div className="relative w-64 mr-4">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
    );
};

export default InputSearch;