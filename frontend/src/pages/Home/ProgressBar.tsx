import React from 'react'

const ProgressBar = () => {
    return (
        <div>
            <div className="h-1 w-full bg-gray-300">
                <div className="h-1 bg-blue-500" style={{ width: '50%' }}></div>
            </div>
        </div>
    )
}

export default ProgressBar