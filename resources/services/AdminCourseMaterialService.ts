// ========================================================================
// 🔐 ADMIN COURSE MATERIAL SERVICE
// Handles API calls for Course Material (File) management
// Now subject-based instead of class-subject-based
// ========================================================================

// Reusing general interfaces for consistency
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: any;
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Subject interface for dropdowns
export interface Subject {
    id: number;
    subject_code: string;
    subject_name: string;
    description?: string;
}

// 📋 INTERFACE DEFINITIONS
export interface CourseMaterial {
    id: number;
    subject_id: number;
    title: string;
    description: string | null;
    file_path: string;
    file_mime_type?: string;
    file_size?: number;
    uploaded_by?: number;
    created_at: string;

    // Computed properties (from CourseMaterial.php accessors)
    uploaded_by_name?: string;
    subject_name?: string;
    subject_code?: string;
    file_type?: string;
    file_icon?: string;

    // Relationships
    subject?: Subject;
    uploader?: {
        id: number;
        name: string;
    };
}

// Used for metadata update (PUT)
export interface CourseMaterialUpdateData {
    subject_id: number;
    title: string;
    description?: string | null;
}

// Used for file upload (POST/FormData)
export interface CourseMaterialUploadData extends CourseMaterialUpdateData {
    file: File;
}

export interface CourseMaterialsResponse extends ApiResponse<CourseMaterial[]> {
    pagination?: PaginationData;
}


// 🛠️ ADMIN COURSE MATERIAL SERVICE CLASS

class AdminCourseMaterialService {
    private baseURL = '/api';

    private getCsrfToken(): string {
        // Try multiple sources for CSRF token
        let csrfToken: string | null = null;
        
        // 1. Try meta tag first
        csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
        
        // 2. Try Inertia page props
        if (!csrfToken && typeof window !== 'undefined') {
            try {
                const inertiaData = (window as any).__INERTIA_DATA__;
                if (inertiaData?.page?.props?.csrf_token) {
                    csrfToken = inertiaData.page.props.csrf_token;
                } else if ((window as any).Inertia?.page?.props?.csrf_token) {
                    csrfToken = (window as any).Inertia.page.props.csrf_token;
                }
            } catch (e) {
                console.warn('Could not retrieve CSRF token from Inertia props:', e);
            }
        }
        
        // 3. Try Laravel's default token name
        if (!csrfToken) {
            const tokenInput = document.querySelector('input[name="_token"]') as HTMLInputElement;
            if (tokenInput) {
                csrfToken = tokenInput.value;
            }
        }
        
        if (!csrfToken) {
            console.error('CSRF token not found. Please refresh the page.');
            throw new Error('CSRF token not found. Please refresh the page.');
        }
        
        return csrfToken;
    }

