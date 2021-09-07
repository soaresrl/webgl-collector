import React, {useEffect} from "react"
import PropertyField from "../PropertyFields"

export function Prototype(props){
    const currentAttribute = props.currentAttribute;
    if(!currentAttribute){
        return null
    }
    
    return (<>
                {Object.keys(currentAttribute.properties).map((property, index)=>{
                    return(<>
                        <p>{`${property}`}</p>
                        <PropertyField 
                            key={`${property}-${index}-field`}
                            attribute={currentAttribute} 
                            handleChangeProperty={props.handleChangeProperty} 
                            property={property}
                            type={currentAttribute['properties-type'][index]}
                        />
                    </>)
                })}
            </>)
}