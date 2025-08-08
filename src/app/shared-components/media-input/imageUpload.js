import { apiService } from './api.js';

export class ImageUploadService {
	/**
	 * Upload an image file and return the final URL
	 * @param {File} file - The image file to upload
	 * @param {string} userId - The user ID for the upload
	 * @returns {Promise<string>} - The final image URL (without query parameters)
	 */
	async uploadImage(file, userId) {
		try {
			// Step 1: Get pre-signed URL
			const preSignedData = await this.getPreSignedUrl(file, userId);
			
			// Step 2: Upload image to the pre-signed URL
			await this.uploadToPreSignedUrl(preSignedData.url, file);
			
			// Step 3: Extract and return the clean URL (before the first "?")
			const cleanUrl = this.extractCleanUrl(preSignedData.url);
			
			return cleanUrl;
		} catch (error) {
			throw new Error('Image upload failed: ' + error.message);
		}
	}

	/**
	 * Get pre-signed URL from the backend
	 * @param {File} file - The image file
	 * @param {string} userId - The user ID
	 * @returns {Promise<{url: string}>} - Pre-signed URL data
	 */
	async getPreSignedUrl(file, userId) {
		try {
			const requestData = {
				userId: userId,
				fileName: file.name,
				contentType: file.type
			};
			
			console.log('Requesting pre-signed URL with:', requestData);
			const response = await apiService.post('/media/pre-signed', requestData);
			
			if (!response.url) {
				throw new Error('No pre-signed URL received from server');
			}
			
			console.log('Received pre-signed URL response:', response);
			return response;
		} catch (error) {
			console.error('Pre-signed URL request failed:', error);
			throw new Error('Failed to get pre-signed URL: ' + error.message);
		}
	}

	/**
	 * Upload file to the pre-signed URL using PUT request
	 * @param {string} preSignedUrl - The pre-signed URL
	 * @param {File} file - The image file to upload
	 */
	async uploadToPreSignedUrl(preSignedUrl, file) {
		try {
			console.log('Uploading to pre-signed URL:', preSignedUrl);
			console.log('File details:', { name: file.name, type: file.type, size: file.size });
			
			const response = await fetch(preSignedUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Upload failed:', response.status, errorText);
				throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
			}
			
			console.log('Upload successful');
		} catch (error) {
			console.error('Upload error:', error);
			throw new Error('Failed to upload to pre-signed URL: ' + error.message);
		}
	}

	/**
	 * Extract clean URL by removing query parameters
	 * @param {string} url - The full URL with query parameters
	 * @returns {string} - Clean URL without query parameters
	 */
	extractCleanUrl(url) {
		const questionMarkIndex = url.indexOf('?');
		return questionMarkIndex !== -1 ? url.substring(0, questionMarkIndex) : url;
	}

	/**
	 * Validate image file
	 * @param {File} file - The file to validate
	 * @returns {boolean} - True if valid
	 */
	validateImageFile(file) {
		// Check if file exists
		if (!file) {
			throw new Error('No file provided');
		}

		// Check file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
		}

		// Check file size (5MB limit)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (file.size > maxSize) {
			throw new Error('File size too large. Maximum size is 5MB.');
		}

		return true;
	}

	/**
	 * Create a preview URL for the selected image
	 * @param {File} file - The image file
	 * @returns {string} - Object URL for preview
	 */
	createPreviewUrl(file) {
		return URL.createObjectURL(file);
	}

	/**
	 * Revoke a preview URL to free memory
	 * @param {string} url - The object URL to revoke
	 */
	revokePreviewUrl(url) {
		URL.revokeObjectURL(url);
	}
}

export const imageUploadService = new ImageUploadService();