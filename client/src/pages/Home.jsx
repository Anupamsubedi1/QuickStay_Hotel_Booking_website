import React from 'react'
import Hero from '../component/Hero'
import FeaturedDestination from '../component/FeaturedDestination'
import ExclusiveOffer from '../component/ExclusiveOffer'
import Testimonial from '../component/Testimonial'
import NewsLetter from '../component/NewsLetter'
import RecommendedHotels from '../component/RecommendedHotels'

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotels />
      <FeaturedDestination />
      <ExclusiveOffer />
      <Testimonial />
      <NewsLetter />
    </>
  )
}

export default Home