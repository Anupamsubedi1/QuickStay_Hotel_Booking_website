import React from 'react'

const StarRating = () => {
  return (
    <div>{Array(5).fill('').map((_, index) => (
                                <img src={assets.starIconFilled} alt="" />
                            ))}</div>
  )
}

export default StarRating