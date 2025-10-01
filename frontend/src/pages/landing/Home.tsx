import React from 'react'
import HeroSection from '../../components/landing/home/HeroSection';
import Categories from '../../components/landing/home/Categories';
import FeaturedProducts from '../../components/landing/home/NewsSection';
import Testimonials from '../../components/landing/home/Testimonials';
import AdvanceReleaseCalendar from '../../components/landing/home/AdvanceReleaseCalendar';
import AboutSection from '../../components/landing/home/About';
import NewsSection from '../../components/landing/home/NewsSection';

const Home = () => {
  return (
    <main>
        
        <HeroSection />
        <AboutSection />
        <Testimonials />
        <AdvanceReleaseCalendar />
        <Categories />
        <NewsSection />
      </main>
  )
}

export default Home