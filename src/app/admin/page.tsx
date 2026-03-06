'use client';

import { useState, useEffect, useRef } from 'react';
import { useDoc, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Settings, LogOut, CheckCircle2, Loader2, ShoppingCart, Eye, Save, AlertCircle, Gavel } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  // Local state for all fields
  const [showClosure, setShowClosure] = useState(true);
  const [showOnSale, setShowOnSale] = useState(false);
  const [textEn, setTextEn] = useState('');
  const [textHi, setTextHi] = useState('');
  const [saleInfo, setSaleInfo] = useState('');

  // Use a ref to track if we've initialized local state from server data
  const hasInitialized = useRef(false);

  // Sync local state when settings load
  useEffect(() => {
    if (settings && !hasInitialized.current && !saving) {
      setShowClosure(settings.showClosureNotice ?? true);
      setShowOnSale(settings.showOnSale ?? false);
      setTextEn(settings.closureNoticeTextEn || '');
      setTextHi(settings.closureNoticeTextHi || '');
      setSaleInfo(settings.saleInfoText || '');
      hasInitialized.current = true;
    }
  }, [settings, saving]);

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

  const handleSaveAll = async () => {
    if (!settingsRef) {
      setError('System Error: Firestore not initialized.');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    const updates = {
      showClosureNotice: showClosure,
      showOnSale: showOnSale,
      closureNoticeTextEn: textEn,
      closureNoticeTextHi: textHi,
      saleInfoText: saleInfo,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await setDoc(settingsRef, updates, { merge: true });
      setSuccess('Asset Acquisition settings saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save changes. Please check Security Rules.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f2f5] p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2 text-primary">
              <Lock size={48} />
            </div>
            <CardTitle className="text-2xl text-center font-bold tracking-tight uppercase">Registry Access</CardTitle>
            <CardDescription className="text-center">
              Authenticate to manage Asset Acquisition Notice and Liquidation.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Admin ID</Label>
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
                <Label htmlFor="password">Security Key</Label>
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
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg font-bold uppercase">Enter Registry</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f2f5] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-xl text-white shadow-lg">
              <Gavel size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 uppercase">
                Asset Control Center
                {(loading || saving) && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
              </h1>
              <p className="text-muted-foreground font-medium">Manage notices, liquidation text, and acquisition listing.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="font-bold">
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

        {error && (
          <Alert variant="destructive" className="animate-in shake duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>System Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="uppercase text-lg">Display Configuration</CardTitle>
              <CardDescription>Toggle visibility of the acquisition notices.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-8 p-6">
              <div className={`space-y-4 p-5 rounded-2xl border-2 transition-all ${showClosure ? 'border-primary/40 bg-primary/5 shadow-inner' : 'border-muted bg-muted/5'}`}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="closure"
                    className="mt-1"
                    checked={showClosure}
                    onCheckedChange={(checked) => setShowClosure(!!checked)}
                  />
                  <div className="grid gap-1 leading-none cursor-pointer" onClick={() => setShowClosure(!showClosure)}>
                    <Label htmlFor="closure" className="text-lg font-black uppercase">Asset Acquisition Notice</Label>
                    <p className="text-sm text-muted-foreground">Show the main legal default/liquidation card.</p>
                  </div>
                </div>
              </div>

              <div className={`space-y-4 p-5 rounded-2xl border-2 transition-all ${showOnSale ? 'border-accent bg-accent/5 shadow-inner' : 'border-muted bg-muted/5'}`}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="onsale"
                    className="mt-1"
                    checked={showOnSale}
                    onCheckedChange={(checked) => setShowOnSale(!!checked)}
                  />
                  <div className="grid gap-1 leading-none cursor-pointer" onClick={() => setShowOnSale(!showOnSale)}>
                    <Label htmlFor="onsale" className={`text-lg font-black uppercase ${showOnSale ? 'text-accent' : ''}`}>Acquisition Listing</Label>
                    <p className="text-sm text-muted-foreground">List the project as available for purchase.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="uppercase text-lg">Content Management</CardTitle>
              <CardDescription>Update the notice narratives and acquisition terms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="space-y-2">
                <Label htmlFor="saleInfo" className="text-accent font-black flex items-center gap-2 uppercase tracking-tight">
                  <ShoppingCart size={18} /> Acquisition Details
                </Label>
                <Textarea
                  id="saleInfo"
                  rows={2}
                  className="border-accent/30 focus-visible:ring-accent text-lg"
                  placeholder="Terms of sale (e.g. Domain + Source Code + Branding)..."
                  value={saleInfo}
                  onChange={(e) => setSaleInfo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textEn" className="font-black uppercase tracking-tight">Asset Notice (English)</Label>
                <Textarea
                  id="textEn"
                  rows={4}
                  className="text-lg leading-relaxed"
                  placeholder="Primary notice regarding payment default and liquidation..."
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textHi" className="font-black uppercase tracking-tight">Asset Notice (Regional/Hinglish)</Label>
                <Textarea
                  id="textHi"
                  rows={5}
                  className="text-lg leading-relaxed"
                  placeholder="Secondary regional notice..."
                  value={textHi}
                  onChange={(e) => setTextHi(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Save Button */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-50">
          <Button 
            size="lg" 
            className="shadow-2xl px-10 h-16 text-xl font-black gap-3 min-w-[300px] uppercase rounded-full"
            onClick={handleSaveAll}
            disabled={saving || loading}
          >
            {saving ? <Loader2 className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
            {saving ? 'Processing...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </main>
  );
}