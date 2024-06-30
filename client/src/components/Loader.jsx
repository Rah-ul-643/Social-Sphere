import React from 'react'

const Loader = ({loaderImage, imageClasses, content, divClasses}) => {
    return (
        <div className={divClasses}>
            {content}
            <img src={loaderImage} className={imageClasses} alt="Loading..." />
        </div>
    )
}

export default Loader