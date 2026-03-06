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
import { Lock, Settings, LogOut, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

  // Local state for textareas to ensure they are reactive but editable
  const [textEn, setTextEn] = useState('');
  const [textHi, setTextHi] = useState('');

  // Sync local state when settings load
  useEffect(() => {
    if (settings) {
      setTextEn(settings.closureNoticeTextEn || '');
      setTextHi(settings.closureNoticeTextHi || '');
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2 text-primary">
              <Lock size={40} />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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
              <Button type="submit" className="w-full">Login</Button>
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
          <div className="flex items-center gap-2">
            <Settings className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Site Settings
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility Toggles</CardTitle>
              <CardDescription>Control which notices are active on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="closure"
                  checked={settings?.showClosureNotice ?? true}
                  onCheckedChange={(checked) => handleUpdateSettings({ showClosureNotice: !!checked })}
                  disabled={loading}
                />
                <Label htmlFor="closure" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show Project Closure Notice
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onsale"
                  checked={settings?.showOnSale ?? false}
                  onCheckedChange={(checked) => handleUpdateSettings({ showOnSale: !!checked })}
                  disabled={loading}
                />
                <Label htmlFor="onsale" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-accent">
                  Show Project On Sale Notice
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Update the text shown in the notices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textEn">Closure Notice (English)</Label>
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
                <Label htmlFor="textHi">Closure Notice (Hinglish)</Label>
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
            <CardFooter className="text-xs text-muted-foreground italic">
              * Changes are saved automatically when you click outside the text box.
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
