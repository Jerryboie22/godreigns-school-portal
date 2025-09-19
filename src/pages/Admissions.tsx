import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, UserCheck, Calendar, BookOpen, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import principal from "@/assets/principal.jpg";
import vicePrincipal from "@/assets/vice-principal.jpg";
import admissionFlyer from "@/assets/admission-flyer.jpg";
import graduands from "@/assets/graduands.jpg";

const Admissions = () => {
  const admissionSteps = [
    {
      step: 1,
      title: "Application Form",
      description: "Complete and submit the admission application form",
      icon: FileText
    },
    {
      step: 2,
      title: "Document Submission", 
      description: "Submit required documents and credentials",
      icon: UserCheck
    },
    {
      step: 3,
      title: "Assessment",
      description: "Take the entrance examination and interview",
      icon: BookOpen
    },
    {
      step: 4,
      title: "Admission",
      description: "Receive admission letter and complete enrollment",
      icon: CheckCircle
    }
  ];

  const requirements = [
    "Birth Certificate or Declaration of Age",
    "Previous School Report Card/Result",
    "Transfer Certificate (for transfer students)",
    "Recent Passport Photographs (4 copies)",
    "Medical Report/Health Certificate",
    "Parent/Guardian Identification"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Graduation Image */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-green-700 to-yellow-500 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto lg:mx-0 mb-4" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Admissions Open</h1>
              <p className="text-xl md:text-2xl mb-2 text-yellow-200">2025/2026 Academic Session</p>
              <p className="text-lg md:text-xl mb-6">Into JSS & SSS Classes</p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-center mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
                  <p className="font-semibold text-xs md:text-sm">Quality Teaching</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
                  <p className="font-semibold text-xs md:text-sm">Affordable Fee</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
                  <p className="font-semibold text-xs md:text-sm">Computer Based Education</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
                  <p className="font-semibold text-xs md:text-sm">Conducive Learning</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={graduands} 
                alt="Our God Reigns Crystal School Graduates"
                className="rounded-lg shadow-2xl w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Flyer Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 via-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">Join Our School Family</h2>
            <div className="bg-white rounded-lg shadow-elegant p-8">
              <img 
                src={admissionFlyer} 
                alt="Our God Reigns Crystal School - Admission Flyer"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              <div className="mt-6 text-left max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-primary mb-4">Why Choose Our God Reigns Crystal School?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm md:text-base">Quality Teaching with experienced educators</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm md:text-base">Affordable Fee structure for all families</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm md:text-base">Computer Based Education with modern facilities</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm md:text-base">Conducive Learning Environment</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm md:text-base">Character development with Christian values</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Admission Process</h2>
            <p className="text-lg text-muted-foreground">Simple steps to join our school family</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {admissionSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.step} className="text-center group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <Badge variant="secondary" className="w-fit mx-auto mb-2">Step {step.step}</Badge>
                    <CardTitle className="text-primary">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Admission Requirements</h2>
              <p className="text-lg text-muted-foreground">Documents needed for successful application</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-primary">2025/2026 Session</h4>
                    <p className="text-muted-foreground">Registration ongoing for JSS and SSS classes</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold text-secondary">Entrance Exam</h4>
                    <p className="text-muted-foreground">Dates will be communicated to applicants</p>
                  </div>
                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold text-accent">School Resumption</h4>
                    <p className="text-muted-foreground">First term 2025/2026 session</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Contact Admissions Office</h2>
            <p className="text-lg text-muted-foreground">Get in touch for admission inquiries</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <img 
                  src={principal} 
                  alt="Pastor Joseph Oladele"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-primary mb-1">Pastor Joseph Oladele</h3>
                <p className="text-accent font-medium mb-2">Principal</p>
                <div className="space-y-1">
                  <a href="tel:+2348147059222" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-1" />
                    +234 814 705 9222
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <img 
                  src={vicePrincipal} 
                  alt="Mrs Abosede Taiwo"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-primary mb-1">Mrs Abosede Taiwo</h3>
                <p className="text-accent font-medium mb-2">Vice Principal</p>
                <div className="space-y-1">
                  <a href="tel:+2348067795900" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-1" />
                    +234 806 779 5900
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                  <Phone className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-1">General Line</h3>
                <p className="text-accent font-medium mb-2">School Office</p>
                <div className="space-y-1">
                  <a href="tel:+2348027625129" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-1" />
                    +234 802 762 5129
                  </a>
                  <a href="tel:+2348033089735" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-1" />
                    +234 803 308 9735
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center">
                  <Mail className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-1">Email Us</h3>
                <p className="text-accent font-medium mb-2">Admissions</p>
                <div className="space-y-1">
                  <a href="mailto:ogrcs@yahoo.com" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-1" />
                    ogrcs@yahoo.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Apply?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join the Our God Reigns Crystal School family today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:ogrcs@yahoo.com?subject=Application Form Request&body=Dear Management, I would like to request an application form for admission. Please send me the necessary documents.">
              <Button size="lg" className="text-lg px-8">
                Request Application Form
              </Button>
            </a>
            <a href="tel:+2348147059222">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Schedule Visit
              </Button>
            </a>
            <Link to="/school-fees">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                View School Fees
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;