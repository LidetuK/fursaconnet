import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ContactFormModal from './ContactFormModal';

const categories = ["All", "Agro Business", "E-commerce", "Digital Marketing"];

const projectsData = [
  {
    id: 8,
    title: "The day Agro industry",
    category: "Agro Business",
    image: "/t3.png",
    description: "Best Quality Products Spreading nature’s best health and joy in every bite!",
    link: "http://thedayjam.com/"
  },
  {
    id: 9,
    title: "Dahab Cofee",
    category: "Agro Business",
    image: "/t2.png",
    description: "Welcome to Dahab Specialty Farm Experience the finest Ethiopian coffee beans and pure honey, cultivated with traditional methods and modern sustainability practices in the heart of Ethiopia's coffee highlands.",
    link: "https://www.dehabcoffee.com/"
  },
  {
    id: 10,
    title: "Signiture addis cofee",
    category: "Agro Business",
    image: "/t1.png",
    description: "Signiture addis cofee.",
    link: "https://coffeesignatureaddis.com/"
  },
  {
    id: 1,
    title: "One X One Members",
    category: "E-commerce",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200752/Screenshot_2025-04-18_000555_ksy3cc.png",
    description: "Custom e-commerce solution with integrated payment processing and inventory management.",
    link: "https://onexonememberplc.com/"
  },
  {
    id: 2,
    title: "Yesh Adam",
    category: "E-commerce",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200747/Screenshot_2025-04-18_000922_tu3i3b.png",
    description: "Complete redesign and development of a corporate website with modern UI/UX principles.",
    link: "https://yeshadam.com/"
  },
  {
    id: 3,
    title: "Qatken Properties",
    category: "Digital Marketing",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200751/Screenshot_2025-04-18_000735_fbm6wy.png",
    description: "Comprehensive SEO optimization and content marketing strategy for a SaaS company.",
    link: "https://qatkenproperties.com/"
  },
  {
    id: 5,
    title: "Anyacharity organization",
    category: "Digital Marketing",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200776/Screenshot_2025-04-18_000811_s6lcys.png",
    description: "Custom LMS with video courses, quizzes, and certification system.",
    link: "https://anyacharityorganization.com/"
  },
  {
    id: 6,
    title: "Awash Group",
    category: "Digital Marketing",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200734/Screenshot_2025-04-18_000847_ayoidd.png",
    description: "Multi-platform social media strategy and content creation for product launch.",
    link: "https://awashgroup.com/"
  },
  {
    id: 7,
    title: "Jfm Petroulume",
    category: "Digital Marketing",
    image: "https://res.cloudinary.com/dkzw06zke/image/upload/v1748200775/Screenshot_2025-04-18_001738_duj3ss.png",
    description: "Multi-platform social media strategy and content creation for product launch.",
    link: "https://jfmglobalpetroleum.com/"
  }
  
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  const filteredProjects = activeCategory === "All" 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory);

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Our Recent Work
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Explore our latest projects and see the quality we deliver
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-skilllink-green text-white'
                    : 'bg-skilllink-gray hover:bg-skilllink-green/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs font-medium text-skilllink-green bg-white/90 rounded-full py-1 px-3 mb-3 self-start">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-white/80 mb-4 text-sm">{project.description}</p>
                <a 
                  href={project.link} 
                  className="flex items-center gap-2 text-white font-medium text-sm hover:text-skilllink-green transition-colors"
                >
                  View Project <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={openContactModal}
            className="btn-primary inline-flex items-center"
          >
            Let's Discuss Your Project
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen}
      />
    </section>
  );
};

export default Portfolio;
