
import { NextResponse } from 'next/server';

// Reuse the global store
declare global {
    var transactionStore: { [key: string]: string } | undefined;
}

if (!global.transactionStore) {
    global.transactionStore = {};
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("--- WEBHOOK RECEIVED ---");
        console.log(JSON.stringify(body, null, 2));

        // Expected format from user provided docs:
        // {
        //   "status": "paid",
        //   "idTransaction": "TX123",
        //   "typeTransaction": "PIX"
        // }

        const { idTransaction, status } = body;

        if (idTransaction && global.transactionStore) {
            console.log(`[Webhook] Updating status for ${idTransaction} to ${status}`);
            global.transactionStore[idTransaction] = status;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
