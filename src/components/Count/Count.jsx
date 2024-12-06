/* eslint-disable react/prop-types */
// UserCount.jsx
const Count = ({ count, title }) => {
    return (
        <div className="text-lg">
            {title}: {count}
        </div>
    );
};

export default Count;