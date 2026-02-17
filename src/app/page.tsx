import Image from 'next/image';
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

export default function Home() {
  const logo = PlaceHolderImages.find((p) => p.id === 'logo');
  const clientPhoto = PlaceHolderImages.find((p) => p.id === 'client-photo');

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
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
              />
            )}
            <div className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-primary font-headline">
                Project Closure Notice
              </CardTitle>
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
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <div className="space-y-6 text-foreground">
            <div className="space-y-4 text-center">
              <p className="text-lg leading-relaxed">
                Mr. Manoj Kumar, owner of Saat Phere project, has defaulted on payment of{' '}
                <span className="font-bold text-primary">₹1,08,000/-</span> despite full completion of the agreed work. He has stopped responding to calls and messages.
              </p>
              <p className="text-lg font-semibold text-primary">
                Due to this, the Saat Phere project is closed and will never come online again.
              </p>
            </div>

            <Separator />

            <div className="space-y-4 text-center">
              <p className="text-lg leading-relaxed">
                Mr. Manoj Kumar, owner of Saat Phere project, ne agreed kaam fully complete hone ke baad bhi <span className="font-bold text-primary">₹1,08,000/-</span> ka payment nhi kiya hai. or na hi Calls aur messages ka koi response diya ja raha hai. Unke ek business partner Mr. Rahul ne mujhe call kr k bola tha payment 10th feb 2026 tk ho jayegi tb tk k liye app yeh Project Closure Notice Hata dijiye or meine bhi whi kiya lekin aaj 17th feb ko jb meine Rahul ko call ki tho bo mujhe galt language ka use krne lge jis ki wjh se meine yeh Notice phr se aaj Live Kiya hai.... or yeh notice ab ni hatega.. jis ko jo krna ho bo kr sakte hai...
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
        </CardContent>
        <CardFooter className="bg-muted/30 p-4">
          <p className="w-full text-center text-xs text-muted-foreground">This notice is final and irrevocable.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
