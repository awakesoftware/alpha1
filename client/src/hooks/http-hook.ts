//? Handles data/json parsing, response & status code checking, state management logic
    //? 1 fn sends a request, automatically updates all state behind scenes

import React, { useState, useCallback, useRef, useEffect } from 'react';

export function useHttpClient() {
    //* manage loading & error state
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState();

    //? useRef - store data across render cycles; does not change/reinitialize when fn runs again
    const activeHttpRequests = useRef([]);

    //* url, method (GET is default), req data, headers
    //? useCallback - avoid infinite loops; fn never gets recreated when component using this hook rerenders
    const sendRequest = useCallback( async ( url, method = 'GET', body = null, headers = {  } ) => {
        setIsLoading(true);

        //! never continue with a req that is on its way out, if switch from component that triggers req
        //* doesnt change UI; just behind scenes operations
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch( url, {
                method,
                body,
                headers,
                //? link httpAbortCtrl to request; can use this abort controller to cancel connected req
                signal: httpAbortCtrl.signal
            });
    
            const responseData = await response.json();

            /*  keep every ctrl except for ctrl used in current req
                * remove abortCtrl from array if req completes
                * once we have res, we know the req completed
                * filter out this specific ctrl that was responsable for this specific req
                * remove req ctrl that used for this req
            */
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

    
            if(!response.ok) {
              throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
            
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            throw error;
        }

    }, []);

    const clearError = () => {
        setError(null);
    }

    //* cleanup logic when component unmounts
    useEffect(() => {
        // cleanup fn when you return in useEffect
        return () => {
            // linked req will be aborted
            activeHttpRequests.current.forEach( abortCtrl => abortCtrl.abort() );
        }
    }, []);

    return { isLoading, error, sendRequest, clearError };
}
