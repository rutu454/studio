'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Instagram, Mail, Phone, MapPin, Facebook } from 'lucide-react';
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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M16.75 13.96c-.25.12-1.47.72-1.7.82-.22.09-.38.12-.54-.12-.16-.25-.6-0.75-.9-1.09-1.07-1.18-1.8-2.64-1.86-2.76-.06-.12.06-.18.18-.3.12-.12.25-.3.37-.43.12-.12.18-.22.28-.36.09-.15.06-.28 0-.42C12.55 9 11.95 7.5 11.75 7c-.2-.5-.4-.43-.54-.43h-.5c-.15 0-.36.06-.54.3-.18.25-.7.7-1.03 1.4-1 2.22-0.22 4.2.55 5.11 1.7 2.02 3.75 2.5 4.05 2.7.3.2.55.15.75-.09.2-.25.87-1.03 1-1.22.12-.2.25-.15.42-.09.18.06 1.17.55 1.35.65.18.09.3.12.36.09.06-.03.12-0.21-0.21-0.75zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
    </svg>
  );


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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
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
        description: 'Your message has been sent.',
      });
      form.reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Get in Touch</h2>
        <p className="text-lg text-foreground/80 mt-2">
          We would love to hear from you.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <MapPin className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Our Address</h3>
              <p className="text-muted-foreground">123 Unity Lane, Progress City, 12345</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Email Us</h3>
              <p className="text-muted-foreground">contact@prasthangroup.org</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Call Us</h3>
              <p className="text-muted-foreground">+1 (234) 567-890</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/prasthangroup/?hl=en" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={28} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={28} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><WhatsAppIcon className="w-7 h-7" /></a>
            </div>
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
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="+1 (234) 567-890" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Textarea placeholder="Your message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
