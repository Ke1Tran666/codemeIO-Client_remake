import PropTypes from 'prop-types';

const TableHeader = ({ headers }) => {
    return (
        <thead>
            <tr className="bg-gray-100">
                {headers.map((header, index) => (
                    <th key={index} className="py-2 px-4 border-b text-left w-1/4">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

// Kiểm tra kiểu dữ liệu của props
TableHeader.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired, // headers phải là một mảng các chuỗi
};

export default TableHeader;