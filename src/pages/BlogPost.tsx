import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

const blogPosts = {
  'understanding-varicose-veins': {
    title: "Understanding Varicose Veins: Causes and Symptoms",
    author: "Dr. Sarah Johnson",
    date: "March 15, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: [
      "Varicose veins are a common condition affecting millions of people worldwide, particularly those who spend long hours standing or have a family history of venous issues. These enlarged, twisted veins typically appear on the legs and feet, causing both cosmetic concerns and potential health risks if left untreated.",
      "The primary cause of varicose veins is weakened or damaged valve function within the veins. Normally, these valves ensure blood flows in one direction – toward the heart. When they malfunction, blood can flow backward and pool in the veins, causing them to enlarge and become varicose. Risk factors include age, pregnancy, obesity, and prolonged standing or sitting.",
      "Early symptoms often include aching pain, heaviness, and swelling in the legs, particularly after standing for long periods. Some people may experience itching around the affected veins or develop skin discoloration. In more severe cases, patients might develop ulcers or blood clots, making early intervention crucial for preventing complications.",
      "Modern treatment options range from conservative approaches like compression stockings and lifestyle changes to minimally invasive procedures such as sclerotherapy and endovenous laser treatment. The choice of treatment depends on various factors, including the severity of the condition, symptoms, and overall health status.",
      "Prevention plays a crucial role in managing varicose veins. Regular exercise, maintaining a healthy weight, avoiding prolonged standing or sitting, and elevating legs when resting can help improve circulation and reduce the risk of developing varicose veins. For those with a family history or other risk factors, early consultation with a healthcare provider can lead to better outcomes through proactive management."
    ],
    tags: ["Vein Health", "Medical Conditions", "Treatment Options", "Prevention"]
  },
  'latest-treatments': {
    title: "Latest Treatments for Varicose Veins",
    author: "Dr. Michael Chen",
    date: "March 10, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: [
      "The landscape of varicose vein treatment has evolved significantly in recent years, with new technologies and techniques offering more effective and less invasive options for patients. These advancements have revolutionized how we approach vein health, providing better outcomes with shorter recovery times.",
      "Endovenous laser treatment (EVLT) represents one of the most significant breakthroughs in vein care. This minimally invasive procedure uses laser energy to seal off problematic veins, redirecting blood flow to healthy veins. The procedure is performed under local anesthesia and typically takes less than an hour, with most patients returning to normal activities within a day.",
      "Another innovative treatment is VenaSeal™, which uses a medical adhesive to close affected veins. This technique eliminates the need for multiple needle sticks and thermal energy, reducing post-procedure discomfort and bruising. Studies have shown high success rates with this approach, making it an attractive option for many patients.",
      "Radiofrequency ablation (RFA) continues to evolve, with newer devices offering more precise energy delivery and better outcomes. This technique uses thermal energy to heat and close varicose veins, with the advantage of built-in temperature monitoring to ensure optimal treatment while minimizing risk to surrounding tissues.",
      "The future of varicose vein treatment looks promising, with ongoing research into new technologies and techniques. From advanced imaging methods for better diagnosis to novel treatment approaches using biotechnology, the field continues to progress. These developments not only improve treatment outcomes but also make vein care more accessible and comfortable for patients."
    ],
    tags: ["Medical Technology", "Treatment Innovation", "Minimally Invasive", "Healthcare Advances"]
  }
};

const BlogPost = () => {
  const { postId } = useParams();
  const post = blogPosts[postId as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link to="/blog" className="text-primary hover:text-primary-dark">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {post.readTime}
              </div>
            </div>

            <div className="prose max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="flex items-center text-gray-600 hover:text-primary">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;