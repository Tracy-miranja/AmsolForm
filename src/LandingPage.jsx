import chair from "./assets/hiring.png"
import Navbar from "./navbar";

const LandingPage=()=>{
    return(
        <div>
            <Navbar />
    <div className="h-[100vh] bg-gradient-to-r from-[#25b2e6] to-[#0922e3] flex flex-col items-center justify-center relative overflow-hidden">
{/* Welcome Section */}
<div className="text-center flex flex-col items-center justify-center space-y-4 z-10">
  <h1 className="text-5xl font-bold text-white mb-6">Welcome to AMSOL career page</h1>
  <p className="text-lg text-gray-100 max-w-md mb-6">Sign Up and Apply for your dream job today! Discover opportunities, submit your application, and take the next step in your career journey</p>
  <button className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition shadow-lg">
    Get Started
  </button>
</div>

{/* Decorative White Circle and Image */}
<div className="flex justify-center items-center space-x-8  z-10">
  
  <div>
    <img src={chair} alt="Decorative chair" className="h-[350px] object-cover -ml-10" />
  </div>
</div>

{/* Mountain-like Shape */}
<div className="absolute inset-x-0 bottom-0">
  <svg viewBox="0 0 1440 320" className="w-full h-full">
    <path fill="#fff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,213.3C672,235,768,277,864,282.7C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"></path>
  </svg>
</div>
</div>
</div>
    )

}

export default LandingPage;