import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Code2, Download, Edit3, Eye, Github } from 'lucide-react';
import WebsitePreview from './WebsitePreview';
import WebsiteEditor from './WebsiteEditor';
import WebsiteExporter from './WebsiteExporter';

interface WebsiteGeneratorProps {
  packageType: string;
}

interface GeneratedWebsite {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to call the Supabase Edge Function
async function generateReactCodeFromAPI(prompt: string) {
  const response = await fetch('https://ajlytimpconhazplejln.supabase.co/functions/v1/huggingface-generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
}

const WebsiteGenerator = ({ packageType }: WebsiteGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<GeneratedWebsite | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [rawGeneratedCode, setRawGeneratedCode] = useState<string>("");
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please describe the website you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const generatedCode = await generateReactCodeFromAPI(prompt);
      setRawGeneratedCode(generatedCode || "No code generated.");
      setCurrentWebsite({
        id: Date.now().toString(),
        name: extractWebsiteName(prompt),
        description: prompt,
        html: generatedCode || "",
        css: "",
        js: "",
        prompt: prompt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setActiveTab("preview");
      toast({
        title: "Website Generated!",
        description: `Your website has been created successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your website.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleEdit = async (editPrompt: string) => {
    if (!currentWebsite) return;

    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedWebsite: GeneratedWebsite = {
        ...currentWebsite,
        html: enhanceHTML(currentWebsite.html, editPrompt),
        css: enhanceCSS(currentWebsite.css, editPrompt),
        js: enhanceJS(currentWebsite.js, editPrompt),
        updatedAt: new Date()
      };

      setCurrentWebsite(updatedWebsite);
      
      toast({
        title: "Website Updated!",
        description: "Your changes have been applied successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your website.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!currentWebsite} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="edit" disabled={!currentWebsite} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="export" disabled={!currentWebsite} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-skilllink-green" />
                AI Website Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe your website
                  </label>
                  <Textarea
                    placeholder="Example: Create a modern portfolio website for a graphic designer with a hero section, portfolio gallery, about section, and contact form. Use a clean, minimalist design with a blue and white color scheme."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32"
                    disabled={generating}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                  disabled={generating || !prompt.trim()}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Website...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Website
                    </>
                  )}
                </Button>
              </form>

              {rawGeneratedCode && (
                <div className="mt-6 p-4 bg-gray-900 text-green-300 rounded-lg overflow-auto max-h-96">
                  <h3 className="font-semibold text-green-400 mb-2">Generated Code</h3>
                  <pre className="text-xs whitespace-pre-wrap">
                    {rawGeneratedCode}
                  </pre>
                </div>
              )}

              {currentWebsite && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Latest Generated Website</h3>
                  <p className="text-green-700 text-sm mb-2">
                    <strong>{currentWebsite.name}</strong> - Generated {currentWebsite.createdAt.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm">{currentWebsite.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <WebsitePreview website={currentWebsite} />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <WebsiteEditor 
            website={currentWebsite} 
            onEdit={handleEdit}
            isLoading={generating}
          />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <WebsiteExporter website={currentWebsite} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions for generating website code
const extractWebsiteName = (prompt: string): string => {
  const matches = prompt.match(/(?:website for|site for|page for)\s+(?:a\s+)?([^,.\n]+)/i);
  if (matches) return matches[1].trim();
  
  const businessMatches = prompt.match(/(?:business|company|brand|service)\s+([^,.\n]+)/i);
  if (businessMatches) return businessMatches[1].trim();
  
  return "Generated Website";
};

const generateHTML = (prompt: string, siteName: string): string => {
  const isPortfolio = prompt.toLowerCase().includes('portfolio');
  const isBusiness = prompt.toLowerCase().includes('business') || prompt.toLowerCase().includes('company');
  const isEcommerce = prompt.toLowerCase().includes('store') || prompt.toLowerCase().includes('shop');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">${siteName}</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                ${isPortfolio ? '<li><a href="#portfolio">Portfolio</a></li>' : ''}
                ${isBusiness ? '<li><a href="#services">Services</a></li>' : ''}
                ${isEcommerce ? '<li><a href="#products">Products</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1 class="hero-title">Welcome to ${siteName}</h1>
                <p class="hero-subtitle">Creating amazing experiences through innovative design and development</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>We are passionate about delivering exceptional results that exceed expectations and drive success.</p>
            </div>
        </section>

        ${isPortfolio ? `
        <section id="portfolio" class="portfolio">
            <div class="container">
                <h2>Our Work</h2>
                <div class="portfolio-grid">
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/300x200" alt="Project 1">
                        <h3>Project One</h3>
                    </div>
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/300x200" alt="Project 2">
                        <h3>Project Two</h3>
                    </div>
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/300x200" alt="Project 3">
                        <h3>Project Three</h3>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        <section id="contact" class="contact">
            <div class="container">
                <h2>Get In Touch</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${siteName}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
};

const generateCSS = (prompt: string): string => {
  const colorScheme = extractColors(prompt);
  
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: ${colorScheme.primary};
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-menu a:hover {
    opacity: 0.8;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary});
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 80px;
}

.hero-content {
    max-width: 600px;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.2s both;
}

.cta-button {
    background: ${colorScheme.accent};
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    animation: fadeInUp 1s ease 0.4s both;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Sections */
section {
    padding: 80px 0;
}

.about {
    background: #f8f9fa;
}

.portfolio {
    background: white;
}

.contact {
    background: #f8f9fa;
}

h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: ${colorScheme.primary};
}

/* Portfolio Grid */
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.portfolio-item {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.portfolio-item:hover {
    transform: translateY(-5px);
}

.portfolio-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.portfolio-item h3 {
    padding: 1rem;
    font-size: 1.2rem;
}

/* Contact Form */
.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: ${colorScheme.primary};
}

.contact-form textarea {
    min-height: 120px;
    resize: vertical;
}

.contact-form button {
    background: ${colorScheme.primary};
    color: white;
    border: none;
    padding: 15px;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.contact-form button:hover {
    background: ${colorScheme.secondary};
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .portfolio-grid {
        grid-template-columns: 1fr;
    }
}`;
};

const generateJS = (prompt: string): string => {
  return `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        alert('Thank you for your message! We\\'ll get back to you soon.');
        this.reset();
    });
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = '';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

console.log('Website loaded successfully!');`;
};

const extractColors = (prompt: string): { primary: string; secondary: string; accent: string } => {
  const colorKeywords = {
    blue: { primary: '#2563eb', secondary: '#3b82f6', accent: '#1e40af' },
    green: { primary: '#16a34a', secondary: '#22c55e', accent: '#15803d' },
    purple: { primary: '#9333ea', secondary: '#a855f7', accent: '#7c3aed' },
    red: { primary: '#dc2626', secondary: '#ef4444', accent: '#b91c1c' },
    orange: { primary: '#ea580c', secondary: '#f97316', accent: '#c2410c' },
    pink: { primary: '#db2777', secondary: '#ec4899', accent: '#be185d' },
  };

  for (const [color, scheme] of Object.entries(colorKeywords)) {
    if (prompt.toLowerCase().includes(color)) {
      return scheme;
    }
  }

  return colorKeywords.blue; // Default
};

const enhanceHTML = (originalHTML: string, editPrompt: string): string => {
  // Simple enhancement logic - in a real implementation, this would use AI
  if (editPrompt.toLowerCase().includes('testimonial')) {
    return originalHTML.replace(
      '</main>',
      `
        <section id="testimonials" class="testimonials">
            <div class="container">
                <h2>What Our Clients Say</h2>
                <div class="testimonials-grid">
                    <div class="testimonial">
                        <p>"Amazing work! Exceeded all our expectations."</p>
                        <cite>- Sarah Johnson</cite>
                    </div>
                    <div class="testimonial">
                        <p>"Professional, reliable, and incredibly talented."</p>
                        <cite>- Mike Chen</cite>
                    </div>
                </div>
            </div>
        </section>
      </main>`
    );
  }
  return originalHTML;
};

const enhanceCSS = (originalCSS: string, editPrompt: string): string => {
  if (editPrompt.toLowerCase().includes('testimonial')) {
    return originalCSS + `
/* Testimonials */
.testimonials {
    background: white;
    padding: 80px 0;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.testimonial {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.testimonial p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-style: italic;
}

.testimonial cite {
    font-weight: bold;
    color: #666;
}`;
  }
  return originalCSS;
};

const enhanceJS = (originalJS: string, editPrompt: string): string => {
  return originalJS; // Keep JS simple for now
};

export default WebsiteGenerator;
