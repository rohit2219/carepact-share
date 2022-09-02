import React from 'react';

function Parent(props){
    const data = props.details;
    console.log(data)
    return(
        <div>
            <Child dataParentToChild = {data}/>
        </div>
    )
}

function Child ({dataParentToChild}){
    return(
        <div>
            {dataParentToChild}
        </div>
    )
}

export default Parent;