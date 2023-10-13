import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const todos = await prisma.todo.findMany();

		return Response.json(todos);
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error!!', {
			status: 500,
		});
	}
}

export async function POST(req) {
	const body = await req.json();
	const { name } = body;

	try {
		const todo = await prisma.todo.create({
			data: {
				name,
				isCompleted: false,
			},
		});

		return Response.json(todo);
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error!!', {
			status: 500,
		});
	}
}

export async function DELETE(req) {
	const url = new URL(req.url);
	const todoId = url.searchParams.get('id');

	try {
		const todo = await prisma.todo.delete({
			where: {
				id: Number(todoId),
			},
		});

		return Response.json(todo);
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error!!', {
			status: 500,
		});
	}
}

export async function PATCH(req) {
	const url = new URL(req.url);
	const todoId = url.searchParams.get('id');
	const body = await req.json();
	const { isCompleted } = body;

	try {
		const todo = await prisma.todo.update({
			where: {
				id: Number(todoId),
			},
			data: {
				isCompleted,
			},
		});

		return Response.json(todo);
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error!!', {
			status: 500,
		});
	}
}
