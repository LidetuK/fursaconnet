
import { useState } from 'react';
import { ShoppingCart, Package, Layers, CreditCard, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionChatbot from './SectionChatbot';

interface EcommerceSectionProps {
  packageType: string;
}

const EcommerceSection = ({ packageType }: EcommerceSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  // Mock product templates
  const productTemplates = [
    {
      name: "Basic Product Listing",
      description: "Simple product page template for small businesses",
      image: "https://cieloecommerce.com/wp-content/uploads/2024/10/32-scaled.webp",
      features: ["Product Gallery", "Basic Description", "Add to Cart Button", "Reviews"]
    },
    {
      name: "Premium Product Page",
      description: "Detailed product page with advanced features",
      image: "https://htmlburger.com/blog/wp-content/uploads/2022/07/Excellent-Examples-of-Product-Landing-Pages-that-Convert.jpg",
      features: ["360° Product View", "Size Guide", "Custom Options", "Related Products", "Upsells"],
      proOnly: packageType === "starter"
    },
    {
      name: "Service Offering",
      description: "Template for selling services online",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Sbn9OuHqnLLV29g4vvDcaUgS3tWgLuMcpw&s",
      features: ["Service Details", "Pricing Tiers", "Booking Calendar", "Client Testimonials"]
    },
    {
      name: "Digital Product",
      description: "Template for digital downloads and subscriptions",
      image: "/lovable-uploads/2a5bbda2-d1b2-445b-9835-51ba35dba812.png",
      features: ["Secure Downloads", "License Options", "Preview Features", "Subscription Management"],
      proOnly: packageType !== "enterprise"
    }
  ];
  
  // Mock store settings
  const paymentMethods = [
    { name: "Credit Card", active: true },
    { name: "PayPal", active: true },
    { name: "Apple Pay", active: false, proOnly: packageType === "starter" },
    { name: "Google Pay", active: false, proOnly: packageType === "starter" },
    { name: "Bank Transfer", active: false },
    { name: "Cryptocurrency", active: false, proOnly: packageType !== "enterprise" }
  ];
  
  // Mock product descriptions
  const productDescriptions = [
    {
      title: "Professional Web Development Services",
      currentDescription: "We offer web development services for businesses of all sizes. Our team creates responsive websites that look great on all devices.",
      aiEnhanced: "Transform your online presence with our expert web development services. Our seasoned team crafts stunning, responsive websites optimized for all devices, ensuring maximum engagement and conversions. From custom designs to e-commerce solutions, we deliver pixel-perfect websites that elevate your brand and drive business growth."
    },
    {
      title: "SEO Optimization Package",
      currentDescription: "Improve your search engine rankings with our SEO services. We help websites rank higher in search results.",
      aiEnhanced: "Skyrocket your website's visibility with our comprehensive SEO Optimization Package. Our data-driven approach combines technical SEO, content optimization, and strategic keyword targeting to dramatically improve your search engine rankings. Watch your organic traffic grow as we implement proven techniques that place your business above competitors in search results, driving qualified leads directly to your doorstep."
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">E-Commerce Solutions</h1>
          <p className="text-gray-500">Create and manage your online store and product offerings</p>
        </div>
        <button 
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>E-Commerce Assistant</span>
        </button>
      </div>
      
      <Tabs defaultValue="product-templates" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="product-templates">
            <Package className="h-4 w-4 mr-2" />
            Product Templates
          </TabsTrigger>
          <TabsTrigger value="product-content">
            <Layers className="h-4 w-4 mr-2" />
            Product Content
          </TabsTrigger>
          <TabsTrigger value="store-setup">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Store Setup
          </TabsTrigger>
          <TabsTrigger value="payment-options">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Options
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="product-templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Page Templates</CardTitle>
              <CardDescription>Choose a template to build your product pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {productTemplates.map((template, index) => (
                  <Card 
                    key={index} 
                    className={template.proOnly ? "opacity-75" : ""}
                  >
                    <div className="relative">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      {template.proOnly && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Premium
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm text-gray-600">
                        <h4 className="font-medium mb-1">Features:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {template.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                        disabled={template.proOnly}
                      >
                        {template.proOnly ? "Upgrade to Access" : "Use Template"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Custom Template Builder</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI-Powered Template Generator</CardTitle>
                    <CardDescription>
                      Create a custom product page template based on your specific needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="product-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Type
                      </label>
                      <select 
                        id="product-type" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="physical">Physical Product</option>
                        <option value="digital">Digital Product</option>
                        <option value="service">Service</option>
                        <option value="subscription">Subscription</option>
                        <option value="bundle">Product Bundle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <Input id="business-type" placeholder="E.g., Fashion, Electronics, Consulting" />
                    </div>
                    
                    <div>
                      <label htmlFor="key-features" className="block text-sm font-medium text-gray-700 mb-1">
                        Key Features to Include
                      </label>
                      <textarea 
                        id="key-features" 
                        rows={3} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                        placeholder="List the features you want on your product page"
                      ></textarea>
                    </div>
                    
                    <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                      Generate Custom Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="product-content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Product Content Generator</CardTitle>
              <CardDescription>Create compelling product descriptions, features, and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Product Description Generator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <Input id="product-name" placeholder="E.g., Premium Website Package" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Input id="product-category" placeholder="E.g., Web Development, SEO, Design" />
                      </div>
                      <div>
                        <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <Input id="target-audience" placeholder="E.g., Small businesses, E-commerce stores" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="key-features" className="block text-sm font-medium text-gray-700 mb-1">
                        Key Features and Benefits
                      </label>
                      <textarea 
                        id="key-features" 
                        rows={3} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                        placeholder="List the main features and benefits of your product"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                        Tone
                      </label>
                      <select 
                        id="tone" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="professional">Professional</option>
                        <option value="conversational">Conversational</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="technical">Technical</option>
                        <option value="luxurious">Luxurious</option>
                      </select>
                    </div>
                    
                    <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                      Generate Description
                    </Button>
                  </CardContent>
                </Card>
                
                <h3 className="font-medium text-lg mb-4">AI Content Enhancement Examples</h3>
                <div className="space-y-4">
                  {productDescriptions.map((description, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{description.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Description:</h4>
                          <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                            {description.currentDescription}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Enhanced Description:</h4>
                          <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm text-gray-600">
                            {description.aiEnhanced}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                            Use AI Enhancement
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {packageType !== "enterprise" && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Advanced Content Generation</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          Upgrade to {packageType === "starter" ? "Professional" : "Enterprise"} for access to advanced AI-powered content generation,
                          including product specifications, technical details, and SEO-optimized content.
                        </p>
                        <Button className="mt-3 bg-skilllink-green hover:bg-skilllink-dark-green">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="store-setup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Setup Wizard</CardTitle>
              <CardDescription>Configure your online store settings</CardDescription>
            </CardHeader>
            <CardContent>
              {packageType === "starter" ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Advanced Store Setup</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upgrade to Professional or Enterprise package to access advanced e-commerce features,
                    including full store setup, shipping options, inventory management, and more.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Store Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">
                              Store Name
                            </label>
                            <Input id="store-name" placeholder="Your Store Name" />
                          </div>
                          <div>
                            <label htmlFor="store-url" className="block text-sm font-medium text-gray-700 mb-1">
                              Store URL
                            </label>
                            <Input id="store-url" placeholder="yourdomain.com/store" />
                          </div>
                          <div>
                            <label htmlFor="store-email" className="block text-sm font-medium text-gray-700 mb-1">
                              Support Email
                            </label>
                            <Input id="store-email" placeholder="support@yourdomain.com" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Currency & Tax</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select 
                              id="currency" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                            >
                              <option value="usd">USD ($)</option>
                              <option value="eur">EUR (€)</option>
                              <option value="gbp">GBP (£)</option>
                              <option value="cad">CAD ($)</option>
                              <option value="aud">AUD ($)</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700 mb-1">
                              Tax Rate (%)
                            </label>
                            <Input id="tax-rate" type="number" placeholder="0.00" />
                          </div>
                          <div className="flex items-center pt-2">
                            <input
                              id="show-prices-with-tax"
                              type="checkbox"
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="show-prices-with-tax" className="ml-2 block text-sm text-gray-700">
                              Show prices with tax included
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Shipping</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="shipping-method" className="block text-sm font-medium text-gray-700 mb-1">
                              Default Shipping Method
                            </label>
                            <select 
                              id="shipping-method" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                            >
                              <option value="flat">Flat Rate</option>
                              <option value="free">Free Shipping</option>
                              <option value="weight">Weight-based</option>
                              <option value="location">Location-based</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="shipping-cost" className="block text-sm font-medium text-gray-700 mb-1">
                              Flat Rate Cost
                            </label>
                            <Input id="shipping-cost" type="number" placeholder="0.00" />
                          </div>
                          <div className="flex items-center pt-2">
                            <input
                              id="free-shipping-threshold"
                              type="checkbox"
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="free-shipping-threshold" className="ml-2 block text-sm text-gray-700">
                              Enable free shipping threshold
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Save Store Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-options" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure the payment options for your online store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method, index) => (
                    <Card key={index} className={method.proOnly ? "opacity-75" : ""}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {method.name === "Credit Card" && <CreditCard className="h-6 w-6 text-gray-500" />}
                            {method.name === "PayPal" && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-blue-500">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.544 6.082h-2.19a.513.513 0 0 0-.507.435l-1.202 7.626a.513.513 0 0 0 .507.591h3.605c.42 0 .779-.305.845-.72l.034-.181.653-4.145.042-.225a.513.513 0 0 1 .845-.72h.531c3.432 0 6.122-1.394 6.911-5.426.366-1.418.19-2.606-.882-3.43z" />
                              </svg>
                            )}
                            {method.name === "Apple Pay" && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-800">
                                <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44A4.51 4.51 0 0 1 19 16.5a11.12 11.12 0 0 1-1.38 2.65c-.84 1.17-1.71 2.35-3.09 2.37-1.35 0-1.8-.8-3.36-.8s-2.05.78-3.35.83c-1.35 0-2.37-1.27-3.21-2.44A10.93 10.93 0 0 1 3 13.18c0-3.92 2.55-6 5.06-6 1.33 0 2.43.9 3.27.9s2.02-.93 3.41-.93a4.85 4.85 0 0 1 4.14 2.1 4.64 4.64 0 0 0-1.42 3.28z" />
                              </svg>
                            )}
                            {method.name === "Google Pay" && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-800">
                                <path d="M12 22.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z" fill="#fff"/>
                                <path d="M12.545 12.179h5.867v1.509h-5.867z" fill="#5f6368"/>
                                <path d="M12.545 9.806h5.867v1.509h-5.867z" fill="#4285f4"/>
                                <path d="M12.545 14.552h2.953v1.509h-2.953z" fill="#34a853"/>
                                <path d="M15.498 14.552h2.914v1.509h-2.914z" fill="#fbbc04"/>
                                <path d="M5.988 14.182l2.122-5.344h1.36l2.122 5.344h-1.305l-.535-1.387h-2.17l-.526 1.387zm1.877-2.414h1.4l-.666-1.787-.117-.46h-.066l-.117.46-.434 1.787z" fill="#ea4335"/>
                              </svg>
                            )}
                            {method.name === "Bank Transfer" && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-500">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                              </svg>
                            )}
                            {method.name === "Cryptocurrency" && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-orange-500">
                                <path d="M11.767 19.089c4.924.868 9.458-2.51 10.325-7.433.868-4.924-2.51-9.458-7.433-10.325-4.924-.868-9.458 2.51-10.325 7.433-.868 4.924 2.51 9.458 7.433 10.325zm1.695-13.9c2.446.431 4.12 2.753 3.933 5.208l-.068.837 1.323.232-.185 1.052-1.34-.235-.397 2.244 1.34.236-.186 1.052-1.34-.236-.107.981c-.022.226-.068.439-.137.64l-.127.344h-.22l-1.252-.222-.22 1.245-1.052-.185.22-1.246-1.634-.288.22-1.246 1.634.289.397-2.245-1.634-.288.186-1.051 1.633.287.069-.77c.366-2.347 2.13-4.004 4.337-3.593zm-.069 1.935c-1.167-.205-2.258.784-2.453 2.208l-.059.348-.016.145-.396 2.244c-.151 1.36.818 2.55 2.166 2.689l.227.016c1.354.238 2.609-.644 2.789-1.978l.016-.143.396-2.245c.16-1.458-.833-2.756-2.285-2.913l-.228-.016-.157-.355zm-7.566 3.254c.41.918 1.334 1.313 2.06 0 .726-1.312-.726-4.593-2.06-3.675-1.334.918-1.334 2.756 0 3.675z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-xs text-gray-500">
                              {method.proOnly ? 
                                `Available in ${packageType === "starter" ? "Professional" : "Enterprise"} package` : 
                                method.active ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div>
                          {method.proOnly ? (
                            <Button variant="outline" size="sm">Upgrade</Button>
                          ) : (
                            <div className="flex items-center">
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                  type="checkbox" 
                                  id={`toggle-${method.name}`} 
                                  defaultChecked={method.active}
                                  className="sr-only peer"
                                  disabled={method.proOnly}
                                />
                                <div className="h-5 w-10 bg-gray-300 rounded-full peer peer-checked:bg-skilllink-green"></div>
                                <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                              </div>
                              <Button variant="outline" size="sm">Configure</Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">AI-Generated Payment Copy</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Payment Page Content Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label htmlFor="payment-tone" className="block text-sm font-medium text-gray-700 mb-1">
                          Tone
                        </label>
                        <select 
                          id="payment-tone" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                        >
                          <option value="professional">Professional</option>
                          <option value="reassuring">Reassuring</option>
                          <option value="simple">Simple & Clear</option>
                          <option value="friendly">Friendly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="payment-elements" className="block text-sm font-medium text-gray-700 mb-1">
                          Required Elements
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <input
                              id="secure-payment"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="secure-payment" className="ml-2 block text-sm text-gray-700">
                              Security assurance
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="payment-methods"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="payment-methods" className="ml-2 block text-sm text-gray-700">
                              Payment method details
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="refund-policy"
                              type="checkbox"
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="refund-policy" className="ml-2 block text-sm text-gray-700">
                              Refund policy
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="shipping-info"
                              type="checkbox"
                              className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
                            />
                            <label htmlFor="shipping-info" className="ml-2 block text-sm text-gray-700">
                              Shipping information
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                        Generate Payment Copy
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="E-Commerce"
        apiKey="sk-7c6a8a160ab646be9e19793ba72812f4"
        apiType="deepseek"
      />
    </div>
  );
};

export default EcommerceSection;
