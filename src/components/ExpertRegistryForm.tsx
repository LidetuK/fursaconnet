import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Phone, 
  Mail, 
  Users, 
  Briefcase, 
  Code, 
  Upload, 
  Camera, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { uploadExpertPhotoToSupabase } from '@/lib/uploadExpertPhotoToSupabase';
import { uploadExpertCertificationsToSupabase } from '@/lib/uploadExpertCertificationsToSupabase';

// Form schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  gender: z.enum(['male', 'female']),
  currentlyEmployed: z.enum(['yes', 'no']),
  contractType: z.string().optional(),
  expertiseAreas: z.array(z.string()).min(1, 'At least one expertise area is required'),
  experience: z.enum(['less-than-1', '1-3', '4-5', '6-plus']),
});

type FormData = z.infer<typeof formSchema>;

const expertiseAreas = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Digital Marketing',
  'Content Creation', 'SEO', 'Social Media Management', 'Data Analysis',
  'Graphic Design', 'Video Editing', 'E-commerce', 'Project Management'
];

export const ExpertRegistryForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // Separate state for each step to prevent corruption
  const [step1Data, setStep1Data] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    gender: '' as 'male' | 'female' | ''
  });
  
  const [step2Data, setStep2Data] = useState({
    currentlyEmployed: '' as 'yes' | 'no' | '',
    contractType: ''
  });
  
  const [step3Data, setStep3Data] = useState({
    expertiseAreas: [] as string[],
    experience: '' as 'less-than-1' | '1-3' | '4-5' | '6-plus' | ''
  });
  
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPhotoDragOver, setIsPhotoDragOver] = useState(false);
  
  const certificationInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Validation functions for each step
  const validateStep1 = () => {
    if (!step1Data.name) return 'Name is required';
    if (!step1Data.phoneNumber) return 'Phone number is required';
    if (!step1Data.email) return 'Email is required';
    if (!step1Data.gender) return 'Gender is required';
    return null;
  };

  const validateStep2 = () => {
    if (!step2Data.currentlyEmployed) return 'Employment status is required';
    if (step2Data.currentlyEmployed === 'yes' && !step2Data.contractType) {
      return 'Contract type is required';
    }
    return null;
  };

  const validateStep3 = () => {
    if (step3Data.expertiseAreas.length === 0) return 'At least one expertise area is required';
    if (!step3Data.experience) return 'Experience level is required';
    return null;
  };

  const nextStep = () => {
    let error = null;
    
    switch (currentStep) {
      case 1:
        error = validateStep1();
        break;
      case 2:
        error = validateStep2();
        break;
      case 3:
        error = validateStep3();
        break;
    }
    
    if (error) {
      toast({
        title: "Incomplete Information",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExpertiseChange = (area: string, checked: boolean) => {
    setStep3Data(prev => ({
      ...prev,
      expertiseAreas: checked 
        ? [...prev.expertiseAreas, area]
        : prev.expertiseAreas.filter(a => a !== area)
    }));
  };

  const handleCertificationFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });
    
    setCertificationFiles(prev => [...prev, ...newFiles]);
  };

  const handlePassportPhoto = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validTypes = ['.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (validTypes.includes(fileExtension)) {
      setPassportPhoto(file);
    }
  };

  const removeCertificationFile = (index: number) => {
    setCertificationFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removePassportPhoto = () => {
    setPassportPhoto(null);
  };

  const handleDragOver = (e: React.DragEvent, isPhoto: boolean = false) => {
    e.preventDefault();
    if (isPhoto) {
      setIsPhotoDragOver(true);
    } else {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, isPhoto: boolean = false) => {
    e.preventDefault();
    if (isPhoto) {
      setIsPhotoDragOver(false);
    } else {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isPhoto: boolean = false) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    if (isPhoto) {
      setIsPhotoDragOver(false);
      handlePassportPhoto(files);
    } else {
      setIsDragOver(false);
      handleCertificationFiles(files);
    }
  };

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      // Upload passport photo to Supabase if present
      let passportPhotoUrl = '';
      if (passportPhoto) {
        try {
          passportPhotoUrl = await uploadExpertPhotoToSupabase(passportPhoto);
        } catch (uploadErr: any) {
          toast({ title: 'Photo upload failed', description: uploadErr.message || 'Could not upload photo. Please try again.', variant: 'destructive' });
          setSubmitting(false);
          return;
        }
      }
      
      // Upload certifications to Supabase if present
      let certificationUrls: string[] = [];
      if (certificationFiles.length > 0) {
        try {
          certificationUrls = await uploadExpertCertificationsToSupabase(certificationFiles);
        } catch (uploadErr: any) {
          toast({ title: 'Certification upload failed', description: uploadErr.message || 'Could not upload certifications. Please try again.', variant: 'destructive' });
          setSubmitting(false);
          return;
        }
      }
      
      // Prepare payload
      const payload = {
        name: step1Data.name,
        phoneNumber: step1Data.phoneNumber,
        email: step1Data.email,
        gender: step1Data.gender,
        currentlyEmployed: step2Data.currentlyEmployed,
        contractType: step2Data.contractType || '',
        expertiseAreas: JSON.stringify(step3Data.expertiseAreas),
        experience: step3Data.experience,
        certifications: JSON.stringify(certificationUrls),
        passportPhoto: passportPhotoUrl,
      };
      
      // Send to backend
      const response = await fetch('https://fursaconnet-production.up.railway.app/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        let errorMsg = 'Registration failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
        }
        toast({ title: 'Registration Failed', description: errorMsg, variant: 'destructive' });
        setSubmitting(false);
        return;
      }
      
      const result = await response.json();
      toast({
        title: "Registration Successful!",
        description: "Thank you for joining our expert network. We'll review your application and get back to you soon.",
      });
      
      // Reset form
      setStep1Data({ name: '', phoneNumber: '', email: '', gender: '' });
      setStep2Data({ currentlyEmployed: '', contractType: '' });
      setStep3Data({ expertiseAreas: [], experience: '' });
      setCertificationFiles([]);
      setPassportPhoto(null);
      setCurrentStep(1);
      setSubmitting(false);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-foreground">Personal Information</h3>
              <p className="text-muted-foreground">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input 
                  placeholder="Enter your full name" 
                  value={step1Data.name}
                  onChange={(e) => setStep1Data(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 mt-2"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input 
                  placeholder="Enter your phone number" 
                  value={step1Data.phoneNumber}
                  onChange={(e) => setStep1Data(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="h-12 mt-2"
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input 
                placeholder="Enter your email address" 
                value={step1Data.email}
                onChange={(e) => setStep1Data(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 mt-2"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gender *
              </Label>
              <RadioGroup
                value={step1Data.gender}
                onValueChange={(value: 'male' | 'female') => setStep1Data(prev => ({ ...prev, gender: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-foreground">Employment Status</h3>
              <p className="text-muted-foreground">Tell us about your current work situation</p>
            </div>

            <div className="space-y-3">
              <Label className="text-lg">Are you currently employed? *</Label>
              <RadioGroup
                value={step2Data.currentlyEmployed}
                onValueChange={(value: 'yes' | 'no') => setStep2Data(prev => ({ ...prev, currentlyEmployed: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="employed-yes" />
                  <Label htmlFor="employed-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="employed-no" />
                  <Label htmlFor="employed-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {step2Data.currentlyEmployed === 'yes' && (
              <div className="space-y-3">
                <Label className="text-lg">What is your contract type? *</Label>
                <RadioGroup
                  value={step2Data.contractType}
                  onValueChange={(value) => setStep2Data(prev => ({ ...prev, contractType: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freelance" id="contract-freelance" />
                    <Label htmlFor="contract-freelance">Freelance/Contract</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="part-time" id="contract-part-time" />
                    <Label htmlFor="contract-part-time">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-time" id="contract-full-time" />
                    <Label htmlFor="contract-full-time">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="contract-none" />
                    <Label htmlFor="contract-none">None of the Above</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Code className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-foreground">Expertise & Experience</h3>
              <p className="text-muted-foreground">Showcase your digital skills</p>
            </div>

            <div>
              <Label className="text-lg">Primary areas of digital expertise *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {expertiseAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={step3Data.expertiseAreas.includes(area)}
                      onCheckedChange={(checked) => handleExpertiseChange(area, checked as boolean)}
                    />
                    <Label 
                      htmlFor={area} 
                      className="text-sm cursor-pointer hover:text-primary transition-colors"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-lg">
                <Code className="w-4 h-4" />
                Years of experience in your field *
              </Label>
              <RadioGroup
                value={step3Data.experience}
                onValueChange={(value: 'less-than-1' | '1-3' | '4-5' | '6-plus') => setStep3Data(prev => ({ ...prev, experience: value }))}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-than-1" id="exp-less-than-1" />
                  <Label htmlFor="exp-less-than-1">Less than 1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-3" id="exp-1-3" />
                  <Label htmlFor="exp-1-3">1-3 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4-5" id="exp-4-5" />
                  <Label htmlFor="exp-4-5">4-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-plus" id="exp-6-plus" />
                  <Label htmlFor="exp-6-plus">6+ years</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-foreground">Documents & Photo</h3>
              <p className="text-muted-foreground">Upload your certifications and photo</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 text-lg mb-4">
                  <Star className="w-4 h-4" />
                  Digital Skills Certifications
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDrop={(e) => handleDrop(e)}
                  onClick={() => certificationInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop your certifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, JPG, PNG (Max 1TB)
                  </p>
                  <Input
                    ref={certificationInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleCertificationFiles(e.target.files)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {certificationFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertificationFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 text-lg mb-4">
                  <Camera className="w-4 h-4" />
                  Recent Passport Photo *
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isPhotoDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                  onDragOver={(e) => handleDragOver(e, true)}
                  onDragLeave={(e) => handleDragLeave(e, true)}
                  onDrop={(e) => handleDrop(e, true)}
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a recent passport-style photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG (Max 10MB)
                  </p>
                  <Input
                    ref={photoInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handlePassportPhoto(e.target.files)}
                  />
                </div>
                {passportPhoto && (
                  <div className="mt-4 flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-sm">{passportPhoto.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePassportPhoto}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                i + 1 <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1 < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{i + 1}</span>
                )}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-12 h-1 mx-2 transition-all ${
                  i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="w-full h-2 mb-4" />
        <CardTitle className="text-3xl font-bold text-primary">
          Talent Pre-qualification Form
        </CardTitle>
        <CardDescription className="text-base">
          Step {currentStep} of {totalSteps} - Let's build your expert profile
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {currentStep < totalSteps ? (
          <div className="space-y-8">
            {renderStep()}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {renderStep()}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
