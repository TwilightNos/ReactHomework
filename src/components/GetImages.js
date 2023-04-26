import React, {useEffect, useState} from 'react';

const GetImages = () => {
    // initial data get from the url
    const [data,setData] = useState([]);
    // the data after filter, show on the page
    const [filteredData,setFilteredData] = useState([]);
    // status variable to indicate whether the page is loading
    const [isLoading, setIsLoading] = useState(true);
    // status variable to indicate whether there is error in the page
    const [error,setError] = useState(null);
    // the delay time sent to the url
    const [time,setTime] = useState(2.7);
    // the delay time between send request and receive response
    const [delay,setDelay] = useState(0);
    // the filters for id and name
    const [idFilter,setIdFilter] = useState('');
    const [nameFilter,setNameFilter] = useState('');

    // after time state is refreshed, call useEffect function to re-render the page
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                // set isLoading to true to indicate that the page is loading
                setIsLoading(true);
                // timeout promise to check whether the request time is longer than 3 seconds
                const timeout = new Promise((r,reject)=>{
                    setTimeout(()=>reject(new Error('time out')),3000)
                });
                // begin timer
                const beginTime = Date.now();
                // get the response and check whether exceed the limit time
                const response = await Promise.race([fetch(`https://reqres.in/api/users?delay=${time}`),
                    timeout,
                ]);
                // end timer
                const endTime = Date.now();
                // calculate the delay time
                setDelay((endTime-beginTime)/1000);
                // if the response status code is not ok, there must be an error
                if(!response.ok){
                    throw new Error('request error',`${response.status}`);
                }
                // wait for response transform to json
                const data = await response.json();
                // set state with data
                setData(data.data);
                setFilteredData(data.data);
                // loading process finished, set state to be false
                setIsLoading(false);
            }catch (error){
                // if there is error, set error message and end loading
                setError(error.message);
                setIsLoading(false);
            }
        };
        // call the function
        fetchData();
    },[time]);
    // set the delay time to 5
    const setDelayTo5 = ()=>{
        setTime(5);
    }

    // action of the form, to set the filters
    const submitForm = (e) =>{
        // prevent default actions to refresh the page
        e.preventDefault();
        // set the filteredData according to the filters
        if(nameFilter){
            setFilteredData(data.filter(item=>(
                `${item.first_name} ${item.last_name}`.toLowerCase().includes(nameFilter.toLowerCase())
            )))
        }
        if(idFilter){
            setFilteredData(data.filter(item=>(
                item.email.toLowerCase().includes(idFilter.toLowerCase())
            )))
        }
        // if the filter is empty, reset the data
        if(nameFilter===''&&idFilter===''){
            setFilteredData(data);
        }
        setNameFilter('');
        setIdFilter('');

    }
    // return different pages according to status
    if(isLoading){
        return <div>Is Loading...</div>
    }
    if(error){
        return <div>Error:{error}</div>
    }

    // render the page with data
    return (
        <div>
            {/*form to submit the filter*/}
            <form onSubmit={submitForm}>
                <label htmlFor="nameFilter">filter by name:</label>
                <input type="text" name="nameFilter"
                       onChange={(e)=> {
                           setNameFilter(e.target.value)
                       }}/><br/>
                <label htmlFor="idFilter">filter by email:</label>
                <input type="text" name="idFilter" onChange={(e)=>{
                    setIdFilter(e.target.value)
                }}/><br/>
                <button type="submit">filter</button>
            </form>
            {/*button to change the delay time*/}
            <button onClick={setDelayTo5}>set delay to 5</button>
            {/*actual delay time*/}
            <div>time delay:{delay}s</div>

            {/*show the data*/}
            <ul>
                {filteredData.map(item => (
                    <li key = {item.id}>
                        <div>name: {item.first_name} {item.last_name}</div>
                        <div>email: {item.email}</div>
                        <div>id: {item.id}</div>
                        <img src={item.avatar} alt=""/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetImages;