import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, UserCheck, Calendar, BookOpen, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import principal from "@/assets/principal.jpg";
import vicePrincipal from "@/assets/vice-principal.jpg";

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
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Admissions</h1>
          <p className="text-xl mb-2">Admission in Progress</p>
          <p className="text-lg opacity-90">Into JSS & SSS Classes</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Quality Teaching</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Affordable Fee</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Computer Based Education</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Conducive Learning Environment</p>
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