    private async refreshCsrfToken(): Promise<string> {
        try {
            // Ensure URL is absolute for cross-origin requests
            let csrfUrl = `${this.baseURL}/csrf-token`;
            if (!csrfUrl.startsWith('http://') && !csrfUrl.startsWith('https://')) {
                csrfUrl = window.location.origin + (csrfUrl.startsWith('/') ? csrfUrl : '/' + csrfUrl);
            }
            
            const response = await fetch(csrfUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include', // Changed to 'include' for cross-origin support
            });
            
            if (!response.ok) {
                console.error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
                throw new Error(`Failed to fetch new CSRF token: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success && data.csrf_token) {
                console.log('Successfully retrieved fresh CSRF token');
                const metaTag = document.querySelector('meta[name="csrf-token"]');
                if (metaTag) {
                    metaTag.setAttribute('content', data.csrf_token);
                    console.log('Updated meta tag with new CSRF token');
                }
                return data.csrf_token;
            }
            console.error('Invalid CSRF token response:', data);
            throw new Error('Invalid CSRF token response');
        } catch (error) {
            console.error('Error refreshing CSRF token:', error);
            throw new Error('Failed to refresh session. Please refresh the page manually.');
        }
    }

    // Standard JSON Request Handler
    private async request<T>(url: string, options: RequestInit = {}, retryOn419: boolean = true): Promise<ApiResponse<T>> {
        let csrfToken = this.getCsrfToken();
        
        // Ensure URL is absolute - always use full URL to avoid redirects
        let absoluteUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            absoluteUrl = window.location.origin + (url.startsWith('/') ? url : '/' + url);
        }
        
        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers,
            },
            credentials: 'include', // Changed to 'include' for cross-origin support
        };

        // Merge options carefully - ensure headers are merged correctly
        const mergedOptions: RequestInit = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {}),
            }
        };

        try {
            let response = await fetch(absoluteUrl, mergedOptions);
            const contentType = response.headers.get('content-type');
            let data;
            
            // Handle 419 CSRF token mismatch BEFORE trying to parse JSON
            if (response.status === 419 && retryOn419) {
                console.warn('CSRF token mismatch (419). Attempting to refresh token and retry...');
                try {
                    const newCsrfToken = await this.refreshCsrfToken();
                    // Retry the request with the new token, but prevent further retries
                    const retryOptions = {
                        ...options,
                        headers: {
                            ...defaultOptions.headers,
                            ...options.headers,
                            'X-CSRF-TOKEN': newCsrfToken,
                        },
                    };
                    return this.request<T>(url, retryOptions, false); // Do not retry again
                } catch (refreshError) {
                    console.error('Failed to refresh CSRF token:', refreshError);
                    throw new Error('CSRF token mismatch. Your session may have expired. Please refresh the page and try again.');
                }
            }
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                if (response.status >= 400) {
                    throw new Error(`Server error (${response.status}): ${text.substring(0, 200)}`);
                }
                throw new Error('Unexpected response format from server');
            }

            // Handle 401 Unauthorized
            if (response.status === 401) {
                console.warn('⚠️ Authentication error (401). This may be a temporary issue.');
                throw new Error('Unauthenticated. Please check your login status.');
            }

            if (!response.ok) {
                // Handle 419 again (in case retryOn419 was false)
                if (response.status === 419) {
                    throw new Error('CSRF token mismatch. Your session may have expired. Please refresh the page and try again.');
                }

                if (data.errors) {
                    const errorMessages = Object.entries(data.errors)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                        .join('; ');
                    throw new Error(errorMessages || data.message || `Request failed with status ${response.status}`);
                }
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('❌ REQUEST ERROR:', error);
            throw error;
        }
    }
    
    // FormData Request Handler (For file uploads)
    // Accepts either FormData or a function that creates FormData (for retry support)
    private async formDataRequest<T>(
        url: string, 
        formDataOrFactory: FormData | (() => FormData), 
        retryOn419: boolean = true
    ): Promise<ApiResponse<T>> {
        let csrfToken = this.getCsrfToken();
        
        // Ensure URL is absolute - always use full URL to avoid redirects
        let absoluteUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            absoluteUrl = window.location.origin + (url.startsWith('/') ? url : '/' + url);
        }
        
        // Helper to get FormData (recreate if it's a function)
        const getFormData = (): FormData => {
            if (typeof formDataOrFactory === 'function') {
                return formDataOrFactory();
            }
            return formDataOrFactory;
        };
        
        const makeRequest = async (token: string, formData: FormData): Promise<Response> => {
            // Verify FormData has file before sending
            let hasFileInFormData = false;
            for (const [key, value] of formData.entries()) {
                if (key === 'file' && value instanceof File) {
                    hasFileInFormData = true;
                    console.log(`✅ File verified in FormData: ${value.name} (${value.size} bytes)`);
                    break;
                }
            }
            
            if (!hasFileInFormData) {
                console.error('❌ CRITICAL: File not found in FormData before sending request!');
            }
            
            const options: RequestInit = {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
                },
                credentials: 'include', // Changed to 'include' for cross-origin support
            };
            
            console.log('📡 Sending request with:', {
                url: absoluteUrl,
                method: 'POST',
                hasFile: hasFileInFormData,
                csrfToken: token.substring(0, 20) + '...'
            });
            
            return fetch(absoluteUrl, options);
        };

        try {
            let formData = getFormData();
            let response = await makeRequest(csrfToken, formData);
            
            // Handle 419 CSRF token mismatch BEFORE trying to parse JSON
            if (response.status === 419 && retryOn419) {
                console.warn('CSRF token mismatch detected. Attempting to refresh token...');
                try {
                    const freshToken = await this.refreshCsrfToken();
                    if (freshToken) {
                        // Recreate FormData for retry (it gets consumed on first request)
                        formData = getFormData();
                        // Retry the request with the fresh token and new FormData (only once)
                        response = await makeRequest(freshToken, formData);
                    } else {
                        throw new Error('Failed to refresh CSRF token');
                    }
                } catch (refreshError) {
                    console.error('Failed to refresh CSRF token:', refreshError);
                    throw new Error('CSRF token mismatch. Your session may have expired. Please refresh the page and try again.');
                }
            }
            
            // Check content type after potential retry
            const contentType = response.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                const responseText = await response.text();
                
                if (response.status === 419 || response.status === 401 || response.status === 403) {
                     throw new Error(`Authentication/CSRF Error: Server returned status ${response.status}. Your session may have expired.`);
                }
                
                if (responseText.startsWith('<!DOCTYPE html>')) {
                    throw new Error(`Server Error: Unexpected HTML response. Check backend logs. Status: ${response.status}`);
                }
                
                throw new Error(`Unexpected response format: expected JSON. Status: ${response.status}`);
            }
            
            const data = await response.json(); 
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                console.warn('⚠️ Authentication error (401). This may be a temporary issue.');
                throw new Error('Unauthenticated. Please check your login status.');
            }
            
            if (!response.ok) {
                // Handle 419 again (in case retryOn419 was false)
                if (response.status === 419) {
                    throw new Error('CSRF token mismatch. Your session may have expired. Please refresh the page and try again.');
                }

                // Log full error response for debugging
                console.error('❌ Backend validation error - Full response:', JSON.stringify({
                    status: response.status,
                    data: data,
                    errors: data.errors,
                    message: data.message
                }, null, 2));

                // Also log errors object expanded
                if (data.errors) {
                    console.error('❌ Validation errors breakdown:', data.errors);
                    Object.entries(data.errors).forEach(([field, msgs]) => {
                        const messages = Array.isArray(msgs) ? msgs : [msgs];
                        console.error(`  - ${field}:`, messages);
                    });
                }

                const errorMessages = data.errors 
                    ? Object.entries(data.errors).map(([field, msgs]) => {
                        const messages = Array.isArray(msgs) ? msgs : [msgs];
                        return `${field}: ${messages.join(', ')}`;
                    }).join('; ')
                    : data.message || `File upload failed with status ${response.status}`;
                throw new Error(errorMessages);
            }
            
            return data;
        } catch (error) {
            console.error('❌ FILE UPLOAD ERROR:', error);
            throw error;
        }
    }


    // 📚 COURSE MATERIAL ENDPOINTS
    
    /**
     * Get list of course materials
     */
    async getCourseMaterials(params: { subject_id?: number; search?: string } = {}): Promise<ApiResponse<CourseMaterial[]>> {
        const searchParams = new URLSearchParams();
        if (params.subject_id) {
            searchParams.append('subject_id', params.subject_id.toString());
        }
        if (params.search) {
            searchParams.append('search', params.search);
        }
        return this.request<CourseMaterial[]>(`${this.baseURL}/course-materials?${searchParams.toString()}`);
    }
    
    /**
     * Upload a new course material (Uses FormData for file transfer)
     */
    async uploadMaterial(data: CourseMaterialUploadData): Promise<ApiResponse<CourseMaterial>> {
        // Validate file before creating FormData
        if (!data.file) {
            throw new Error('File is required for upload');
        }
        
        // Log file info for debugging
        console.log('📤 Uploading file:', {
            name: data.file.name,
            size: data.file.size,
            type: data.file.type,
            sizeInMB: (data.file.size / (1024 * 1024)).toFixed(2)
        });
        
        // Create a factory function that creates FormData (allows retry after CSRF refresh)
        const createFormData = (): FormData => {
            const formData = new FormData();
            formData.append('subject_id', data.subject_id.toString());
            formData.append('title', data.title);
            if (data.description) {
                formData.append('description', data.description);
            }
            // Verify file is still valid before appending
            if (!data.file) {
                throw new Error('File object is missing or invalid');
            }
            
            // Verify file properties before appending
            if (!(data.file instanceof File)) {
                throw new Error('File object is not a valid File instance');
            }
            
            if (data.file.size === 0) {
                throw new Error('File is empty (0 bytes)');
            }
            
            formData.append('file', data.file);
            
            // Log FormData contents for debugging
            console.log('📋 FormData created:', {
                subject_id: data.subject_id,
                title: data.title,
                description: data.description || '(empty)',
                file: {
                    name: data.file.name,
                    size: data.file.size,
                    type: data.file.type,
                    lastModified: new Date(data.file.lastModified).toISOString()
                }
            });
            
            // Verify FormData has the file (can't directly check, but we can log what we appended)
            const formDataEntries: string[] = [];
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    formDataEntries.push(`${key}: File(${value.name}, ${value.size} bytes)`);
                } else {
                    formDataEntries.push(`${key}: ${value}`);
                }
            }
            console.log('📦 FormData entries:', formDataEntries);
            
            return formData;
        };
        
        return this.formDataRequest<CourseMaterial>(`${this.baseURL}/course-materials`, createFormData);
    }

    /**
     * Update material metadata (title, description, subject_id)
     */
    async updateMaterial(id: number, data: CourseMaterialUpdateData): Promise<ApiResponse<CourseMaterial>> {
        return this.request<CourseMaterial>(`${this.baseURL}/course-materials/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Download the specified course material file
     */
    async downloadMaterial(id: number, filename: string): Promise<void> {
        const url = `${this.baseURL}/course-materials/${id}/download`; 
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                     const errorData = await response.json();
                     throw new Error(`Download failed: ${errorData.message || 'Server error'}`);
                }
                
                throw new Error(`Download failed with status ${response.status}.`);
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            
        } catch (error) {
            console.error('❌ DOWNLOAD ERROR:', error);
            throw error;
        }
    }

    /**
     * Delete material (removes record and file)
     */
    async deleteMaterial(id: number): Promise<ApiResponse<null>> {
        return this.request<null>(`${this.baseURL}/course-materials/${id}`, {
            method: 'DELETE',
        });
    }
    
    /**
     * Fetch all Subjects for dropdowns
     */
    async getSubjects(): Promise<ApiResponse<Subject[]>> {
        return this.request<Subject[]>(`${this.baseURL}/course-materials/subjects`);
    }
}

export const adminCourseMaterialService = new AdminCourseMaterialService();
