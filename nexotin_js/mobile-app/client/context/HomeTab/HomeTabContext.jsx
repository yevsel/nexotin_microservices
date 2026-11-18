import { createContext } from "react";


export const HomeTabContext = createContext()

export function HomeTabContextProvider({children}){



    return(
        <HomeTabContext.Provider value={{tabName:"Home"}}>
            {children}
        </HomeTabContext.Provider>
    )
}