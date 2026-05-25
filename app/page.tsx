'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  HelpCircle,
  Brain,
  Activity,
  FileSearch,
  Upload,
  ScanSearch,
  ChevronDown,
} from 'lucide-react'

export default function WelcomePage() {
  const [showHelp, setShowHelp] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description:
        'Advanced machine learning algorithms for accurate breast cancer detection and diagnostic assistance.',
    },
    {
      icon: Activity,
      title: 'Real-time Results',
      description:
        'Instant scan analysis with fast AI-powered predictions for medical professionals.',
    },
    {
      icon: FileSearch,
      title: 'Comprehensive Reports',
      description:
        'Detailed AI-generated findings and clinical recommendations.',
    },
  ]

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10 bg-background/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="sm" />

            <div className="flex items-center gap-3">
              {/* LOGIN DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl px-5">
                    Login
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/doctor/login">Doctor Login</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/auth/admin/login">Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* HELP */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* HELP MODAL */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <Card
            className="max-w-md mx-4 rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>
                Assistance for OncoScanXAI users
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <h4 className="font-semibold">Doctors</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Register with your professional details, verify your email and
                  mobile number, and wait for admin approval.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Administrators</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage doctor approvals, system analytics, and platform
                  settings.
                </p>
              </div>

              <Button
                className="w-full rounded-xl"
                onClick={() => setShowHelp(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MAIN */}
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HERO */}
          <section className="text-center py-12 lg:py-20">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              Advanced AI-Powered
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Breast Cancer
              </span>{' '}
              Analysis
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-9 mb-14">
              Empowering healthcare professionals with intelligent AI-driven
              diagnostics for early detection and accurate breast cancer
              assessment.
            </p>

            {/* ACTION CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* UPLOAD SCAN */}
              <Card className="p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 rounded-[32px] bg-white/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>

                  <CardTitle className="text-2xl">Upload Scan</CardTitle>

                  <CardDescription className="text-base">
                    Upload breast scan images for AI-powered analysis and
                    diagnostic prediction.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href="/dashboard/upload-scan">
                    <Button className="w-full rounded-xl h-12 text-base">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Scan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* PATIENT RESULTS */}
              <Card className="p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 rounded-[32px] bg-white/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ScanSearch className="h-10 w-10 text-primary" />
                  </div>

                  <CardTitle className="text-2xl">Patient Results</CardTitle>

                  <CardDescription className="text-base">
                    View AI-generated scan results and breast cancer analysis
                    reports.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href="/auth/guest">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12 text-base"
                    >
                      View Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FEATURES */}
          <section className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <Card
                    key={feature.title}
                    className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg"
                  >
                    <CardHeader>
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>

                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>
      </main>

{/* PROFESSIONAL FOOTER WITH LOGO */}
<footer className="relative border-t border-white/10 bg-zinc-950 text-zinc-300 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950 to-zinc-900 opacity-95" />
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[120px] pointer-events-none" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* BRAND */}
      <div className="space-y-6">
        <div className="flex items-center">
          <Logo size="sm" />
        </div>

        <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
          AI-powered breast cancer diagnostic assistance platform designed for
          healthcare professionals, enabling faster, explainable, and accurate
          scan analysis.
        </p>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">
            Clinical Decision Support Platform
          </span>
        </div>
      </div>

      {/* PLATFORM */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
          Platform
        </h3>

        <ul className="space-y-4 text-sm">
          <li>
            <Link
              href="/dashboard/upload-scan"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Upload Scan
            </Link>
          </li>

          <li>
            <Link
              href="/auth/guest"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              View Results
            </Link>
          </li>

          <li>
            <Link
              href="/faq"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              FAQs
            </Link>
          </li>
        </ul>
      </div>

      {/* SUPPORT */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
          Support
        </h3>

        <ul className="space-y-4 text-sm">
          <li>
            <Link
              href="/contact"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Contact Us
            </Link>
          </li>

          <li>
            <Link
              href="/support"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Help Center
            </Link>
          </li>

          <li>
            <a
              href="mailto:support@krishnendughosh.in"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              support@krishnendughosh.in
            </a>
          </li>
        </ul>
      </div>

      {/* LEGAL */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
          Legal
        </h3>

        <ul className="space-y-4 text-sm">
          <li>
            <Link
              href="/privacy-policy"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </li>

          <li>
            <Link
              href="/terms"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </li>

          <li>
            <Link
              href="/cookies"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* DISCLAIMER */}
    <div className="mt-12 border-t border-white/10 pt-8">
      <p className="text-xs leading-relaxed text-zinc-500 max-w-4xl">
        <span className="font-semibold text-zinc-400">Medical Disclaimer:</span>{" "}
        OncoScanXAI provides AI-assisted clinical decision support and is not a
        substitute for professional medical diagnosis, treatment, or physician
        judgment.
      </p>
    </div>

    {/* BOTTOM BAR */}
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-zinc-500">
        © {new Date().getFullYear()} OncoScanXAI. All rights reserved.
      </p>

      <p className="text-xs text-zinc-500">
        Built with AI for modern healthcare innovation.
      </p>
    </div>
  </div>
</footer>
