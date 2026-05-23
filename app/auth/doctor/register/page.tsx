'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth'

import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import { auth, db, otpAuth } from '@/lib/firebase'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Stethoscope, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

// Extend Window type once, cleanly
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

const specializations = [
  'Radiologist',
  'Breast Imaging Specialist',
  'Medical Oncologist',
  'Surgical Oncologist',
  'Radiation Oncologist',
  'Pathologist',
  'General Surgeon',
  'Gynecologic Oncologist',
  'Other',
]

export default function DoctorRegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    specialization: '',
    hospitalName: '',
    mobile: '',
    mobileOtp: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // FIX: Single confirmationResult at the top level (not buried inside a nested function)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [mobileVerified, setMobileVerified] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [success, setSuccess] = useState(false)

  // FIX: RecaptchaVerifier initialization is now UNCOMMENTED and active
  useEffect(() => {
    // Clean up any existing verifier before creating a new one
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = undefined
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        otpAuth,
        'recaptcha-container',
        {
          size: 'invisible', // invisible so user doesn't need to click anything
          callback: () => {
            console.log('✓ reCAPTCHA verified')
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try sending OTP again.')
            window.recaptchaVerifier = undefined
          },
        }
      )
      console.log('✓ RecaptchaVerifier initialized')
    } catch (err) {
      console.error('reCAPTCHA init error:', err)
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }
    }
  }, [])

  // FIX: sendMobileOtp is now a proper top-level function inside the component
  const sendMobileOtp = async () => {
    setError('')
    setInfo('')

    const phone = formData.mobile.trim()

    if (!phone) {
      setError('Please enter a mobile number.')
      return
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    setIsLoading(true)
    setInfo('Sending OTP...')

    try {
      // Re-initialize reCAPTCHA if it was cleared after a previous error
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          otpAuth,
          'recaptcha-container',
          { size: 'invisible' }
        )
      }

      const formattedPhone = `+91${phone}`
      console.log('Sending OTP to:', formattedPhone)

      const result = await signInWithPhoneNumber(
        otpAuth,
        formattedPhone,
        window.recaptchaVerifier
      )

      setConfirmationResult(result)
      setOtpSent(true)
      setInfo('✓ OTP sent! Check your phone.')
      console.log('✓ OTP sent successfully')
    } catch (err: any) {
      console.error('OTP send error:', err)

      // Reset reCAPTCHA so the user can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }

      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Make sure it is a valid Indian number.')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Phone authentication is not enabled in Firebase Console.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes and try again.')
      } else if (err.code === 'auth/invalid-app-credential') {
        setError('reCAPTCHA configuration error. Check your Firebase project settings.')
      } else {
        setError(err.message || 'Failed to send OTP. Try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // FIX: verifyMobileOtp is now a proper top-level function (was missing entirely)
  const verifyMobileOtp = async () => {
    setError('')
    setInfo('')

    if (!confirmationResult) {
      setError('Please send OTP first.')
      return
    }

    const otp = formData.mobileOtp.trim()
    if (!otp || otp.length < 4) {
      setError('Enter the OTP received on your phone.')
      return
    }

    setIsLoading(true)
    setInfo('Verifying OTP...')

    try {
      await confirmationResult.confirm(otp)
      setMobileVerified(true)
      setInfo('✓ Mobile number verified successfully!')
      console.log('✓ Mobile verified')
    } catch (err: any) {
      console.error('OTP verify error:', err)
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.')
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.')
      } else {
        setError(err.message || 'OTP verification failed.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailVerificationLink = async () => {
    setError('')
    setInfo('')

    if (!mobileVerified) {
      setError('Verify your mobile number first.')
      return
    }
    if (!formData.email) {
      setError('Enter your email address.')
      return
    }
    if (!formData.password) {
      setError('Enter a password.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    setInfo('Creating account...')

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      )

      console.log('User created:', userCredential.user.uid)

      await sendEmailVerification(userCredential.user)

      setEmailVerificationSent(true)
      setInfo('✓ Verification email sent. Check your inbox and click the link.')
    } catch (err: any) {
      console.error('Email error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.')
      } else {
        setError(err.message || 'Failed to send verification email.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!mobileVerified) {
      setError('Complete mobile verification first.')
      return
    }
    if (!emailVerificationSent) {
      setError('Send and complete email verification first.')
      return
    }
    if (!auth.currentUser) {
      setError('Authentication session missing. Please refresh and try again.')
      return
    }

    setIsLoading(true)

    try {
      await auth.currentUser.reload()

      if (!auth.currentUser.emailVerified) {
        setError('Your email is not verified yet. Check your inbox and click the verification link.')
        return
      }

      await setDoc(doc(db, 'doctors', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        role: 'doctor',
        fullName: formData.name,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        hospitalName: formData.hospitalName,
        mobile: formData.mobile,
        email: formData.email,
        mobileVerified: true,
        emailVerified: true,
        createdAt: serverTimestamp(),
      })

      setSuccess(true)

      setTimeout(async () => {
        await signOut(auth)
        router.push('/auth/doctor/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardContent className="pt-10">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold">Registration Successful!</h2>
            <p className="text-muted-foreground mt-2">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Stethoscope className="h-10 w-10" />
            </div>
            <CardTitle>Doctor Registration</CardTitle>
            <CardDescription>Register your doctor account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                placeholder="Medical License Number"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />

              <Select
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              />

              {/* Mobile OTP Section */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Mobile Number (10 digits)"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    maxLength={10}
                    disabled={mobileVerified}
                  />
                  <Button
                    type="button"
                    onClick={sendMobileOtp}
                    disabled={isLoading || mobileVerified}
                    className="shrink-0"
                  >
                    {isLoading && !otpSent ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
                  </Button>
                </div>

                {otpSent && !mobileVerified && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={formData.mobileOtp}
                      onChange={(e) => setFormData({ ...formData, mobileOtp: e.target.value })}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={verifyMobileOtp}
                      disabled={isLoading}
                      className="shrink-0"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </div>
                )}

                {mobileVerified && (
                  <p className="text-sm text-green-600 font-medium">✓ Mobile verified</p>
                )}
              </div>

              {/* Email & Password */}
              <Input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={emailVerificationSent}
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={emailVerificationSent}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={emailVerificationSent}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={sendEmailVerificationLink}
                className="w-full"
                disabled={!mobileVerified || emailVerificationSent || isLoading}
              >
                {emailVerificationSent ? '✓ Verification Email Sent' : 'Send Email Verification'}
              </Button>

              {/* Error / Info messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <p className="text-red-600 text-sm font-medium">❌ {error}</p>
                </div>
              )}
              {info && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-blue-600 text-sm font-medium">ℹ️ {info}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* IMPORTANT: This div must exist in the DOM for invisible reCAPTCHA */}
              <div id="recaptcha-container" />
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/doctor/login" className="text-primary hover:underline">
                Already have an account? Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Logo size="sm" />
        </div>
      </div>
    </div>
  )
}