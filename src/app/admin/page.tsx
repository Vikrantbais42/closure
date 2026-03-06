'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Settings, LogOut, CheckCircle2, Loader2, ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  // Local state for textareas
  const [textEn, setTextEn] = useState('');
  const [textHi, setTextHi] = useState('');
  const [saleInfo, setSaleInfo] = useState('');

  // Sync local state when settings load
  useEffect(() => {
    if (settings) {
      setTextEn(settings.closureNoticeTextEn || '');
      setTextHi(settings.closureNoticeTextHi || '');
      setSaleInfo(settings.saleInfoText || '');
    }
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPass) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleUpdateSettings = (updates: any) => {
    if (!settingsRef) return;
    
    setDoc(settingsRef, updates, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: updates,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    setSuccess('Settings updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2 text-primary">
              <Lock size={48} />
            </div>
            <CardTitle className="text-2xl text-center font-bold tracking-tight">System Control</CardTitle>
            <CardDescription className="text-center">
              Authenticate to manage project visibility and notices.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Administrator Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Security Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg font-bold">Access Panel</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                Site Configuration
                {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              </h1>
              <p className="text-muted-foreground">Manage global visibility and project status notices.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/"><Eye className="mr-2 h-4 w-4" /> View Site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card className="border-2">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle>Visibility Controls</CardTitle>
              <CardDescription>Toggle active notices on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-8 p-6">
              <div className="space-y-4 p-4 rounded-xl border-2 border-primary/10 bg-primary/5">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="closure"
                    className="mt-1"
                    checked={settings?.showClosureNotice ?? true}
                    onCheckedChange={(checked) => handleUpdateSettings({ showClosureNotice: !!checked })}
                    disabled={loading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="closure" className="text-lg font-bold">Project Closure Notice</Label>
                    <p className="text-sm text-muted-foreground">Show the main default payment notice card.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-xl border-2 border-accent/20 bg-accent/5">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="onsale"
                    className="mt-1"
                    checked={settings?.showOnSale ?? false}
                    onCheckedChange={(checked) => handleUpdateSettings({ showOnSale: !!checked })}
                    disabled={loading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="onsale" className="text-lg font-bold text-accent">Project On Sale Status</Label>
                    <p className="text-sm text-muted-foreground">Transform the site into an "Asset Acquisition" view.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle>Content Editor</CardTitle>
              <CardDescription>Update the narratives and sale information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="saleInfo" className="text-accent font-bold">Acquisition Details (On Sale Text)</Label>
                <Textarea
                  id="saleInfo"
                  rows={2}
                  className="border-accent/20 focus-visible:ring-accent"
                  placeholder="Details for serious buyers..."
                  value={saleInfo}
                  onChange={(e) => setSaleInfo(e.target.value)}
                  onBlur={() => handleUpdateSettings({ saleInfoText: saleInfo })}
                  disabled={loading && !settings}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textEn" className="font-bold">Closure Notice (English)</Label>
                <Textarea
                  id="textEn"
                  rows={4}
                  placeholder="Enter English notice..."
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                  onBlur={() => handleUpdateSettings({ closureNoticeTextEn: textEn })}
                  disabled={loading && !settings}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textHi" className="font-bold">Closure Notice (Hinglish)</Label>
                <Textarea
                  id="textHi"
                  rows={6}
                  placeholder="Enter Hinglish notice..."
                  value={textHi}
                  onChange={(e) => setTextHi(e.target.value)}
                  onBlur={() => handleUpdateSettings({ closureNoticeTextHi: textHi })}
                  disabled={loading && !settings}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t py-3 text-xs text-muted-foreground italic flex justify-center">
              Changes are committed automatically when you lose focus on a text field.
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}