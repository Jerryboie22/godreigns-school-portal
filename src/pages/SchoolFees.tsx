import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building, Phone, Mail, Calendar, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const SchoolFees = () => {
  const schoolFees = [
    {
      class: "JSS 1",
      freshStudents: "₦100,500",
      returningStudents: "N/A",
      notes: "Fresh students with E-books & Exercise books (Textbooks not included)"
    },
    {
      class: "JSS 2", 
      freshStudents: "₦175,500",
      returningStudents: "₦115,500",
      notes: "Returning students in JSS 2 are 10 days in 8 months"
    },
    {
      class: "JSS 3",
      freshStudents: "N/A",
      returningStudents: "N/A", 
      notes: "Refer to JSS 3 bill for fresh students. The JSS 3 bill is for the period"
    },
    {
      class: "SSS 1 (Science)",
      freshStudents: "₦185,500",
      returningStudents: "N/A",
      notes: "Fresh students with E-notes & Exercise books (Textbooks not included)"
    },
    {
      class: "SSS 1 (Others)",
      freshStudents: "₦179,500",
      returningStudents: "N/A",
      notes: ""
    },
    {
      class: "SSS 2 (Science)",
      freshStudents: "₦195,500",
      returningStudents: "₦122,500",
      notes: ""
    },
    {
      class: "SSS 2 (Others)",
      freshStudents: "N/A",
      returningStudents: "₦122,500",
      notes: ""
    }
  ];

  const boardingFees = [
    {
      class: "JSS 1-3",
      hostelOnly: "₦200,000",
      hostelChurch: "₦50,000",
      uniforms: "₦50,000"
    },
    {
      class: "SSS 1-3", 
      hostelOnly: "₦200,000",
      hostelChurch: "₦50,000",
      uniforms: "₦50,000"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">School Fees</h1>
          <p className="text-xl mb-2">2025/2026 Academic Session</p>
          <p className="text-lg opacity-90">Consolidated School Bill for First Term</p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-3 p-4 bg-secondary/20 rounded-lg border border-secondary/30">
              <AlertCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <h3 className="font-semibold text-secondary mb-2">Important Payment Information</h3>
                <p className="text-sm text-muted-foreground">
                  All payments must be made before resumption. Please note that payments are not refundable. 
                  Payments should be made to the following account. Please bring the deposit slip to the 
                  school / contact the school when transfer is made to obtain receipt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Fees Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">School Fees Structure</h2>
            <p className="text-lg text-muted-foreground">2025/2026 First Term Fees</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Day School Fees</CardTitle>
                <CardDescription>Fees for day students (Fresh students with E-books & Exercise books - Textbooks not included)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-primary">Class</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">School Fee (Fresh Students)</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">School Fee (Returning Students)</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolFees.map((fee, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Badge variant="outline">{fee.class}</Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold text-primary">{fee.freshStudents}</td>
                          <td className="py-3 px-4 font-semibold text-secondary">{fee.returningStudents}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{fee.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Boarding Fees */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Boarding Fees</h2>
            <p className="text-lg text-muted-foreground">Additional fees for boarding students</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Boarding School Fees</CardTitle>
                <CardDescription>Additional fees for students staying in the hostel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-primary">Class Level</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Hostel Fee (Boarders Only)</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Hostel / Church Wears (Fresh Boarders Only)</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Hostel Uniforms (Fresh Boarders Only)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardingFees.map((fee, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Badge variant="outline">{fee.class}</Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold text-primary">{fee.hostelOnly}</td>
                          <td className="py-3 px-4 font-semibold text-secondary">{fee.hostelChurch}</td>
                          <td className="py-3 px-4 font-semibold text-accent">{fee.uniforms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Payment Methods</h2>
            <p className="text-lg text-muted-foreground">Secure and convenient payment options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <CreditCard className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">Online Payment</CardTitle>
                    <CardDescription>Secure card payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-lg text-center">
                    <p className="text-accent font-semibold mb-2">Coming Soon!</p>
                    <p className="text-sm text-muted-foreground">
                      Online card payment system will be available soon for your convenience.
                    </p>
                  </div>
                  <Button className="w-full" disabled>
                    Pay with Card (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Building className="h-6 w-6 text-secondary group-hover:text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">Bank Transfer</CardTitle>
                    <CardDescription>Direct bank payment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-semibold">ACCESS BANK PLC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span className="font-semibold">OUR GOD REIGNS CRYSTAL SCHOOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number:</span>
                      <span className="font-semibold text-primary">0029836079</span>
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Please bring the deposit slip to the school or contact the school when transfer is made to obtain receipt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Payment */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Payment Support</h2>
            <p className="text-lg text-muted-foreground">Contact us for payment assistance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Phone</h3>
                <div className="space-y-1">
                  <a href="tel:+2348027625129" className="text-sm text-muted-foreground hover:text-primary block">
                    +234 802 762 5129
                  </a>
                  <a href="tel:+2348033089735" className="text-sm text-muted-foreground hover:text-primary block">
                    +234 803 308 9735
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Mail className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Email</h3>
                <a href="mailto:ogrcs@yahoo.com" className="text-sm text-muted-foreground hover:text-primary">
                  ogrcs@yahoo.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Building className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Visit Office</h3>
                <p className="text-sm text-muted-foreground">School Bursary Office</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                  <Calendar className="h-8 w-8 text-navy group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Office Hours</h3>
                <p className="text-sm text-muted-foreground">Mon - Fri: 8AM - 4PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Make Payment?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you and God bless - Management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`data:text/plain;charset=utf-8,${encodeURIComponent('School Fee Structure 2025/2026\nOur God Reigns Crystal School\n\nJSS 1: ₦100,500 (Fresh Students)\nJSS 2: ₦175,500 (Fresh), ₦115,500 (Returning)\nSSS 1 Science: ₦185,500 (Fresh)\nSSS 1 Others: ₦179,500 (Fresh)\nSSS 2 Science: ₦195,500 (Fresh), ₦122,500 (Returning)\nSSS 2 Others: ₦122,500 (Returning)\n\nBoarding Fees: ₦200,000\nUniforms: ₦50,000\n\nBank Details:\nAccount Name: OUR GOD REIGNS CRYSTAL SCHOOL\nAccount Number: 0029836079\nBank: ACCESS BANK PLC')}`} download="School_Fee_Structure_2025_2026.txt">
              <Button size="lg" className="text-lg px-8">
                Download Fee Structure
              </Button>
            </a>
            <a href="tel:+2348027625129">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Bursary
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolFees;