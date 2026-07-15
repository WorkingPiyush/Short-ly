import { ThreeDot } from 'react-loading-indicators'

function FullScreenLoader() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <ThreeDot color={["#205788", "#2a72b1", "#3d8cd1", "#66a4db"]} />
        </div>
    )
}

export default FullScreenLoader;
