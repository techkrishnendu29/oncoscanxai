'use client'

import { use } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, Patient } from '@/lib/store'
import { 
  ArrowLeft,
  User,
  Calendar,
  FileImage,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  Download,
  Share2,
  Printer,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { patients } = useStore()
  
  const patient = patients.find(p => p.id === id)

  if (!patient) {
    return (
      <DashboardLayout role="doctor">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Patient not found</h2>
          <p className="text-muted-foreground mb-4">The requested patient record does not exist.</p>
          <Link href="/dashboard/doctor/patients">
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case 'negative':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'inconclusive':
        return <HelpCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusStyles = (status: Patient['status']) => {
    const styles = {
      positive: 'bg-destructive/10 text-destructive border-destructive/20',
      negative: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      inconclusive: 'bg-muted text-muted-foreground border-border'
    }
    return styles[status]
  }

  const getRiskStyles = (risk?: 'low' | 'moderate' | 'high') => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      high: 'bg-destructive/10 text-destructive'
    }
    return risk ? styles[risk] : 'bg-muted text-muted-foreground'
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Link 
              href="/dashboard/doctor/patients" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <p className="text-muted-foreground">
                  {patient.age} years old • {patient.gender === 'female' ? 'Female' : patient.gender === 'male' ? 'Male' : 'Other'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium">{patient.disease}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-mono text-sm">{patient.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Scan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Scan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Scan Type</p>
                <p className="font-medium">{patient.scanType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scan Date</p>
                <p className="font-medium">{patient.scanDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize border mt-1 ${getStatusStyles(patient.status)}`}>
                  {getStatusIcon(patient.status)}
                  {patient.status}
                </span>
              </div>
              {patient.scanImage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Scan Preview</p>
                  <img 
                    src={patient.scanImage} 
                    alt="Scan" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.aiAnalysis ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">AI Confidence</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${patient.aiAnalysis.confidence}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{patient.aiAnalysis.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize mt-1 ${getRiskStyles(patient.aiAnalysis.riskLevel)}`}>
                      <Shield className="h-4 w-4" />
                      {patient.aiAnalysis.riskLevel} Risk
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Findings Count</p>
                    <p className="text-2xl font-bold">{patient.aiAnalysis.findings.length}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Analysis pending</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Results */}
        {patient.aiAnalysis && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Automated analysis powered by OncoScanXai AI
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Findings */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Key Findings
                  </h4>
                  <ul className="space-y-3">
                    {patient.aiAnalysis.findings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Recommendation
                  </h4>
                  <div className={`p-4 rounded-lg border ${
                    patient.aiAnalysis.riskLevel === 'high' 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : patient.aiAnalysis.riskLevel === 'moderate'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{patient.aiAnalysis.recommendation}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Next Steps</h4>
                    <ul className="space-y-2 text-sm">
                      {patient.status === 'positive' && (
                        <>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            Schedule immediate biopsy
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            Refer to oncology specialist
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            Order additional imaging if needed
                          </li>
                        </>
                      )}
                      {patient.status === 'negative' && (
                        <>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Continue regular screening schedule
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Schedule follow-up in 12 months
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Maintain healthy lifestyle
                          </li>
                        </>
                      )}
                      {patient.status === 'inconclusive' && (
                        <>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                            Consider additional imaging modality
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                            Schedule follow-up scan in 3-6 months
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                            Discuss findings with patient
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Analysis */}
        {!patient.aiAnalysis && patient.status === 'pending' && (
          <Card className="border-2 border-yellow-200 bg-yellow-50/50">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis Pending</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                The scan is currently being analyzed by our AI system. Results will be available shortly. 
                You will be notified once the analysis is complete.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
