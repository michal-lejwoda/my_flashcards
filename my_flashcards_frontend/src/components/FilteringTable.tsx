import {Dispatch} from "react";

const GlobalFilter = (filter: string, setFilter: Dispatch<string>) => {
    return (
        <div>
            Search: {' '}
            <input value={filter || ''} onChange={(e)=>{setFilter(e.target.value)}}/>
        </div>
    );
};

export default GlobalFilter;
