// eslint-disable-next-line react/prop-types
function Card({ children }) {
    return (
        <div className="dark:bg-[#0B0F19] dark:text-white bg-white text-black dark:border-gray-800  border border-gray-800 rounded-3xl p-8 mb-8">
            {children}
        </div>
    );
}
export default Card;