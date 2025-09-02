import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import './App.css';

const ServerLink = ({ 
  serverName = "", 
  serverHref = "",
  serverStatus = null
}) => {

  return (
    <div>
      <a href={serverHref} className="linkStyle" target="_blank" rel="noopener noreferrer">
          
        <div  className="linkContainer">
            {
            serverStatus 
            // statuses[serverId]?.isOnline
                ? <FaCircleCheck size={18} className="iconStyleOnline" />
                : <FaCircleXmark size={18} className="iconStyleOffline" />
            }
            <p style={{ fontSize: "16", paddingBottom: "3px", overflow: "hidden", maxWidth: "126px" }}>{serverName}</p>
        </div>
      </a>
    </div>
  )
};

export default ServerLink;