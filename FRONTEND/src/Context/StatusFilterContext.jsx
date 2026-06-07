import React, { createContext, useContext, useState } from 'react'

const FilterContext = createContext();

// eslint-disable-next-line react/prop-types
export function StatusFilterContext({ children }) {
    const [filter, setFilter] = useState("all");

    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    )
}


// eslint-disable-next-line react-refresh/only-export-components
export function useUrlFilter() {
    return useContext(FilterContext);
}

