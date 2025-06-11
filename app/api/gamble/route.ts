import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://testproject-112665672495.us-central1.run.app/gamble", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching gamble data:", error)
    return NextResponse.json({ error: "Failed to fetch data from external API" }, { status: 500 })
  }
}
