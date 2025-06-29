"use client";

import { useVitals } from '@/hooks/use-vitals';
import { useGlucose } from '@/hooks/use-glucose';
import { useMedications } from '@/hooks/use-medications';
import Header from '@/components/vitals/header';
import VitalsDisplay from '@/components/vitals/vitals-display';
import VitalsTrendChart from '@/components/vitals/vitals-trend-chart';
import VitalsActions from '@/components/vitals/vitals-actions';
import GlucoseDisplay from '@/components/glucose/glucose-display';
import GlucoseTrendChart from '@/components/glucose/glucose-trend-chart';
import GlucoseActions from '@/components/glucose/glucose-actions';
import MedicationsList from '@/components/medications/medications-list';
import MedicationsActions from '@/components/medications/medications-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Home() {
  const { readings: vitalReadings, addReading: addVitalReading, isLoaded: isVitalsLoaded, latestReading: latestVitalReading } = useVitals();
  const { readings: glucoseReadings, addReading: addGlucoseReading, isLoaded: isGlucoseLoaded, latestReading: latestGlucoseReading } = useGlucose();
  const { medications, addMedication, removeMedication, isLoaded: isMedicationsLoaded } = useMedications();
  const isLoaded = isVitalsLoaded && isGlucoseLoaded && isMedicationsLoaded;

  const handleVitalsDownload = () => {
    if (vitalReadings.length === 0) return;
    const csvHeader = "id,date,systolic,diastolic,heartRate,oxygenSaturation\n";
    const csvRows = vitalReadings
      .map(r => `"${r.id}","${r.date}",${r.systolic},${r.diastolic},${r.heartRate},${r.oxygenSaturation}`)
      .join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vitals-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleGlucoseDownload = () => {
    if (glucoseReadings.length === 0) return;
    const csvHeader = "id,date,glucose,context\n";
    const csvRows = glucoseReadings
      .map(r => `"${r.id}","${r.date}",${r.glucose},"${r.context}"`)
      .join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "glucose-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMedicationsDownload = () => {
    if (medications.length === 0) return;
    const csvHeader = "id,name,dosage,frequency,notes\n";
    const csvRows = medications
      .map(m => `"${m.id}","${m.name}","${m.dosage}","${m.frequency}","${m.notes || ''}"`)
      .join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "medications-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>
          <TabsContent value="vitals" className="mt-6">
            <div className="grid gap-8">
              <Card className="shadow-lg animate-in fade-in-50 duration-500">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Current Vitals</CardTitle>
                  <CardDescription>
                    Your most recent blood pressure, heart rate, and oxygen measurement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:col-span-1">
                    {isLoaded ? (
                      <VitalsDisplay latestReading={latestVitalReading} />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Skeleton className="mx-auto aspect-square w-full max-w-[250px] rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-1">
                    <VitalsActions addReading={addVitalReading} />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg animate-in fade-in-50 duration-700">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">Vitals History</CardTitle>
                    <CardDescription>
                      A visual trend of your recorded measurements over time.
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleVitalsDownload} disabled={vitalReadings.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoaded ? (
                    <VitalsTrendChart readings={vitalReadings} />
                  ) : (
                    <Skeleton className="h-[350px] w-full" />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="diabetes" className="mt-6">
            <div className="grid gap-8">
                <Card className="shadow-lg animate-in fade-in-50 duration-500">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Current Glucose</CardTitle>
                    <CardDescription>
                      Your most recent blood glucose measurement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="md:col-span-1">
                      {isLoaded ? (
                        <GlucoseDisplay latestReading={latestGlucoseReading} />
                      ) : (
                        <div className="flex flex-col items-center">
                            <Skeleton className="mx-auto aspect-square w-full max-w-[192px] rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <GlucoseActions addReading={addGlucoseReading} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg animate-in fade-in-50 duration-700">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="font-headline text-2xl">Glucose History</CardTitle>
                      <CardDescription>
                        A visual trend of your recorded glucose levels over time.
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleGlucoseDownload} disabled={glucoseReadings.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoaded ? (
                      <GlucoseTrendChart readings={glucoseReadings} />
                    ) : (
                      <Skeleton className="h-[350px] w-full" />
                    )}
                  </CardContent>
                </Card>
              </div>
          </TabsContent>
          <TabsContent value="medications" className="mt-6">
             <div className="grid gap-8">
                <Card className="shadow-lg animate-in fade-in-50 duration-500">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Medication List</CardTitle>
                        <CardDescription>
                            A list of your current medications.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <MedicationsActions addMedication={addMedication} />
                        <Button variant="outline" onClick={handleMedicationsDownload} disabled={medications.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoaded ? (
                        <MedicationsList medications={medications} removeMedication={removeMedication} />
                    ) : (
                        <Skeleton className="h-[350px] w-full" />
                    )}
                  </CardContent>
                </Card>
              </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Vitalsnap &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

