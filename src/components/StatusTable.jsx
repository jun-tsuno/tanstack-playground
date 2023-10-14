'use client';
import { useQueryClient } from '@tanstack/react-query';

const StatusTable = () => {
	const queryClient = useQueryClient();
	const queryData = queryClient.getQueryData(['todos']);

	const allNumber = queryData && queryData.length;

	const completedNumber =
		queryData && queryData.filter((data) => data.isCompleted === true).length;

	return (
		<>
			<section className='text-center mt-20'>
				<h1 className='mb-4 font-bold text-2xl'>Fetch from cached data</h1>
				<table className='mx-auto'>
					<thead>
						<tr className='bg-gray-200'>
							<th className='p-2'>All</th>
							<th className='p-2'>Completed</th>
							<th className='p-2'>UnCompleted</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='text-center'>{allNumber || 0}</td>
							<td className='text-center'>{completedNumber || 0}</td>
							<td className='text-center'>
								{allNumber - completedNumber || 0}
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		</>
	);
};

export default StatusTable;
