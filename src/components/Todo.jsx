'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const fetchTodos = async () => {
	const res = await fetch('http://localhost:3000/api/todos');

	if (!res.ok) {
		const result = await res.text();
		throw new Error(result);
	}
	return await res.json();
};

const addTodo = async (name) => {
	const res = await fetch('http://localhost:3000/api/todos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
		}),
	});
	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}
	return res.json();
};

const deleteTodo = async (id) => {
	const res = await fetch(`http://localhost:3000/api/todos?id=${id}`, {
		method: 'DELETE',
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}
	return res.json();
};

const updateTodo = async (todo) => {
	const res = await fetch(`http://localhost:3000/api/todos?id=${todo.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(todo),
	});
	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}
	return res.json();
};

const Todo = () => {
	const [name, setName] = useState('');
	const {
		data: todos,
		isLoading,
		isError,
		error,
	} = useQuery(['todos'], fetchTodos);
	const queryClient = useQueryClient();

	const addMutation = useMutation(addTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
	});

	const deleteMutation = useMutation(deleteTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
	});

	const updateMutation = useMutation(updateTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) return alert('Field Required!!');
		addMutation.mutate(name);

		return setName('');
	};

	const handleDelete = (id) => {
		deleteMutation.mutate(id);
	};

	const handleCheckChange = (todo) => {
		const newTodo = { ...todo, isCompleted: !todo.isCompleted };
		updateMutation.mutate(newTodo);
	};

	if (isLoading) return <div>loading...</div>;

	if (isError) return <div>{`Error: ${error.message}`}</div>;

	return (
		<>
			<h1 className='text-center my-10 text-3xl font-bold'>Todo List</h1>

			<form
				onSubmit={handleSubmit}
				className='flex items-center gap-3 justify-center'
			>
				Add Todo :
				<input
					placeholder='Add New Todo'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='border-[1px] border-gray-300 rounded-xl py-2 px-4'
				/>
				<button className='bg-emerald-500 hover:brightness-95 text-white p-2 rounded-full shadow-md'>
					ADD
				</button>
			</form>

			<ul className='mt-8 w-[300px] mx-auto'>
				{todos?.map((todo, i) => (
					<li key={todo.id}>
						<input
							type='checkbox'
							checked={todo.isCompleted}
							onChange={() => handleCheckChange(todo)}
						/>
						{`${i + 1}: ${todo.name}`}
						<button
							onClick={() => handleDelete(todo.id)}
							className='text-xs bg-red-400 rounded-xl ml-3 p-1'
						>
							DELETE
						</button>

						{todo.isCompleted && (
							<span className='bg-emerald-400 text-gray-500 p-1 rounded-full text-xs ml-4'>
								DONE😎!
							</span>
						)}
					</li>
				))}
			</ul>
		</>
	);
};

export default Todo;
