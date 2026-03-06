'use client';

import { useState } from 'react';
import { useDoc, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Settings, LogOut, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const firestore = useFirestore();
  const settingsRef = firestore ? doc(firestore, 'settings', 'global') : null;
  const { data: settings, loading } = useDoc(settingsRef);

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
    
    // Non-blocking mutation with catch handler for permission errors
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

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading settings...</div>;

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
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
                  checked={settings?.showClosureNotice || false}
                  onCheckedChange={(checked) => handleUpdateSettings({ showClosureNotice: !!checked })}
                />
                <Label htmlFor="closure" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show Project Closure Notice
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onsale"
                  checked={settings?.showOnSale || false}
                  onCheckedChange={(checked) => handleUpdateSettings({ showOnSale: !!checked })}
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
                  defaultValue={settings?.closureNoticeTextEn || "The Owner of this domain and website has defaulted on payment of ₹1,08,000/- despite full completion of the agreed work. He has stopped responding to calls and messages."}
                  onBlur={(e) => handleUpdateSettings({ closureNoticeTextEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textHi">Closure Notice (Hinglish)</Label>
                <Textarea
                  id="textHi"
                  rows={6}
                  defaultValue={settings?.closureNoticeTextHi || "The Owner of this domain and website ne agreed kaam fully complete hone ke baad bhi ₹1,08,000/- ka payment nhi kiya hai. or na hi Calls aur messages ka koi response diya ja raha hai. Unke ek business partner Mr. Rahul ne mujhe call kr k bola tha payment 10th feb 2026 tk ho jayegi tb tk k liye app yeh Project Closure Notice Hata dijiye or meine bhi whi kiya lekin aaj 17th feb ko jb meine Rahul ko call ki tho bo mujhe galt language ka use krne lge jis ki wjh se meine yeh Notice phr se aaj Live Kiya hai.... or yeh notice ab ni hatega.. jis ko jo krna ho bo kr sakte hai..."}
                  onBlur={(e) => handleUpdateSettings({ closureNoticeTextHi: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
