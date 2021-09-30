import {
    faArrowDown,
    faArrowUp,
    faChevronLeft,
    faChevronRight,
    faMinusCircle,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {Confirm} from "semantic-ui-react";
import {toast, ToastContainer} from "react-toastify";
import _ from "underscore"

function Listing() {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [sortValue, setSortValue] = useState("");
    const [activePage, setActivePage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    let sortedList = []
    let chunkedList;

    function generateList() {

        for (let r in Object.entries(localStorage)) {

            let newObj = JSON.parse(Object.entries(localStorage)[r][1])

            newObj.id = Object.entries(localStorage)[r][0]

            sortedList.push(newObj)
        }

        if (sortedList.length === 0) {
            return null
        }

        if (sortValue === "less") {
            sortedList = _(sortedList).chain().sortBy(function (item) {
                return item.date;
            }).reverse().sortBy(function (item) {
                return item.vote;
            }).value();
        }
        else if (sortValue === "most") {

            sortedList = _(sortedList).chain().sortBy(function (item) {
                return item.date;
            }).sortBy(function (item) {
                return item.vote;
            }).value().reverse();
        }
        else {
            sortedList = _.sortBy(sortedList, "date").reverse()
        }
        chunkedList = _.chunk(sortedList, 5)
        setMaxPage(chunkedList.length - 1)

        setPagination(chunkedList.map((element, index) => {
            return (<div style={{border: index === activePage ? '1px solid' : ''}} className="page-index" key={index}
                         onClick={() => {
                             setActivePage(index)
                         }}>{index + 1}</div>)
        }))

        return chunkedList[activePage].map((record) => {

            return (<div key={record.id} className="voting-area">
                <div className="points-area">
                    <span className="points">{record.vote}</span>
                    <span className="points-text">POINTS</span>
                </div>
                <div>
                    <div className="link-names">{record.name}</div>
                    <div className="link-urls">({record.url})</div>
                    <div className="up-down-vote">
                        <div onClick={() => {
                            let rec = JSON.parse(localStorage.getItem(record.id))
                            rec.vote = parseInt(rec.vote) + 1
                            rec.date = Date.now()

                            localStorage.setItem(record.id, JSON.stringify(rec))
                            setRefresh(!refresh)
                        }} className="vote-action-up">
                            <FontAwesomeIcon icon={faArrowUp}/>
                            Up vote
                        </div>
                        <div onClick={() => {
                            let rec = JSON.parse(localStorage.getItem(record.id))

                            if (rec.vote > 0) {
                                rec.vote = parseInt(rec.vote) - 1
                                rec.date = Date.now()

                                localStorage.setItem(record.id, JSON.stringify(rec))
                                setRefresh(!refresh)
                            }

                        }} className="vote-action-down">
                            <FontAwesomeIcon icon={faArrowDown}/>
                            Down vote
                        </div>
                    </div>
                </div>

                <span onClick={() => {

                    setOpenModal(true)
                    setActiveRecord(record)
                }
                }> <FontAwesomeIcon className="red" icon={faMinusCircle}/></span>
            </div>)
        });
    }

    useEffect(() => {

        setRecords(generateList())
    }, [refresh, sortValue, activePage])

    return (<div>
        <div className="submit-link-area">
            <Link to="/adding">
                <div className="submit-plus">
                    <FontAwesomeIcon icon={faPlus}/>
                </div>
            </Link>
            <div className="submit-link-text">
                SUBMIT A LINK
            </div>
        </div>
        <div className="submit-border">
            <select onChange={(event) => {
                setSortValue(event.target.value)
                setActivePage(0)
            }} className="order" name="Order by" id="links">
                <option value="">Order by</option>
                <option value="most">Most Voted</option>
                <option value="less">Less Voted</option>
            </select>
        </div>
        {records}
        <div className="pagination">
            <span onClick={() => {
                if (activePage > 0) {
                    setActivePage(activePage - 1)
                }
            }}><FontAwesomeIcon className="chevron-left"
                                icon={faChevronLeft}/></span>
            {pagination}
            <span onClick={() => {
                if (activePage < maxPage) {
                    setActivePage(activePage + 1)
                }
            }}><FontAwesomeIcon className="chevron-right" icon={faChevronRight}/></span>
        </div>
        <Confirm
            open={openModal}
            header='Remove Link'
            content={'Do you want to remove: ' + activeRecord.name}
            onCancel={() => {
                setOpenModal(false)
            }}
            onConfirm={() => {
                setOpenModal(false)
                setRefresh(!refresh)
                localStorage.removeItem(activeRecord.id)
                setActivePage(0)
                toast.success(activeRecord.name + " removed.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }}
        />
        <ToastContainer/>
    </div>)
}

export default Listing