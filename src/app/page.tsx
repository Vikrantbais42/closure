'use client';

import Image from 'next/image';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react';

export default function Home() {
  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  const logo = PlaceHolderImages.find((p) => p.id === 'logo');
  const clientPhoto = PlaceHolderImages.find((p) => p.id === 'client-photo');
  const appStores = PlaceHolderImages.find((p) => p.id === 'app-stores');

  // Use values from settings if available, otherwise use defaults for instant visibility
  const showClosure = settings?.showClosureNotice ?? true;
  const showOnSale = settings?.showOnSale ?? false;
  const textEn = settings?.closureNoticeTextEn || "The Owner of this domain and website has defaulted on payment of ₹1,08,000/- despite full completion of the agreed work. He has stopped responding to calls and messages.";
  const textHi = settings?.closureNoticeTextHi || "The Owner of this domain and website ne agreed kaam fully complete hone ke baad bhi ₹1,08,000/- ka payment nhi kiya hai. or na hi Calls aur messages ka koi response diya ja raha hai. Unke ek business partner Mr. Rahul ne mujhe call kr k bola tha payment 10th feb 2026 tk ho jayegi tb tk k liye app yeh Project Closure Notice Hata dijiye or meine bhi whi kiya lekin aaj 17th feb ko jb meine Rahul ko call ki tho bo mujhe galt language ka use krne lge jis ki wjh se meine yeh Notice phr se aaj Live Kiya hai.... or yeh notice ab ni hatega.. jis ko jo krna ho bo kr sakte hai...";

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 gap-6">
      
      {/* Background loading indicator (optional, very subtle) */}
      {loading && (
        <div className="fixed top-4 right-4 animate-spin text-muted-foreground/30">
          <Loader2 size={16} />
        </div>
      )}

      {/* On Sale Notice */}
      {showOnSale && (
        <Card className="w-full max-w-5xl border-2 border-accent/30 bg-accent/5 shadow-xl animate-pulse">
          <CardHeader className="p-4 flex flex-row items-center gap-4">
            <div className="bg-accent p-2 rounded-full">
              <ShoppingCart className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-accent font-bold">PROJECT FOR SALE</CardTitle>
              <CardDescription>This domain and complete project code are available for purchase.</CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto border-accent text-accent">Limited Time</Badge>
          </CardHeader>
        </Card>
      )}

      {/* Closure Notice */}
      {showClosure && (
        <Card className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10">
          <CardHeader className="bg-card p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
              {logo && (
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={120}
                  height={120}
                  data-ai-hint={logo.imageHint}
                  className="rounded-full border-4 border-primary/20"
                  priority
                />
              )}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <AlertTriangle size={24} />
                  <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
                    Project Closure Notice
                  </CardTitle>
                </div>
                <CardDescription className="pt-2 text-md text-muted-foreground">
                  Important announcement regarding the "Saat Phere" project.
                </CardDescription>
              </div>
              {clientPhoto && (
                <Image
                  src={clientPhoto.imageUrl}
                  alt={clientPhoto.description}
                  width={120}
                  height={120}
                  data-ai-hint={clientPhoto.imageHint}
                  className="rounded-full border-4 border-primary/20"
                  priority
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="space-y-6 text-foreground">
              <div className="space-y-4 text-center">
                <p className="text-lg leading-relaxed">
                  {textEn}
                </p>
                <p className="text-lg font-semibold text-primary">
                  Due to this, the Saat Phere project is closed and will never come online again.
                </p>
              </div>

              <Separator />

              <div className="space-y-4 text-center">
                <p className="text-lg leading-relaxed">
                  {textHi}
                </p>
                <p className="text-lg font-semibold text-primary">
                  Is wajah se, Saat Phere project band ho gaya hai aur kabhi bhi online nahi aayega.
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold text-accent">
                Client Information
              </h3>
              <div className="text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground/80">Client Name:</span> Manoj Kumar
                </p>
                <p>
                  <span className="font-semibold text-foreground/80">Address:</span> Vijay Nagar Chauraha, Etawah
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold text-accent">
                App Removed from App Store and Play Store
              </h3>
              {appStores && (
                <div className="flex justify-center mt-4">
                  <Image
                    src={appStores.imageUrl}
                    alt={appStores.description}
                    width={500}
                    height={125}
                    data-ai-hint={appStores.imageHint}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4">
            <p className="w-full text-center text-xs text-muted-foreground">This notice is final and irrevocable.</p>
          </CardFooter>
        </Card>
      )}

      {/* Message when everything is hidden */}
      {!showClosure && !showOnSale && (
        <div className="text-center space-y-4">
          <div className="bg-primary/10 p-6 rounded-full inline-block">
            <Loader2 className="text-primary w-12 h-12 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">System Maintenance</h2>
          <p className="text-muted-foreground">The site is currently being updated. Please check back later.</p>
        </div>
      )}
    </main>
  );
}
