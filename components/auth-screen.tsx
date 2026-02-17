"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Users, Zap, Globe } from "lucide-react"

export function AuthScreen() {
  const { setIsAuthenticated, setView } = useApp()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
    setView("dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8" />
            <span className="text-2xl font-semibold tracking-tight">Collabo</span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Write together,<br />
            build faster.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
            The real-time collaboration platform that helps teams create, edit, and ship documents at the speed of thought.
          </p>

          <div className="flex flex-col gap-5 mt-4">
            <FeatureItem
              icon={<Users className="h-5 w-5" />}
              title="Real-time collaboration"
              description="See edits appear instantly as your team types"
            />
            <FeatureItem
              icon={<Zap className="h-5 w-5" />}
              title="Version history"
              description="Track every change with automatic versioning"
            />
            <FeatureItem
              icon={<Globe className="h-5 w-5" />}
              title="Share anywhere"
              description="Publish and share documents with anyone"
            />
          </div>
        </div>

        <p className="text-sm text-primary-foreground/50">
          Trusted by 10,000+ teams worldwide
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <FileText className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-foreground">Collabo</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Start collaborating with your team today"
                : "Sign in to continue to your workspace"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-foreground">Full name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="h-11"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <Button type="submit" size="lg" className="h-11 w-full mt-1">
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full"
            onClick={handleSubmit}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
        {icon}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>
  )
}
