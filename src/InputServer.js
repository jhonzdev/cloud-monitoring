import { LuShieldCheck } from "react-icons/lu";
import { IoEarth } from "react-icons/io5";

const InputServer = ({ label, type, placeholder, value, onChange, inputDetails, iconType }) => {
  return (
    <div className="inputContainer">
        <div className="inputTitleContainer">
            {iconType ? <LuShieldCheck size={18} /> : <IoEarth size={18} />}
            <p className="labelStyle">{label}</p>
        </div>
        
        <input
            type={type}
            className="inputStyle"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <p className="detailStyle">{inputDetails}</p>
    </div>
  );
};

export default InputServer;