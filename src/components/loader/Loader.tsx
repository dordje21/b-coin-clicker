// src/components/Loader.js
import logo from '../../assets/logo.jpeg'
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader-container relative w-screen h-screen bg-black">
      <div className="loader">
      </div>
      <img src={logo} className="w-[50px] h-[50px] absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]" />
    </div>
  );
};

export default Loader;
