import { GrServers } from "react-icons/gr";
import { TbAppWindow } from "react-icons/tb";

const DropDownServer = ({label, value, name, onChange, placeholder, options, type }) => {
  return (           
    <div>
        <div className="inputTitleContainer">
            {type ? <GrServers size={18} /> : <TbAppWindow size={18}/>}            
            <p className="labelStyle">{label}</p>
        </div>

        <select name={name} value={value} onChange={onChange} className="selectConintaner">
            {placeholder && <option value="" >{placeholder}</option>}
            {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
            ))}
        </select>
    </div>
  )
};

export default DropDownServer;