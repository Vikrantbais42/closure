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
import { ShoppingCart, AlertTriangle, Loader2, Info, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  const logo = PlaceHolderImages.find((p) => p.id === 'logo');
  const appStores = PlaceHolderImages.find((p) => p.id === 'app-stores');

  // Logic for display toggles
  const showClosure = settings?.showClosureNotice ?? true;
  const showOnSale = settings?.showOnSale ?? false;

  // Dynamic Content with specific defaults
  const textEn = settings?.closureNoticeTextEn || "This Project is on Sale. Kindly Contact saatphere25@gmail.com, at just ₹108000. Complete Source Code available";
  const textHi = settings?.closureNoticeTextHi || "Yeh project sale k liye available hai. Contact kare saatphere25@gmail.com. kbl ₹108000 mein. Complete Source Code available";
  const saleInfo = settings?.saleInfoText || "The complete 'Saat Phere' project (Source Code, Domain, Branding) is available for immediate acquisition. Serious buyers only.";

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f9fa] p-4 sm:p-6 md:p-8 gap-6 transition-colors duration-500">
      
      {loading && (
        <div className="fixed top-4 right-4 animate-spin text-muted-foreground/30 z-50">
          <Loader2 size={16} />
        </div>
      )}

      {/* Main Notice Container */}
      {(showClosure || showOnSale) ? (
        <Card className={cn(
          "w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border-4 transition-all duration-500",
          showOnSale ? "border-accent shadow-accent/20" : "border-primary/20"
        )}>
          {/* Status Header */}
          {showOnSale && (
            <div className="bg-accent text-accent-foreground p-3 flex items-center justify-center gap-2 font-bold animate-pulse uppercase tracking-widest text-sm">
              <Gavel size={18} />
              <span>Public Listing: Asset for Immediate Acquisition</span>
              <Badge variant="outline" className="bg-black/10 text-black border-black/20 ml-2">Active</Badge>
            </div>
          )}

          <CardHeader className="bg-white p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-8">
              {/* Left Logo */}
              {logo && (
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={140}
                  height={140}
                  data-ai-hint={logo.imageHint}
                  className={cn(
                    "rounded-2xl border-2 shadow-lg transition-colors duration-500",
                    showOnSale ? "border-accent" : "border-primary/10"
                  )}
                  priority
                />
              )}
              
              <div className="text-center flex-1 space-y-2">
                <div className={cn(
                  "flex items-center justify-center gap-3 mb-2 transition-colors duration-500",
                  showOnSale ? "text-accent" : "text-primary"
                )}>
                  {showOnSale ? <ShoppingCart size={40} /> : <AlertTriangle size={40} />}
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter uppercase font-headline">
                    Asset Acquisition Notice
                  </CardTitle>
                </div>
                <CardDescription className="text-xl font-semibold text-foreground/70">
                  {showOnSale 
                    ? "Official Liquidation & Sales Registry" 
                    : "Legal Notice Regarding Asset Default & Liquidation"}
                </CardDescription>
              </div>

              {/* Right Logo (Symmetrical) */}
              {logo && (
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={140}
                  height={140}
                  data-ai-hint={logo.imageHint}
                  className={cn(
                    "rounded-2xl border-2 shadow-lg transition-colors duration-500",
                    showOnSale ? "border-accent" : "border-primary/10"
                  )}
                  priority
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-10 bg-white">
            <div className="space-y-10">
              {/* Sale Context Section */}
              {showOnSale && (
                <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-8 text-center space-y-4 shadow-inner">
                  <div className="flex items-center justify-center gap-2 text-accent font-black text-2xl uppercase tracking-widest">
                    <Info size={24} />
                    Acquisition Terms
                  </div>
                  <p className="text-2xl text-foreground font-bold italic leading-tight">
                    "{saleInfo}"
                  </p>
                </div>
              )}

              {/* Default Notice Section */}
              {showClosure && (
                <div className="space-y-8 text-foreground">
                  <div className="space-y-6 text-center max-w-4xl mx-auto">
                    <p className="text-2xl leading-relaxed font-bold text-foreground/80">
                      {textEn}
                    </p>
                    <Separator className="bg-primary/10" />
                    <p className="text-2xl leading-relaxed font-medium">
                      {textHi}
                    </p>
                  </div>

                  {!showOnSale && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                      <p className="text-xl font-black text-primary uppercase tracking-tighter">
                        Status: Frozen / Liquidation Pending
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-dashed">
                  <h3 className={cn("text-lg font-black uppercase tracking-widest flex items-center gap-2", showOnSale ? "text-accent" : "text-primary")}>
                    The Owner of this domain and website
                  </h3>
                  <div className="text-foreground/70 space-y-2 text-lg">
                    <p><span className="font-bold text-foreground">Subject:</span> Vijay Nagar Chauraha, Etawah</p>
                    <p><span className="font-bold text-foreground">Reference:</span> Asset Payment Default #108K</p>
                  </div>
                </div>

                <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-dashed flex flex-col justify-center">
                  <h3 className={cn("text-lg font-black uppercase tracking-widest mb-2", showOnSale ? "text-accent" : "text-primary")}>
                    Registry Status
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Badge variant="destructive" className="w-fit text-md py-1 px-4">OFFLINE PERMANENTLY</Badge>
                    {showOnSale && <Badge variant="secondary" className="w-fit bg-accent text-accent-foreground text-md py-1 px-4">AVAILABLE FOR SALE</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Footer Media */}
              <div className="space-y-8 text-center pt-4">
                <h3 className="text-xl font-black text-muted-foreground uppercase tracking-tighter">
                  Platform De-listed & Mobile Assets Terminated
                </h3>
                {appStores && (
                  <div className="flex justify-center">
                    <Image
                      src={appStores.imageUrl}
                      alt={appStores.description}
                      width={700}
                      height={180}
                      data-ai-hint={appStores.imageHint}
                      className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-not-allowed"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 border-t flex flex-col items-center gap-2">
            <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Verified Asset Registry - Document ID: SAT-2026-02-17
            </p>
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Liquidation Services. All Rights Reserved.
            </p>
          </CardFooter>
        </Card>
      ) : (
        /* Empty State */
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="bg-white p-12 rounded-full shadow-2xl inline-block border-4 border-accent">
            <Loader2 className="text-accent w-24 h-24 animate-spin" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">System Synchronizing</h2>
          <p className="text-muted-foreground text-xl font-medium">Registry records are being updated by the administrator...</p>
        </div>
      )}
    </main>
  );
}