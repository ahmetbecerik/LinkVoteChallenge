import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {useState} from "react";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";

function idMaker() { //linklerimize id atamak için idmaker ekledim
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function Adding() {

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    function addLink() {
        if (!name || !url) { //name veya url satırı boşsa basmamasını sağladık
            return
        }

        let record = {
            name: name,
            url: url,
            vote: 0,
            date: Date.now()
        }
        localStorage.setItem(idMaker(), JSON.stringify(record));
        toast.success(name + " added.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (<div className="adding-area">

            <div className="full-width sub-content">
                <div className="return-list">
                    <Link to="/">
                    <FontAwesomeIcon icon={faArrowLeft}/>
                        Return to list
                    </Link>
                </div>
                <div className="margin-bottom-20 add-new-link">
                    Add New Link
                </div>
                <div className="margin-bottom-20 links">
                    <label className="full-width">
                        <div>Link Name:</div>
                        <input onChange={(e) => setName(e.target.value)} className="full-width" type="text"
                               name="name"/>
                    </label>
                </div>
                <div className="margin-bottom-20 links">
                    <label className="full-width">
                        <div>Link URL:</div>
                        <input onChange={(e) => setUrl(e.target.value)} className="full-width" type="text" name="name"/>
                    </label>
                </div>
                <button className="submit-button" onClick={addLink}>
                    ADD
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default Adding;