import React from "react";

const Pagination = ({ roomPerPage, totalRooms, currentPage, paginate }) => {

    const pageNumber = [];

    for(let i = 1; i <= Math.ceil(totalRooms / roomPerPage); i++){
        pageNumber.push(i);
    }

    return(
        <div className="pagination-nav">
            <ul className="pagination-ul">
                {pageNumber.map((number)=>(
                    <li key={number} className="pagination-li">
                        <button onClick={()=> paginate(number)} 
                        className={`pagination-button ${currentPage === number ? 'current-page' : ''}`}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default Pagination;
