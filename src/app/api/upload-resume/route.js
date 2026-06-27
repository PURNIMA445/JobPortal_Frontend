import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // We proxy it directly to the Python AI service
    const response = await fetch('http://127.0.0.1:8000/upload-resume', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text || 'Failed to process resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to AI service:', error);
    return NextResponse.json({ error: 'Failed to communicate with AI Service' }, { status: 500 });
  }
}
