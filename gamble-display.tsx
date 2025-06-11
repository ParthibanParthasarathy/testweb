"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GambleData {
  numbers: number[]
}

interface ApiError {
  error: string
}

export default function Component() {
  const [data, setData] = useState<GambleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use our API route instead of direct external call
      const response = await fetch("/api/gamble", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result: GambleData = await response.json()
      setData(result)
      setLastFetch(new Date())
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gamble Numbers</h1>
          <p className="text-muted-foreground">Live data from your API endpoint</p>
          {lastFetch && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Wifi className="h-3 w-3" />
              Last updated: {lastFetch.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              Random Numbers
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="ml-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Fetched via proxy from: testproject-112665672495.us-central1.run.app/gamble
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !data && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading numbers...</span>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Error fetching data: {error}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <WifiOff className="h-4 w-4" />
                      <span>This might be due to network issues or the external API being unavailable.</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {data && !loading && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-4">
                  {data.numbers.map((number, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-2xl px-6 py-3 font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      {number}
                    </Badge>
                  ))}
                </div>

                <div className="text-center space-y-2 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Total Numbers: {data.numbers.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Sum: {data.numbers.reduce((sum, num) => sum + num, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average: {(data.numbers.reduce((sum, num) => sum + num, 0) / data.numbers.length).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {error ? <WifiOff className="h-4 w-4 text-red-500" /> : <Wifi className="h-4 w-4 text-green-500" />}
                <span>API Status: {error ? "Disconnected" : "Connected"}</span>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium mb-1">API Endpoint:</p>
                <code className="text-xs">
                  GET /api/gamble → https://testproject-112665672495.us-central1.run.app/gamble
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {data && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Raw API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
