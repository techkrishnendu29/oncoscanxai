'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore, Patient } from '@/lib/store'
import { 
  Search, 
  Plus, 
  Filter,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  Users,
  SortAsc
} from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PatientsListPage() {
  const { patients, currentUser } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [scanTypeFilter, setScanTypeFilter] = useState<string>('all')
  
  const doctorPatients = patients.filter(p => p.doctorId === currentUser?.id || currentUser?.id === 'd1')

  const filteredPatients = doctorPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.disease.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    const matchesScanType = scanTypeFilter === 'all' || patient.scanType === scanTypeFilter
    
    return matchesSearch && matchesStatus && matchesScanType
  })

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'negative':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'inconclusive':
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Patient['status']) => {
    const styles = {
      positive: 'bg-destructive/10 text-destructive border-destructive/20',
      negative: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      inconclusive: 'bg-muted text-muted-foreground border-border'
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${styles[status]}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-muted-foreground">Manage your patient records and scan results</p>
          </div>
          <Link href="/dashboard/doctor/patients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inconclusive">Inconclusive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={scanTypeFilter} onValueChange={setScanTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Scan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="Mammogram">Mammogram</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Showing {filteredPatients.length} of {doctorPatients.length} patients</span>
        </div>

        {/* Patient List */}
        {filteredPatients.length > 0 ? (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Link 
                key={patient.id} 
                href={`/dashboard/doctor/patients/${patient.id}`}
              >
                <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/30 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-lg font-medium text-primary">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years old • {patient.gender === 'female' ? 'Female' : patient.gender === 'male' ? 'Male' : 'Other'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Condition</p>
                          <p className="font-medium">{patient.disease}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Scan Type</p>
                          <p className="font-medium">{patient.scanType}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{patient.scanDate}</p>
                        </div>
                        {getStatusBadge(patient.status)}
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    {patient.aiAnalysis && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">AI Confidence:</span>
                          <div className="flex-1 max-w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${patient.aiAnalysis.confidence}%` }}
                            />
                          </div>
                          <span className="font-medium">{patient.aiAnalysis.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No patients found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || scanTypeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first patient'}
              </p>
              <Link href="/dashboard/doctor/patients/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
