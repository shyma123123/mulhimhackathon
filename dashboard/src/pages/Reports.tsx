import React, { useState } from 'react'
import { FileText, Download, Calendar, BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns'

const Reports: React.FC = () => {
  const { language } = useThemeStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPeriod, setSelectedPeriod] = useState(new Date())

  // Mock data for reports
  const generateMockData = (type: 'monthly' | 'yearly', date: Date) => {
    const isMonthly = type === 'monthly'
    const multiplier = isMonthly ? 1 : 12
    
    return {
      period: isMonthly 
        ? format(date, 'MMMM yyyy', { locale: language.code === 'ar' ? undefined : undefined })
        : format(date, 'yyyy'),
      totalScans: Math.floor(Math.random() * 10000 * multiplier) + 5000,
      threatsDetected: Math.floor(Math.random() * 500 * multiplier) + 100,
      cleanPages: Math.floor(Math.random() * 8000 * multiplier) + 4000,
      activeUsers: Math.floor(Math.random() * 200 * multiplier) + 50,
      detectionRate: (Math.random() * 20 + 80).toFixed(1),
      falsePositives: Math.floor(Math.random() * 50 * multiplier) + 10,
      topThreats: [
        { name: 'Phishing Emails', count: Math.floor(Math.random() * 200 * multiplier) + 50 },
        { name: 'Suspicious Websites', count: Math.floor(Math.random() * 150 * multiplier) + 30 },
        { name: 'Malware Links', count: Math.floor(Math.random() * 100 * multiplier) + 20 },
        { name: 'Social Engineering', count: Math.floor(Math.random() * 80 * multiplier) + 15 }
      ],
      monthlyTrends: Array.from({ length: isMonthly ? 30 : 12 }, (_, i) => ({
        day: isMonthly ? i + 1 : i + 1,
        scans: Math.floor(Math.random() * 500) + 100,
        threats: Math.floor(Math.random() * 50) + 5
      }))
    }
  }

  const reportData = generateMockData(reportType, selectedPeriod)

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      // Create a temporary div to hold the report content
      const reportElement = document.createElement('div')
      reportElement.id = 'pdf-report'
      reportElement.style.cssText = `
        width: 800px;
        padding: 40px;
        background: white;
        color: black;
        font-family: Arial, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
      `
      
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">SmartShield Security Report</h1>
          <h2 style="color: #374151; margin-bottom: 20px;">
            ${reportType === 'monthly' ? 'Monthly' : 'Yearly'} Report - ${reportData.period}
          </h2>
          <p style="color: #6b7280;">Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
          <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Security Overview</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="color: #6b7280; font-size: 14px;">Total Scans</p>
                <p style="color: #2563eb; font-size: 24px; font-weight: bold;">${reportData.totalScans.toLocaleString()}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px;">Threats Detected</p>
                <p style="color: #dc2626; font-size: 24px; font-weight: bold;">${reportData.threatsDetected.toLocaleString()}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px;">Clean Pages</p>
                <p style="color: #059669; font-size: 24px; font-weight: bold;">${reportData.cleanPages.toLocaleString()}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px;">Active Users</p>
                <p style="color: #7c3aed; font-size: 24px; font-weight: bold;">${reportData.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Performance Metrics</h3>
            <div style="margin-bottom: 15px;">
              <p style="color: #6b7280; font-size: 14px;">Detection Rate</p>
              <p style="color: #059669; font-size: 20px; font-weight: bold;">${reportData.detectionRate}%</p>
            </div>
            <div>
              <p style="color: #6b7280; font-size: 14px;">False Positives</p>
              <p style="color: #f59e0b; font-size: 20px; font-weight: bold;">${reportData.falsePositives.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #374151; margin-bottom: 20px;">Top Threat Categories</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Threat Type</th>
                <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: right;">Count</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.topThreats.map(threat => `
                <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${threat.name}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 12px; text-align: right;">${threat.count.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #374151; margin-bottom: 20px;">${reportType === 'monthly' ? 'Daily' : 'Monthly'} Trends</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${reportData.monthlyTrends.slice(0, 10).map(trend => `
              <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 14px;">Day ${trend.day}</p>
                <p style="color: #2563eb; font-size: 18px; font-weight: bold;">${trend.scans} scans</p>
                <p style="color: #dc2626; font-size: 14px;">${trend.threats} threats</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This report was generated by SmartShield Security Platform
          </p>
        </div>
      `
      
      document.body.appendChild(reportElement)
      
      // Generate PDF
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Clean up
      document.body.removeChild(reportElement)
      
      // Download PDF
      const fileName = `SmartShield-${reportType}-Report-${reportData.period.replace(/\s+/g, '-')}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(language.code === 'en' ? 'Error generating PDF report' : 'خطأ في إنشاء تقرير PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePeriodChange = (type: 'monthly' | 'yearly') => {
    setReportType(type)
    if (type === 'monthly') {
      setSelectedPeriod(new Date())
    } else {
      setSelectedPeriod(new Date())
    }
  }

  const handleDateChange = (increment: boolean) => {
    const newDate = new Date(selectedPeriod)
    if (reportType === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (increment ? 1 : -1))
    } else {
      newDate.setFullYear(newDate.getFullYear() + (increment ? 1 : -1))
    }
    setSelectedPeriod(newDate)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {language.code === 'en' ? 'Security Reports' : 'التقارير الأمنية'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-mono">
            {language.code === 'en' 
              ? 'Generate comprehensive security reports in PDF format' 
              : 'إنشاء تقارير أمنية شاملة بصيغة PDF'
            }
          </p>
        </div>
        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Report Controls */}
      <div className="card-terminal">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Report Type Selection */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handlePeriodChange('monthly')}
                className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 ${
                  reportType === 'monthly'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                {t('monthly', language.code)}
              </button>
              <button
                onClick={() => handlePeriodChange('yearly')}
                className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 ${
                  reportType === 'yearly'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                {t('yearly', language.code)}
              </button>
            </div>

            {/* Period Selection */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateChange(false)}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ←
              </button>
              <span className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm text-gray-900 dark:text-gray-100 min-w-[120px] text-center">
                {reportType === 'monthly' 
                  ? format(selectedPeriod, 'MMMM yyyy')
                  : format(selectedPeriod, 'yyyy')
                }
              </span>
              <button
                onClick={() => handleDateChange(true)}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Generate PDF Button */}
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            {isGenerating ? (
              <>
                <div className="loading"></div>
                <span>{t('generating', language.code)}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('generatePdfReport', language.code)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Overview */}
        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Security Overview' : 'نظرة عامة على الأمان'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'Total Scans' : 'إجمالي الفحوصات'}
              </p>
              <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {reportData.totalScans.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'Threats Detected' : 'التهديدات المكتشفة'}
              </p>
              <p className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">
                {reportData.threatsDetected.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'Clean Pages' : 'الصفحات النظيفة'}
              </p>
              <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                {reportData.cleanPages.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'Active Users' : 'المستخدمون النشطون'}
              </p>
              <p className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                {reportData.activeUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Performance Metrics' : 'مقاييس الأداء'}
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'Detection Rate' : 'معدل الكشف'}
              </p>
              <p className="text-3xl font-mono font-bold text-green-600 dark:text-green-400">
                {reportData.detectionRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {language.code === 'en' ? 'False Positives' : 'النتائج الإيجابية الخاطئة'}
              </p>
              <p className="text-2xl font-mono font-bold text-yellow-600 dark:text-yellow-400">
                {reportData.falsePositives.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Threats */}
      <div className="card-terminal">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
            {language.code === 'en' ? 'Top Threat Categories' : 'أهم فئات التهديدات'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-terminal w-full">
            <thead>
              <tr>
                <th className="text-left">
                  {language.code === 'en' ? 'Threat Type' : 'نوع التهديد'}
                </th>
                <th className="text-right">
                  {language.code === 'en' ? 'Count' : 'العدد'}
                </th>
                <th className="text-right">
                  {language.code === 'en' ? 'Percentage' : 'النسبة المئوية'}
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.topThreats.map((threat, index) => {
                const percentage = ((threat.count / reportData.threatsDetected) * 100).toFixed(1)
                return (
                  <tr key={index}>
                    <td className="font-mono">{threat.name}</td>
                    <td className="text-right font-mono">{threat.count.toLocaleString()}</td>
                    <td className="text-right font-mono">{percentage}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Info */}
      <div className="card-terminal">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
            {language.code === 'en' ? 'Report Information' : 'معلومات التقرير'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {language.code === 'en' ? 'Report Period:' : 'فترة التقرير:'}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              {reportData.period}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {language.code === 'en' ? 'Generated On:' : 'تم الإنشاء في:'}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              {format(new Date(), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {language.code === 'en' ? 'Report Type:' : 'نوع التقرير:'}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              {language.code === 'en' 
                ? (reportType === 'monthly' ? 'Monthly Security Report' : 'Yearly Security Report')
                : (reportType === 'monthly' ? 'تقرير أمني شهري' : 'تقرير أمني سنوي')
              }
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {language.code === 'en' ? 'Format:' : 'الصيغة:'}
            </p>
            <p className="text-gray-900 dark:text-gray-100">PDF Document</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
