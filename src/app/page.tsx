import { Lock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10">
        <CardHeader className="bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary font-headline">
            Project Closure Notice
          </CardTitle>
          <CardDescription className="pt-2 text-md text-muted-foreground">
            Important announcement regarding the "Saat Phere" project.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6 text-center text-foreground">
            <p className="text-lg leading-relaxed">
              Mr. Manoj Kumar, owner of Saat Phere project, has defaulted on payment of{' '}
              <span className="font-bold text-destructive">₹1,08,000/-</span> despite full completion of the agreed work. He has stopped responding to calls and messages.
            </p>
            <p className="text-lg font-semibold text-primary">
              Due to this, the Saat Phere project is closed and will never come online again.
            </p>
          </div>

          <Separator className="my-8" />

          <div className="space-y-2 text-center">
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
