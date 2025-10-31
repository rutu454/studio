'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Instagram, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionWrapper from '../common/SectionWrapper';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactSection = () => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Database service is not available. Please try again later.',
      });
      return;
    }

    try {
      await addDoc(collection(firestore, 'contactFormSubmissions'), {
        ...values,
        submissionDate: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: 'Your message has been sent. We will get back to you shortly.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: 'Uh oh! Something went wrong.',
        description: 'Could not send your message. Please try again.',
      });
    }
  }

  return (
    <SectionWrapper id="contact">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Contact Us</h2>
        <p className="text-lg text-foreground/80 mt-2">Have a question or want to get involved? Reach out!</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 bg-muted p-8 rounded-lg">
          <h3 className="text-2xl font-bold">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <MapPin className="text-primary mt-1 flex-shrink-0" />
              <span>Prasthan Group Office, 123 Unity Lane, Progress City, 12345</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-primary flex-shrink-0" />
              <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="text-primary flex-shrink-0" />
              <span>contact@prasthangroup.org</span>
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="p-3 bg-background rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram /></a>
            <a href="#" className="p-3 bg-background rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><MessageCircle /></a>
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} className="rounded-md" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="your.email@example.com" {...field} className="rounded-md" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number (Optional)</FormLabel>
                    <FormControl><Input placeholder="Your Phone Number" {...field} className="rounded-md" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea placeholder="Your message..." {...field} className="rounded-md" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="rounded-md" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
