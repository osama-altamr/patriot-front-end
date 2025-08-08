import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosProgressEvent } from 'axios';

const s3AxiosInstance = axios.create();

export const createMedia = createAsyncThunk<
	{ url: string; [key: string]: any },
	{ userId: string; fileName: string; contentType: string }
>('mediaInput/createMedia', async ({ userId, fileName, contentType }, { rejectWithValue }) => {
	try {
		const response = await axios.post('v1/media/pre-signed', {
			fileName,
			userId,
			contentType
		});
		return response.data;
	} catch (error: any) {
		console.error('Failed to get pre-signed URL:', error.response?.data || error.message);
		return rejectWithValue(error.response?.data || 'Could not create media URL');
	}
});

interface UploadMediaArgs {
	url: string; // The pre-signed URL
	file: File;
	onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
}

export const uploadMedia = createAsyncThunk<boolean, UploadMediaArgs>(
	'mediaInput/uploadMedia',
	async ({ url, file, onUploadProgress }, { rejectWithValue }) => {
		try {
			const response = await s3AxiosInstance.put(url, file, {
				headers: {
					'Content-Type': file.type,
					Authorization: undefined
				},
				onUploadProgress
			});

			// A successful PUT to S3 returns a 200 OK status.
			return response.status === 200;
		} catch (error: any) {
			// Log the detailed XML error message from S3 for debugging.
			console.error('Direct S3 upload failed. S3 Response:', error.response?.data);
			return rejectWithValue(error.response?.data || 'File upload failed');
		}
	}
);

const mediaInputSlice = createSlice({
	name: 'mediaInput',
	initialState: {},
	reducers: {}
});

export default mediaInputSlice.reducer;
