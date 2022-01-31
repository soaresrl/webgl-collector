import React from "react"
import PropertyField from "../PropertyFields"

import './style.css'

export function Prototype(props){
    const { currentAttribute } = props;
    if(!currentAttribute){
        return null
    }
    
    return (<>
                {Object.keys(currentAttribute.properties).map((property, index)=>{
                    return(<div key={`prototype-${property}-${index}`} className="proto">
                        <p key={`${property}-${index}-paragraph`}>{`${property}`}</p>
                        <PropertyField 
                            key={`${property}-${index}-field`}
                            attribute={currentAttribute} 
                            handleChangeProperty={props.handleChangeProperty} 
                            property={property}
                            type={currentAttribute['properties-type'][index]}
                        />
                    </ div>)
                })}
            </>)
}