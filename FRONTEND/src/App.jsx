import { Toaster } from 'react-hot-toast';
import './App.css'
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <>
      <div className="min-h-screen bg-white text-white dark:bg-black dark:text-white">
        <AppRoutes />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  )
}

export default App
