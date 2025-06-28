import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya S.",
      location: "Bangalore",
      quote: "After years of discomfort, QurePlus helped me find the right treatment. The AI assessment was spot-on!",
      rating: 5
    },
    {
      name: "Rajesh M.",
      location: "Mumbai",
      quote: "The video consultation saved me time, and the treatment plan was perfectly customized for my condition.",
      rating: 5
    },
    {
      name: "Anjali P.",
      location: "Delhi",
      quote: "Transparent pricing and excellent care. The minimally invasive treatment was exactly what I needed.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Patient Success Stories</h2>
          <p className="mt-4 text-lg text-gray-600">See what our patients say about their experience</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="absolute -top-4 -right-4 bg-primary/10 p-3 rounded-full">
                <Quote className="h-6 w-6 text-primary" />
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;