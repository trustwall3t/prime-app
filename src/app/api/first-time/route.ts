import { NextResponse } from 'next/server';
import { submitFirstTimeProfile } from '@/actions/auth/firstTime';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await submitFirstTimeProfile(body);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: result.user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
