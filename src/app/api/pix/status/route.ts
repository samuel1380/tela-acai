import { NextResponse } from "next/server";

// Declare global type to avoid TS errors
declare global {
    var transactionStore: { [key: string]: string } | undefined;
}

// --- IN-MEMORY STORAGE FOR TRANSACTIONS (Temporary for this session) ---
// In a real production app, use a database (Redis, Postgres, etc.)
// preventing data loss on server restart.
if (!global.transactionStore) {
    global.transactionStore = {};
}

export async function POST(request: Request) {
    try {
        const { idTransaction } = await request.json();

        if (!idTransaction) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        // Check internal store (populated by Webhook)
        const storedStatus = global.transactionStore?.[idTransaction];

        console.log(`[Internal Polling] Checking ID: ${idTransaction} | Status: ${storedStatus || "WAITING"}`);

        if (storedStatus) {
            return NextResponse.json({ status: storedStatus });
        }

        // If not found yet, return WAITING
        return NextResponse.json({ status: "WAITING" });

    } catch (error) {
        console.error("Error checking PIX status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
