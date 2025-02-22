
import React, { useState, useEffect } from "react"
import {
  Globe2,
  Calendar,
  MapPin,
  CreditCard,
  Users,
  Cloud,
  ChevronDown,
  Compass,
  Star,
  MessageCircle,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function Landing() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

  const features = [
    {
      title: "Smart Travel Planning",
      description: "AI-powered itinerary creation based on your preferences",
      image: "https://images.unsplash.com/photo-14694749688-56623f02e42e?q=80&w=2074",
      icon: <Compass className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: "Local Experiences",
      description: "Discover hidden gems and authentic local experiences",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2074",
      icon: <MapPin className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: "Smart Scheduling",
      description: "Optimal travel dates based on your calendar",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
      icon: <Calendar className="w-8 h-8 text-emerald-500" />,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1))
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <Globe2 className="w-16 h-16 text-emerald-500" />
              <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                GlobeMate
              </h1>
            </div>
            <p className="text-3xl text-zinc-400 max-w-3xl mx-auto font-light">
              Your AI-Powered Travel Companion for Smarter, Personalized Adventures
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-5 rounded-full text-xl font-medium transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
              Start Your Journey
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </header>

      {/* Features Carousel */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Experience Travel Like Never Before
          </h2>
          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={prevFeature}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700/80 transition-all p-2 rounded-full"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={nextFeature}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700/80 transition-all p-2 rounded-full"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            <div className="overflow-hidden relative rounded-3xl bg-zinc-900/50 backdrop-blur-sm">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentFeatureIndex * 100}%)`,
                  width: `${features.length * 100}%`,
                }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-[400px] overflow-hidden">
                      <img
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="space-y-6 p-8">
                      <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                      <p className="text-xl text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatureIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentFeatureIndex === index ? "bg-emerald-500 w-6" : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Travelers", icon: <Users className="w-8 h-8 text-emerald-500" /> },
              { number: "100+", label: "Countries Covered", icon: <Globe2 className="w-8 h-8 text-teal-500" /> },
              { number: "4.9", label: "User Rating", icon: <Star className="w-8 h-8 text-emerald-500" /> },
              { number: "24/7", label: "Support", icon: <MessageCircle className="w-8 h-8 text-teal-500" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all"
              >
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Smart Features for Smart Travelers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8 text-emerald-500" />,
                title: "AI-Powered Recommendations",
                description: "Get personalized suggestions based on your preferences and travel history",
              },
              {
                icon: <Calendar className="w-8 h-8 text-teal-500" />,
                title: "Smart Date Planning",
                description: "Find the perfect travel dates by analyzing your calendar",
              },
              {
                icon: <CreditCard className="w-8 h-8 text-emerald-500" />,
                title: "Expense Tracking",
                description: "Effortlessly track and analyze your travel expenses",
              },
              {
                icon: <Shield className="w-8 h-8 text-teal-500" />,
                title: "Safe Travel",
                description: "Real-time safety alerts and travel insurance integration",
              },
              {
                icon: <Award className="w-8 h-8 text-emerald-500" />,
                title: "Exclusive Deals",
                description: "Access to premium discounts and special offers",
              },
              {
                icon: <Cloud className="w-8 h-8 text-teal-500" />,
                title: "Weather Insights",
                description: "Advanced weather forecasting for better planning",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-zinc-800/50 transition-all duration-300 border border-zinc-800"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">What Our Travelers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "GlobeMate transformed how I plan my trips. The AI recommendations are spot-on!",
                author: "Sarah K.",
                role: "Adventure Enthusiast",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887",
              },
              {
                quote: "The smart calendar feature saved me hours of planning time. Absolutely brilliant!",
                author: "Michael R.",
                role: "Business Traveler",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887",
              },
              {
                quote: "Best travel companion app I've ever used. The expense tracking is a game-changer.",
                author: "Emily T.",
                role: "Digital Nomad",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-emerald-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-zinc-400">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl font-bold text-white">Ready to Transform Your Travel Experience?</h2>
            <p className="text-xl text-zinc-400">
              Join thousands of smart travelers who are already using GlobeMate to plan their perfect trips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-xl font-medium hover:opacity-90 transition-all">
                Get Started for Free
              </button>
              <button className="bg-zinc-900 text-white px-8 py-4 rounded-full text-xl font-medium hover:bg-zinc-800 transition-all border border-zinc-800">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

