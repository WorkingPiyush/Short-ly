// eslint-disable-next-line react/prop-types
function Card({ children }) {
    return (
        <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-8 mb-8">
            {children}
        </div>
    );
}
export default Card;