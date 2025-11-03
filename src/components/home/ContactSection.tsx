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
