import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Server } from '@/models/Schema';

export async function GET() {
  try {
    await dbConnect();
    const servers = await Server.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: servers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newServer = await Server.create(body);
    return NextResponse.json({ success: true, data: newServer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
     await dbConnect();
     const { searchParams } = new URL(req.url);
     const id = searchParams.get('id');
     await Server.findByIdAndDelete(id);
     return NextResponse.json({ success: true });
  } catch (error) {
     return NextResponse.json({ success: false });
  }
}
