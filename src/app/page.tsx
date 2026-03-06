
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
import { ShoppingCart, AlertTriangle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  const logo = PlaceHolderImages.find((p) => p.id === 'logo');
  const clientPhoto = PlaceHolderImages.find((p) => p.id === 'client-photo');
  const appStores = PlaceHolderImages.find((p) => p.id === 'app-stores');

  // Logic for display toggles
  const showClosure = settings?.showClosureNotice ?? true;
  const showOnSale = settings?.showOnSale ?? false;

  // Dynamic Content with fallback defaults
  const textEn = settings?.closureNoticeTextEn || "The Owner of this domain and website has defaulted on payment of ₹1,08,000/- despite full completion of the agreed work. He has stopped responding to calls and messages.";
  const textHi = settings?.closureNoticeTextHi || "The Owner of this domain and website ne agreed kaam fully complete hone ke baad bhi ₹1,08,000/- ka payment nhi kiya hai. or na hi Calls aur messages ka koi response diya ja raha hai. Unke ek business partner Mr. Rahul ne mujhe call kr k bola tha payment 10th feb 2026 tk ho jayegi tb tk k liye app yeh Project Closure Notice Hata dijiye or meine bhi whi kiya lekin aaj 17th feb ko jb meine Rahul ko call ki tho bo mujhe galt language ka use krne lge jis ki wjh se meine yeh Notice phr se aaj Live Kiya hai.... or yeh notice ab ni hatega.. jis ko jo krna ho bo kr sakte hai...";
  const saleInfo = settings?.saleInfoText || "This complete project including source code, domain, and branding assets is available for immediate acquisition. Serious inquiries only.";

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 gap-6 transition-colors duration-500">
      
      {loading && (
        <div className="fixed top-4 right-4 animate-spin text-muted-foreground/30 z-50">
          <Loader2 size={16} />
        </div>
      )}

      {/* Main Notice Container */}
      {(showClosure || showOnSale) ? (
        <Card className={cn(
          "w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl border-2 transition-all duration-500",
          showOnSale ? "border-accent/40 shadow-accent/10" : "border-primary/10"
        )}>
          {/* Status Header */}
          {showOnSale && (
            <div className="bg-accent text-accent-foreground p-3 flex items-center justify-center gap-2 font-bold animate-pulse">
              <ShoppingCart size={18} />
              <span>OFFER: PROJECT AVAILABLE FOR SALE</span>
              <Badge variant="outline" className="bg-white/20 text-white border-white/40 ml-2">Limited Time</Badge>
            </div>
          )}

          <CardHeader className="bg-card p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6">
              {logo && (
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={140}
                  height={140}
                  data-ai-hint={logo.imageHint}
                  className={cn(
                    "rounded-full border-4 transition-colors duration-500",
                    showOnSale ? "border-accent/40" : "border-primary/20"
                  )}
                  priority
                />
              )}
              <div className="text-center flex-1">
                <div className={cn(
                  "flex items-center justify-center gap-3 mb-2 transition-colors duration-500",
                  showOnSale ? "text-accent" : "text-primary"
                )}>
                  {showOnSale ? <ShoppingCart size={32} /> : <AlertTriangle size={32} />}
                  <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase font-headline">
                    Asset Acquisition Notice
                  </CardTitle>
                </div>
                <CardDescription className="pt-2 text-lg font-medium">
                  {showOnSale 
                    ? "The 'Saat Phere' project is officially listed for sale." 
                    : "Important announcement regarding the 'Saat Phere' project status."}
                </CardDescription>
              </div>
              {clientPhoto && (
                <Image
                  src={clientPhoto.imageUrl}
                  alt={clientPhoto.description}
                  width={140}
                  height={140}
                  data-ai-hint={clientPhoto.imageHint}
                  className={cn(
                    "rounded-full border-4 transition-colors duration-500",
                    showOnSale ? "border-accent/40" : "border-primary/20"
                  )}
                  priority
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8">
            <div className="space-y-8">
              {/* Sale Context Section */}
              {showOnSale && (
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-accent font-bold text-xl uppercase tracking-wider">
                    <Info size={20} />
                    Acquisition Details
                  </div>
                  <p className="text-lg text-foreground/90 italic">
                    "{saleInfo}"
                  </p>
                </div>
              )}

              {/* Default Notice Section */}
              {showClosure && (
                <div className="space-y-6 text-foreground">
                  <div className="space-y-4 text-center">
                    <p className="text-xl leading-relaxed font-medium">
                      {textEn}
                    </p>
                    {!showOnSale && (
                      <p className="text-xl font-bold text-primary">
                        Due to these circumstances, the Saat Phere project is closed and is now being liquidated.
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4 text-center">
                    <p className="text-xl leading-relaxed">
                      {textHi}
                    </p>
                    {!showOnSale && (
                      <p className="text-xl font-bold text-primary">
                        Is wajah se, Saat Phere project band ho gaya hai aur ise ab becha ja raha hai.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className={cn("text-lg font-bold uppercase tracking-widest", showOnSale ? "text-accent" : "text-primary")}>
                    Owner/Client Record
                  </h3>
                  <div className="text-muted-foreground space-y-1">
                    <p><span className="font-bold text-foreground">Name:</span> Manoj Kumar</p>
                    <p><span className="font-bold text-foreground">Address:</span> Vijay Nagar Chauraha, Etawah</p>
                  </div>
                </div>

                <div className="space-y-4 text-center md:text-right">
                  <h3 className={cn("text-lg font-bold uppercase tracking-widest", showOnSale ? "text-accent" : "text-primary")}>
                    Project Status
                  </h3>
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <Badge variant="destructive" className="w-fit">Permanently Offline</Badge>
                    {showOnSale && <Badge variant="secondary" className="w-fit bg-accent text-accent-foreground">Available for Purchase</Badge>}
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Footer Media */}
              <div className="space-y-6 text-center">
                <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">
                  App Removed from App Store and Play Store
                </h3>
                {appStores && (
                  <div className="flex justify-center">
                    <Image
                      src={appStores.imageUrl}
                      alt={appStores.description}
                      width={600}
                      height={150}
                      data-ai-hint={appStores.imageHint}
                      className="opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 border-t">
            <p className="w-full text-center text-sm font-medium text-muted-foreground">
              Official Status Page - Document Version 2.2 - {new Date().getFullYear()}
            </p>
          </CardFooter>
        </Card>
      ) : (
        /* Empty State (Maintenance/Hidden) */
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-primary/10 p-8 rounded-full inline-block">
            <Loader2 className="text-primary w-16 h-16 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold">System Status: Updating</h2>
          <p className="text-muted-foreground text-lg">The project visibility settings are being modified by the administrator.</p>
        </div>
      )}
    </main>
  );
}
