import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, debtor_name, email, debtor_document_number, phone } = body;

        const token = 'a9dc1703-e814-4fe2-b3f0-0e91258208cb';
        const secret = 'f327e8a9-6766-4ec7-a3a1-10671db2ec68';
        const apiKey = '6954b349e8a12';

        // Create base64 encoded auth string
        const authString = Buffer.from(`${token}:${secret}`).toString('base64');

        const response = await fetch('https://pagviva.com/api/transaction/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${authString}`,
                'X-API-KEY': apiKey
            },
            body: JSON.stringify({
                // Postback URL forced to Serveo for stability
                postback: 'https://957b1d4a49e9c2f5-187-63-97-31.serveousercontent.com/api/webhook/pix',
                amount: parseFloat(amount),
                debtor_name,
                email,
                debtor_document_number,
                phone,
                method_pay: 'pix'
            })
        });

        const data = await response.json();
        console.log("PagViva Create Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error('PagViva API Error:', data);
            return NextResponse.json(
                { error: 'Failed to create PIX transaction', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Available error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
