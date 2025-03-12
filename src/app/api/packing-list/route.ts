import { NextRequest, NextResponse } from "next/server";

export default function POST(req: NextRequest) {
	try {
		const data = req.body;

		return NextResponse.json({ status: 201, data: data });
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
