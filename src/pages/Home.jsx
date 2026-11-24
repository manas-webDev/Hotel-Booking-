import React from 'react'
import HeroSection from '../components/HeroSection'
import Destination from '../components/Destination'
import Offers from '../components/Offers'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <>
     <HeroSection /> 
     <Destination />
     <Offers  />
     <Testimonial />
     <Newsletter />
    </>
  )
}

export default Home
